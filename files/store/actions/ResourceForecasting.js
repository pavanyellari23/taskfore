import { ResourceForecastingActionType } from '../types/ResourceForecastingActionType';

export const getResourceForecasting = (payload) => ({
  type: ResourceForecastingActionType.GET_RESOURCE_FORECASTING_DATA,
  payload
});

export const setResourceForecasting = (payload) => ({
  type: ResourceForecastingActionType.SET_RESOURCE_FORECASTING_DATA,
  payload
});

export const addUpdateRolesAction = (payload) => ({
  type: ResourceForecastingActionType.ADD_UPDATE_ROLES,
  payload
});

export const addUpdateRolesActionSuccess = (payload) => ({
  type: ResourceForecastingActionType.ADD_UPDATE_ROLES_SUCCESS,
  payload
});

export const addUpdateRolesActionError = (payload) => ({
  type: ResourceForecastingActionType.ADD_UPDATE_ROLES_ERROR,
  payload
});

export const getUser = (payload) => ({
  type: ResourceForecastingActionType.GET_USER,
  payload
});

export const getUserSuccess = (payload) => ({
  type: ResourceForecastingActionType.GET_USER_SUCCESS,
  payload
});

export const getUserError = (payload) => ({
  type: ResourceForecastingActionType.GET_USER_ERROR,
  payload
});

export const getUsers = (payload) => ({
  type: ResourceForecastingActionType.GET_USERS,
  payload
});

export const getUsersError = (payload) => ({
  type: ResourceForecastingActionType.GET_USERS_ERROR,
  payload
});

export const setUsers = (payload) => ({
  type: ResourceForecastingActionType.SET_USERS,
  payload
});

export const addUpdateResourceError = (payload) => ({
  type: ResourceForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
  payload
});

export const addUpdateResourceSuccess = (payload) => ({
  type: ResourceForecastingActionType.ADD_UPDATE_RESOURCE_SUCCESS,
  payload
});

export const editResource = (payload) => ({
  type: ResourceForecastingActionType.EDIT_RESOURCE,
  payload
});

export const deletResource = (payload) => ({
  type: ResourceForecastingActionType.DELETE_RESOURCE,
  payload
});

export const deletResourceSuccess = (payload) => ({
  type: ResourceForecastingActionType.DELETE_RESOURCE_SUCCESS,
  payload
});

export const deletResourceError = (payload) => ({
  type: ResourceForecastingActionType.DELETE_RESOURCE_ERROR,
  payload
});

export const resetAddResourceModal = () => ({
  type: ResourceForecastingActionType.RESET_ADD_RESOURCE_MODAL
});

export const updateResourceForecasting = (payload) => ({
  type: ResourceForecastingActionType.UPDATE_RESOURCE_FORECASTING,
  payload
});

export const forecastErrorAction = (error) => ({
  type: ResourceForecastingActionType.FORECAST_ERROR ,
  payload:error
});
export const setRoleModalErrorAction = (error) => ({
  type: ResourceForecastingActionType.SET_ROLE_MODAL_ERROR,
  payload: error
});

export const updateResourceForecastingWithAPI = (payload) => ({
  type: ResourceForecastingActionType.SET_UPDATE_RESOURCE_FORECASTING,
  payload
});

export const resetRoleModalErrorAction = () => ({
  type: ResourceForecastingActionType.RESET_ROLE_MODAL_ERROR
});

export const resetResourceForecastingData = () => ({
  type: ResourceForecastingActionType.RESET_RESOURCE_FORECASTING_DATA
});

export const setResourceSummary = (payload) => ({
  type: ResourceForecastingActionType.SET_RESOURCE_SUMMARY,
  payload
});

export const clearResourceSummary = () => ({
  type: ResourceForecastingActionType.CLEAR_RESOURCE_SUMMARY
});

export const clearResourceForecastingData =() => ({
  type: ResourceForecastingActionType.CLEAR_RESOURCE_FORECASTING_DATA
});
