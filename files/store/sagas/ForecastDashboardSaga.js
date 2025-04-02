import { get, patch, post, buildDropDownOption, setSessionItem } from '@revin-utils/utils';
import { call, put, takeLatest, takeEvery, select } from 'redux-saga/effects';
import handleApiErrorMessages from './GlobalSaga';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import {
  setForecastHistoricalData, setFinancialYearSummary, setFinancialYearSummaryError, setVerticalOptionsAction, getVerticalOptionsErrorAction, forecastSubmissionSuccessAction, setGraphSummaryAction, setForecastingQuarterlyTrends, setForecastingMonthlyTrends, forecastSubmissionNewCardSuccessAction, getForecastCommentsSuccessAction,
  saveForecastCommentsSucccess, saveForecastCommentsError
} from 'store/actions/ForecastDashboard';
import { BASE_URL } from 'utils/environment';
import { toggleLoading, showToastMessage, showMultipleToastMessage, loadingSpinnerStack } from 'store/actions/Global';
import { OPPORTUNITY_SELECTION_ERROR_CODES, getMultipleErrorMessageConfig, FORECASTING_SUMMARY,  FORECAST_CANDIDATES,  SESSION_STORAGE_KEYS, TOAST_TYPES, FORECAST_DASHBOARD_CONSTANTS } from 'utils/constants';
import { forecastTrendsMapper, getArray } from './helper';
import { modifySubmissionAction, setParentAccountOptionsAction } from 'store/actions/MetaData';

function* fetchForecastHistoricalData(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true}));
    const { parentAccountId, pageSize, page } = action.payload;
    const response = yield call(get, `${BASE_URL}account-forecast-candidates/accounts/${parentAccountId}/records?page=${page}&pageSize=${pageSize}`);

    yield put(setForecastHistoricalData(response?.data?.data));
  } catch (error) {
    yield call(handleApiErrorMessages, error?.response);
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false}));
  }
}

function* forecastSubmit(action) {
  const { accountForecastCandidateId, status } = action.payload;
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: false }));
    const response = yield call(patch, `${BASE_URL}account-forecast-candidates/${accountForecastCandidateId}/status/${status}`);
    if (response.status === 200) {
      const parentAccount = response?.data?.data;
      setSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN, parentAccount);
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, title: action.payload.successMsgTitle, subtitle: action.payload.successMsgSubTitle }));
      yield put(forecastSubmissionSuccessAction(parentAccount?.attributes));
      yield put(forecastSubmissionNewCardSuccessAction(parentAccount.id));
      yield put(modifySubmissionAction(buildDropDownOption([parentAccount], 'attributes.parentAccountName', 'attributes.id')));
      yield fetchForecastHistoricalData(action);
    }
  } catch (error) {
    if(error?.data?.error?.errors[0]?.code === OPPORTUNITY_SELECTION_ERROR_CODES.PENDING_FOR_SUBMISSION){
      yield call(handleApiErrorMessages, error?.response);
      const errors = getArray(error?.data?.error?.errors[0]?.detail);
      yield put(showMultipleToastMessage({errors, multipleErrorMessageConfig: getMultipleErrorMessageConfig(errors, OPPORTUNITY_SELECTION_ERROR_CODES.PENDING_FOR_SUBMISSION)}));
    }else{
      const errMsg = error?.data?.error?.errors[0]?.detail || error?.data?.error;
      yield call(handleApiErrorMessages, error?.response);
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, title: errMsg }));
    }
   
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

function* getFinancialYearSummary(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true}));
    const { accountForecastCandidateId } = action.payload;
    const response = yield call(get, `${BASE_URL}account-forecast-candidates/${accountForecastCandidateId}/financial-year-summary`);
    const fySummary = response?.data?.data;
    yield put(setFinancialYearSummary(fySummary));
    const { parentAccounts } = yield select(state => state.metaData); 
    const updateParentAccountIndex = parentAccounts?.findIndex(({ id }) => id === fySummary?.id);
    const updatedParentAccounts = parentAccounts?.toSpliced(
      updateParentAccountIndex,
      1,
      {...parentAccounts[updateParentAccountIndex], attributes: {...parentAccounts[updateParentAccountIndex]?.attributes, updatedOn: fySummary?.attributes?.updatedOn}}
    );
    yield put(setParentAccountOptionsAction(updatedParentAccounts));
  } catch (error) {
    yield put(setFinancialYearSummaryError());
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

function* getDashboardGraph(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true}));
    const { accountForecastCandidateId } = action.payload;
    const response = yield call(get, `${BASE_URL}account-forecast-candidates/${accountForecastCandidateId}/trends/quarters`);
    const transformedData = forecastTrendsMapper(response?.data?.data, FORECASTING_SUMMARY.ACCOUNT, true);
    yield put(setGraphSummaryAction(transformedData));
  } catch (error) {
    yield put(setGraphSummaryAction(null));
    yield call(handleApiErrorMessages, error?.response);
  }finally {
    yield put(loadingSpinnerStack({ visibility: false }));
  }
}

