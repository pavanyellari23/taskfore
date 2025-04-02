import { get, put as update, readEndpoint, post } from '@revin-utils/utils';
import { all, call, put, takeLatest } from 'redux-saga/effects';
import handleApiErrorMessages from './GlobalSaga';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import { getForecastControlsActionError, getForecastControlsActionSuccess, getHolidaysByLocationIdErrorAction, getHolidaysByLocationIdSuccessAction, saveForecastControlsActionError, saveForecastControlsActionSuccess } from 'store/actions/ForecastControls';
import { BASE_URL } from 'utils/environment';
import { toggleLoading, showToastMessage } from 'store/actions/Global';
import { CONTROLS_LABEL, FORECAST_TYPE, PROJECT_LABEL, RESOURCE_LABEL, TOAST_TYPES } from 'utils/constants';
import { getAddedControls, getModifiedControls } from './helper';

function* fetchForecastControls(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true  }));
    let url = '';
    switch(action.payload.type) {
      case RESOURCE_LABEL: url = `${BASE_URL}forecast-controls/?targetType=PROJECT&targetId=${action.payload.projectCode}&version=WIP`; break;
      case PROJECT_LABEL: url = `${BASE_URL}forecast-controls/?targetType=PROJECT&targetId=${action.payload.projectCode}`; break;
      case FORECAST_TYPE.ACCOUNT_FORECASTING: url = `${BASE_URL}forecast-controls/?targetType=ACCOUNT&targetId=${action.payload.parentAccountId}`; break;
    }
    const response = yield call(get, url);
    yield put(getForecastControlsActionSuccess({ data : response?.data?.data, type: action.payload.type}));
  } catch (error) {
    yield put(getForecastControlsActionError());
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* fetchHolidaysByLocationId(action) {
  try {
    const payload = {
      param: 'holidays',
      resource: {
        filter: `[holidays]={locationId --eq '${action.payload.locationId}'}_AND_{date --ge --d ${action.payload.windowStartDate} --f yyyy-MM-dd'T'HH:mm:ss}_AND_{date --le --d  ${action.payload.windowEndDate} --f yyyy-MM-dd'T'HH:mm:ss}`
      }
    };
    const response = yield call(readEndpoint, payload);
    yield put(getHolidaysByLocationIdSuccessAction(response));
  } catch (error) {
    yield put(getHolidaysByLocationIdErrorAction(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* saveForecastControls(action) {
  const added = getAddedControls(action?.payload?.data);
  const modified = getModifiedControls(action?.payload?.data);
  yield all([
    call(addForecastControls, {parentAccountId : action?.payload?.parentAccountId, data: added, action}),
    call(modifyForecastControls, {parentAccountId : action?.payload?.parentAccountId, data: modified, action})
  ]);
}

function* modifyForecastControls({parentAccountId, data, action}) {
  if (data?.length) {
    try {
      yield put(toggleLoading({ visibility: true, backdropLoader: true }));
      let url = '';
      switch(action.payload.type) {
        case RESOURCE_LABEL: url = `${BASE_URL}forecast-controls/_bulk?targetType=PROJECT&targetId=${action?.payload?.projectCode}&version=WIP`; break;
        case PROJECT_LABEL: url = `${BASE_URL}forecast-controls/_bulk?targetType=PROJECT&targetId=${action?.payload?.projectCode}`; break;
        case FORECAST_TYPE.ACCOUNT_FORECASTING: url = `${BASE_URL}forecast-controls/_bulk?targetType=ACCOUNT&targetId=${parentAccountId}`; break;
      }
      const response = yield call(update, url, data);
      if(action.payload.type === RESOURCE_LABEL || action.payload.type === PROJECT_LABEL) yield put(saveForecastControlsActionSuccess(response?.data?.data));
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      if(action.payload.type === FORECAST_TYPE.ACCOUNT_FORECASTING) yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, subtitle: CONTROLS_LABEL.CONTROLS_SUCCESS }));
    } catch (error) {
      const errMsg = error?.data?.error?.errors[0]?.detail || error?.data?.error;
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, subtitle: errMsg}));
      yield put(saveForecastControlsActionError(error));
      yield call(handleApiErrorMessages, error?.response);
    }
  }
}

function* addForecastControls({parentAccountId, data, action}) {
  if (data?.length) {
    try {
      yield put(toggleLoading({ visibility: true, backdropLoader: true }));
      const response = yield call(post,( action?.payload?.type === PROJECT_LABEL || action?.payload?.type ===RESOURCE_LABEL )?
        `${BASE_URL}forecast-controls/_bulk?targetType=PROJECT&targetId=${action?.payload?.projectCode}` :
        `${BASE_URL}forecast-controls/_bulk?targetType=ACCOUNT&targetId=${parentAccountId}`, data);
      yield put(saveForecastControlsActionSuccess(response?.data?.data));
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, subtitle: CONTROLS_LABEL.CONTROLS_SUCCESS }));
    } catch (error) {
      const errMsg = error?.data?.error?.errors[0]?.detail || error?.data?.error;
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, subtitle: errMsg}));
      yield put(saveForecastControlsActionError(error));
      yield call(handleApiErrorMessages, error?.response);
    }
  }
}

export default function* watchForecastControlsSaga() {
  yield takeLatest(ForecastControlsActionType.GET_FORECAST_CONTROLS, fetchForecastControls);
  yield takeLatest(ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID, fetchHolidaysByLocationId);
  yield takeLatest(ForecastControlsActionType.SAVE_FORECAST_CONTROLS, saveForecastControls);
}

