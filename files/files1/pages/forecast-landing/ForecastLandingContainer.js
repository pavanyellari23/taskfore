import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import {
  getBillingType,
  getDeliveryType,
  getServicePortfolio,
  getServiceLine,
  getProviders,
  getCurrencyData,
  getLocations,
  getProgramDropdown,
  getProjectManger,
  getAccountDropdown,
  getSalesStage,
  getProjectSource,
  setAccountDropdown, 
  setProgramDropdown,
  getProjectManagerSuccess
} from 'store/actions/MetaData';
import {
  addOpportunity,
  getForecastCandidates,
  deleteOpportunity,
  editOpportunity,
  bulkUpdateForecastCandidates,
  getAvailableProjectList,
  addAvailableProject,
  resetModal,
  getForecastCandidatesAppend,
  getProgramsandManagers,
  getChildAccount,
  deleteCustomGroupAction,
  getCustomGrpProjectsList,
  addCustomGroups,
  getCustomGroupCandidates,
  editCustomGroups
} from 'store/actions/Opportunities';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import ForecastLanding from './ForecastLanding';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { addLocationInControlsStateAction, getForecastControlsAction, getHolidaysByLocationIdAction,
  saveForecastControlsAction, updateForecastControlsStateAction } from 'store/actions/ForecastControls';
import { GlobalActionType } from 'store/types/GlobalActionType';
import { showToastMessage } from 'store/actions/Global';

