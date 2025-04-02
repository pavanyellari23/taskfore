import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { ResourceForecastingActionType } from 'store/types/ResourceForecastingActionType';
import ResourceLevelForecasting from './ResourceLevelForecasting';

import { addLocationInControlsStateAction, getForecastControlsAction, getHolidaysByLocationIdAction,
  saveForecastControlsAction, updateForecastControlsStateAction } from 'store/actions/ForecastControls';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { updateResourceForecasting, updateResourceForecastingWithAPI, getResourceForecasting,resetResourceForecastingData,
  getUsers, getUser, editResource, resetAddResourceModal, resetRoleModalErrorAction, addUpdateResourceError } from 'store/actions/ResourceForecasting';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { getInitialRoleDataAction,getLocations} from 'store/actions/MetaData';
import { toggleForecastSaved } from 'store/actions/Global';
import { GlobalActionType } from 'store/types/GlobalActionType';

const ResourceLevelForecastingContainer = ({
  editResourceAction,
  forecastSaved,
  resourceForecastingState,
  updateResourceForecastingAction,
  updateResourceForecastingWithAPIAction,
  getResourceForecasting,
  getInitialRoleDataDispatcher,
  metaDataState,
  getResourcesAction,
  getResourceAction,
  resetAddResourceModalAction,
  resetRoleModalErrorDispatcher,
  resetResourceForecastingDataAction,
  updateResourceModaleErrorAction,
  toggleForecastSavedAction,
  saveForecastControlsDispatcher,
  updateForecastControlsStateDispatcher,
  getForecastControlsDispatcher,
  getLocationsAction,
  addLocationInControlsStateDispatcher,
  forecastControlsState,
  getHolidaysByLocationIdDispatcher

}) => {
  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case ResourceForecastingActionType.GET_RESOURCE_FORECASTING_DATA:
        getResourceForecasting(payload);
        break;
      case MetaDataActionType.GET_INITIAL_ROLE_DATA:
        getInitialRoleDataDispatcher(payload);
        break;
      case ResourceForecastingActionType.GET_USERS:
        getResourcesAction(payload);
        break;
      case ResourceForecastingActionType.GET_USER:
        getResourceAction(payload);
        break;
      case ResourceForecastingActionType.EDIT_RESOURCE:
        editResourceAction(payload);
        break;
      case ResourceForecastingActionType.RESET_ADD_RESOURCE_MODAL:
        resetAddResourceModalAction(payload);
        break;
      case ResourceForecastingActionType.RESET_ROLE_MODAL_ERROR:
        resetRoleModalErrorDispatcher(payload);
        break;  
      case ResourceForecastingActionType.SET_UPDATE_RESOURCE_FORECASTING:
        updateResourceForecastingWithAPIAction(payload);
        break;
      case ResourceForecastingActionType.UPDATE_RESOURCE_FORECASTING:
        updateResourceForecastingAction(payload);
        break;
      case ResourceForecastingActionType.RESET_RESOURCE_FORECASTING_DATA:
        resetResourceForecastingDataAction();
        break;
      case ResourceForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
        updateResourceModaleErrorAction(payload);
        break;
      case GlobalActionType.TOGGLE_FORECAST_SAVED:
        toggleForecastSavedAction(payload);
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
    <ResourceLevelForecasting
      callBackHandler={callBackHandler}
      forecastControlsState={forecastControlsState}
      forecastSaved={forecastSaved}
      metaDataState={metaDataState}
      resourceForecastingState={resourceForecastingState}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    resourceForecastingState: state.resourceForecasting,
    metaDataState: state.metaData,
    forecastSaved: state.global.isForecastSaved,
    forecastControlsState: state.forecastControls
  };
};

ResourceLevelForecastingContainer.propTypes = {
  getInitialRoleDataDispatcher: PropTypes.func,
  metaDataState: PropTypes.object
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
    getResourceForecasting: (payload) => {
      dispatch(getResourceForecasting(payload));
    },
    getInitialRoleDataDispatcher: (payload) => {
      dispatch(getInitialRoleDataAction(payload));
    },
    updateResourceForecastingAction: (payload) => {
      dispatch(updateResourceForecasting(payload));
    },
    updateResourceForecastingWithAPIAction: (payload) => {
      dispatch(updateResourceForecastingWithAPI(payload));
    },
    getResourcesAction: (payload) => {
      dispatch(getUsers(payload));
    },
    getResourceAction: (payload) => {
      dispatch(getUser(payload));
    },
    editResourceAction: (payload) => {
      dispatch(editResource(payload));
    },
    resetAddResourceModalAction: (payload) => {
      dispatch(resetAddResourceModal(payload));
    },
    resetRoleModalErrorDispatcher: () => {
      dispatch(resetRoleModalErrorAction());  
    },
    resetResourceForecastingDataAction: () => {
      dispatch(resetResourceForecastingData());  
    },
    updateResourceModaleErrorAction: (payload) => {
      dispatch( addUpdateResourceError(payload));
    },
    toggleForecastSavedAction: (payload) => {
      dispatch(toggleForecastSaved(payload));
    },
    getLocationsAction: (payload) => {
      dispatch(getLocations(payload));
    },
    updateForecastControlsStateDispatcher: (payload) => {
      dispatch(updateForecastControlsStateAction(payload));
    },
    saveForecastControlsDispatcher: (payload) => {
      dispatch(saveForecastControlsAction(payload));
    }

  };
};
  
ResourceLevelForecastingContainer.propTypes = {
  addLocationInControlsStateDispatcher: PropTypes.func,
  addResourceAction: PropTypes.func,
  editResourceAction: PropTypes.func,
  forecastControlsState: PropTypes.object,
  forecastSaved: PropTypes.bool,
  getForecastControlsDispatcher: PropTypes.func,
  getHolidaysByLocationIdDispatcher: PropTypes.func,
  getInitialRoleDataDispatcher: PropTypes.func,
  getLocationsAction: PropTypes.func,
  getResourceAction: PropTypes.func,
  getResourceForecasting: PropTypes.func,
  getResourcesAction: PropTypes.func,
  resetAddResourceModalAction: PropTypes.func,
  resetResourceForecastingDataAction: PropTypes.func,
  resetRoleModalErrorDispatcher : PropTypes.func,
  resourceForecastingState: PropTypes.object,
  saveForecastControlsDispatcher: PropTypes.func,
  toggleForecastSavedAction: PropTypes.func,
  updateForecastControlsStateDispatcher: PropTypes.func,
  updateResourceForecastingAction: PropTypes.func,
  updateResourceForecastingWithAPIAction: PropTypes.func,
  updateResourceModaleErrorAction:PropTypes.func
};
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ResourceLevelForecastingContainer));
  
