import { put, call, takeLatest } from 'redux-saga/effects';
import { ProjectForecastingActionType } from '../types/ProjectForecastingActionType';
import { toggleLoading, showToastMessage, toggleForecastSaved } from 'store/actions/Global';
import {
  setProjectForecasting,
  setUsers,
  getUsersError,
  getUserSuccess,
  setInitialProjetForecastingData,
  addUpdateResourceError,
  forecastErrorAction,
  setRoleModalErrorAction,
  getAdjustmentThresholdSuccess,
  resetForecastingState,
  setProjectSummary,
  setProjectModalError,
  resetProjectForecastingData,
  setAdditionalProjectInfo
} from '../actions/ProjectForecasting';
import { get, post } from '@revin-utils/utils';
import { BASE_URL } from 'utils/environment';
import { RESOURCE_SEARCH_LIMIT, RESOURCE_SEARCH_SORTBY, RESOURCE_SEARCH_SORTBY_EMAIL, TOAST_TYPES, ORIGIN } from 'utils/constants';
import { forecastGridErrorControl, getForecastRevenueThresholdLevel } from './helper';
import handleApiErrorMessages from './GlobalSaga';

function* getProjectForecastingData(action) {
  const { projectForecastCandidateId, isNotLoading, isInitialRender = false} = action.payload;
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    const response = yield call(
      get,
        `${BASE_URL}forecasting-plans/${projectForecastCandidateId}`
    );
    if (isInitialRender) {
      yield put(setInitialProjetForecastingData(response.data));
    } else {
      yield put(setProjectForecasting(response.data));
      yield put(setProjectSummary(response.data));
    }
    toggleForecastSaved(true);
    yield put(toggleLoading({ visibility: false }));
  } catch (error) {
    const transformedErrors= forecastGridErrorControl(error?.data?.error?.errors || []);
    if (isNotLoading) yield put(toggleLoading({ visibility: false }));
    yield put(forecastErrorAction(transformedErrors));
    yield put(resetForecastingState());
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

function* getAdditionalProjectInfo(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    const response = yield call( get, `${BASE_URL}project-forecast-candidates/${action.payload.projectForecastCandidateId}` );
    yield put(setAdditionalProjectInfo(response.data));
  } catch (error) {
    yield call(handleApiErrorMessages, error?.response);
  }finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* updateProjectForecasting(action){
  const { isNotLoading, projectForecastCandidateId, actionOrigin, dryRun = true, message = null, isContinueClicked } = action.payload;
  if (isNotLoading) yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(
      post,
        `${BASE_URL}forecasting-plans/${projectForecastCandidateId}?isDryRun=${dryRun}`,
        action.payload.payload
    );
    /* Update local object data to final object, on click of continue button, 
    do not call below method on tab changes or any other action in modal
    */
    if(isContinueClicked) yield put(resetProjectForecastingData());
    if(dryRun) yield put(setProjectForecasting(response?.data));
    if (isNotLoading) yield put(toggleLoading({ visibility: false }));
    if(!dryRun && response?.data){
      yield put(toggleForecastSaved(true));
      yield put(setProjectForecasting(response?.data));
    }
    if (message) {
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.SUCCESS,
          subtitle: message
        })
      );
    }
  }
  catch (error) {
    const errorCheck = error?.data?.error;
    const errorDetails = errorCheck?.errors || [];
    const transformedErrors = forecastGridErrorControl(errorDetails);
    const transformedErrorMessage = transformedErrors[0]?.detail;

    switch (actionOrigin) {
      case ORIGIN.ROLE_MODAL_ORIGIN:
        yield put(setRoleModalErrorAction(transformedErrorMessage || errorCheck));
        break;
      case ORIGIN.FORECAST_GRID_ORIGIN:
        yield put(forecastErrorAction(transformedErrors));
        break;
      case ORIGIN.PER_UNIT_REVENUE:
      case ORIGIN.COST_MODAL:
      case ORIGIN.FIXED_BID_MODAL:
        yield put(setProjectModalError(transformedErrors));
        break;
      default:
        yield put(addUpdateResourceError(transformedErrorMessage));
    }
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

function* getUsers(action) {
  const { searchTerm } = action.payload;
  try {
    const response = yield call(
      post,
        `${BASE_URL}users/_search?sortBy=${RESOURCE_SEARCH_SORTBY}&&sortBy=${RESOURCE_SEARCH_SORTBY_EMAIL}&offSet=0&limit=${RESOURCE_SEARCH_LIMIT}&onlyUsers=true&includeAllUsers=false`,
        { searchTerm }
    );
    yield put(setUsers(response?.data?.data));
  } catch (error) {
    yield put(getUsersError(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
}

function* getUser(action) {
  const { userId } = action.payload;
  try {
    const response = yield call(
      get,
        `${BASE_URL}forecasting-role-plans/allocations/${userId}`
    );
    yield put(getUserSuccess(response?.data?.data[0]?.attributes));
  } catch (error) {
    yield put(getUsersError(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
}

function* getThresholdConfig() {
  try {
    const orgResponse = yield call(get, `${BASE_URL}organizations`);
    const organizationId = orgResponse?.data?.data[0]?.id;
    if (organizationId) {
      const configResponse = yield call(post, `${BASE_URL}configurations/_search`, { entityIds: [organizationId] });
      yield put(getAdjustmentThresholdSuccess(getForecastRevenueThresholdLevel(configResponse?.data?.data[0].configurations)));
    }
  } catch (error) {
    const errorCheck = error?.data?.error;
    const errorMessage = errorCheck?.errors;
    yield put(forecastErrorAction(errorMessage));
  }
}

export default function* watchProjectForecastingSaga() {
  yield takeLatest(ProjectForecastingActionType.GET_PROJECT_FORECASTING_DATA, getProjectForecastingData);
  yield takeLatest(ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING, updateProjectForecasting);
  yield takeLatest(ProjectForecastingActionType.GET_USERS, getUsers);
  yield takeLatest(ProjectForecastingActionType.GET_USER, getUser);
  yield takeLatest(ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD,getThresholdConfig);
  yield takeLatest(ProjectForecastingActionType.GET_ADDITIONAL_PROJECT_INFO, getAdditionalProjectInfo);
}
