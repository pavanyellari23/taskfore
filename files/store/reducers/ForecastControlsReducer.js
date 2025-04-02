import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { formatControlsData, buildModifiedControls, filterHolidays } from './helper';
import { PROJECT_LABEL, RESOURCE_LABEL } from 'utils/constants';

const INITIAL_STATE = {
  controls: { forecastControls: [], projectControls: [], resourceControls: [] },
  modifiedControls: { forecastControls: [], projectControls: [], resourceControls: [] },
  holidaysByLocation: [],
  saveControlsSuccess: false
};

const updateControlsByType = (state, payload, updateControls) => {
  switch (payload.type) {
    case PROJECT_LABEL:
      return {
        forecastControls: [],
        resourceControls: [],
        projectControls: updateControls(state.projectControls, payload?.data)
      };
    case RESOURCE_LABEL:
      return {
        forecastControls: [],
        projectControls: [],
        resourceControls: updateControls(state.resourceControls, payload?.data)
      };
    default:
      return {
        projectControls: [],
        resourceControls: [],
        forecastControls: updateControls(state.forecastControls, payload?.data)
      };
  }
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ForecastControlsActionType.GET_FORECAST_CONTROLS:
      return {
        ...state,
        saveControlsSuccess: false
      };
    
    case ForecastControlsActionType.SET_FORECAST_CONTROLS: {
      return {
        ...state,
        modifiedControls: INITIAL_STATE.modifiedControls,
        controls: updateControlsByType(state.controls, action.payload, (currentControls, data) => formatControlsData(data))
      };
    }

    case ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE: {
      return {
        ...state,
        modifiedControls: updateControlsByType(state.modifiedControls, action.payload, (currentControls) => buildModifiedControls([...currentControls], action.payload))
      };
    }

    case ForecastControlsActionType.SAVE_FORECAST_CONTROLS_ERROR:
      return { ...state };

    case ForecastControlsActionType.SAVE_FORECAST_CONTROLS_SUCCESS:
      return {
        ...state,
        modifiedControls: INITIAL_STATE.modifiedControls,
        saveControlsSuccess: true
      };

    case ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID_SUCCESS:
      return {
        ...state,
        holidaysByLocation: filterHolidays(action.payload)
      };

    case ForecastControlsActionType.ADD_LOCATION_IN_CONTROLS_STATE: {
      return {
        ...state,
        controls: updateControlsByType(state.controls, action.payload, (currentControls, data) => [...currentControls, data]),
        modifiedControls: updateControlsByType(state.modifiedControls, action.payload, (currentControls, data) => [...currentControls, data])
      };
    }

    case ForecastControlsActionType.GET_FORECAST_CONTROLS_ERROR:
      return  INITIAL_STATE;
    
    default:
      return { ...state };
  }
};

export default reducer;
