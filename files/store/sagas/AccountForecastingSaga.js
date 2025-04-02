import { put, call, takeLatest } from 'redux-saga/effects';
import { AccountForecastingActionType } from '../types/AccountForecastingActionType';
import { toggleLoading, showToastMessage, toggleForecastSaved } from 'store/actions/Global';
import {
  setAccountForecasting,
  setResourceUsersAction,
  getResourceUsersErrorAction,
  getResourceUserSuccessAction,
  setInvestmentCategories,
  setInvestmentCategoriesError,
  setAccountSummary,
  accountForecastErrorAction
} from '../actions/AccountForecasting';
import { get, post } from '@revin-utils/utils';
import { forecastGridErrorControl } from './helper';
import { BASE_URL } from 'utils/environment';
import {  RESOURCE_SEARCH_LIMIT, RESOURCE_SEARCH_SORTBY, RESOURCE_SEARCH_SORTBY_EMAIL, TOAST_TYPES } from 'utils/constants';

function* getAccountForecastingData(action) {
  const { accountForecastCandidateId, payload = null, dryRun = true, message = null, fromDetailSummary = false } = action.payload;
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    let response = {};
    if (payload) {
      response = yield call(
        post,
        `${BASE_URL}forecasting-plans/${accountForecastCandidateId}/account?isDryRun=${dryRun}`,
        payload
      );
    } else if (fromDetailSummary) {
      response = yield call(
        get,
        `${BASE_URL}account-forecast-candidates/${accountForecastCandidateId}/detailed-summary`
      );
    }
    else {
      response = yield call(
        get,
        `${BASE_URL}forecasting-plans/${accountForecastCandidateId}/account`
      );
      yield put(setAccountSummary(response?.data?.data));
    }
    if (dryRun) yield put(setAccountForecasting(response?.data?.data));
    yield put(toggleLoading({ visibility: false }));
    if (!dryRun && response?.data) yield put(toggleForecastSaved(true));
    if (message) {
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.SUCCESS,
          subtitle: message
        })
      );
    }
  } catch (error) {
    const transformedErrorMessage = forecastGridErrorControl(error?.data?.error?.errors || []);
    yield put(toggleLoading({ visibility: false }));
    yield put(accountForecastErrorAction(transformedErrorMessage));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

function* getResourceUsers(action) {
  const { searchTerm } = action.payload;
  try {
    const response = yield call( post,
        `${BASE_URL}users/_search?sortBy=${RESOURCE_SEARCH_SORTBY}&&sortBy=${RESOURCE_SEARCH_SORTBY_EMAIL}&offSet=0&limit=${RESOURCE_SEARCH_LIMIT}&onlyUsers=true&includeAllUsers=false`,
        { searchTerm }
    );
    yield put(setResourceUsersAction(response?.data?.data));
  } catch (error) {
    yield put(getResourceUsersErrorAction(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
}

function* getResourceUser(action) {
  const { userId } = action.payload;
  try {
    const response = yield call( get, `${BASE_URL}forecasting-role-plans/allocations/${userId}` );
    yield put(getResourceUserSuccessAction(response?.data?.data[0]?.attributes));
  } catch (error) {
    yield put(getResourceUsersErrorAction(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
}

function* fetchInvestmentCategories(action) {
  try {
    const investmentCategories = yield call(
      post,
        `${BASE_URL}codes/_search`,
        action.payload
    );
    yield put(setInvestmentCategories(investmentCategories?.data?.data));
  }
  catch (error) {
    const errorCheck = error?.data?.error;
    const errorMessage = errorCheck?.errors[0]?.detail || errorCheck;
    yield put(setInvestmentCategoriesError(errorMessage));
  }
}

export default function* watchAccountForecastingSaga() {
  yield takeLatest(AccountForecastingActionType.GET_ACCOUNT_FORECASTING_DATA, getAccountForecastingData);
  yield takeLatest(AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API, getAccountForecastingData);
  yield takeLatest(AccountForecastingActionType.GET_INVESTMENT_CATEGORIES, fetchInvestmentCategories);
  yield takeLatest(AccountForecastingActionType.GET_RESOURCE_USERS, getResourceUsers);
  yield takeLatest(AccountForecastingActionType.GET_RESOURCE_USER, getResourceUser);
  yield takeLatest(AccountForecastingActionType.GET_INVESTMENT_CATEGORIES, fetchInvestmentCategories);
}