export function* fetchTrendsSummary(action) {
  const { id, forecastingType, isQuarterlyTrends } = action.payload;

  try {
    const response = yield call(
      get,
      `${BASE_URL}${forecastingType === FORECASTING_SUMMARY.ACCOUNT
        ? FORECAST_CANDIDATES.ACCOUNT_FORECAST_CANDIDATES
        : FORECAST_CANDIDATES.PROJECT_FORECAST_CANDIDATES
      }/${id}/trends/${isQuarterlyTrends ? 'quarters' : 'months'}`
    );
    if (isQuarterlyTrends) {
      yield put(
        setForecastingQuarterlyTrends(
          forecastTrendsMapper(
            response?.data?.data,
            forecastingType,
            isQuarterlyTrends
          )
        )
      );
    } else {
      yield put(
        setForecastingMonthlyTrends(
          forecastTrendsMapper(
            response?.data?.data,
            forecastingType,
            isQuarterlyTrends
          )
        )
      );
    }
  } catch (error) {
    if (isQuarterlyTrends) {
      yield put(setForecastingQuarterlyTrends(null));
    } else {
      yield put(setForecastingMonthlyTrends(null));
    }
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

function* fetchVerticalOptions(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(post, `${BASE_URL}forecast-entitlements/divisions/_search`, action.payload);
    yield put(setVerticalOptionsAction(buildDropDownOption(response?.data?.data, 'attributes.name', 'attributes.id')));
  } catch (error) {
    yield call(handleApiErrorMessages, error?.response);
    yield put(getVerticalOptionsErrorAction());
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export function* getForecastComments(action) {
  const { id, forecastingType, forecastEntitlementView } = action.payload;
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    const response = yield call(get, `${BASE_URL}forecast-notes/${forecastingType}/${id}?forecastEntitlementView=${forecastEntitlementView}`);
    yield put(getForecastCommentsSuccessAction(response?.data?.data?.attributes));
  } catch (error) {
    yield put(toggleLoading({ visibility: false }));
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

export function* saveForecastComments(action) {
  try {
    const { id, notes, targetType, forecastEntitlementView } = action.payload;
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    yield call(post, `${BASE_URL}forecast-notes?forecastEntitlementView=${forecastEntitlementView}`, { notes, targetType, targetForecastCandidateId: id });
    const response = yield put(saveForecastCommentsSucccess(response?.data?.data));
    if (response.status === 200) {
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, title: FORECAST_DASHBOARD_CONSTANTS.NOTES_SUCCESS_MESSAGE }));;
    }
  } catch (error) {
    yield put(saveForecastCommentsError(error));
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

export function* updateForecastComments(action) {
  try {
    const { notesId, forecastEntitlementView, notes } = action.payload;
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    yield call(patch, `${BASE_URL}forecast-notes/${notesId}?forecastEntitlementView=${forecastEntitlementView}`, { notes });
    const response = yield put(saveForecastCommentsSucccess(response?.data?.data));
    if (response.status === 200) {
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(showToastMessage({ open: true, mode: TOAST_TYPES.SUCCESS, title: FORECAST_DASHBOARD_CONSTANTS.NOTES_UPDATED_MESSAGE }));;
    }
  } catch (error) {
    yield put(saveForecastCommentsError(error));
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

export default function* watchForecastDashboardSaga() {
  yield takeLatest(ForecastDashBoardActionType.GET_FORECAST_HISTORICAL_DATA, fetchForecastHistoricalData);
  yield takeLatest(ForecastDashBoardActionType.FORECAST_SUBMISSION, forecastSubmit);
  yield takeLatest(ForecastDashBoardActionType.GET_DASHBOARD_GRAPH_DATA, getDashboardGraph);
  yield takeLatest(ForecastDashBoardActionType.GET_FORECAST_FINANCIAL_YEAR_SUMMARY, getFinancialYearSummary);
  yield takeLatest(ForecastDashBoardActionType.GET_VERTICAL_OPTIONS, fetchVerticalOptions);
  yield takeEvery(ForecastDashBoardActionType.GET_FORECAST_SUMMARY_TRENDS, fetchTrendsSummary);
  yield takeLatest(ForecastDashBoardActionType.GET_FORECAST_COMMENTS, getForecastComments);
  yield takeLatest(ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS, saveForecastComments);
  yield takeLatest(ForecastDashBoardActionType.UPDATE_FORECAST_COMMENTS, updateForecastComments);
}

