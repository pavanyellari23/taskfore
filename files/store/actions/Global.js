import { GlobalActionType } from 'store/types/GlobalActionType';

export const toggleLoading = ({ visibility, backdropLoader = false }) => ({
  type: GlobalActionType.TOGGLE_LOADING_SPINNER,
  payload: {
    visibility,
    backdropLoader
  }
});

export const showErrorToasts = (payload) => ({
  type: GlobalActionType.SHOW_ERROR_TOAST_MESSAGE,
  payload
});

export const clearErrorToasts = () => ({
  type: GlobalActionType.CLEAR_ERROR_TOAST_MESSAGE
});

export const showToastMessage = (payload) => ({
  type: GlobalActionType.SHOW_TOAST_MESSAGE,
  payload
});

export const showMultipleToastMessage = (payload) => ({
  type: GlobalActionType.SHOW_MULTIPLE_TOAST_MESSAGE,
  payload
});


export const setShowOpportunityUpdated = (payload) => ({
  type: GlobalActionType.SHOW_OPPORTUNITY_UPDATED,
  payload
});

export const toggleForecastSaved = (payload) => ({
  type: GlobalActionType.TOGGLE_FORECAST_SAVED,
  payload
});

export const loadingSpinnerStack = (payload) => ({
  type: GlobalActionType.LOADING_SPINNER_STACK,
  payload
});