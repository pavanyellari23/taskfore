import { INVESTMENT_MODAL } from 'utils/constants';
import { AccountForecastingActionType } from '../types/AccountForecastingActionType';
import { mapSelectedUser, mapCodesData } from './helper';

const INITIAL_STATE = {
  forecastingData: null,
  allocationValidationError: null,
  userList: [],
  selectedUser: null,
  resourceModalError: null,
  roleModalError:null,
  closeRoleModal: false,
  investmentCategories: null,
  investmentsCategoriesError: null,
  accountSummary: null,
  accountForecastError: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case AccountForecastingActionType.SET_ACCOUNT_FORECASTING_DATA:
      return {
        ...state,
        forecastingData: action.payload?.attributes,
        allocationValidationError: null,
        closeRoleModal: false,
        selectedUser: null,
        accountForecastError: null
      };
    case AccountForecastingActionType.SET_ACCOUNT_SUMMARY:
      return {
        ...state,
        accountSummary: action.payload,
        accountForecastError: null
      };
    case AccountForecastingActionType.CLEAR_ACCOUNT_SUMMARY:
      return {
        ...state,
        accountSummary: null
      };
    case AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE:
      return {
        ...state,
        forecastingData: action.payload,
        accountForecastError: null
      };

    case AccountForecastingActionType.SET_INVESTMENT_CATEGORIES:
      return {
        ...state,
        investmentCategories: mapCodesData(action.payload, INVESTMENT_MODAL.INVESTMENT_CATEGORY_LABEL),
        accountForecastError: null
      };

    case AccountForecastingActionType.SET_INVESTMENT_CATEGORIES_ERROR:
      return {
        ...state,
        investmentsCategoriesError: action.payload
      };

    case AccountForecastingActionType.ADD_EDIT_INVESTMENT_SUCCESS:
      return {
        ...state,
        forecastingData: action.payload?.attributes,
        accountForecastError: null
      };
      
    case AccountForecastingActionType.ADD_EDIT_INVESTMENT_ERROR:
      return {
        ...state,
        allocationValidationError : action.payload
      };
    case AccountForecastingActionType.SET_RESOURCE_USERS:
      return {
        ...state,
        userList: action.payload,
        accountForecastError: null
      };
  
    case AccountForecastingActionType.GET_RESOURCE_USER_SUCCESS:
      return {
        ...state,
        selectedUser: mapSelectedUser(action.payload, true),
        resourceModalError: null
      };
  
    case AccountForecastingActionType.GET_RESOURCE_USER_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };
  
    case AccountForecastingActionType.GET_RESOURCE_USERS_ERROR:
      return {
        ...state,
        resourceModalError: action.payload,
        selectedUser: null
      };

    case AccountForecastingActionType.SET_RESOURCE_MODAL_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };

    case AccountForecastingActionType.RESET_RESOURCE_MODAL_ERROR:
      return {
        ...state,
        selectedUser: null,
        resourceModalError: null
      };

    case AccountForecastingActionType.SET_ROLE_MODAL_ERROR:
      return {
        ...state,
        roleModalError: action.payload
      };

    case AccountForecastingActionType.RESET_ROLE_MODAL_ERROR:
      return {
        ...state,
        roleModalError: null,
        closeRoleModal: true
      };
    case AccountForecastingActionType.EDIT_RESOURCE:
      return {
        ...state,
        selectedUser: action.payload?.clearItem ? null : mapSelectedUser(action.payload?.item),
        resourceModalError: null,
        accountForecastError: null
      };
    case AccountForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };
    case AccountForecastingActionType.ACCOUNT_FORECAST_ERROR:
      return{
        ...state,
        accountForecastError: action.payload
      };
    default:
      return { ...state };  
  }
};

export default reducer;
