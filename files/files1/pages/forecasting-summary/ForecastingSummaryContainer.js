import React , { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLocation, useParams } from 'react-router-dom';
import { connect } from 'react-redux';
import { ForecastingSummary } from 'components/common/ForecastingSummary';
import { clearResourceSummary, getResourceForecasting } from 'store/actions/ResourceForecasting';
import { clearAccountSummary, getAccountForecasting } from 'store/actions/AccountForecasting';
import { FORECASTING_SUMMARY } from 'utils/constants';
import { clearProjectSummary, getProjectForecasting } from 'store/actions/ProjectForecasting';
import { toggleForecastSaved } from 'store/actions/Global';
import { getAccountLogo , getForecastCyclesAction ,downloadExcel } from 'store/actions/MetaData';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { ResourceForecastingActionType } from 'store/types/ResourceForecastingActionType';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { getForecastingTrends, getForecastComments, saveForecastComments, getForecastCommentsSuccessAction, updateForecastComments, getFinancialYearSummary } from 'store/actions/ForecastDashboard';

const ForecastingSummaryContainer = (props) => {

  const {
    clearAccountSummaryAction,
    clearProjectSummaryAction,
    clearResourceSummaryAction,
    getProjectForecastingSummaryAction,
    getResourceForecastingSummaryAction,
    getAccountForecastingAction,
    getFinancialYearSummaryAction,
    getForecastingTrendsAction,
    toggleForecastSavedAction,
    downloadExcelAction,
    getForecastCyclesAction,
    getAccountLogoAction,
    getForeCastCommentsAction,
    saveForecastCommentsAction,
    setForecastCommentsDataAction,
    updateForecastcommentsAction
  } = props;
  const location = useLocation();
  const { projectForecastCandidateId , accountForecastCandidateId } = useParams();

  useEffect(() => {
    const payload =  {projectForecastCandidateId};
    switch(location.pathname.split('/')[2]){
      case FORECASTING_SUMMARY.PROJECT:
        handleProjectForecasting(payload);
        break;
      case FORECASTING_SUMMARY.RESOURCE:
        handleResourceForecasting(payload);
        break;
      case FORECASTING_SUMMARY.ACCOUNT:
        handleAccountForecasting({ accountForecastCandidateId, fromDetailSummary: true });
        break;
      default:
        break;
    }
    toggleForecastSavedAction(false);
  }, [location.pathname]);

  const handleProjectForecasting = (payload) => {
    getProjectForecastingSummaryAction(payload);
    fetchTrends(
      payload.projectForecastCandidateId,
      FORECASTING_SUMMARY.PROJECT
    );
  };

  const handleResourceForecasting = (payload) => {
    getResourceForecastingSummaryAction(payload);
    fetchTrends(
      payload.projectForecastCandidateId,
      FORECASTING_SUMMARY.RESOURCE
    );
  };

  const handleAccountForecasting = (payload) => {
    getAccountForecastingAction(payload);
    fetchTrends(
      payload.accountForecastCandidateId,
      FORECASTING_SUMMARY.ACCOUNT
    );
  };

  const fetchTrends = (id, forecastingType) => {
    getForecastingTrendsAction({
      id,
      forecastingType,
      isQuarterlyTrends: false
    });
    getForecastingTrendsAction({
      id,
      forecastingType,
      isQuarterlyTrends: true
    });
  };

  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case MetaDataActionType.GET_FORECAST_CYCLES:
        getForecastCyclesAction();
        break;
      case MetaDataActionType.GET_ACCOUNT_LOGO:
        getAccountLogoAction(payload);
        break;
      case ProjectForecastingActionType.CLEAR_PROJECT_SUMMARY: 
        clearProjectSummaryAction();
        break;
      case ResourceForecastingActionType.CLEAR_RESOURCE_SUMMARY:
        clearResourceSummaryAction();
        break;
      case AccountForecastingActionType.CLEAR_ACCOUNT_SUMMARY:
        clearAccountSummaryAction();
        break;
      case ForecastDashBoardActionType.GET_FORECAST_COMMENTS:
        getForeCastCommentsAction(payload);
        break;
      case ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS:
        saveForecastCommentsAction(payload);
        break;
      case ForecastDashBoardActionType.SET_FORECAST_COMMENTS:
        setForecastCommentsDataAction(payload);
        break;
      case ForecastDashBoardActionType.UPDATE_FORECAST_COMMENTS:
        updateForecastcommentsAction(payload);
        break;
      case ForecastDashBoardActionType.GET_FORECAST_FINANCIAL_YEAR_SUMMARY:
        getFinancialYearSummaryAction(payload);
        break;
      default:
        break; 
    }
  };

  const downloadExcelHandler = (event) => {
    const forecastingType = event?.payload;
    const payload = {
      id: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? accountForecastCandidateId : projectForecastCandidateId,
      forecastingType
    };
    downloadExcelAction(payload);
  };

  return(
    <ForecastingSummary 
      callBackHandler={callBackHandler}
      downloadExcel={downloadExcelHandler}
      forecastingType={location.pathname.split('/')[2]}
      {...props}
    /> 
  );
};

