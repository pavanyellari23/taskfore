import { AccountForecastingActionType } from '../types/AccountForecastingActionType';

export const getAccountForecasting = (payload) => ({
  type: AccountForecastingActionType.GET_ACCOUNT_FORECASTING_DATA,
  payload
});

export const setAccountForecasting = (payload) => ({
  type: AccountForecastingActionType.SET_ACCOUNT_FORECASTING_DATA,
  payload
});

export const getInvestmentCategories = (payload) => ({
  type: AccountForecastingActionType.GET_INVESTMENT_CATEGORIES,
  payload
});

export const setInvestmentCategories = (payload) => ({
  type: AccountForecastingActionType.SET_INVESTMENT_CATEGORIES,
  payload
});

export const setInvestmentCategoriesError = (payload) => ({
  type: AccountForecastingActionType.SET_INVESTMENT_CATEGORIES_ERROR,
  payload
});

export const addUpdateRolesAction = (payload) => ({
  type: AccountForecastingActionType.ADD_UPDATE_ROLES,
  payload
});

export const addUpdateRolesActionSuccess = (payload) => ({
  type: AccountForecastingActionType.ADD_UPDATE_ROLES_SUCCESS,
  payload
});

export const addUpdateRolesActionError = (payload) => ({
  type: AccountForecastingActionType.ADD_UPDATE_ROLES_ERROR,
  payload
});

export const updateAccountForecastingState = (payload) => ({
  type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE,
  payload
});

export const updateAccountForecastingWithAPI = (payload) => ({
  type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
  payload
});

export const getResourceUserAction = (payload) => ({
  type: AccountForecastingActionType.GET_RESOURCE_USER,
  payload
});

export const getResourceUserSuccessAction = (payload) => ({
  type: AccountForecastingActionType.GET_RESOURCE_USER_SUCCESS,
  payload
});

export const getResourceUserErrorAction = (payload) => ({
  type: AccountForecastingActionType.GET_RESOURCE_USER_ERROR,
  payload
});

export const getResourceUsersAction = (payload) => ({
  type: AccountForecastingActionType.GET_RESOURCE_USERS,
  payload
});

export const getResourceUsersErrorAction = (payload) => ({
  type: AccountForecastingActionType.GET_RESOURCE_USERS_ERROR,
  payload
});

export const setResourceUsersAction = (payload) => ({
  type: AccountForecastingActionType.SET_RESOURCE_USERS,
  payload
});

export const editResourceAction = (payload) => ({
  type: AccountForecastingActionType.EDIT_RESOURCE,
  payload
});

export const setRoleModalErrorAction = (error) => ({
  type: AccountForecastingActionType.SET_ROLE_MODAL_ERROR,
  payload: error
});

export const resetRoleModalErrorAction = () => ({
  type: AccountForecastingActionType.RESET_ROLE_MODAL_ERROR
});

export const setResourceModalErrorAction = (payload) => ({
  type: AccountForecastingActionType.SET_RESOURCE_MODAL_ERROR,
  payload
});

export const resetResourceModalErrorAction = () => ({
  type: AccountForecastingActionType.RESET_RESOURCE_MODAL_ERROR
});

export const setAccountSummary = (payload) => ({
  type: AccountForecastingActionType.SET_ACCOUNT_SUMMARY,
  payload
});

export const clearAccountSummary = () => ({
  type: AccountForecastingActionType.CLEAR_ACCOUNT_SUMMARY
});

export const addUpdateResourceError = (payload) => ({
  type: AccountForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
  payload
});

export const accountForecastErrorAction = (payload) => ({
  type: AccountForecastingActionType.ACCOUNT_FORECAST_ERROR,
  payload
});