import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import CancelIcon from '@material-ui/icons/Cancel';
import {
  SnapModal,
  SnapButton,
  SnapDropdown,
  SnapToggleSwitch
} from '@pnp-blox/snap';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { DROPDOWN_TYPE, setSessionItem, getSessionItem, NOTIFICATION_TYPES, ENTITY_TYPES } from '@revin-utils/utils';
import { TOGGLE_SWITCH_LABEL, ACCOUNT_DROPDOWN, SESSION_STORAGE_KEYS, FILTER_OPPORTUNITES, PROJECT_DETAILS, BTN_LABELS, MANAGERS, FORECASTING_SELECTION_ROUTE } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import { getManagersPayload, getBillingTypeList, getAccountEntityCodeArray } from 'utils/helper';
import { getEntitlementsGrantsAction } from 'store/actions/MetaData';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import styles from './FilterOpportunities.module.scss';

const FilterOpportunities = ({ open, handleClose, metaData, callBackHandler, getChildAccountsCallBack, getForeCastCandidateList, chooseForecastScreen, setIsRestoreFilterData }) => {
  const { accountForecastCandidateId } = useParams();
  const history = useHistory();
  const [filterFieldsData, setFilterFieldsData] = useState({
    parentAccountId: {},
    accounts: [],
    programs: [],
    salesStages: [],
    projectSources: [],
    deliveryType: [],
    billingType: [],
    projectManager: [],
    includeCompletedProjects: false
  });
  const [billingData, setBillingData] = useState([]);
  const [errorState, setErrorState] = useState({
    accounts: false,
    programs: false,
    salesStages: false,
    projectSources: false
  });
  const initialFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
  const [filterOpenAccountsList, setFilterOpenAccountsList] = useState([]);
  const [filterOpenProgramsList, setFilterOpenProgramsList] = useState([]);
  const [filterOpenProjectManagers, setFilterOpenProjectManagers] =  useState([]);

  useEffect(() => {
    setFilterOpenAccountsList(metaData?.accounts);
    setFilterOpenProgramsList(metaData?.programs);
    setFilterOpenProjectManagers(metaData?.projectManagers);
    setIsRestoreFilterData(false);
    setFilterFieldsData((prevData) => ({
      ...prevData,
      accounts: metaData?.accounts?.length ? getAccountsList(metaData.accounts) : [],
      programs: metaData?.programs?.length ? getProgramsList(metaData.programs) : [],
      salesStages: metaData?.salesStageData,
      projectSources: metaData?.projectSource,
      deliveryType: [],
      billingType: [],
      projectManager: [],
      includeCompletedProjects: false
    }));
    setBillingData([]);
  }, []);

  useEffect(() => {
    if (filterFieldsData.accounts?.length) {
      setErrorState((prevState) => ({
        ...prevState,
        accounts: false
      }));
    }
    if (filterFieldsData.programs?.length) {
      setErrorState((prevState) => ({
        ...prevState,
        programs: false
      }));
    }
    if (filterFieldsData.salesStages?.length) {
      setErrorState((prevState) => ({
        ...prevState,
        salesStages: false
      }));
    }
    if (filterFieldsData.projectSources?.length) {
      setErrorState((prevState) => ({
        ...prevState,
        projectSources: false
      }));
    }
  },[filterFieldsData.accounts, filterFieldsData.programs, filterFieldsData.salesStages, filterFieldsData.projectSources]);

  useEffect(() => {
    if (metaData?.parentAccounts?.length) {
      const sessionedParentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id || accountForecastCandidateId;
      const parentAccount = metaData?.parentAccounts.find(({ id }) => id === sessionedParentAccountId) || metaData?.parentAccounts[0];
      setFilterFieldsData((prevData) => ({
        ...prevData,
        [FILTER_OPPORTUNITES.PARENT_ACCOUNT_NAME]: parentAccount?.id
      }));
      setSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN, parentAccount);
    }
  }, [metaData?.parentAccounts]);

  useEffect(() => {
    setFilterFieldsData((prevData) => ({
      ...prevData,
      accounts: metaData?.accounts?.length ? getAccountsList(metaData.accounts) : []
    }));
  },[JSON.stringify(metaData?.accounts)]);

  useEffect(() => {
    if (metaData?.programs) {
      setFilterFieldsData((prevData) => ({
        ...prevData,
        programs: metaData?.programs?.length ? getProgramsList(metaData.programs) : []
      }));
    }
  }, [JSON.stringify(metaData?.programs)]);


  useEffect(() => {
    setFilterFieldsData((prevData) => ({
      ...prevData,
      accounts: getAccountsList(initialFilterConditions?.selectedAccounts),
      programs: getProgramsList(initialFilterConditions?.selectedPrograms),
      salesStages: initialFilterConditions?.salesStages,
      projectSources: initialFilterConditions?.projectSources,
      deliveryType: initialFilterConditions?.deliveryTypesIds,
      billingType: initialFilterConditions?.billingTypesIds,
      projectManager: initialFilterConditions?.projectManagerIds,
      includeCompletedProjects: initialFilterConditions?.includeCompletedProjects
    }));
    if (initialFilterConditions?.deliveryTypesIds?.length) {
      setBillingData(getBillingTypeList(initialFilterConditions?.deliveryTypesIds, metaData));
    } else {
      setBillingData([]);
    }
  }, []);

  const getAccountsList = (account) => {
    if (account?.find(item => item.id.toLowerCase() === FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE)) {
      return metaData.accounts;
    } else {
      return account;
    }
  };

  const getProgramsList = (program) => {
    if (program?.find(item => item.id.toLowerCase() === FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE)) {
      return metaData.programs;
    } else {
      return program;
    }
  };

  const handleFilterFieldsChange = (event, newValue, id) => {
    const { name, value } = event.target;
    if (name === FILTER_OPPORTUNITES.PARENT_ACCOUNT_NAME) {
      const parentAccount = metaData?.parentAccounts?.find(({ id }) => id === value);
      getChildAccountsCallBack(parentAccount?.attributes?.parentAccountId);
      setFilterFieldsData((prevData) => ({
        ...prevData,
        [name]: value,
        salesStages: metaData?.salesStageData,
        projectSources: metaData?.projectSource,
        deliveryType: [],
        billingType: [],
        projectManager: [],
        includeCompletedProjects: false
      }));
      setBillingData([]);
    } else {
      handleMultiSelectWithAllOption(event, newValue, id);
    }
  };

  const handleMultiSelectWithAllOption = (event, newValue, id) => {
    let tempData = [];
    if (id) {
      if (newValue.find(item => item.id.toLowerCase() === FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE) && event.currentTarget.textContent.toLowerCase() === FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE && event?.target?.checked) {
        tempData = (id === FILTER_OPPORTUNITES.ACCOUNT_NAME) ? metaData.accounts : metaData.programs;
      } else if (event.currentTarget.textContent.toLowerCase() === FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE && !event?.target?.checked) {
        tempData = [];
      } else {
        if (id === FILTER_OPPORTUNITES.DELIVERY_TYPE_NAME) {
          const billingList = getBillingTypeList(newValue, metaData);
          setBillingData(billingList);
          setFilterFieldsData((prevData) => ({
            ...prevData,
            [FILTER_OPPORTUNITES.BILLING_TYPE_NAME]: []
          }));
        }
        tempData = newValue.filter(item => item.id.toLowerCase() !== FILTER_OPPORTUNITES.DROPDOWN_ALL_VALUE);
      }
      if (id === FILTER_OPPORTUNITES.ACCOUNT_NAME && tempData?.length !== 0) {
        callBackHandler({
          type: MetaDataActionType.GET_PROJECT_MANAGERS,
          payload: getManagersPayload(tempData)
        });
        callBackHandler({
          type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
          payload: {
            forecastEntitlement: {
              forecastEntitlementView: metaData?.entitlement
            },
            isShowLoader: true,
            parentEntityCodes: getAccountEntityCodeArray(newValue, metaData?.accounts)
          }
        });
        setFilterFieldsData((prevData) => ({
          ...prevData,
          [FILTER_OPPORTUNITES.PROJECT_MANAGER_NAME]: []
        }));
      }
      if (id !== FILTER_OPPORTUNITES.DELIVERY_TYPE_NAME && id !== FILTER_OPPORTUNITES.BILLING_TYPE_NAME && id !== FILTER_OPPORTUNITES.PROJECT_MANAGER_NAME) {
        setErrorState((prevState) => ({
          ...prevState,
          [id]: tempData?.length === 0
        }));
      }
      setFilterFieldsData((prevData) => ({
        ...prevData,
        [id]: tempData
      }));
    }
  };

  const clearFilter = () => {
    getChildAccountsCallBack(getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId);
    if (getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id === filterFieldsData.parentAccountId) {
      setFilterFieldsData((prevData) => ({
        ...prevData,
        accounts: metaData?.accounts?.length ? getAccountsList(metaData.accounts) : [],
        programs: metaData?.programs?.length ? getProgramsList(metaData.programs) : [],
        salesStages: metaData?.salesStageData,
        projectSources: metaData?.projectSource,
        deliveryType: [],
        billingType: [],
        projectManager: [],
        includeCompletedProjects: false
      }));
    } else {
      setFilterFieldsData((prevData) => ({
        ...prevData,
        parentAccountId: getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id
      }));
    }
  };

  const handleCancel = () => {
    handleFilterModalClose();
  };

  const handleFilterSubmit = () => {
    const parentAccount = metaData?.parentAccounts?.find(({ id }) => id === filterFieldsData?.parentAccountId);
    const programData = filterFieldsData?.programs?.filter(filterData => filterData.id != 'All').map(item => item.attributes?.id);
    const accountData = filterFieldsData?.accounts?.filter(filterData => filterData.id != 'All').map(item => item.attributes?.id);
    setSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN, parentAccount);
    getForeCastCandidateList({
      parentAccountId: parentAccount?.attributes.parentAccountId,
      accountIds: accountData,
      accountForecastCandidateId: parentAccount?.id,
      includeSignedContracts: true,
      programIds: programData,
      salesStages: filterFieldsData.salesStages?.map(item => item.id),
      projectSources: filterFieldsData.projectSources?.map(item => item.id),
      billingTypesIds: filterFieldsData.billingType?.map(item => item.id),
      deliveryTypesIds: filterFieldsData.deliveryType?.map(item => item.id),
      includeCompletedProjects: filterFieldsData.includeCompletedProjects,
      includeSummaryInformation: true,
      projectManagerIds: filterFieldsData.projectManager?.map(item => item.id),
      forecastEntitlement: {
        forecastEntitlementView: metaData?.entitlement
      }
    });
    setSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS, JSON.stringify({
      selectedAccounts: filterFieldsData?.accounts,
      parentAccountId: parentAccount?.id,
      selectedPrograms: filterFieldsData?.programs,
      salesStages: filterFieldsData.salesStages,
      projectSources: filterFieldsData.projectSources,
      billingTypesIds: filterFieldsData.billingType,
      deliveryTypesIds: filterFieldsData.deliveryType,
      includeCompletedProjects: filterFieldsData.includeCompletedProjects,
      projectManagerIds: filterFieldsData.projectManager
    }));
    
    // To get the permission, for selected parentAccount
    // setPermissionsV2(null, parentAccount?.attributes?.parentAccountId);
    if(metaData?.grantsObject?.entityId !== parentAccount?.attributes?.parentAccountId){
      callBackHandler(getEntitlementsGrantsAction({
        entityId: parentAccount?.attributes?.parentAccountId,
        nodeType: ENTITY_TYPES.PARENT_ACCOUNT,
        includeInherited: true,
        includeChildren: true
      }));
    }

    chooseForecastScreen && history.push(`/${FORECASTING_SELECTION_ROUTE}/${parentAccount.attributes.id}`);
    !chooseForecastScreen && history.push(`/${parentAccount.attributes.id}`);
    handleClose();
  };

  const handleFilterModalClose = () => {
    if (filterFieldsData.parentAccountId !== initialFilterConditions?.id) {
      callBackHandler({
        type: MetaDataActionType.SET_ACCOUNT_DROPDOWN,
        payload: filterOpenAccountsList
      });
      callBackHandler({
        type: MetaDataActionType.SET_PROGRAM_DROPDOWN,
        payload: filterOpenProgramsList
      });
      callBackHandler({
        type: MetaDataActionType.SET_PROJECT_MANAGERS,
        payload: filterOpenProjectManagers
      });
    }
    setIsRestoreFilterData(true);
    handleClose();
  };


  return (
    <>
      <SnapModal
        align="right"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <div className="w-100 d-flex align-items-center justify-content-between">
            <SnapButton
              handleClick={handleCancel}
              label={BTN_LABELS.CANCEL}
              name={BTN_LABELS.CANCEL}
              type="submit"
              variant="outlined"
            />
            <SnapButton
              disabled={Object.values(errorState).indexOf(true) >= 0}
              handleClick={handleFilterSubmit}
              label={FILTER_OPPORTUNITES.FILTER}
              name={FILTER_OPPORTUNITES.FILTER}
              type="Submit"
              variant="contained"
            />
          </div>
        }
        fullWidth
        maxWidth={false}
        modalHeight="full"
        modalTitle="Filter Opportunities"
        name="Filter opportunities"
        onClose={handleFilterModalClose}
        open={open}
        scroll="paper"
      >
        <PerfectScrollbar>
          <div>
            {Object.values(errorState).indexOf(true) >= 0 &&
              <CustomAlertBar
                alertType={NOTIFICATION_TYPES.ERROR}
                className={styles['border-alert-bar']}
              >
                <div className="d-flex align-items-center">
                  <CancelIcon />
                  {FILTER_OPPORTUNITES.MANDATORY_VALIDATION_MESSAGE}
                </div>
              </CustomAlertBar>
            }
            {/* Need to add it in the upcoming phase, commenting out for phase 1 */}
            {/* <p className="mb-2">
              You can apply a saved filter or multi-select parameters from the
              fields below.
            </p>
            <SnapDropdown
              className="mr-2"
              data={[]}
              label="Select saved filter"
              type="dropdown"
            />
            <div className={`d-flex align-items-center justify-content-between mt-2 ${styles['switch-wrapper']} ${styles['with-border']}`}>
              <div
                className="d-flex align-items-center"
              >
                Default this filter
                <InfoTooltip
                  infoContent={
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.'
                  }
                />
                <SnapToggleSwitch
                  id="default"
                  optionLabels={TOGGLE_SWITCH_LABEL}
                  small
                />
              </div>

              <div className={`d-flex align-items-center justify-content-end ${styles['bottom-actions']}`}>
                <a className={styles['btn-active']}>Save Filter</a>
                <a className={styles['btn-active']}>Clear Filter</a>
              </div>
            </div> */}

            <SnapDropdown
              className="mb-2"
              data={metaData?.parentAccounts ?? []}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, ELEMENT_ID.ACCOUNT_DROPDOWN_PARENT_ACCOUNT)}
              id={ELEMENT_ID.ACCOUNT_DROPDOWN_PARENT_ACCOUNT}
              label={`${ACCOUNT_DROPDOWN.PARENT_ACCOUNT}*`}
              name={FILTER_OPPORTUNITES.PARENT_ACCOUNT_NAME}
              type={DROPDOWN_TYPE.DROPDOWN}
              value={filterFieldsData.parentAccountId}
            />
            <SnapDropdown
              className={`mb-2 ${errorState.accounts ? 'error-border' : ''}`}
              data={metaData?.accounts ?? []}
              error={errorState.accounts}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.ACCOUNT_NAME)}
              id={FILTER_OPPORTUNITES.ACCOUNT_NAME}
              label={`${ACCOUNT_DROPDOWN.ACCOUNT}*`}
              name={FILTER_OPPORTUNITES.ACCOUNT_NAME}
              selectedValue={filterFieldsData.accounts}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            <SnapDropdown
              className={`mb-2 ${errorState.programs ? 'error-border' : ''}`}
              data={metaData?.programs ?? []}
              error={errorState.programs}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.PROGRAM_NAME)}
              id={FILTER_OPPORTUNITES.PROGRAM_NAME}
              label={`${ACCOUNT_DROPDOWN.PROGRAM}*`}
              name={FILTER_OPPORTUNITES.PROGRAM_NAME}
              selectedValue={filterFieldsData.programs}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            {/* Need to add it in the upcoming phase, commenting out for phase 1 
            <div className={`d-flex align-items-center gap-2 ${styles['inline-component']}`}>
              <SnapCalendar
                className="mb-2"
                label="Start date"
                selectedDate={new Date('2022-01-14T13:22:27.168Z')}
              />
              <SnapCalendar
                className={`mb-2 ${styles['end-date']}`}
                label="End date"
                selectedDate={new Date('2022-01-14T13:22:27.168Z')}
              />
            </div> */}
            <SnapDropdown
              className={`mb-2 ${errorState.salesStages ? 'error-border' : ''}`}
              data={metaData?.salesStageData ?? []}
              error={errorState.salesStages}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.SALES_STAGE_NAME)}
              id={FILTER_OPPORTUNITES.SALES_STAGE_NAME}
              label={FILTER_OPPORTUNITES.SALES_STAGE_LABEL}
              name={FILTER_OPPORTUNITES.SALES_STAGE_NAME}
              selectedValue={filterFieldsData.salesStages}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            <SnapDropdown
              className={`mb-2 ${errorState.projectSources ? 'error-border' : ''}`}
              data={metaData?.projectSource ?? []}
              error={errorState.projectSources}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.SOURCE_NAME)}
              id={FILTER_OPPORTUNITES.SOURCE_NAME}
              label={FILTER_OPPORTUNITES.SOURCE_LABEL}
              name={FILTER_OPPORTUNITES.SOURCE_NAME}
              selectedValue={filterFieldsData.projectSources}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            <SnapDropdown
              className="mb-2"
              data={metaData?.deliveryTypeData ?? []}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.DELIVERY_TYPE_NAME)}
              id={FILTER_OPPORTUNITES.DELIVERY_TYPE_NAME}
              label={PROJECT_DETAILS.PROJECT_DELIVERY_TYPE}
              name={FILTER_OPPORTUNITES.DELIVERY_TYPE_NAME}
              selectedValue={filterFieldsData.deliveryType}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            <SnapDropdown
              className="mb-2"
              data={billingData}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.BILLING_TYPE_NAME)}
              id={FILTER_OPPORTUNITES.BILLING_TYPE_NAME}
              label={PROJECT_DETAILS.PROJECT_BILLING_TYPE}
              name={FILTER_OPPORTUNITES.BILLING_TYPE_NAME}
              selectedValue={filterFieldsData.billingType}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            <SnapDropdown
              className="mb-2"
              data={metaData?.projectManagers ?? []}
              handleChange={(event, newValue) => handleFilterFieldsChange(event, newValue, FILTER_OPPORTUNITES.PROJECT_MANAGER_NAME)}
              id={FILTER_OPPORTUNITES.PROJECT_MANAGER_NAME}
              label={MANAGERS.PROJECT}
              name={FILTER_OPPORTUNITES.PROJECT_MANAGER_NAME}
              selectedValue={filterFieldsData.projectManager}
              type={DROPDOWN_TYPE.MULTI_SELECT}
            />
            {/* Need to add it in the upcoming phase, commenting out for phase 1 
            <div
              className={'d-flex align-items-center mt-2'}
            >
              Show project which has P&L entry
              <InfoTooltip
                infoContent={
                  'Lorem ipsum dolor sit amet, consectetur adipiscing elit'
                }
              />
              <SnapToggleSwitch
                id="plEntry"
                optionLabels={TOGGLE_SWITCH_LABEL}
                small
              />
            </div> */}
            <div
              className={'d-flex align-items-center mt-2'}
            >
              {FILTER_OPPORTUNITES.INCLUDE_CLOSED_PROJECTS_LABEL}
              <InfoTooltip
                infoContent={
                  FILTER_OPPORTUNITES.COMPLTED_PROJECTS_INFO_TEXT
                }
              />
              <SnapToggleSwitch
                handleChange={(event) => {
                  setFilterFieldsData((prevData) => ({
                    ...prevData,
                    [FILTER_OPPORTUNITES.INCLUDE_CLOSED_PROJECTS]: event.currentTarget?.checked
                  }));
                }}
                id={FILTER_OPPORTUNITES.INCLUDE_CLOSED_PROJECTS}
                optionLabels={TOGGLE_SWITCH_LABEL}
                small
                value={filterFieldsData.includeCompletedProjects}
              />
            </div>
            <div className={`d-flex align-items-center justify-content-end mt-1 ${styles['bottom-actions']}`}>
              <a
                className={styles['btn-active']}
                onClick={clearFilter}
              >{FILTER_OPPORTUNITES.RESET_FILTER}</a>
            </div>
          </div>
        </PerfectScrollbar>
      </SnapModal>
    </>
  );
};

FilterOpportunities.propTypes = {
  callBackHandler: PropTypes.func,
  chooseForecastScreen: PropTypes.bool,
  getChildAccountsCallBack: PropTypes.func,
  getForeCastCandidateList: PropTypes.func,
  handleClose: PropTypes.any,
  metaData: PropTypes.object,
  open: PropTypes.any,
  setIsRestoreFilterData: PropTypes.func
};

export default FilterOpportunities;