const ForecastLandingContainer = (props) => {
  const {
    addOpportunityAction,
    deleteOpportunityAction,
    editOpportunityAction,
    getBillingTypeAction,
    getDeliveryTypeAction,
    getForecastCandidatesAction,
    getProgramDropdownDispatcher,
    getServicePortfolioAction,
    getServiceLineAction,
    getProvidersAction,
    getCurrencyDataAction,
    getProjectManagerAction,
    bulkUpdateForecastCandidatesAction,
    getAvailableProjectListAction,
    addAvailableProjectAction,
    resetModalAction,
    getForecastControlsDispatcher,
    getLocationsAction,
    updateForecastControlsStateDispatcher,
    saveForecastControlsDispatcher,
    getHolidaysByLocationIdDispatcher,
    addLocationInControlsStateDispatcher,
    showToastMessageDispatcher,
    getAccountDropDownAction,
    getProgramsandManagersAction,
    getSalesStageDataAction,
    getProjectSourceDataAction,
    getForecastCandidatesAppendAction,
    getChildAccountsAction,
    setAccountDropDownDisPatcher,
    setProgramDropDownDispatcher,
    setProjectManagerDropDownDispatcher,
    deleteCustomGroupDispatcher,
    getCustomGroupProjectsList,
    addCustomGroupsDispatcher,
    getCustomGroupCandidatesAction,
    editCustomGroupDispatcher
  } = props;

  const callBackHandler = ({type , payload}) => {
    switch(type){
      case OpportunitiesActionType.ADD_OPPORTUNITY:
        addOpportunityAction(payload);
        break;
      case OpportunitiesActionType.DELETE_OPPORTUNITY:
        deleteOpportunityAction(payload);
        break;
      case OpportunitiesActionType.EDIT_OPPORTUNITY:
        editOpportunityAction(payload);
        break;
      case OpportunitiesActionType.BULK_UPDATE_FORECAST_CANDIDATES:
        bulkUpdateForecastCandidatesAction(payload);
        break;
      case OpportunitiesActionType.GET_AVAILABLE_PROJECT_LIST:
        getAvailableProjectListAction(payload);
        break;
      case OpportunitiesActionType.ADD_AVAILABLE_PROJECT:
        addAvailableProjectAction(payload);
        break;
      case OpportunitiesActionType.RESET_MODAL:
        resetModalAction(payload);
        break;
      case MetaDataActionType.GET_BILLING_TYPE:
        getBillingTypeAction(payload);
        break;
      case MetaDataActionType.GET_DELIVERY_TYPE:
        getDeliveryTypeAction(payload);
        break;
      case MetaDataActionType.GET_SERVICE_PORTFOLIO:
        getServicePortfolioAction(payload);
        break;
      case MetaDataActionType.GET_SERVICE_LINE:
        getServiceLineAction(payload);
        break;
      case MetaDataActionType.GET_PROVIDERS:
        getProvidersAction(payload);
        break;
      case MetaDataActionType.GET_CURRENCY_DATA:
        getCurrencyDataAction(payload);
        break;
      case MetaDataActionType.GET_LOCATIONS:
        getLocationsAction(payload);
        break;
      case OpportunitiesActionType.GET_FORECAST_CANDIDATES:
        getForecastCandidatesAction(payload);
        break;
      case MetaDataActionType.GET_PROJECT_MANAGERS:
        getProjectManagerAction(payload);
        break;
      case MetaDataActionType.GET_ACCOUNT_DROPDOWN:
        getAccountDropDownAction(payload);
        break;
      case ForecastControlsActionType.GET_FORECAST_CONTROLS:
        getForecastControlsDispatcher(payload);
        break;
      case ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE:
        updateForecastControlsStateDispatcher(payload);
        break;
      case ForecastControlsActionType.SAVE_FORECAST_CONTROLS:
        saveForecastControlsDispatcher(payload);
        break;
      case ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID:
        getHolidaysByLocationIdDispatcher(payload);
        break;
      case ForecastControlsActionType.ADD_LOCATION_IN_CONTROLS_STATE:
        addLocationInControlsStateDispatcher(payload);
        break;
      case MetaDataActionType.GET_PROGRAM_DROPDOWN:
        getProgramDropdownDispatcher(payload);
        break;  
      case GlobalActionType.SHOW_TOAST_MESSAGE:
        showToastMessageDispatcher(payload);
        break;
      case OpportunitiesActionType.GET_MANAGERS_PROGRAM_DROPDOWN:
        getProgramsandManagersAction(payload);
        break;
      case MetaDataActionType.GET_SALES_STAGE:
        getSalesStageDataAction(payload);
        break;
      case MetaDataActionType.GET_PROJECT_SOURCE:
        getProjectSourceDataAction(payload);
        break;
      case OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND:
        getForecastCandidatesAppendAction(payload);
        break;
      case OpportunitiesActionType.GET_CHILD_ACCOUNTS:
        getChildAccountsAction(payload);
        break;
      case MetaDataActionType.SET_ACCOUNT_DROPDOWN:
        setAccountDropDownDisPatcher(payload);
        break;
      case MetaDataActionType.SET_PROGRAM_DROPDOWN:
        setProgramDropDownDispatcher(payload);
        break;
      case MetaDataActionType.SET_PROJECT_MANAGERS:
        setProjectManagerDropDownDispatcher(payload);
        break;
      case OpportunitiesActionType.DELETE_CUSTOM_GROUP:
        deleteCustomGroupDispatcher(payload);
        break;
      case OpportunitiesActionType.GET_CUSTOM_GROUP_PROJECTS_LIST:
        getCustomGroupProjectsList(payload);
        break;
      case OpportunitiesActionType.ADD_CUSTOM_GROUP:
        addCustomGroupsDispatcher(payload);
        break;
      case OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES: 
        getCustomGroupCandidatesAction(payload);
        break;
      case OpportunitiesActionType.EDIT_CUSTOM_GROUP: 
        editCustomGroupDispatcher(payload);
        break;
      default:
        break;
    }
  };

  return (
    <ForecastLanding
      {...props}
      callBackHandler={callBackHandler}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    metaData: state.metaData,
    opportunities: state.opportunities,
    forecastControlsState: state.forecastControls
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addAvailableProjectAction: (payload) => {
      dispatch(addAvailableProject(payload));
    },
    addOpportunityAction: (payload) => {
      dispatch(addOpportunity(payload));
    },
    deleteOpportunityAction: (payload) => {
      dispatch(deleteOpportunity(payload));
    },
    editOpportunityAction: (payload) => {
      dispatch(editOpportunity(payload));
    },
    bulkUpdateForecastCandidatesAction: (payload) => {
      dispatch(bulkUpdateForecastCandidates(payload));
    },
    getAvailableProjectListAction: (payload) => {
      dispatch(getAvailableProjectList(payload));
    },
    getAccountDropDownAction: (payload) => {
      dispatch(getAccountDropdown(payload));
    },
    getBillingTypeAction: (payload) => {
      dispatch(getBillingType(payload));
    },
    getDeliveryTypeAction: (payload) => {
      dispatch(getDeliveryType(payload));
    },
    getServicePortfolioAction: (payload) => {
      dispatch(getServicePortfolio(payload));
    },
    getServiceLineAction: (payload) => {
      dispatch(getServiceLine(payload));
    },
    getProvidersAction: (payload) => {
      dispatch(getProviders(payload));
    },
    getCurrencyDataAction: (payload) => {
      dispatch(getCurrencyData(payload));
    },
    getForecastCandidatesAction: (payload) => {
      dispatch(getForecastCandidates(payload));
    },
    getProjectManagerAction: (payload) => {
      dispatch(getProjectManger(payload));
    },
    getForecastControlsDispatcher: (payload) => {
      dispatch(getForecastControlsAction(payload));
    },
    getSalesStageDataAction: (payload) => {
      dispatch(getSalesStage(payload));
    },
    updateForecastControlsStateDispatcher: (payload) => {
      dispatch(updateForecastControlsStateAction(payload));
    },
    saveForecastControlsDispatcher: (payload) => {
      dispatch(saveForecastControlsAction(payload));
    },
    getLocationsAction: (payload) => {
      dispatch(getLocations(payload));
    },
    getHolidaysByLocationIdDispatcher : (payload) => {
      dispatch(getHolidaysByLocationIdAction(payload));
    },
    addLocationInControlsStateDispatcher : (payload) => {
      dispatch(addLocationInControlsStateAction(payload));
    },
    showToastMessageDispatcher: (payload) => {
      dispatch(showToastMessage(payload));
    },
    getProgramDropdownDispatcher: (payload) => {
      dispatch(getProgramDropdown(payload));
    },
    resetModalAction: () => {
      dispatch(resetModal());
    },
    getProgramsandManagersAction: (payload) => {
      dispatch(getProgramsandManagers(payload));
    },
    getProjectSourceDataAction: (payload) => {
      dispatch(getProjectSource(payload));
    },
    getForecastCandidatesAppendAction: (payload) => {
      dispatch(getForecastCandidatesAppend(payload));
    },
    getChildAccountsAction: (payload) => {
      dispatch(getChildAccount(payload));
    },
    setAccountDropDownDisPatcher: (payload) => {
      dispatch(setAccountDropdown(payload));
    },
    setProgramDropDownDispatcher: (payload) => {
      dispatch(setProgramDropdown(payload));
    },
    setProjectManagerDropDownDispatcher: (payload) => {
      dispatch(getProjectManagerSuccess(payload));
    },
    deleteCustomGroupDispatcher: (payload) => {
      dispatch(deleteCustomGroupAction(payload));
    },
    getCustomGroupProjectsList: (payload) => {
      dispatch(getCustomGrpProjectsList(payload));
    },
    addCustomGroupsDispatcher: (payload) => {
      dispatch(addCustomGroups(payload));
    },
    getCustomGroupCandidatesAction: (payload) => {
      dispatch(getCustomGroupCandidates(payload));
    },
    editCustomGroupDispatcher: (payload) => {
      dispatch(editCustomGroups(payload));
    }
  };
};

