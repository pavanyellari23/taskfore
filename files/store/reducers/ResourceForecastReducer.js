import { ResourceForecastActionType } from '../types/ResourceForecastActionType';
import { buildResponse, updateResourceForecastData, mapPayloadToResourceModal } from './helper';

const INITIAL_STATE = {
  resourceForecastData: {
    roles: [],
    directExpenses: null,
    otherExpenses: null,
    periodSummary: null,
    fySummary: null,
    roleModalError: null,
    isError : false,
    isGridUpdate: false,
    resetExitSuccess: false
  },
  projectInfo: null,
  resourceModalError: null,
  saveDataSuccess: false ,
  forecastError: null,
  selectedUser: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ResourceForecastActionType.SET_FORECAST_ROLES:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          roles: action.payload,
          isGridUpdate: false,
          resetExitSuccess: false
        },
        saveDataSuccess: false,
        forecastError: []
      };

    case ResourceForecastActionType.GET_FORECAST_ROLES:
    case ResourceForecastActionType.GET_FORECAST_ROLES_ERROR:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          roles: []
        }
      };

    case ResourceForecastActionType.SET_FORECAST_PERIOD_SUMMARY:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          periodSummary: action.payload,
          isGridUpdate: false,
          resetExitSuccess: false
        },
        forecastError: []
      };

    case ResourceForecastActionType.GET_FORECAST_PERIOD_SUMMARY:
    case ResourceForecastActionType.GET_FORECAST_PERIOD_SUMMARY_ERROR:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          periodSummary: []
        }
      };

    case ResourceForecastActionType.SET_FORECAST_DIRECT_EXPENSES:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          directExpenses: action.payload,
          isGridUpdate: false,
          resetExitSuccess: false
        },
        forecastError: []
      };

    case ResourceForecastActionType.GET_FORECAST_DIRECT_EXPENSES:
    case ResourceForecastActionType.GET_FORECAST_DIRECT_EXPENSES_ERROR:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          directExpenses: []
        }
      };

    case ResourceForecastActionType.SET_FORECAST_OTHER_EXPENSES:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          otherExpenses: action.payload,
          isGridUpdate: false,
          resetExitSuccess: false
        },
        forecastError: []
      };

    case ResourceForecastActionType.GET_FORECAST_OTHER_EXPENSES:
    case ResourceForecastActionType.GET_FORECAST_OTHER_EXPENSES_ERROR:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          otherExpenses: []
        }
      };

    case ResourceForecastActionType.SET_FY_SUMMARY:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          fySummary: buildResponse(action.payload)[0]
        }
      };

    case ResourceForecastActionType.GET_FY_SUMMARY:
    case ResourceForecastActionType.GET_FY_SUMMARY_ERROR:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          fySummary: null
        }
      };

    case ResourceForecastActionType.UPDATE_RESOURCE_FORECAST_SUCCESS:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          ...updateResourceForecastData(state.resourceForecastData, action.payload),
          isGridUpdate: true,
          resetExitSuccess: false
        },
        saveDataSuccess: false,
        forecastError: [],
        selectedUser: null
      };

    case ResourceForecastActionType.FORECAST_ERROR:
      return {
        ...state,
        forecastError: action.payload
      };

    case ResourceForecastActionType.GET_USER_RESOURCE_SUCCESS:
      return {
        ...state,
        selectedUser: mapPayloadToResourceModal(action.payload, true),
        resourceModalError: null
      };

    case ResourceForecastActionType.GET_USER_RESOURCE_ERROR:
      return {
        ...state,
        resourceModalError: action.payload
      };

    case ResourceForecastActionType.EDIT_USER_RESOURCE:
      return {
        ...state,
        selectedUser: mapPayloadToResourceModal(action.payload),
        resourceModalError: null
      };

    case ResourceForecastActionType.RESET_ADD_RESOURCE_MODAL:
      return {
        ...state,
        selectedUser: null,
        resourceModalError: null
      };

    case ResourceForecastActionType.CLEAR_RESOURCE_FORECASTING_DATA:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          roles: [],
          directExpenses: null,
          otherExpenses: null,
          periodSummary: null,
          fySummary: null,
          isError: true
        }
      };

    case ResourceForecastActionType.SAVE_FORECAST_DATA_SUCCESS:
      return {
        ...state,
        saveDataSuccess: action.payload
      };

    case ResourceForecastActionType.SET_PROJECT_INFO:
      return {
        ...state,
        projectInfo: action.payload
      };

    case ResourceForecastActionType.RESET_FORECAST_DATA_SUCCESS:
      return {
        ...state,
        resourceForecastData: {
          ...state.resourceForecastData,
          resetExitSuccess: action.payload
        }
      };

    default:
      return { ...state };
  }
};

export default reducer;
