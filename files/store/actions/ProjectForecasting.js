import { ProjectForecastingActionType } from '../types/ProjectForecastingActionType';

export const getProjectForecasting = (payload) => ({
  type: ProjectForecastingActionType.GET_PROJECT_FORECASTING_DATA,
  payload
});

export const setProjectForecasting = (payload) => ({
  type: ProjectForecastingActionType.SET_PROJECT_FORECASTING_DATA,
  payload
});

export const getInitialRoleDataAction = (payload) => ({
  type: ProjectForecastingActionType.GET_INITIAL_ROLE_DATA,
  payload
});

export const getInitialRoleDataActionError = (error) => ({
  type: ProjectForecastingActionType.GET_INITIAL_ROLE_DATA_ERROR,
  error
});

export const addUpdateRolesAction = (payload) => ({
  type: ProjectForecastingActionType.ADD_UPDATE_ROLES,
  payload
});

export const addUpdateRolesActionSuccess = (payload) => ({
  type: ProjectForecastingActionType.ADD_UPDATE_ROLES_SUCCESS,
  payload
});

export const addUpdateRolesActionError = (payload) => ({
  type: ProjectForecastingActionType.ADD_UPDATE_ROLES_ERROR,
  payload
});

export const getLocationRevisionsAction = (payload) => ({
  type: ProjectForecastingActionType.GET_LOCATION_REVISIONS,
  payload
});

export const setLocationRevisionsAction = (payload) => ({
  type: ProjectForecastingActionType.SET_LOCATION_REVISIONS,
  payload
});

export const getLocationRevisionsActionError = (error) => ({
  type: ProjectForecastingActionType.GET_LOCATION_REVISIONS_ERROR,
  error
});

export const getUser = (payload) => ({
  type: ProjectForecastingActionType.GET_USER,
  payload
});

export const getUserSuccess = (payload) => ({
  type: ProjectForecastingActionType.GET_USER_SUCCESS,
  payload
});

export const getUserError = (payload) => ({
  type: ProjectForecastingActionType.GET_USER_ERROR,
  payload
});

export const getUsers = (payload) => ({
  type: ProjectForecastingActionType.GET_USERS,
  payload
});

export const getUsersError = (payload) => ({
  type: ProjectForecastingActionType.GET_USERS_ERROR,
  payload
});

export const setUsers = (payload) => ({
  type: ProjectForecastingActionType.SET_USERS,
  payload
});

export const addUpdateResourceError = (payload) => ({
  type: ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
  payload
});

export const addUpdateResourceSuccess = (payload) => ({
  type: ProjectForecastingActionType.ADD_UPDATE_RESOURCE_SUCCESS,
  payload
});

export const editResource = (payload) => ({
  type: ProjectForecastingActionType.EDIT_RESOURCE,
  payload
});

export const deletResource = (payload) => ({
  type: ProjectForecastingActionType.DELETE_RESOURCE,
  payload
});

export const deletResourceSuccess = (payload) => ({
  type: ProjectForecastingActionType.DELETE_RESOURCE_SUCCESS,
  payload
});

export const deletResourceError = (payload) => ({
  type: ProjectForecastingActionType.DELETE_RESOURCE_ERROR,
  payload
});

export const resetAddResourceModal = () => ({
  type: ProjectForecastingActionType.RESET_ADD_RESOURCE_MODAL
});

export const updateProjectForecasting = (payload) => ({
  type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
  payload
});

export const updateProjectForecastingWithAPI = (payload) => ({
  type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
  payload
});

export const setInitialProjetForecastingData = (payload) => ({
  type: ProjectForecastingActionType.SET_INITIAL_PROJECT_FORECASTING_DATA,
  payload
});

export const setRoleModalErrorAction = (error) => ({
  type: ProjectForecastingActionType.SET_ROLE_MODAL_ERROR,
  payload: error
});

export const resetForecastingData = () => ({
  type: ProjectForecastingActionType.RESET_FORECASTING_DATA
});

export const getAdjustmentThreshold =() => ({
  type:ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD
});

export const getAdjustmentThresholdSuccess= (payload) => ({
  type:ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD_SUCCESS,
  payload
});

export const setAdjustmentThresholdError= (error) => ({
  type:ProjectForecastingActionType.SET_ADJUSTMENT_THRESHOLD_ERROR,
  error
});
export const resetForecastingState = () => ({
  type: ProjectForecastingActionType.RESET_FORECASTING_STATE
});

export const forecastErrorAction = (error) => ({
  type: ProjectForecastingActionType.FORECAST_ERROR,
  payload:error
});

export const setProjectSummary = (payload) => ({
  type: ProjectForecastingActionType.SET_PROJECT_SUMMARY,
  payload
});

export const clearProjectSummary = () => ({
  type: ProjectForecastingActionType.CLEAR_PROJECT_SUMMARY
});

export const setProjectModalError =(payload) =>({
  type:ProjectForecastingActionType.SET_MODAL_ERROR,
  payload
});

export const resetProjectForecastingData = () => ({
  type:ProjectForecastingActionType.RESET_INITIAL_STATE
});

export const getAdditionalProjectInfo = (payload) => ({
  type: ProjectForecastingActionType.GET_ADDITIONAL_PROJECT_INFO,
  payload
});

export const setAdditionalProjectInfo = (payload) => ({
  type: ProjectForecastingActionType.SET_ADDITIONAL_PROJECT_INFO,
  payload
});