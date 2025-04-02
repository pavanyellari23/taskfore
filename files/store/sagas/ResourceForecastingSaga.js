import { put, call, takeLatest } from 'redux-saga/effects';
import { ResourceForecastingActionType } from '../types/ResourceForecastingActionType';
import { toggleLoading, showToastMessage, toggleForecastSaved } from 'store/actions/Global';
import {
  setResourceForecasting,
  setUsers,
  getUsersError,
  getUserSuccess,
  addUpdateResourceError,
  setRoleModalErrorAction,
  resetRoleModalErrorAction,
  forecastErrorAction,
  setResourceSummary,
  clearResourceForecastingData
} from '../actions/ResourceForecasting';
import { saveForecastDataSuccess } from '../actions/ResourceForecast';
import { get, post } from '@revin-utils/utils';
import { BASE_URL } from 'utils/environment';
import { RESOURCE_SEARCH_LIMIT, RESOURCE_SEARCH_SORTBY, RESOURCE_SEARCH_SORTBY_EMAIL, TOAST_TYPES, ORIGIN } from 'utils/constants';
import { forecastGridErrorControl} from './helper';
  
function* getResourceForecastingData(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    const response = yield call(
      get,
        `${BASE_URL}forecasting-plans/${action.payload.projectForecastCandidateId}`
    );
    const {data} = response?.data;
    yield put(setResourceForecasting({ data, isInitialFetch: true}));
    yield put(setResourceSummary({data}));
    yield put(toggleLoading({ visibility: false }));
    yield put(saveForecastDataSuccess(false));
  } catch (error) {
    yield put(toggleLoading({ visibility: false }));
    if(error.status === 500) {
      yield put(clearResourceForecastingData());
    }
  }
}
function* updateResourceForecasting(action){
  const { isNotLoading, projectForecastCandidateId, actionOrigin, dryRun = true, message = null } = action.payload;
  if (isNotLoading) yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(
      post,
        `${BASE_URL}forecasting-plans/${projectForecastCandidateId}?isDryRun=${dryRun}`,
        action.payload.payload
    );
    if(dryRun) yield put(setResourceForecasting(response?.data));
    if (isNotLoading) yield put(toggleLoading({ visibility: false }));
    if(!dryRun && response?.data) yield put(toggleForecastSaved(true));
    switch (actionOrigin) {
      case ORIGIN.ROLE_MODAL_ORIGIN:
        yield put(resetRoleModalErrorAction());
        break;
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
      default:
        yield put(addUpdateResourceError(transformedErrorMessage));
    }
    if(error.status === 500){
      yield put(clearResourceForecastingData());
    }

  } finally {
    if (isNotLoading) yield put(toggleLoading({ visibility: false }));
    toggleForecastSaved(false);
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

export default function* watchResourceForecastingSaga() {
  yield takeLatest(ResourceForecastingActionType.GET_RESOURCE_FORECASTING_DATA, getResourceForecastingData);
  yield takeLatest(ResourceForecastingActionType.SET_UPDATE_RESOURCE_FORECASTING, updateResourceForecasting);
  yield takeLatest(ResourceForecastingActionType.GET_USERS, getUsers);
  yield takeLatest(ResourceForecastingActionType.GET_USER, getUser);
}