ForecastLandingContainer.propTypes = {
  addAvailableProjectAction: PropTypes.func,
  addCustomGroupsDispatcher: PropTypes.func,
  addLocationInControlsStateDispatcher:PropTypes.func,
  addOpportunityAction: PropTypes.func,
  bulkUpdateForecastCandidatesAction: PropTypes.func,
  deleteCustomGroupDispatcher: PropTypes.func,
  deleteOpportunityAction: PropTypes.func,
  editCustomGroupDispatcher: PropTypes.func,
  editOpportunityAction:PropTypes.func,
  getAccountDropDownAction: PropTypes.func,
  getAvailableProjectListAction: PropTypes.func,
  getBillingTypeAction: PropTypes.func,
  getChildAccountsAction: PropTypes.func,
  getCurrencyDataAction: PropTypes.func,
  getCustomGroupCandidatesAction: PropTypes.func,
  getCustomGroupProjectsList: PropTypes.func,
  getDeliveryTypeAction: PropTypes.func,
  getForecastCandidatesAction: PropTypes.func,
  getForecastCandidatesAppendAction: PropTypes.func,
  getForecastControlsDispatcher: PropTypes.func,
  getHolidaysByLocationIdDispatcher: PropTypes.func,
  getLocationsAction: PropTypes.func,
  getProgramDropdownDispatcher:PropTypes.func,
  getProgramsandManagersAction: PropTypes.func,
  getProjectManagerAction: PropTypes.func,
  getProjectSourceDataAction: PropTypes.func,
  getProvidersAction: PropTypes.func,
  getSalesStageDataAction: PropTypes.func,
  getServiceLineAction: PropTypes.func,
  getServicePortfolioAction: PropTypes.func,
  modifyForecastControlsDispatcher: PropTypes.func,
  resetModalAction: PropTypes.func,
  saveForecastControlsDispatcher: PropTypes.func,
  setAccountDropDownDisPatcher: PropTypes.func,
  setProgramDropDownDispatcher: PropTypes.func,
  setProjectManagerDropDownDispatcher: PropTypes.func,
  showToastMessageDispatcher: PropTypes.func,
  updateForecastControlsStateDispatcher: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForecastLandingContainer);
