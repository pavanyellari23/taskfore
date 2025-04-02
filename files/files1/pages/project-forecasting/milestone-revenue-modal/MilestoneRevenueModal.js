
import React, { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Info } from '@material-ui/icons';
import _isUndefined from 'lodash/isUndefined';
import Box from '@material-ui/core/Box';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import addRole from 'assets/images/add-role.png';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import RadioButton from '@revin-utils/components/radio-button';
import { TABLE_TYPES, FORM_LABELS } from '@revin-utils/utils';
import EmptyScreen from '@revin-utils/components/empty-screen';
import DynamicAlertList from 'components/common/dynamic-alert-list/DynamicAlertList';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import ManageCostAllocationTable from 'components/pages/project-forecasting/manage-cost-modal/components/manage-cost-allocation-table';
import CrmPipMethod from './crm-pip-method/CrmPipMethod';
import { buildCRMGrid } from './helper';
import { getFilteredSearchData } from 'utils/commonFunctions';
import { updateProjectForecastingWithAPI, getUsers, getUser, resetAddResourceModal } from 'store/actions/ProjectForecasting';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import {prepareAddResourcePayload, preparePayloadForRole} from 'components/pages/resource-level-forecasting/helper';
import { getOptionsListForUsers, validateDuplicateResource } from 'utils/forecastingCommonFunctions';
import { ORIGIN, PROJECT_FORECASTING, COST_REVENUE_TYPE, PERCENTAGE_ERROR, EMPTY_SCREEN_MESSAGE_NO_DATA, RESOURCE, ROLE_SELECTION_LABELS, ALERT_CONFIGURATION, TOAST_MESSAGES_SUFFIX, MAX_NUMBER_LIMIT } from 'utils/constants';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './MilestoneRevenueModal.module.scss';


