import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import { useParams, useHistory } from 'react-router-dom';
import { DROPDOWN_TYPE, setSessionItem, getSessionItem, ENTITY_TYPES } from '@revin-utils/utils';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { getAccountEntityCodeArray } from 'utils/helper';
import { getEntitlementsGrantsAction } from 'store/actions/MetaData';
import { ACCOUNT_DROPDOWN, SESSION_STORAGE_KEYS, VIEW_ONLY_ACCESS_ROLES, PARENT_ACCOUNT_MANAGER, OPPORTUNITY_SELECTION_ACCESS_ROLES, FORECASTING_SELECTION_ROUTE } from 'utils/constants';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './AccountDropdown.module.scss';

const AccountDropdown = ({ callBackHandler, chooseForecastScreen, metaData, showProgram, showChildAccount, eventParentAccount, className, dashboardState, showVerticalHead, fromOpportunitiesContainer, resetForecastLandingErrors }) => {
  const [vertical, setVertical] = useState(null);
  const [parentAccount, setParentAccount] = useState(null);
  const [account, setAccount] = useState({});
  const [program, setProgram] = useState(null);
  const { accountForecastCandidateId } = useParams();
  const history = useHistory();
  const [verticalAccountInputValue, setVerticalAccountInputValue] = useState('');
  const [parentAccountInputValue, setParentAccountInputValue] = useState('');
  const [hasUserTypedState, setHasUserTypedState] = useState({ [ACCOUNT_DROPDOWN.PARENT_ACCOUNT]: false, [ACCOUNT_DROPDOWN.VERTICAL]: false });
  const [dropdownOpenState, setDropdownOpenState] = useState({ [ACCOUNT_DROPDOWN.VERTICAL]: false, [ACCOUNT_DROPDOWN.PARENT_ACCOUNT]: false });

  useEffect(() => {
    const sessionedParentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
    !!sessionedParentAccountId && setParentAccount(sessionedParentAccountId);
  }, [getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id]);

  useEffect(() => {
    if (metaData?.entitlement && VIEW_ONLY_ACCESS_ROLES.includes(metaData?.entitlement)) {
      callBackHandler({
        type: ForecastDashBoardActionType.GET_VERTICAL_OPTIONS,
        payload: {
          forecastEntitlementView: metaData?.entitlement
        }
      });
    }
  }, [metaData?.entitlement]);

  useEffect(() => {
    if (dashboardState?.verticals?.length && VIEW_ONLY_ACCESS_ROLES.includes(metaData?.entitlement)) {
      const vertical = getSessionItem(SESSION_STORAGE_KEYS.VERTICAL_DPDN) || dashboardState?.verticals?.[0];
      setVertical(vertical?.id);
      setVerticalAccountInputValue(vertical?.label);
      setSessionItem(SESSION_STORAGE_KEYS.VERTICAL_DPDN, vertical);
      !metaData?.parentAccounts?.length && fetchParentAccountOptions({
        divisionCode: vertical?.attributes?.entityCode,
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        }
      });
    }
  }, [JSON.stringify(dashboardState?.verticals), metaData?.entitlement]);

  useEffect(() => {
    if (!metaData?.parentAccounts?.length && metaData?.entitlement &&
      (PARENT_ACCOUNT_MANAGER.includes(metaData?.entitlement) || OPPORTUNITY_SELECTION_ACCESS_ROLES.includes(metaData?.entitlement))) {
      fetchParentAccountOptions({
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        }
      });
    }
  }, [metaData?.entitlement, JSON.stringify(metaData?.parentAccounts)]);

  useEffect(() => {
    if (metaData?.parentAccounts?.length) {
      const sessionedParentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id || accountForecastCandidateId;
      const parentAccount = metaData?.parentAccounts.find(({ id }) => id === sessionedParentAccountId) || metaData?.parentAccounts[0];
      
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

      setParentAccount(parentAccount?.id);
      //this required for parent component
      !metaData?.accounts?.length && getChildAccountsCallBack(parentAccount?.attributes?.parentAccountId);
      !chooseForecastScreen && !!eventParentAccount && eventParentAccount(parentAccount?.attributes);
      setSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN, parentAccount);
      setParentAccountInputValue(parentAccount?.label);
    }
  }, [JSON.stringify(metaData?.parentAccounts)]);
  /* Removed accountForecastCandidateId from dependency array for now, to solve duplicate API call.
   Can be add Back, if it creates any issue
   }, [metaData?.parentAccounts, accountForecastCandidateId]); */

  useEffect(() => {
    if (metaData?.accounts?.length) {
      showProgram && programCallBack(getAccountEntityCodeArray(account, metaData?.accounts));
    }
  }, [JSON.stringify(metaData?.accounts), showProgram]);

  const handleChangeVertical = (_,data) => {
    if (data?.id) {
      const value = data?.id;
      const vertical = dashboardState?.verticals?.find(({ id }) => id === value);
      setVertical(value);
      setSessionItem(SESSION_STORAGE_KEYS.VERTICAL_DPDN, vertical);
      fetchParentAccountOptions({
        divisionCode: vertical?.attributes?.entityCode,
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        }
      });
      resetFilterData();
      setVerticalAccountInputValue(data.label);
      setHasUserTypedState((prevState) => ({ ...prevState, [ACCOUNT_DROPDOWN.VERTICAL]: false }));
    }
  };

  const fetchParentAccountOptions = (payload) => {
    callBackHandler({
      type: MetaDataActionType.GET_PARENT_ACCOUNT_OPTIONS,
      payload
    });
  };

  const handleOpenDropdown = (dropdownType) => {
    setDropdownOpenState((prevState) => ({ ...prevState, [dropdownType]: true }));
    setHasUserTypedState((prevState) => ({ ...prevState, [dropdownType]: false }));
  };

  const handleCloseDropdown = (dropdownType) => {
    setDropdownOpenState((prevState) => ({ ...prevState, [dropdownType]: false }));
  };

  const handleChangeParentAccount = (_, data) => {
    if (data?.id) {
      const value = data?.id;
      setParentAccount(value);
      const parentAccount = metaData?.parentAccounts?.find(({ id }) => id === value);
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
      setSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN, parentAccount);
      getChildAccountsCallBack(parentAccount?.attributes?.parentAccountId);
      !chooseForecastScreen && eventParentAccount && eventParentAccount(parentAccount?.attributes);
      chooseForecastScreen && history.push(`/${FORECASTING_SELECTION_ROUTE}/${parentAccount.attributes.id}`);
      if (fromOpportunitiesContainer) {
        history.push(`/${parentAccount.attributes.id}`);
        resetForecastLandingErrors();
      }
      resetFilterData();
      setParentAccountInputValue(data.label);
      setHasUserTypedState((prevState) => ({ ...prevState, [ACCOUNT_DROPDOWN.PARENT_ACCOUNT]: false }));
    }
  };

  const resetFilterData = () => {
    callBackHandler({
      type: MetaDataActionType.SET_ACCOUNT_DROPDOWN,
      payload: []
    });
    callBackHandler({
      type: MetaDataActionType.SET_PROGRAM_DROPDOWN,
      payload: []
    });
    callBackHandler({
      type: MetaDataActionType.SET_PROJECT_MANAGERS,
      payload: []
    });
    setSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS, {
      selectedAccounts: [],
      parentAccountId: '',
      selectedPrograms: [],
      salesStages: metaData?.salesStageData,
      projectSources: metaData?.projectSource,
      billingTypesIds: [],
      deliveryTypesIds: [],
      includeCompletedProjects: false,
      projectManagerIds: []
    });
  };

  const getChildAccountsCallBack = (parentAccountId) => {
    callBackHandler({
      type: MetaDataActionType.GET_ACCOUNT_DROPDOWN,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        },
        accountFetchType: 'CHILD_ACCOUNTS_WITH_PARENT',
        parentAccountIds: [
          parentAccountId
        ]
      }
    });
  };

  const programCallBack = (entityCode) => {
    callBackHandler({
      type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        },
        isShowLoader: true,
        parentEntityCodes: entityCode
      }
    });
  };

  const handleChangeAccount = (event) => {
    const account = metaData?.accounts?.find(({ id }) => id === event.target.value);
    setAccount(account.id);
    showProgram && programCallBack(getAccountEntityCodeArray(account, metaData?.accounts));
  };

  const handleChangeProgram = (event) => {
    const program = metaData?.programs?.find(({ id }) => id === event.target.value);
    setProgram(program?.id);
  };

  const parentAccountInputValueHandler = (newInputValue) => {
    setParentAccountInputValue(newInputValue);
  };

  const verticalAccountInputValueHandler = (newInputValue) => {
    setVerticalAccountInputValue(newInputValue);
  };

  const onBlurHandler = ({target}) => {
    const data = target.id === ELEMENT_ID.ACCOUNT_DROPDOWN_VERTICAL ? dashboardState?.verticals : metaData?.parentAccounts;
    const findCondition = target.id === ELEMENT_ID.ACCOUNT_DROPDOWN_VERTICAL ? vertical : parentAccount;
    if (!target.value || !data?.some(item => item.id === target.value)) {
      const label = data?.find(({ id }) => id === findCondition)?.label;
      target.id === ELEMENT_ID.ACCOUNT_DROPDOWN_VERTICAL ? setVerticalAccountInputValue(label) : setParentAccountInputValue(label);
    } else {
      target.id === ELEMENT_ID.ACCOUNT_DROPDOWN_VERTICAL ? setVerticalAccountInputValue(target.value) : setParentAccountInputValue(target.value);
    };
  };

  return (
    <div className={`d-flex gap-2 align-items-center ${className} ${styles['filter-wrapper']}`}>
      {(showVerticalHead && vertical) && 
        <SnapDropdown
          className={'verticalParentAccountoptionClass'}
          customTextBoxClass={verticalAccountInputValue && 'input-with-value'}
          data={dashboardState?.verticals}
          defaultValue={getSessionItem(SESSION_STORAGE_KEYS.VERTICAL_DPDN) || dashboardState?.verticals[0]}
          disabled={dashboardState?.verticals?.length === 1}
          filterOptions={(options) => {
            if (hasUserTypedState[ACCOUNT_DROPDOWN.VERTICAL] && verticalAccountInputValue) {
              return options.filter((option) =>
                option.label?.toLowerCase()?.includes(verticalAccountInputValue?.toLowerCase())
              );
            }
            return options;
          }}
          getOptionSelected={(option) => option?.id === vertical}
          handleChange={handleChangeVertical}
          id={ELEMENT_ID.ACCOUNT_DROPDOWN_VERTICAL}
          isClearAutocomplete
          isOverflowEnabled
          label={ACCOUNT_DROPDOWN.VERTICAL}
          name={ACCOUNT_DROPDOWN.VERTICAL}
          onBlur={onBlurHandler}
          onClose={() => handleCloseDropdown(ACCOUNT_DROPDOWN.VERTICAL)}
          onOpen={() => handleOpenDropdown(ACCOUNT_DROPDOWN.VERTICAL)}
          open={dropdownOpenState[ACCOUNT_DROPDOWN.VERTICAL]}
          setAutocompleteValue={
            (inputValue) => {
              verticalAccountInputValueHandler(inputValue);
              setHasUserTypedState((prevState) => ({ ...prevState, [ACCOUNT_DROPDOWN.VERTICAL]: true }));
            }}
          type={DROPDOWN_TYPE.AUTOCOMPLETE}
          value={verticalAccountInputValue || ''}
        />
      }

      {
        parentAccount &&
        <SnapDropdown
          className={'verticalParentAccountoptionClass'}
          customOverflowWidth={73}
          customTextBoxClass={parentAccountInputValue && 'input-with-value'}
          data={metaData?.parentAccounts}
          defaultValue={getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN) || metaData?.parentAccounts[0]}
          disabled={metaData?.parentAccounts?.length === 1}
          filterOptions={(options) => {
            if (hasUserTypedState[ACCOUNT_DROPDOWN.PARENT_ACCOUNT] && parentAccountInputValue) {
              return options.filter((option) =>
                option.label?.toLowerCase()?.includes(parentAccountInputValue?.toLowerCase())
              );
            }
            return options;
          }}
          getOptionSelected={(option, value) => option?.label === value} 
          handleChange={handleChangeParentAccount}
          id={ELEMENT_ID.ACCOUNT_DROPDOWN_PARENT_ACCOUNT}
          isClearAutocomplete
          isOverflowEnabled
          label={ACCOUNT_DROPDOWN.PARENT_ACCOUNT}
          name={ACCOUNT_DROPDOWN.PARENT_ACCOUNT}
          onBlur={onBlurHandler}
          onClose={() => handleCloseDropdown(ACCOUNT_DROPDOWN.PARENT_ACCOUNT)}
          onOpen={() => handleOpenDropdown(ACCOUNT_DROPDOWN.PARENT_ACCOUNT)}
          open={dropdownOpenState[ACCOUNT_DROPDOWN.PARENT_ACCOUNT]}
          setAutocompleteValue={
            (inputValue) => {
              parentAccountInputValueHandler(inputValue);
              setHasUserTypedState((prevState) => ({ ...prevState, [ACCOUNT_DROPDOWN.PARENT_ACCOUNT]: true }));
            }}
          type={DROPDOWN_TYPE.AUTOCOMPLETE}
          value={parentAccountInputValue || ''}
        /> 
      }

      {showChildAccount && (
        <SnapDropdown
          data={metaData?.accounts}
          disabled={metaData?.accounts?.length === 1}
          handleChange={handleChangeAccount}
          id={ELEMENT_ID.ACCOUNT_DROPDOWN_ACCOUNT}
          isOverflowEnabled
          label={ACCOUNT_DROPDOWN.ACCOUNT}
          name={ACCOUNT_DROPDOWN.ACCOUNT}
          type={DROPDOWN_TYPE.DROPDOWN}
          value={account}
        />
      )}
      {showProgram && (
        <SnapDropdown
          data={metaData?.programs}
          disabled={metaData?.programs?.length === 1}
          handleChange={handleChangeProgram}
          id={ELEMENT_ID.ACCOUNT_DROPDOWN_PROGRAM}
          isOverflowEnabled
          label={ACCOUNT_DROPDOWN.PROGRAM}
          name={ACCOUNT_DROPDOWN.PROGRAM}
          type={DROPDOWN_TYPE.DROPDOWN}
          value={program}
        />
      )}

    </div>
  );
};

AccountDropdown.propTypes = {
  callBackHandler: PropTypes.func,
  chooseForecastScreen: PropTypes.bool,
  className: PropTypes.string,
  dashboardState: PropTypes.object,
  eventParentAccount: PropTypes.func,
  fromOpportunitiesContainer: PropTypes.bool,
  getAccount: PropTypes.func,
  metaData: PropTypes.object,
  resetForecastLandingErrors: PropTypes.func,
  showChildAccount: PropTypes.bool,
  showProgram: PropTypes.bool,
  showVerticalHead: PropTypes.bool
};

export default withStyles(styles)(AccountDropdown);

