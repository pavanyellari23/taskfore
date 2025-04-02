import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ResourceLevelForecast from './ResourceLevelForecast';
import { updateResourceForecastAction, getUserResourceAction, editUserResourceAction, resetForecastDataAction, saveForecastDataAction, downloadResourceForeCastExcel, resetAddResourceModalAction, getInitialResourceForecastDataAction, resetForecastDataSuccess } from 'store/actions/ResourceForecast';
import { addLocationInControlsStateAction, getForecastControlsAction, getHolidaysByLocationIdAction,
  saveForecastControlsAction, updateForecastControlsStateAction } from 'store/actions/ForecastControls';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { ResourceForecastActionType } from 'store/types/ResourceForecastActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { getUserResourceListAction, getInitialRoleDataAction, getLocations } from 'store/actions/MetaData';

const ResourceLevelForecastContainer = ({
  metaDataState,
  resourceForecastState,
  updateResourceForecastDispatcher,
  getInitialResourceForecastDataDispatcher,
  getUserResourceDispatcher,
  getUserResourceListDispatcher,
  getInitialRoleDataDispatcher,
  editUserResourceDispatcher,
  downloadResourceLevelExcel,
  resetForecastDataDispatcher,
  saveForecastDataDispatcher,
  resetAddResourceModalDispatcher,
  saveForecastControlsDispatcher,
  updateForecastControlsStateDispatcher,
  getForecastControlsDispatcher,
  getLocationsAction,
  addLocationInControlsStateDispatcher,
  forecastControlsState,
  getHolidaysByLocationIdDispatcher,
  resetForecastDataSuccessDispatcher
}) => {
  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case ResourceForecastActionType.GET_INITIAL_RESOURCE_FORECAST_DATA:
        getInitialResourceForecastDataDispatcher(payload);
        break;
      case MetaDataActionType.GET_INITIAL_ROLE_DATA:
        getInitialRoleDataDispatcher(payload);
        break;
      case MetaDataActionType.GET_USER_RESOURCE_LIST:
        getUserResourceListDispatcher(payload);
        break;
      case ResourceForecastActionType.GET_USER_RESOURCE:
        getUserResourceDispatcher(payload);
        break;
      case ResourceForecastActionType.EDIT_USER_RESOURCE:
        editUserResourceDispatcher(payload);
        break;
      case ResourceForecastActionType.UPDATE_RESOURCE_FORECAST:
        updateResourceForecastDispatcher(payload);
        break;
      case ResourceForecastActionType.DOWNLOAD_RESOURCE_LEVEL_EXCEL:
        downloadResourceLevelExcel(payload);
        break; 
      case ResourceForecastActionType.RESET_FORECAST_DATA:
        resetForecastDataDispatcher(payload);
        break;
      case ResourceForecastActionType.RESET_FORECAST_DATA_SUCCESS:
        resetForecastDataSuccessDispatcher(payload);
        break;
      case ResourceForecastActionType.SAVE_FORECAST_DATA:
        saveForecastDataDispatcher(payload);
        break;
      case ResourceForecastActionType.RESET_ADD_RESOURCE_MODAL:
        resetAddResourceModalDispatcher(payload);
        break;
      case ForecastControlsActionType.GET_FORECAST_CONTROLS:
        getForecastControlsDispatcher(payload);
        break;
      case MetaDataActionType.GET_LOCATIONS:
        getLocationsAction(payload);
        break; 
      case ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE:
        updateForecastControlsStateDispatcher(payload);
        break;
      case ForecastControlsActionType.ADD_LOCATION_IN_CONTROLS_STATE:
        addLocationInControlsStateDispatcher(payload);
        break;
      case ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID:
        getHolidaysByLocationIdDispatcher(payload);
        break;
      case ForecastControlsActionType.SAVE_FORECAST_CONTROLS:
        saveForecastControlsDispatcher(payload);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <ResourceLevelForecast
        callBackHandler={callBackHandler}
        forecastControlsState={forecastControlsState}
        metaDataState={metaDataState}
        resourceForecastState={resourceForecastState}
      />
    </>
  );
};

const mapStateToProps = (state) => {
  return {
    metaDataState: state.metaData,
    resourceForecastState: state.resourceForecastState,
    forecastControlsState: state.forecastControls
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addLocationInControlsStateDispatcher : (payload) => {
      dispatch(addLocationInControlsStateAction(payload));
    },
    getForecastControlsDispatcher: (payload) => {
      dispatch(getForecastControlsAction(payload));
    },
    getHolidaysByLocationIdDispatcher : (payload) => {
      dispatch(getHolidaysByLocationIdAction(payload));
    },
    editUserResourceDispatcher: (payload) => {
      dispatch(editUserResourceAction(payload));
    },
    getInitialResourceForecastDataDispatcher: (payload) => {
      dispatch(getInitialResourceForecastDataAction(payload));
    },
    updateResourceForecastDispatcher: (payload) => {
      dispatch(updateResourceForecastAction(payload));
    },
    getUserResourceDispatcher: (payload) => {
      dispatch(getUserResourceAction(payload));
    },
    getUserResourceListDispatcher: (payload) => {
      dispatch(getUserResourceListAction(payload));
    },
    getLocationsAction: (payload) => {
      dispatch(getLocations(payload));
    },
    getInitialRoleDataDispatcher: (payload) => {
      dispatch(getInitialRoleDataAction(payload));
    },
    resetForecastDataDispatcher: (payload) => {
      dispatch(resetForecastDataAction(payload));
    },
    resetForecastDataSuccessDispatcher: (payload) => {
      dispatch(resetForecastDataSuccess(payload));
    },
    saveForecastDataDispatcher: (payload) => {
      dispatch(saveForecastDataAction(payload));
    },
    resetAddResourceModalDispatcher: (payload) => {
      dispatch(resetAddResourceModalAction(payload));
    },
    downloadResourceLevelExcel: (payload) => {
      dispatch(downloadResourceForeCastExcel(payload));
    },
    updateForecastControlsStateDispatcher: (payload) => {
      dispatch(updateForecastControlsStateAction(payload));
    },
    saveForecastControlsDispatcher: (payload) => {
      dispatch(saveForecastControlsAction(payload));
    }
  };
};

ResourceLevelForecastContainer.propTypes = {
  addLocationInControlsStateDispatcher: PropTypes.func,
  downloadResourceLevelExcel: PropTypes.func,
  editUserResourceDispatcher: PropTypes.func,
  forecastControlsState: PropTypes.object,
  getForecastControlsDispatcher: PropTypes.func,
  getHolidaysByLocationIdDispatcher: PropTypes.func,
  getInitialResourceForecastDataDispatcher: PropTypes.func,
  getInitialRoleDataDispatcher: PropTypes.func,
  getLocationsAction: PropTypes.func,
  getUserResourceDispatcher: PropTypes.func,
  getUserResourceListDispatcher: PropTypes.func,
  metaDataState: PropTypes.object,
  resetAddResourceModalDispatcher: PropTypes.func,
  resetForecastDataDispatcher: PropTypes.func,
  resetForecastDataSuccessDispatcher: PropTypes.func,
  resourceForecastState: PropTypes.object,
  saveForecastControlsDispatcher: PropTypes.func,
  saveForecastDataDispatcher: PropTypes.func,
  updateForecastControlsStateDispatcher: PropTypes.func,
  updateResourceForecastDispatcher: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResourceLevelForecastContainer));

