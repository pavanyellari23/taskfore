import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getForecastCandidates, changeForecastingType, getForecastCandidatesAppend, getForecastCandidatesSummary, deleteCustomGroupAction, setChooseForecastCandidates, getOpportunityInfoById } from 'store/actions/Opportunities';
import { getProgramDropdown, getAccountDropdown, getParentAccountOptionsAction, getBillingType, getDeliveryType, getSalesStage, getProjectSource, getProjectManger, setAccountDropdown, setProgramDropdown, getProjectManagerSuccess, getEntitlementsGrantsAction } from 'store/actions/MetaData';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import ChooseForecasting from 'components/common/ChooseForecasting/ChooseForecasting';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { forecastSubmissionAction, getVerticalOptionsAction } from 'store/actions/ForecastDashboard';

const ForecastSelectionContainer = (props) => {
  const { accountForecastCandidateId } = useParams();
  const {
    changeForecastingTypeDispatcher,
    getForecastCandidatesDispatcher,
    getAccountDropdownDispatcher,
    getEntitlementsGrantsDispatcher,
    getProgramDropdownDispatcher,
    getParentAccountOptionsDispatcher,
    getVerticalOptionsDispatcher,
    forecastSubmissionDispatcher,
    getBillingTypeAction,
    getDeliveryTypeAction,
    getSalesStageAction,
    getProjectSourceAction,
    getProjectManagerAction,
    setAccountDropDownDisPatcher,
    setProgramDropDownDispatcher,
    setProjectManagerDropDownDispatcher,
    getForecastCandidatesAppendAction,
    getForecastSummaryDataAction,
    deleteCustomGroupActionDIspatcher,
    setChooseForecastCandidatesDispatcher,
    getOpportunityInfoByIdDispatcher
  } = props;

  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case OpportunitiesActionType.GET_FORECAST_CANDIDATES:
        getForecastCandidatesDispatcher(payload);
        break;
      case OpportunitiesActionType.CHANGE_FORECASTING_TYPE:
        changeForecastingTypeDispatcher(payload);
        break;
      case ForecastDashBoardActionType.GET_VERTICAL_OPTIONS:
        getVerticalOptionsDispatcher(payload);
        break;
      case MetaDataActionType.GET_PARENT_ACCOUNT_OPTIONS:
        getParentAccountOptionsDispatcher(payload);
        break;
      case MetaDataActionType.GET_ENTITLEMENT_GRANTS:
        getEntitlementsGrantsDispatcher(payload);
        break;    
      case MetaDataActionType.GET_ACCOUNT_DROPDOWN:
        getAccountDropdownDispatcher(payload);
        break;
      case MetaDataActionType.GET_PROGRAM_DROPDOWN:
        getProgramDropdownDispatcher(payload);
        break;
      case ForecastDashBoardActionType.FORECAST_SUBMISSION:
        forecastSubmissionDispatcher(payload);
        break;
      case MetaDataActionType.GET_BILLING_TYPE:
        getBillingTypeAction(payload);
        break;
      case MetaDataActionType.GET_DELIVERY_TYPE:
        getDeliveryTypeAction(payload);
        break;
      case MetaDataActionType.GET_SALES_STAGE:
        getSalesStageAction(payload);
        break;
      case MetaDataActionType.GET_PROJECT_SOURCE:
        getProjectSourceAction(payload);
        break;
      case MetaDataActionType.GET_PROJECT_MANAGERS:
        getProjectManagerAction(payload);
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
      case OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND:
        getForecastCandidatesAppendAction(payload);
        break;
      case OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA:
        getForecastSummaryDataAction(payload);
        break;
      case OpportunitiesActionType.DELETE_CUSTOM_GROUP:
        deleteCustomGroupActionDIspatcher(payload);
        break;
      case OpportunitiesActionType.SET_CHOOSE_FORECAST_CANDIDATES:
        setChooseForecastCandidatesDispatcher(payload);
        break;
      case OpportunitiesActionType.GET_OPPORTUNITY_INFO_BY_ID:
        getOpportunityInfoByIdDispatcher(payload);
        break;
      default:
        break;
    }
  };

  return (
    <>
      {accountForecastCandidateId &&
        <ChooseForecasting
          accountForecastCandidateId={accountForecastCandidateId}
          callBackHandler={callBackHandler}
          {...props}
        />
      }
    </>
  );
};


