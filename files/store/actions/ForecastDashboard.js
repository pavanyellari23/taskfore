import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';

export const getForecastHistoricalData = (payload) => ({
  type: ForecastDashBoardActionType.GET_FORECAST_HISTORICAL_DATA,
  payload
});

export const setForecastHistoricalData = (payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_HISTORICAL_DATA,
  payload
});

export const forecastSubmissionAction = (payload) => ({
  type: ForecastDashBoardActionType.FORECAST_SUBMISSION,
  payload
});

export const forecastSubmissionSuccessAction = (payload) => ({
  type: ForecastDashBoardActionType.FORECAST_SUBMISSION_SUCCESS,
  payload
});

export const forecastSubmissionNewCardSuccessAction = (payload) => ({
  type: ForecastDashBoardActionType.FORECAST_SUBMISSION_NEW_CARD_SUCCESS,
  payload
});

export const getFinancialYearSummary = (payload) => ({
  type: ForecastDashBoardActionType.GET_FORECAST_FINANCIAL_YEAR_SUMMARY,
  payload
});

export const setFinancialYearSummary = (payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_FINANCIAL_YEAR_SUMMARY,
  payload
});

export const setFinancialYearSummaryError = (payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_FINANCIAL_YEAR_SUMMARY_ERROR,
  payload
});

export const setSelectedParentAccountAction = (payload) => ({
  type: ForecastDashBoardActionType.SET_SELECTED_PARENT_ACCOUNT,
  payload
});

export const getVerticalOptionsAction = (payload) => ({
  type: ForecastDashBoardActionType.GET_VERTICAL_OPTIONS,
  payload
});

export const setVerticalOptionsAction = (payload) => ({
  type: ForecastDashBoardActionType.SET_VERTICAL_OPTIONS,
  payload
});

export const getVerticalOptionsErrorAction = (payload) => ({
  type: ForecastDashBoardActionType.GET_VERTICAL_OPTIONS_ERROR,
  payload
});

export const getGraphSummaryAction = (payload) => ({
  type:ForecastDashBoardActionType.GET_DASHBOARD_GRAPH_DATA,
  payload
});

export const setGraphSummaryAction = (payload) => ({
  type: ForecastDashBoardActionType.SET_DASHBOARD_GRAPH_DATA,
  payload
});

export const setForecastingMonthlyTrends =(payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_MONTHLY_TRENDS,
  payload
});

export const setForecastingQuarterlyTrends =(payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_QUARTERLY_TRENDS,
  payload
});

export const getForecastingTrends =(payload) => ({
  type: ForecastDashBoardActionType.GET_FORECAST_SUMMARY_TRENDS,
  payload
});

export const getForecastComments= (payload) => ({
  type: ForecastDashBoardActionType.GET_FORECAST_COMMENTS,
  payload
});

export const getForecastCommentsSuccessAction = (payload) => ({
  type: ForecastDashBoardActionType.SET_FORECAST_COMMENTS,
  payload
});

export const getForecastCommentsErrorAction = (payload) => ({
  type: ForecastDashBoardActionType.GET_FORECAST_COMMENTS_ERROR,
  payload
});

export const saveForecastComments = (payload) => ({
  type: ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS,
  payload
});

export const saveForecastCommentsSucccess = (payload) => ({
  type: ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS_SUCCESS,
  payload
});

export const saveForecastCommentsError = (payload) => ({
  type: ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS_ERROR,
  payload
});

export const updateForecastComments = (payload) => ({
  type: ForecastDashBoardActionType.UPDATE_FORECAST_COMMENTS,
  payload
});