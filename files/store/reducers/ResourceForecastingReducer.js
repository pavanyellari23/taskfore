import { ResourceForecastingActionType } from '../types/ResourceForecastingActionType';
import { mapSelectedUser } from './helper';
import _cloneDeep from 'lodash/cloneDeep';

const INITIAL_STATE = {
  resourceForecastingData: null,
  resourceForecastingAPIData: null,
  locationRevisions: null,
  userList: [],
  selectedUser: null,
  roleModalError:null,
  resourceModalError: null,
  projectForecastingSummary: null,
  forecastError:null,
  closeResourceModal: false,
  closeRoleModal: false,
  resourceSummary: null,
  iserror: false
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ResourceForecastingActionType.SET_RESOURCE_FORECASTING_DATA:
      return {
        ...state,
        resourceForecastingData: action.payload?.data?.attributes,
        resourceForecastingAPIData: action.payload?.isInitialFetch && _cloneDeep(action.payload?.data?.attributes),
        selectedUser: null,
        forecastError:null,
        closeResourceModal: true,
        closeRoleModal: false
      };
    case ResourceForecastingActionType.SET_RESOURCE_SUMMARY: 
      return {
        ...state,
        resourceSummary: action.payload?.data?.attributes
      };
    case ResourceForecastingActionType.CLEAR_RESOURCE_SUMMARY:
      return {
        ...state,
        resourceSummary: null
      };
    case ResourceForecastingActionType.SET_LOCATION_REVISIONS:
      return {
        ...state,
        locationRevisions: action.payload
      };

    case ResourceForecastingActionType.RESET_RESOURCE_FORECASTING_DATA:
      return {
        ...state,
        resourceForecastingData: _cloneDeep(state.resourceForecastingAPIData)
      };
      
    case ResourceForecastingActionType.UPDATE_RESOURCE_FORECASTING:
      return {
        ...state,
        resourceForecastingData: action.payload?.resourceForecastingData
      };
      
    case ResourceForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };

    case ResourceForecastingActionType.SET_USERS:
      return {
        ...state,
        userList: action.payload
      };

    case ResourceForecastingActionType.GET_USER_SUCCESS:
      return {
        ...state,
        selectedUser: mapSelectedUser(action.payload, true),
        resourceModalError: null
      };

    case ResourceForecastingActionType.GET_USER_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };

    case ResourceForecastingActionType.GET_USERS_ERROR:
      return {
        ...state,
        resourceModalError: action.payload,
        selectedUser: null
      };

    case ResourceForecastingActionType.EDIT_RESOURCE:
      return {
        ...state,
        selectedUser: mapSelectedUser(action.payload),
        resourceModalError: null
      };


    case ResourceForecastingActionType.RESET_ADD_RESOURCE_MODAL:
      return {
        ...state,
        selectedUser: null,
        resourceModalError: null
      };

    case ResourceForecastingActionType.FORECAST_ERROR: 
      return {
        ...state,
        forecastError: action.payload
      };
      
    case ResourceForecastingActionType.SET_ROLE_MODAL_ERROR:
      return {
        ...state,
        roleModalError: action.payload
      };
  
    case ResourceForecastingActionType.RESET_ROLE_MODAL_ERROR:
      return {
        ...state,
        roleModalError: null,
        closeRoleModal: true
      };

    case ResourceForecastingActionType.CLEAR_RESOURCE_FORECASTING_DATA:
      return{
        ...state,
        resourceForecastingData: null,
        resourceForecastingAPIData: null,
        resourceSummary: null,
        iserror:true
      };
  
    
    default:
      return { ...state };  
  }
};

export default reducer;
