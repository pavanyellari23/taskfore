import { get, post, API_RESPONSE, RESPONSE_TYPE } from '@revin-utils/utils';
import moment from 'moment-mini';
import { BASE_URL } from 'utils/environment';
import { all, put, call, takeLatest, takeEvery } from 'redux-saga/effects';
import { toggleLoading, showToastMessage } from 'store/actions/Global';
import handleApiErrorMessages from './GlobalSaga';
import { ResourceForecastActionType } from 'store/types/ResourceForecastActionType';
import { SUMMARY_TYPE, TOAST_TYPES, DATE_FORMAT, BTN_LABELS } from 'utils/constants';
import { setFYSummary, setForecastDirectExpenses, clearResourceForecastingData, setForecastOtherExpenses, setForecastPeriodSummary,
  setForecastRoles, updateResourceForecastSuccess, getUserResourceSuccessAction, getUserResourceErrorAction, forecastError,
  saveForecastDataSuccess, getForecastRolesError, getForecastPeriodSummaryError, getFYSummaryError, getForecastOtherExpensesError,
  getForecastDirectExpensesError, setProjectInfo, resetForecastDataSuccess} from 'store/actions/ResourceForecast';
import { DownloadExcelFile, forecastGridErrorControl } from './helper';

function* getInitialForecastData(action) {
  yield call(getForecastRoles, action);
  const periodSummaryPayload = {
    payload: {
      projectForecastCandidateId: action.payload.projectForecastCandidateId,
      summaryType: SUMMARY_TYPE.PERIODSUMMARY,
      year: ''
    }
  };

  const fySummaryPayload = {
    payload: {
      projectForecastCandidateId: action.payload.projectForecastCandidateId,
      summaryType: SUMMARY_TYPE.FYSUMMARY,
      year: moment().format(DATE_FORMAT.FORMAT_6)
    }
  };
  yield all([
    call(getForecastOtherExpenses, action),
    call(getForecastDirectExpenses, action),
    call(getForecastSummary, periodSummaryPayload),
    call(getForecastSummary, fySummaryPayload),
    call(getProjectInfo, action)
  ]);
}