const MilestoneRevenueModal = ({ callBackHandler, open, setMilestoneRevenueModal,  projectForecastingState, metaDataState }) => {
  const { projectForecastingDataLocalObject,modalError } = projectForecastingState;
  const [crmMethod, setCrmMethod] = useState(true);
  const [crmTableData, setCrmTableData] = useState({'headerData': [], 'resourceSummary': []});
  const [allocationMethod, setAllocationMethod] = useState(false);
  const [pocMethod, setPocMethod] = useState(false);
  const [idtUpdate, setItdUpdate] = useState(false);
  const [pocBasedCrmPipMethod, setPocBasedCrmPipMethod] = useState(true);
  const [costUpdate, setCostUpdate] = useState({});
  const [handleClickContinue, setHandleClickContinue] = useState(false);
  const [revenueModalPayload, setRevenueModalPayload] = useState(projectForecastingDataLocalObject);
  const [showAlertMessage, setShowAlertErrorMessage] = useState(false);
  const [searchText,setSearchText] = useState('');
  const [filteredData,setFilteredData] =useState(null);
  const [openRoleSelectionModal, setOpenRoleSelectionModal] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const { userList } = projectForecastingState;

  useEffect(() => {
    setCrmTableData(buildCRMGrid(projectForecastingDataLocalObject, crmMethod));
    setCostUpdate({
      itdRevenue: projectForecastingDataLocalObject?.forecastPoCDetails?.itdRevenue,
      itdCost: projectForecastingDataLocalObject?.forecastPoCDetails?.itdCost,
      totalProjectCost: projectForecastingDataLocalObject?.forecastPoCDetails?.totalProjectCost,
      forecastTCV: projectForecastingDataLocalObject?.forecastPoCDetails?.forecastTCV
    });
  }, [projectForecastingDataLocalObject, crmMethod]);
  
  // if continue is clicked, and no error, then close modal.
  useEffect(() => {
    if (pocMethod && modalError) {
      setMilestoneRevenueModal(true); 
    } else if (handleClickContinue && ! modalError) {
      setMilestoneRevenueModal(false); 
      setHandleClickContinue(false); 
    }
  }, [ modalError, handleClickContinue]);

  useEffect(() => {
    if (projectForecastingState?.projectForecastingDataLocalObject?.projectRevenueComputationMethod === COST_REVENUE_TYPE.CRM_PIP) {
      open && handleCRMClick();
    }
    if(_isUndefined(projectForecastingState?.projectForecastingDataLocalObject?.projectRevenueComputationMethod)){
      open && handleCRMClick('', true);
    }
    if(projectForecastingState?.projectForecastingDataLocalObject?.projectRevenueComputationMethod  === COST_REVENUE_TYPE.POC_BASED) {
      open && handlePOCClick();
      if(projectForecastingState?.projectForecastingDataLocalObject?.projectCostComputationMethod === COST_REVENUE_TYPE.USER_ALLOCATION){
        open && handleAllocationClick();
      }
    }
  }, [open]);

  useEffect(() => {
    const filtered = getFilteredSearchData(projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles,searchText);
    setFilteredData(filtered);
  }, [ projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, searchText]);

  const handleCRMClick = (event, callBackEnabled) => {
    (event?.target || callBackEnabled) && callBack({projectRevenueComputationMethod : COST_REVENUE_TYPE.CRM_PIP});
    setCrmMethod(true);
    setPocMethod(false);
  };

  const handlePOCClick = (event) => {
    event?.target && callBack({projectRevenueComputationMethod : COST_REVENUE_TYPE.POC_BASED});
    setCrmMethod(false);
    setPocMethod(true);
  };

  const callBack = (selectedTab) => {
    const payload = {...projectForecastingDataLocalObject, ...selectedTab};
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      actionOrigin: ORIGIN.FIXED_BID_MODAL,
      payload
    }));
  };

  const handlePocCrmClick = () => {
    callBack({projectCostComputationMethod : COST_REVENUE_TYPE.CRM_PIP});
    setPocBasedCrmPipMethod(true);
    setAllocationMethod(false);
  };

  const handleAllocationClick = (event) => {
    event?.target && callBack({projectCostComputationMethod : COST_REVENUE_TYPE.USER_ALLOCATION});
    setPocBasedCrmPipMethod(false);
    setAllocationMethod(true);
  };
  
  const handleClose = () => {
    callBackHandler({type: ProjectForecastingActionType.RESET_FORECASTING_DATA});
    callBackHandler({type:ProjectForecastingActionType.RESET_MODAL_ERROR});
    setMilestoneRevenueModal(false);
  };

  const handleChange = (event) => {
    setCostUpdate({...costUpdate, [event.target.name]: event.target.value});
    setRevenueModalPayload({...projectForecastingDataLocalObject, forecastPoCDetails : {...projectForecastingDataLocalObject?.forecastPoCDetails, ...costUpdate, [event.target.name]: event.target.value}});
    setItdUpdate(true);
  };

  const handleContinue = () => {
    handleCallBack(true);
  };

  const handleCallBack = (dryRun) => {
    const modifiedPayload={...revenueModalPayload,projectRevenueComputationMethod:pocMethod?COST_REVENUE_TYPE.POC_BASED:COST_REVENUE_TYPE.CRM_PIP};

    callBackHandler(updateProjectForecastingWithAPI({
      dryRun,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      actionOrigin: ORIGIN.FIXED_BID_MODAL,
      payload: modifiedPayload
    }));
    
    setHandleClickContinue(true);
  };
  
  const onHandleSubmit = (resource) => {

    let resourceDetails = prepareAddResourcePayload(resource,projectForecastingState?.projectForecastingDataLocalObject, modify);
    resourceDetails = {...resourceDetails, projectCostComputationMethod: crmMethod ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };

    callBackHandler(
      updateProjectForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId: projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
        payload: resourceDetails,
        message: `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${modify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`,
        actionType: modify ? RESOURCE.EDIT_ACTION : RESOURCE.ADD_RESOURCE
      })
    );

    handleCloseModal();
  };

  const handleAddUpdateDeleteRole = (data) => {
    let preparedPayload = preparePayloadForRole(data.values,projectForecastingState?.projectForecastingDataLocalObject, data.actionType);
    preparedPayload = {...preparedPayload, projectCostComputationMethod: crmMethod ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    
    callBackHandler(updateProjectForecastingWithAPI({
      isNotLoading: true,
      projectForecastCandidateId:  projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
      payload: preparedPayload,
      message: `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${data.values?.roleForm?.orgRoleId?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[data.actionType]}`,
      actionOrigin: ORIGIN.ROLE_MODAL_ORIGIN
    }));
    handleCloseRoleSelectionModal();
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, value?.id) ?
        callBackHandler(
          {
            type: ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
            payload: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR
          }
        )
        :
        callBackHandler(getUser({ isNotLoading: true, userId: value?.id }));
    } else {
      callBackHandler(resetAddResourceModal());
    }
  };

  const options = useMemo(() => {
    const optionsList = getOptionsListForUsers(userList);
    return optionsList;
  }, [userList]);

  const onSearch = (value) => {
    if (value) {
      callBackHandler(getUsers({ isNotLoading: true, searchTerm: value }));
    }
  };
  
  const handleAddRole =() =>{
    setOpenRoleSelectionModal(true);
  };

  const handleCloseRoleSelectionModal = () => {
    setOpenRoleSelectionModal(false);
    setIsRoleModify(false);
    setRoleToModify(null);
  };

  const handleCloseModal = () => {
    setModelOpen(false);
    setModify(false);
    callBackHandler(resetAddResourceModal());
  };

  const handleSecondaryButton = () =>{
    setModelOpen(true);
  };

  return (
    <>
      <SnapModal
        align="center"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <SnapButton
                handleClick={handleClose}
                label={FORM_LABELS.CANCEL}
                name={FORM_LABELS.CANCEL}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.OUTLINED}
              />
              <SnapButton
                disabled={modalError}
                handleClick={handleContinue}
                label={FORM_LABELS.CONTINUE}
                name={FORM_LABELS.CONTINUE}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          </>
        }
        fullScreen
        fullWidth
        modalHeight="auto"
        modalTitle={PROJECT_FORECASTING.TITLE}
        name={PROJECT_FORECASTING.PROJECT_CONTROLS}
        onClose={handleClose}
        open={open}
        scroll="paper"
        transitionDirection="up"
      >
        <div className={`px-4 py-3 ${styles['action-wrapper']}`}>
          {/* for POC based, need to show this message */}
          { pocMethod &&
                <CustomAlertBar
                  alertType="info"
                  className={styles['info-alert']}
                >
                  <div className="d-flex align-items-center">
                    <Info /> {PROJECT_FORECASTING.INFO_MESSAGE}
                  </div>
                </CustomAlertBar>
          }
          <div className="d-flex">
            <RadioButton
              checked={crmMethod}
              className="mr-2"
              id={ELEMENT_ID.CRM_PIP_RADIO_BUTTON}
              label={PROJECT_FORECASTING.CRM_PIP_LABEL}
              name="milestoneGroup"
              onChange={handleCRMClick}
            />
            <RadioButton
              checked={pocMethod}
              id={ELEMENT_ID.POC_RADIO_BUTTON}
              label={PROJECT_FORECASTING.POC_BASED}
              name="milestoneGroup"
              onChange={handlePOCClick}
            />
          </div>
          {modalError && <DynamicAlertList alertList={modalError} />}

          {pocMethod &&
          <div className={`mt-3 mb-2 d-flex align-items-center gap-2 ${styles['input-wrap']}`}>
            <SnapTextbox
              handleChange={handleChange}
              id={ELEMENT_ID.PROJECT_FORECAST_TCV}
              isNonNegativeNumber
              label={PROJECT_FORECASTING.FORECAST_TCV}
              name="forecastTCV"
              type={FORM_LABELS.OUTLINED}
              value={!_isUndefined(costUpdate.forecastTCV) ? costUpdate.forecastTCV : ''}
            />
            <SnapTextbox
              handleChange={handleChange}
              id={ELEMENT_ID.ITD_REVENUE}
              inputType="number"
              label={projectForecastingDataLocalObject?.forecastPoCDetails?.itdRevenueLabel}
              name="itdRevenue"
              type={FORM_LABELS.OUTLINED}
              value={!_isUndefined(costUpdate.itdRevenue) ? costUpdate.itdRevenue : ''}
            />
            <SnapTextbox
              handleChange={handleChange}
              id={ELEMENT_ID.ITD_COST}
              isNonNegativeNumber
              label={projectForecastingDataLocalObject?.forecastPoCDetails?.itdCostLabel}
              name="itdCost"
              type={FORM_LABELS.OUTLINED}
              value={!_isUndefined(costUpdate.itdCost) ? costUpdate.itdCost : ''}
            />
            <SnapTextbox
              handleChange={handleChange}
              id={ELEMENT_ID.PROJECT_TOTAL_COST}
              isNonNegativeNumber
              label={PROJECT_FORECASTING.PROJECT_TOTAL_COST}
              name="totalProjectCost"
              type={FORM_LABELS.OUTLINED}
              value={!_isUndefined(costUpdate.totalProjectCost) ? costUpdate.totalProjectCost : ''}
            />
          </div>
          }
        </div>
        <div className={`px-4 ${styles['table-wrapper']}`}>
          {crmMethod && (
            <Box className={`forecasting-table mt-3 revenue-modal${styles.wrapper}`}>
              <ForecastDataSheetControlWrapper  
                grid={crmTableData?.resourceSummary}
                header={crmTableData?.headerData}
                limit
                limitRange={MAX_NUMBER_LIMIT}
                type={TABLE_TYPES.PRICING_SUMMARY}
              />
            </Box>
          )}

          { pocMethod && (
            <div className={styles['poc-table-wrapper']}>
              {/* @todo : This needs to removed, commenting out for now. */}
              {/* <h3 className={styles.heading}>REVENUE</h3>
              <Box className={`forecasting-table mt-3 revenue-modal${styles.wrapper}`}>
                <ForecastDataSheetControlWrapper  
                  grid={crmTableData?.resourceSummary}
                  header={crmTableData?.headerData}
                  limit
                  limitRange={MAX_NUMBER_LIMIT}
                  type={TABLE_TYPES.PRICING_SUMMARY}
                />
              </Box> */}
              <h3 className={`mb-2 ${styles.heading}`}>COST</h3>
              <div className="d-flex">
                <RadioButton
                  checked={pocBasedCrmPipMethod}
                  className="mr-2"
                  id={ELEMENT_ID.CRM_PIP_LABEL}
                  label={PROJECT_FORECASTING.CRM_PIP_LABEL}
                  name="milestoneGroup1"
                  onChange={handlePocCrmClick}
                />
                <RadioButton
                  checked={allocationMethod}
                  id={ELEMENT_ID.CRM_PIP_LABEL}
                  label={PROJECT_FORECASTING.ALLOCATION}
                  name="milestoneGroup1"
                  onChange={handleAllocationClick}
                />

              </div>
         

              {pocBasedCrmPipMethod && 
              <>
                {showAlertMessage && (
                  <CustomAlertBar
                    alertType="error-plain-text"
                    className="my-2"
                  >
                    <div className="d-flex align-items-center">
                      <Info /> {PERCENTAGE_ERROR}
                    </div>
                  </CustomAlertBar>
                )}
                <CrmPipMethod
                  callBackHandler={callBackHandler}
                  costUpdate={costUpdate}
                  forecastError={modalError}
                  forecastingState={projectForecastingState?.projectForecastingDataLocalObject}
                  idtUpdate={idtUpdate}
                  setRevenueModalPayload={setRevenueModalPayload}
                  setShowAlertErrorMessage={setShowAlertErrorMessage}
                />
              </> 
              }

              {allocationMethod &&
                <>
                  {showAlertMessage && (
                    <CustomAlertBar
                      alertType="error-plain-text"
                      className="my-2"
                    >
                      <div className="d-flex align-items-center">
                        <Info /> {PERCENTAGE_ERROR}
                      </div>
                    </CustomAlertBar>
                  )}

                  {filteredData && filteredData.length === 0 && !searchText && (
                    <>
                      <EmptyScreen
                        center
                        className="empty-add-role-resource"
                        image={addRole}
                        moreAction={
                          <div className="d-flex align-items-center justify-content-between mt-2">
                            <SnapButton
                              className="primary-invert mx-1"
                              handleClick={handleAddRole}
                              label={EMPTY_SCREEN_MESSAGE_NO_DATA.ROLE}
                              variant={EMPTY_SCREEN_MESSAGE_NO_DATA.VARIENT}
                            />
                            <SnapButton
                              className="primary-invert mx-1"
                              handleClick={handleSecondaryButton}
                              label={EMPTY_SCREEN_MESSAGE_NO_DATA.LABEL}
                              variant={EMPTY_SCREEN_MESSAGE_NO_DATA.VARIENT}
                            />
                          </div>
                        }
                        subTitle={EMPTY_SCREEN_MESSAGE_NO_DATA.SUBTITLE}
                        title={EMPTY_SCREEN_MESSAGE_NO_DATA.TITLE}
                      />
                    </>
                  )}
  
                  <ManageCostAllocationTable
                    callBackHandler={callBackHandler}
                    costUpdate={costUpdate}
                    filteredData={filteredData}
                    idtUpdate={idtUpdate}
                    isCrmSelected={crmMethod}
                    metaDataState={metaDataState}
                    projectForecastingState={projectForecastingState}
                    revenueModalPayload={revenueModalPayload}
                    searchTextEvent={setSearchText}
                    setRevenueModalPayload={setRevenueModalPayload}
                    setShowAlertErrorMessage={setShowAlertErrorMessage}
                    showRevenueRow
                  />

                  {modelOpen &&(
                    <ResourceModal
                      className={styles['modal-inside']}
                      forecastPeriodSummaryData={projectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary}
                      handleClose={handleCloseModal}
                      handleSubmit={onHandleSubmit}
                      modify={modify}
                      onSearch={onSearch}
                      onSelect={onResourceSelect}
                      open={modelOpen}
                      options={options}
                      resourceModalError={projectForecastingState?.resourceModalError}
                      selectedUser={projectForecastingState?.selectedUser}
                    />
                  )}
                  {openRoleSelectionModal && (
                    <RoleSelectionModal
                      className={styles['modal-inside']}
                      forecastingData={projectForecastingState?.projectForecastingDataLocalObject}
                      handleClose={handleCloseRoleSelectionModal}
                      handleSubmit={handleAddUpdateDeleteRole}
                      locationRevisions={metaDataState?.locationRevisions}
                      metaDataState={metaDataState}
                      modify={isRoleModify}
                      open={openRoleSelectionModal}
                      roleToModify={roleToModify}
                    />
                  )}
                  
                </>
              }
            </div>
          )}
        </div>
      </SnapModal>
    </>
  );
};

MilestoneRevenueModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  metaDataState: PropTypes.object,
  open: PropTypes.any,
  projectForecastingState: PropTypes.object,
  setMilestoneRevenueModal: PropTypes.func
};

export default MilestoneRevenueModal;