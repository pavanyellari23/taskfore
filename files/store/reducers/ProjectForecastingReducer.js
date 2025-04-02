import _cloneDeep from 'lodash/cloneDeep';
import { ProjectForecastingActionType } from '../types/ProjectForecastingActionType';
import { mapSelectedUser } from './helper';

const INITIAL_STATE = {
  projectForecastingData: null,
  projectForecastingDataLocalObject: null,
  locationRevisions: null,
  userList: [],
  selectedUser: null,
  resourceModalError: null,
  forecastError:null,
  modalError:null,
  adjustmentThreshold: null,
  projectSummary: null,
  additionalProjectInfo: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ProjectForecastingActionType.SET_INITIAL_PROJECT_FORECASTING_DATA:
      return {
        ...state,
        projectForecastingData: action.payload?.data?.attributes,
        projectForecastingDataLocalObject: _cloneDeep(action.payload?.data?.attributes),
        forecastError:null,
        modalError:null
      };
    case ProjectForecastingActionType.SET_PROJECT_SUMMARY: 
      return {
        ...state,
        projectSummary: action.payload?.data?.attributes
      };
    case ProjectForecastingActionType.CLEAR_PROJECT_SUMMARY:
      return {
        ...state,
        projectSummary: null
      };
    case ProjectForecastingActionType.SET_PROJECT_FORECASTING_DATA:
      return {
        ...state,
        projectForecastingDataLocalObject: action.payload?.data?.attributes,
        selectedUser: null,
        forecastError:null,
        modalError:null
      };

    case ProjectForecastingActionType.SET_ADDITIONAL_PROJECT_INFO:
      return {
        ...state,
        additionalProjectInfo: action.payload?.data?.attributes
      };

    case ProjectForecastingActionType.SET_LOCATION_REVISIONS:
      return {
        ...state,
        locationRevisions: action.payload
      };
    case ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING:
      return {
        ...state,
        projectForecastingDataLocalObject: action.payload?.projectForecastingDataLocalObject,
        forecastError: null,
        resourceModalError: null
      };
    case ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };

    case ProjectForecastingActionType.SET_USERS:
      return {
        ...state,
        userList: action.payload
      };

    case ProjectForecastingActionType.GET_USER_SUCCESS:
      return {
        ...state,
        selectedUser: mapSelectedUser(action.payload, true),
        resourceModalError: null
      };

    case ProjectForecastingActionType.GET_USER_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };
    case ProjectForecastingActionType.FORECAST_ERROR:
      return {
        ...state,
        forecastError: action.payload
      };

    case ProjectForecastingActionType.GET_USERS_ERROR:
      return {
        ...state,
        resourceModalError: action.payload,
        selectedUser: null
      };

    case ProjectForecastingActionType.EDIT_RESOURCE:
      return {
        ...state,
        selectedUser: mapSelectedUser(action.payload),
        resourceModalError: null
      };

    case ProjectForecastingActionType.SET_ROLE_MODAL_ERROR:
      return {
        ...state,
        roleModalError: action.payload
      };

    case ProjectForecastingActionType.RESET_ADD_RESOURCE_MODAL:
      return {
        ...state,
        selectedUser: null,
        resourceModalError: null,
        forecastError:null
      };

    case ProjectForecastingActionType.RESET_FORECASTING_DATA:
      return {
        ...state,
        projectForecastingDataLocalObject : _cloneDeep(state.projectForecastingData),
        selectedUser: null,
        resourceModalError: null,
        forecastError:null
      };

    case ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD_SUCCESS:
      return {
        ...state,
        adjustmentThreshold:action.payload
      };
      
    case ProjectForecastingActionType.RESET_FORECASTING_STATE:
      return {
        ...state,
        projectForecastingDataLocalObject: null,
        projectForecastingData: null
      };
    case ProjectForecastingActionType.SET_MODAL_ERROR:
      return {
        ...state,
        modalError:action.payload
      };
    case ProjectForecastingActionType.RESET_MODAL_ERROR:
      return{
        ...state,
        modalError:null
      };
    case ProjectForecastingActionType.RESET_INITIAL_STATE:
      return {
        ...state,
        projectForecastingData: state.projectForecastingDataLocalObject
      };
    default:
      return { ...state };  
  }
};

export default reducer;
