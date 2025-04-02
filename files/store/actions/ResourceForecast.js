import { ResourceForecastActionType } from '../types/ResourceForecastActionType';

export const getInitialResourceForecastDataAction = (payload) => ({
  type: ResourceForecastActionType.GET_INITIAL_RESOURCE_FORECAST_DATA,
  payload
});

export const getForecastRolesAction = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_ROLES,
  payload
});

export const setForecastRoles = (payload) => ({
  type: ResourceForecastActionType.SET_FORECAST_ROLES,
  payload
});

export const getForecastRolesError = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_ROLES_ERROR,
  payload
});

export const updateResourceForecastAction = (payload) => ({
  type: ResourceForecastActionType.UPDATE_RESOURCE_FORECAST,
  payload
});

export const updateResourceForecastSuccess = (payload) => ({
  type: ResourceForecastActionType.UPDATE_RESOURCE_FORECAST_SUCCESS,
  payload
});

export const forecastError = (payload) => ({
  type: ResourceForecastActionType.FORECAST_ERROR,
  payload
});

export const setForecastPeriodSummary = (payload) => ({
  type: ResourceForecastActionType.SET_FORECAST_PERIOD_SUMMARY,
  payload
});

export const getForecastPeriodSummaryError = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_PERIOD_SUMMARY_ERROR,
  payload
});

export const getForecastDirectExpensesAction = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_DIRECT_EXPENSES,
  payload
});

export const setForecastDirectExpenses = (payload) => ({
  type: ResourceForecastActionType.SET_FORECAST_DIRECT_EXPENSES,
  payload
});

export const getForecastDirectExpensesError = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_DIRECT_EXPENSES_ERROR,
  payload
});

export const getForecastOtherExpensesAction = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_OTHER_EXPENSES,
  payload
});

export const setForecastOtherExpenses = (payload) => ({
  type: ResourceForecastActionType.SET_FORECAST_OTHER_EXPENSES,
  payload
});

export const getForecastOtherExpensesError = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_OTHER_EXPENSES_ERROR,
  payload
});

export const getSummaryAction = (payload) => ({
  type: ResourceForecastActionType.GET_FORECAST_SUMMARY,
  payload
});


export const setFYSummary = (payload) => ({
  type: ResourceForecastActionType.SET_FY_SUMMARY,
  payload
});

export const getFYSummaryError = (payload) => ({
  type: ResourceForecastActionType.GET_FY_SUMMARY_ERROR,
  payload
});

export const getUserResourceAction = (payload) => ({
  type: ResourceForecastActionType.GET_USER_RESOURCE,
  payload
});

export const getUserResourceSuccessAction = (payload) => ({
  type: ResourceForecastActionType.GET_USER_RESOURCE_SUCCESS,
  payload
});

export const getUserResourceErrorAction = (payload) => ({
  type: ResourceForecastActionType.GET_USER_RESOURCE_ERROR,
  payload
});

export const addNewRoleAction = (payload) => ({
  type: ResourceForecastActionType.ADD_NEW_ROLE,
  payload
});

export const addNewRoleErrorAction = (payload) => ({
  type: ResourceForecastActionType.ADD_NEW_ROLE_ERROR,
  payload
});

export const editUserResourceAction = (payload) => ({
  type: ResourceForecastActionType.EDIT_USER_RESOURCE,
  payload
});

export const clearResourceForecastingData =() => ({
  type: ResourceForecastActionType.CLEAR_RESOURCE_FORECASTING_DATA
});

export const resetForecastDataAction = (payload) => ({
  type: ResourceForecastActionType.RESET_FORECAST_DATA,
  payload
});

export const resetForecastDataSuccess = (payload) => ({
  type: ResourceForecastActionType.RESET_FORECAST_DATA_SUCCESS,
  payload
});

export const saveForecastDataAction = (payload) => ({
  type: ResourceForecastActionType.SAVE_FORECAST_DATA,
  payload
});

export const saveForecastDataSuccess = (payload) => ({
  type: ResourceForecastActionType.SAVE_FORECAST_DATA_SUCCESS,
  payload
});

export const downloadResourceForeCastExcel = (payload) => ({
  type: ResourceForecastActionType.DOWNLOAD_RESOURCE_LEVEL_EXCEL,
  payload
});

export const resetAddResourceModalAction = () => ({
  type: ResourceForecastActionType.RESET_ADD_RESOURCE_MODAL
});

export const getProjectInfo = (payload)=>({
  type:ResourceForecastActionType.GET_PROJECT_INFO,
  payload
});

export const setProjectInfo = (payload)=>({
  type:ResourceForecastActionType.SET_PROJECT_INFO,
  payload
});