const mapStateToProps = (state) => {
  const forecastingType = window.location.href.split('/').slice(-2, -1)[0];
  return {
    forecastSummary:
      forecastingType === FORECASTING_SUMMARY.RESOURCE
        ? state?.resourceForecasting?.resourceSummary
        : forecastingType === FORECASTING_SUMMARY.ACCOUNT
          ? state.accountForecasting?.forecastingData
          : state?.projectForecasting?.projectSummary,
    monthlyTrends:state?.forecastDashboard?.forecastMonthlyTrends,
    quarterlyTrends:state?.forecastDashboard?.forecastQuarterlyTrends,
    metaData: state?.metaData,
    foreCastCommentsData: state?.forecastDashboard?.foreCastCommentsData
  };
};

const mapDispatchToProps = (dispatch) => {
  return{
    clearAccountSummaryAction: () => {
      dispatch(clearAccountSummary());
    },
    clearProjectSummaryAction: () => {
      dispatch(clearProjectSummary());
    },
    clearResourceSummaryAction: () => {
      dispatch(clearResourceSummary());
    },
    getProjectForecastingSummaryAction: (payload) => {
      dispatch(getProjectForecasting(payload));
    },
    getResourceForecastingSummaryAction: (payload) => {
      dispatch(getResourceForecasting(payload));
    },
    getAccountForecastingAction: (payload) => {
      dispatch(getAccountForecasting(payload));
    },
    toggleForecastSavedAction: (payload) => {
      dispatch(toggleForecastSaved(payload));
    },
    downloadExcelAction: (payload) => {
      dispatch(downloadExcel(payload));
    },
    getForecastCyclesAction: () => {
      dispatch(getForecastCyclesAction());
    },
    getAccountLogoAction: (payload) => {
      dispatch(getAccountLogo(payload));
    },
    getFinancialYearSummaryAction: (payload) => {
      dispatch(getFinancialYearSummary(payload));
    },
    getForecastingTrendsAction:(payload) => {
      dispatch(getForecastingTrends(payload));
    },
    getForeCastCommentsAction:(payload) => {
      dispatch(getForecastComments(payload));
    },
    saveForecastCommentsAction: (payload) => {
      dispatch(saveForecastComments(payload));
    },
    setForecastCommentsDataAction: (payload) => {
      dispatch(getForecastCommentsSuccessAction(payload));
    },
    updateForecastcommentsAction: (payload) => {
      dispatch(updateForecastComments(payload));
    }
  };
};

ForecastingSummaryContainer.propTypes = {
  callBackHandler: PropTypes.func,
  clearAccountSummaryAction: PropTypes.func,
  clearProjectSummaryAction: PropTypes.func,
  clearResourceSummaryAction: PropTypes.func,
  downloadExcelAction: PropTypes.func,
  getAccountForecastingAction: PropTypes.func,
  getAccountLogoAction: PropTypes.func,
  getFinancialYearSummaryAction: PropTypes.func,
  getForeCastCommentsAction: PropTypes.func,
  getForecastCyclesAction: PropTypes.func,
  getForecastingTrendsAction: PropTypes.func,
  getProjectForecastingSummaryAction: PropTypes.func,
  getResourceForecastingSummaryAction: PropTypes.func,
  saveForecastCommentsAction: PropTypes.func,
  setForecastCommentsDataAction: PropTypes.func,
  toggleForecastSavedAction: PropTypes.func,
  updateForecastcommentsAction: PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(ForecastingSummaryContainer);