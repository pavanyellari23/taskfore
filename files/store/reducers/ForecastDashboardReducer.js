import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';

const INITIAL_STATE = {
  forecastData: null,
  forecastHistoricalRecords: null,
  error: null,
  financialYearSummary: null,
  selectedParentAccount: null,
  dashBoardTrends:null,
  forecastQuarterlyTrends:null,
  forecastMonthlyTrends:null,
  verticals: [],
  isNewCard: null,
  foreCastCommentsData: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ForecastDashBoardActionType.SET_FORECAST_HISTORICAL_DATA:
      return {
        ...state,
        forecastHistoricalRecords: action.payload,
        error: null
      };

    case ForecastDashBoardActionType.SET_FORECAST_FINANCIAL_YEAR_SUMMARY:
      return {
        ...state,
        financialYearSummary: action.payload,
        selectedParentAccount: {...state.selectedParentAccount, updatedOn: action.payload?.attributes?.updatedOn}
      };  
    
    case ForecastDashBoardActionType.SET_FORECAST_FINANCIAL_YEAR_SUMMARY_ERROR:
      return {
        ...state,
        financialYearSummary: null
      };

    case ForecastDashBoardActionType.FORECAST_SUBMISSION_SUCCESS:
    case ForecastDashBoardActionType.SET_SELECTED_PARENT_ACCOUNT:
      return {
        ...state,
        selectedParentAccount: action.payload
      };   
    
    case ForecastDashBoardActionType.FORECAST_SUBMISSION_NEW_CARD_SUCCESS:
      return {
        isNewCard: action.payload
      };

    case ForecastDashBoardActionType.SET_VERTICAL_OPTIONS:
      return {
        ...state,
        verticals: action.payload
      };
      
    case ForecastDashBoardActionType.GET_VERTICAL_OPTIONS_ERROR:
      return {
        ...state,
        verticals: []
      };
    case ForecastDashBoardActionType.SET_DASHBOARD_GRAPH_DATA:
      return{
        ...state,
        dashBoardTrends: action.payload
      };
    case ForecastDashBoardActionType.SET_FORECAST_MONTHLY_TRENDS:
      return{
        ...state,
        forecastMonthlyTrends: action.payload
      };
    case ForecastDashBoardActionType.SET_FORECAST_QUARTERLY_TRENDS:
      return{
        ...state,
        forecastQuarterlyTrends: action.payload
      };
    case ForecastDashBoardActionType.SET_FORECAST_COMMENTS:
      return {
        ...state,
        foreCastCommentsData: action.payload
      };
  
    case ForecastDashBoardActionType.GET_FORECAST_COMMENTS_ERROR:
      return {
        ...state,
        foreCastCommentsData: null
      };
    default:
      return { ...state };
  }
};

export default reducer;