const mapStateToProps = (state) => {
  return {
    opportunities: state.opportunities,
    metaData: state.metaData,
    dashboardState: state.forecastDashboard
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getForecastCandidatesDispatcher: (payload) => {
      dispatch(getForecastCandidates(payload));
    },
    changeForecastingTypeDispatcher: (payload) => {
      dispatch(changeForecastingType(payload));
    },
    getVerticalOptionsDispatcher: (payload) => {
      dispatch(getVerticalOptionsAction(payload));
    },
    getParentAccountOptionsDispatcher: (payload) => {
      dispatch(getParentAccountOptionsAction(payload));
    },
    getEntitlementsGrantsDispatcher: (payload) => {
      dispatch(getEntitlementsGrantsAction(payload));
    },
    getAccountDropdownDispatcher: (payload) => {
      dispatch(getAccountDropdown(payload));
    },
    getProgramDropdownDispatcher: (payload) => {
      dispatch(getProgramDropdown(payload));
    },
    forecastSubmissionDispatcher: (payload) => {
      dispatch(forecastSubmissionAction(payload));
    },
    getBillingTypeAction: (payload) => {
      dispatch(getBillingType(payload));
    },
    getDeliveryTypeAction: (payload) => {
      dispatch(getDeliveryType(payload));
    },
    getSalesStageAction: (payload) => {
      dispatch(getSalesStage(payload));
    },
    getProjectSourceAction: (payload) => {
      dispatch(getProjectSource(payload));
    },
    getProjectManagerAction: (payload) => {
      dispatch(getProjectManger(payload));
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
    getForecastCandidatesAppendAction: (payload) => {
      dispatch(getForecastCandidatesAppend(payload));
    },
    getForecastSummaryDataAction: (payload) => {
      dispatch(getForecastCandidatesSummary(payload));
    },
    deleteCustomGroupActionDIspatcher: (payload) => {
      dispatch(deleteCustomGroupAction(payload));
    },
    setChooseForecastCandidatesDispatcher: (payload) => {
      dispatch(setChooseForecastCandidates(payload));
    },
    getOpportunityInfoByIdDispatcher: (payload) => {
      dispatch(getOpportunityInfoById(payload));
    }
  };
};

ForecastSelectionContainer.propTypes = {
  changeForecastingTypeDispatcher: PropTypes.func,
  deleteCustomGroupActionDIspatcher: PropTypes.func,
  forecastSubmissionDispatcher: PropTypes.func,
  getAccountDropdownDispatcher: PropTypes.func,
  getBillingTypeAction: PropTypes.func,
  getDeliveryTypeAction: PropTypes.func,
  getEntitlementsGrantsDispatcher: PropTypes.func,
  getForecastCandidatesAppendAction: PropTypes.func,
  getForecastCandidatesDispatcher: PropTypes.func,
  getForecastSummaryDataAction: PropTypes.func,
  getOpportunityInfoByIdDispatcher: PropTypes.func,
  getParentAccountOptionsDispatcher: PropTypes.func,
  getProgramDropdownDispatcher: PropTypes.func,
  getProjectManagerAction: PropTypes.func,
  getProjectSourceAction: PropTypes.func,
  getSalesStageAction: PropTypes.func,
  getVerticalOptionsDispatcher: PropTypes.func,
  setAccountDropDownDisPatcher: PropTypes.func,
  setChooseForecastCandidatesDispatcher: PropTypes.func,
  setProgramDropDownDispatcher: PropTypes.func,
  setProjectManagerDropDownDispatcher: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForecastSelectionContainer);
