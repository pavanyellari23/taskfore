import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import ProjectForecastingLicense from './ProjectLevelForecasting';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { updateProjectForecasting, updateProjectForecastingWithAPI, getProjectForecasting, getInitialRoleDataAction,
  getUsers, getUser, editResource, resetAddResourceModal, resetForecastingData,addUpdateResourceError,getAdjustmentThreshold, 
  getAdditionalProjectInfo} from 'store/actions/ProjectForecasting';
import { addLocationInControlsStateAction, getForecastControlsAction, getHolidaysByLocationIdAction,
  saveForecastControlsAction, updateForecastControlsStateAction } from 'store/actions/ForecastControls';
import { getLocations } from 'store/actions/MetaData';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { GlobalActionType } from 'store/types/GlobalActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { toggleForecastSaved } from 'store/actions/Global';

const ProjectForecastingLicenseContainer = ({
  addLocationInControlsStateDispatcher,
  getHolidaysByLocationIdDispatcher,
  editResourceAction,
  forecastControlsState,
  forecastSaved,
  getLocationsAction,
  projectForecastingState,
  updateProjectForecastingAction,
  updateProjectForecastingWithAPIAction,
  getForecastControlsDispatcher,
  getProjectForecasting,
  getInitialRoleDataDispatcher,
  metaDataState,
  getResourcesAction,
  getResourceAction,
  resetAddResourceModalAction,
  resetForecastingDataAction,
  getAdjustmentThresholdAction,
  updateResourceModaleErrorAction,
  saveForecastControlsDispatcher,
  toggleForecastSavedAction,
  updateForecastControlsStateDispatcher,
  getAdditionalProjectInfo
}) => {
  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case ProjectForecastingActionType.GET_PROJECT_FORECASTING_DATA:
        getProjectForecasting(payload);
        break;
      case ProjectForecastingActionType.GET_ADDITIONAL_PROJECT_INFO:
        getAdditionalProjectInfo(payload);
        break;
      case ProjectForecastingActionType.GET_INITIAL_ROLE_DATA:
        getInitialRoleDataDispatcher(payload);
        break;
      case ProjectForecastingActionType.GET_USERS:
        getResourcesAction(payload);
        break;
      case ProjectForecastingActionType.GET_USER:
        getResourceAction(payload);
        break;
      case ProjectForecastingActionType.EDIT_RESOURCE:
        editResourceAction(payload);
        break;
      case ProjectForecastingActionType.RESET_ADD_RESOURCE_MODAL:
        resetAddResourceModalAction(payload);
        break;
      case ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING:
        updateProjectForecastingWithAPIAction(payload);
        break;
      case ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING:
        updateProjectForecastingAction(payload);
        break;  
      case ProjectForecastingActionType.RESET_FORECASTING_DATA:
        resetForecastingDataAction(payload);
        break;  
      case ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD:
        getAdjustmentThresholdAction();
        break;
      case ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
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
    <ProjectForecastingLicense
      callBackHandler={callBackHandler}
      forecastControlsState={forecastControlsState}
      forecastSaved={forecastSaved}
      metaDataState={metaDataState}
      projectForecastingState={projectForecastingState}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    projectForecastingState: state.projectForecasting,
    metaDataState: state.metaData,
    forecastSaved: state.global.isForecastSaved,
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
    getProjectForecasting: (payload) => {
      dispatch(getProjectForecasting(payload));
    },
    getAdditionalProjectInfo: (payload) => {
      dispatch(getAdditionalProjectInfo(payload));
    },
    getInitialRoleDataDispatcher: (payload) => {
      dispatch(getInitialRoleDataAction(payload));
    },
    updateProjectForecastingAction: (payload) => {
      dispatch(updateProjectForecasting(payload));
    },
    updateProjectForecastingWithAPIAction: (payload) => {
      dispatch(updateProjectForecastingWithAPI(payload));
    },
    getLocationsAction: (payload) => {
      dispatch(getLocations(payload));
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
    resetForecastingDataAction: () => {
      dispatch(resetForecastingData());
    },
    getAdjustmentThresholdAction:() => {
      dispatch(getAdjustmentThreshold());
    },
    updateResourceModaleErrorAction: (payload) => {
      dispatch( addUpdateResourceError(payload));
    },
    toggleForecastSavedAction: (payload) => {
      dispatch(toggleForecastSaved(payload));
    },
    updateForecastControlsStateDispatcher: (payload) => {
      dispatch(updateForecastControlsStateAction(payload));
    },
    saveForecastControlsDispatcher: (payload) => {
      dispatch(saveForecastControlsAction(payload));
    }
  };
};
  
ProjectForecastingLicenseContainer.propTypes = {
  addLocationInControlsStateDispatcher: PropTypes.func,
  addResourceAction: PropTypes.func,
  editResourceAction: PropTypes.func, 
  forecastControlsState: PropTypes.object,
  forecastSaved: PropTypes.bool,
  getAdditionalProjectInfo: PropTypes.func,
  getAdjustmentThresholdAction: PropTypes.func,
  getForecastControlsDispatcher: PropTypes.func,
  getHolidaysByLocationIdDispatcher: PropTypes.func,
  getInitialRoleDataDispatcher: PropTypes.func,
  getLocationsAction: PropTypes.func,
  getProjectForecasting: PropTypes.func,
  getResourceAction: PropTypes.func,
  getResourceForecasting: PropTypes.func,
  getResourcesAction: PropTypes.func,
  metaDataState: PropTypes.object,
  projectForecastingState: PropTypes.object,
  resetAddResourceModalAction: PropTypes.func,
  resetForecastingDataAction: PropTypes.func,
  resourceForecastingState: PropTypes.object,
  saveForecastControlsDispatcher: PropTypes.func,
  toggleForecastSavedAction: PropTypes.func,
  updateForecastControlsStateDispatcher: PropTypes.func,
  updateProjectForecastingAction: PropTypes.func,
  updateProjectForecastingWithAPIAction: PropTypes.func,
  updateResourceForecastingAction: PropTypes.func,
  updateResourceForecastingWithAPIAction: PropTypes.func,
  updateResourceModaleErrorAction:PropTypes.func
};
  
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(ProjectForecastingLicenseContainer));
  
