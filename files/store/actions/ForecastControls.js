import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';

export const getForecastControlsAction = (payload) => ({
  type: ForecastControlsActionType.GET_FORECAST_CONTROLS,
  payload
});
  
export const getForecastControlsActionSuccess = (payload) => ({
  type: ForecastControlsActionType.SET_FORECAST_CONTROLS,
  payload
});
  
export const getForecastControlsActionError = () => ({
  type: ForecastControlsActionType.GET_FORECAST_CONTROLS_ERROR
});

export const updateForecastControlsStateAction = (payload) => ({
  type: ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE,
  payload
});

export const saveForecastControlsAction = (payload) => ({
  type: ForecastControlsActionType.SAVE_FORECAST_CONTROLS,
  payload
});
  
export const saveForecastControlsActionSuccess = (payload) => ({
  type: ForecastControlsActionType.SAVE_FORECAST_CONTROLS_SUCCESS,
  payload
});
  
export const saveForecastControlsActionError = (error) => ({
  type: ForecastControlsActionType.SAVE_FORECAST_CONTROLS_ERROR,
  error
});

export const getHolidaysByLocationIdAction = (payload) => ({
  type: ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID,
  payload
});

export const getHolidaysByLocationIdSuccessAction = (payload) => ({
  type: ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID_SUCCESS,
  payload
});

export const getHolidaysByLocationIdErrorAction = (payload) => ({
  type: ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID_ERROR,
  payload
});

export const addLocationInControlsStateAction = (payload) => ({
  type: ForecastControlsActionType.ADD_LOCATION_IN_CONTROLS_STATE,
  payload
});

