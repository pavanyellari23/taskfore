import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ForecastDashboardLanding from 'components/pages/forecast-dashboard/ForecastDashboard';
import { getAccountDropdown, getForecastCyclesAction, getAccountLogo, getParentAccountOptionsAction, getProgramDropdown, setAccountDropdown, setProgramDropdown, getProjectManagerSuccess, getEntitlementsGrantsAction } from 'store/actions/MetaData';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { getForecastHistoricalData, forecastSubmissionAction, getFinancialYearSummary, setSelectedParentAccountAction, getVerticalOptionsAction, getGraphSummaryAction } from 'store/actions/ForecastDashboard';
import { MetaDataActionType } from 'store/types/MetaDataActionType';

const ForecastDashboardContainer = ({
  forecastSubmissionDispatcher,
  getForecastHistoricalDataDispatcher,
  dashboardState,
  metaData,
  getFinancialYearSummaryDispatcher,
  getAccountDropdownDispatcher,
  getVerticalOptionsDispatcher,
  getForecastCyclesDispatcher,
  getParentAccountOptionsDispatcher,
  getEntitlementsGrantsDispatcher,
  setSelectedParentAccountDispatcher,
  getAccountLogoDispatcher,
  getProgramDropdownDispatcher,
  getForecastTrendsDispatcher,
  setAccountDropDownDisPatcher,
  setProgramDropDownDispatcher,
  setProjectManagerDropDownDispatcher
}) => {

  const callBackHandler = ({type , payload}) => {
    switch(type){
      case ForecastDashBoardActionType.GET_FORECAST_HISTORICAL_DATA:
        getForecastHistoricalDataDispatcher(payload);
        break;
      case ForecastDashBoardActionType.FORECAST_SUBMISSION:
        forecastSubmissionDispatcher(payload);
        break;
      case ForecastDashBoardActionType.GET_FORECAST_FINANCIAL_YEAR_SUMMARY:
        getFinancialYearSummaryDispatcher(payload);
        break;
      case MetaDataActionType.GET_ACCOUNT_DROPDOWN:
        getAccountDropdownDispatcher(payload);
        break;    
      case MetaDataActionType.GET_FORECAST_CYCLES:
        getForecastCyclesDispatcher(payload);
        break;
      case MetaDataActionType.GET_ACCOUNT_LOGO:
        getAccountLogoDispatcher(payload);
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
      case ForecastDashBoardActionType.SET_SELECTED_PARENT_ACCOUNT:
        setSelectedParentAccountDispatcher(payload);
        break; 
      case MetaDataActionType.GET_PROGRAM_DROPDOWN:
        getProgramDropdownDispatcher(payload);
        break;  
      case ForecastDashBoardActionType.GET_DASHBOARD_GRAPH_DATA:
        getForecastTrendsDispatcher(payload);
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
      default:
        break;
    }
  };

  return(
    <ForecastDashboardLanding
      callBackHandler={callBackHandler}
      dashboardState={dashboardState}
      metaData={metaData}
    />
  );
};


const mapStateToProps = (state) => {
  return {
    dashboardState: state.forecastDashboard,
    metaData: state.metaData
  };
};

const mapDispatchToProps = (dispatch) => {
  return{
    getForecastHistoricalDataDispatcher: (payload) => {
      dispatch(getForecastHistoricalData(payload));
    },
    forecastSubmissionDispatcher: (payload) => {
      dispatch(forecastSubmissionAction(payload));
    },
    getFinancialYearSummaryDispatcher: (payload) => {
      dispatch(getFinancialYearSummary(payload));
    },
    getForecastCyclesDispatcher: (payload) => {
      dispatch(getForecastCyclesAction(payload));
    },
    getVerticalOptionsDispatcher: (payload) => {
      dispatch(getVerticalOptionsAction(payload));
    },
    getAccountLogoDispatcher: (payload) => {
      dispatch(getAccountLogo(payload));
    },
    getParentAccountOptionsDispatcher: (payload) => {
      dispatch(getParentAccountOptionsAction(payload));
    },
    getEntitlementsGrantsDispatcher: (payload) => {
      dispatch(getEntitlementsGrantsAction(payload));
    },
    setSelectedParentAccountDispatcher: (payload) => {
      dispatch(setSelectedParentAccountAction(payload));
    },
    getAccountDropdownDispatcher: (payload) => {
      dispatch(getAccountDropdown(payload));
    },
    getProgramDropdownDispatcher: (payload) => {
      dispatch(getProgramDropdown(payload));
    },
    getForecastTrendsDispatcher: (payload) => {
      dispatch(getGraphSummaryAction(payload));
    },
    setAccountDropDownDisPatcher: (payload) => {
      dispatch(setAccountDropdown(payload));
    },
    setProgramDropDownDispatcher: (payload) => {
      dispatch(setProgramDropdown(payload));
    },
    setProjectManagerDropDownDispatcher: (payload) => {
      dispatch(getProjectManagerSuccess(payload));
    }
  };
};

ForecastDashboardContainer.propTypes = {
  dashboardState: PropTypes.object,
  forecastSubmissionDispatcher:PropTypes.func,
  getAccountDropdownDispatcher: PropTypes.func,
  getAccountLogoDispatcher: PropTypes.func,
  getEntitlementsGrantsDispatcher: PropTypes.func,
  getFinancialYearSummaryDispatcher: PropTypes.func,
  getForecastCyclesDispatcher: PropTypes.func,
  getForecastHistoricalDataDispatcher: PropTypes.func,
  getForecastTrendsDispatcher: PropTypes.func,
  getParentAccountOptionsDispatcher: PropTypes.func,
  getProgramDropdownDispatcher:PropTypes.func,
  getVerticalOptionsDispatcher: PropTypes.func,
  metaData: PropTypes.object,
  setAccountDropDownDisPatcher: PropTypes.func,
  setProgramDropDownDispatcher: PropTypes.func,
  setProjectManagerDropDownDispatcher: PropTypes.func,
  setSelectedParentAccountDispatcher: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ForecastDashboardContainer);

