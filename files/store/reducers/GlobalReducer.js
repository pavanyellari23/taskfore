import { GlobalActionType } from '../types/GlobalActionType';
import { maintainLoaderStack } from './helper';

const INITIAL_STATE = {
  visibility: false,
  backdropLoader: false,
  errors: [],
  multipleErrorMessageConfig: {
    linkText: '',
    errorSubText: ''
  },
  isOpportunityUpdated: false,
  isForecastSaved: false,
  loaderStack: {
    visibility: 0,
    backdropLoader: 0
  }
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GlobalActionType.TOGGLE_LOADING_SPINNER:
      return {
        ...state,
        visibility: action.payload?.visibility,
        backdropLoader: action.payload?.backdropLoader
      };
    case GlobalActionType.SHOW_ERROR_TOAST_MESSAGE:
      return {
        ...state,
        errors: action.payload
      };
    case GlobalActionType.CLEAR_ERROR_TOAST_MESSAGE:
      return {
        ...state,
        errors: [],
        multipleErrorMessageConfig: {}
      };
    case GlobalActionType.SHOW_TOAST_MESSAGE:
      return {
        ...state,
        toastConfig: action.payload
      };
    case GlobalActionType.SHOW_MULTIPLE_TOAST_MESSAGE:
      return {
        ...state,
        errors: action.payload?.errors,
        multipleErrorMessageConfig: action.payload?.multipleErrorMessageConfig
      };  
    case GlobalActionType.SHOW_OPPORTUNITY_UPDATED:
      return {
        ...state,
        isOpportunityUpdated: action.payload
      };
    case GlobalActionType.TOGGLE_FORECAST_SAVED:
      return {
        ...state,
        isForecastSaved: action.payload
      };
    case GlobalActionType.LOADING_SPINNER_STACK:{
      const loaderCount = maintainLoaderStack(state.loaderStack, action.payload);
      
      return {
        ...state,
        loaderStack: {
          ...state.loaderStack,
          visibility: loaderCount?.visibility,
          backdropLoader: loaderCount?.backdropLoader
        },
        visibility: !!loaderCount?.visibility,
        backdropLoader: !!loaderCount?.backdropLoader
      };
    };
    default:
      return { ...state };
  }
};

export default reducer;