function* getForecastRoles(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-role-plans/WIP`);
    yield put(setForecastRoles(response?.data?.data?.map((item) => (item.attributes))));
  } catch (error) {
    yield put(getForecastRolesError());
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* getForecastOtherExpenses(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-other-expenses/WIP`);
    yield put(setForecastOtherExpenses(response?.data?.data?.[0].attributes));
  } catch (error) {
    if (error.status === 500) {
      yield put(clearResourceForecastingData());
    }
    yield put(getForecastOtherExpensesError());
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* getForecastDirectExpenses(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-direct-expenses/WIP`);
    yield put(setForecastDirectExpenses(response?.data?.data?.[0].attributes));
  } catch (error) {
    if (error.status === 500) {
      yield put(clearResourceForecastingData());
    }
    yield put(getForecastDirectExpensesError());
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* getForecastSummary(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-summary/WIP?summaryType=${action.payload?.summaryType}&year=${action.payload?.year}`);
    if (action.payload.summaryType == SUMMARY_TYPE.PERIODSUMMARY) {
      yield put(setForecastPeriodSummary(response?.data?.data?.map((item) => (item.attributes))?.sort((a, b) => a.periodId - b.periodId)));
    } else {
      yield put(setFYSummary(response?.data?.data));
    }
  } catch (error) {
    if (error.status === 500) {
      yield put(clearResourceForecastingData());
    }
    if (action.payload.summaryType == SUMMARY_TYPE.PERIODSUMMARY) {
      yield put(getForecastPeriodSummaryError());
    } else {
      yield put(getFYSummaryError());
    }
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* updateResourceForecastData(action) {
  const { actionType, message, projectForecastCandidateId, ...payload } = action.payload;
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(post, `${BASE_URL}forecast-plans/${projectForecastCandidateId}/project-grid`, payload);
    if (response.status === API_RESPONSE.SUCCESS_STATUS) {
      const { sourceId } = payload?.data[0];
      const data = {
        gridChanges: response?.data?.data?.attributes?.gridChanges,
        actionType,
        sourceId
      };
      yield put(updateResourceForecastSuccess(data));
      if (message) {
        yield put( showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, subtitle: message }) );
      }
    };
  } catch (err) {
    const transformedErrors = forecastGridErrorControl(err?.data?.error?.errors || []);
    yield put(forecastError(transformedErrors));
    yield call(handleApiErrorMessages, err?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* resetResourceForecastData(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-grid/reset`);
    if (response?.status === 200) {
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, title: action.payload.successMsg }));
      if(action.payload.origin === BTN_LABELS.RESET) yield call(getInitialForecastData, action);
      if(action.payload.origin === BTN_LABELS.RESET_EXIT) yield put(resetForecastDataSuccess(true));
    }
  } catch (err) {
    const transformedErrors = forecastGridErrorControl(err?.data?.error?.errors || []);
    yield put(forecastError(transformedErrors));
    yield call(handleApiErrorMessages, err?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* saveResourceForecastData(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-plans/${action.payload.projectForecastCandidateId}/project-grid/save-current`);
    if (response?.status === 200) {
      yield put(saveForecastDataSuccess(true));
    }
  } catch (error) {
    const errMsg = error?.data?.error?.errors?.[0]?.detail || error?.data?.error;
    if (error.status === 500) {
      yield put(clearResourceForecastingData());
    }
    yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, title: errMsg }));
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* fetchUserResource(action) {
  const { userId, isError = false, error } = action.payload;
  try {
    if (isError) {
      yield put(getUserResourceErrorAction(error));
    } else {
      const response = yield call(
        get,
        `${BASE_URL}forecasting-role-plans/allocations/${userId}`
      );
      yield put(getUserResourceSuccessAction(response?.data?.data[0]?.attributes));
    }
  } catch (error) {
    yield put(getUserResourceErrorAction(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
};

function* downloadResourceForeCastExcel(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: false }));
  const { projectForecastCandidateId } = action.payload;
  try {
    const response = yield call(
      get,
      `${BASE_URL}forecasting-plans/${projectForecastCandidateId}/resource-forecast/_export`,
      { responseType: RESPONSE_TYPE.blob }
    );
    !!response?.data && DownloadExcelFile(response);
  } catch (error) {
    const errorResponseObj = JSON.parse(yield error.data.text());
    const errMsg = errorResponseObj?.error?.errors[0]?.detail || error?.data?.error;
    yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, subtitle: errMsg }));
    yield put(toggleLoading({ visibility: false }));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

function* getProjectInfo(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(
      get,
        `${BASE_URL}project-forecast-candidates/${action.payload.projectForecastCandidateId}`
    );
    yield put(setProjectInfo(response?.data?.data?.attributes));
    yield put(toggleLoading({ visibility: false }));
  } catch (error) {
    const errMsg = error?.data?.error?.errors[0]?.detail || error?.data?.error;
    yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, subtitle: errMsg }));
    yield put(toggleLoading({ visibility: false }));
  }
}

export default function* watchResourceForecastSaga() {
  yield takeLatest(ResourceForecastActionType.GET_INITIAL_RESOURCE_FORECAST_DATA, getInitialForecastData);
  yield takeLatest(ResourceForecastActionType.GET_PROJECT_INFO, getProjectInfo);
  yield takeLatest(ResourceForecastActionType.GET_FORECAST_ROLES, getForecastRoles);
  yield takeLatest(ResourceForecastActionType.GET_FORECAST_DIRECT_EXPENSES, getForecastDirectExpenses);
  yield takeLatest(ResourceForecastActionType.GET_FORECAST_OTHER_EXPENSES, getForecastOtherExpenses);
  yield takeLatest(ResourceForecastActionType.UPDATE_RESOURCE_FORECAST, updateResourceForecastData);
  yield takeEvery(ResourceForecastActionType.GET_FORECAST_SUMMARY, getForecastSummary);
  yield takeEvery(ResourceForecastActionType.GET_USER_RESOURCE, fetchUserResource);
  yield takeLatest(ResourceForecastActionType.DOWNLOAD_RESOURCE_LEVEL_EXCEL, downloadResourceForeCastExcel);
  yield takeLatest(ResourceForecastActionType.RESET_FORECAST_DATA, resetResourceForecastData);
  yield takeLatest(ResourceForecastActionType.SAVE_FORECAST_DATA, saveResourceForecastData);
}