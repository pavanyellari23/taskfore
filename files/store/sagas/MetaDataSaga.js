import { all, call, put, takeLatest } from 'redux-saga/effects';
import { saveAs } from 'file-saver';
import {
  post,
  patch,
  get,
  readEndpoint,
  ENKLOSE_API_PATH,
  getSessionItem,
  SESSION_STORAGE_ITEM,
  updateObjectInSession,
  buildDropDownOption,
  setSessionItem,
  RESPONSE_TYPE,
  storeActivePermission
} from '@revin-utils/utils';
import { WINDCHIME_URL, OLIO_URL, COPPER_SERVICE_URL, BASE_URL } from 'utils/environment';
import { MetaDataActionType } from '../../../src/store/types/MetaDataActionType';
import {
  setLocations,
  getLocationsError,
  setNotificationsList,
  getNotificationsListError,
  updateNotificationStatusSuccess,
  updateNotificationStatusError,
  setDeliveryType,
  getDeliveryTypeError,
  setBillingType,
  getBillingTypeError,
  setServicePortfolio,
  setServiceLine,
  setProviders,
  setServicePortfolioError,
  setServiceLineError,
  setProvidersError,
  setClientRoles,
  setRoles,
  getRoleError,
  getClientRolesError,
  setRoleGroups,
  getRoleGroupsError,
  setRateRevisions,
  getRateRevisionsError,
  setCostRevisions,
  getCostRevisionsError,
  setCurrencyList,
  setAccountDropdown,
  setProgramDropdown,
  setProgramDropdownError,
  getAccountDropdownError,
  setCurrencyListRivisions,
  setLocationRevisionsAction,
  getLocationRevisionsActionError,
  getProjectManagerSuccess,
  getProjectMangerError,
  getForecastCyclesSuccessAction,
  getForecastCyclesErrorAction,
  setAccountLogo,
  setEntitlements,
  setEntitlementsError,
  setParentAccountOptionsAction,
  getParentAccountOptionsErrorAction,
  getUserResourceListSuccessAction,
  getUserResourceListErrorAction,
  setSalesStage,
  getSalesStageError,
  setProjectSource,
  getProjectSourceError,
  setEntitlementsGrantsAction
} from '../../../src/store/actions/MetaData';
import {
  BLLNG_TYP,
  DLVRY_TYP,
  SRVC_LINE,
  SRVC_PRTFL,
  PROVIDER,
  FORECASTING_SUMMARY,
  SESSION_STORAGE_KEYS,
  FORECAST_CANDIDATES,
  RESOURCE_SEARCH_LIMIT, 
  RESOURCE_SEARCH_SORTBY, 
  RESOURCE_SEARCH_SORTBY_EMAIL,
  EXCEL_DOWNLOAD_SPLIT_STRING,
  ACTIVE_DELIVERY_TYPE
} from '../../utils/constants';
import handleApiErrorMessages from '../../../src/store/sagas/GlobalSaga';
import { loadingSpinnerStack, toggleLoading } from 'store/actions/Global';

function* getLocation() {
  try {
    const bootstrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootstrapData?.locations) {
      yield put(setLocations(bootstrapData?.locations));
    } else {
      const response = yield call(get, `${COPPER_SERVICE_URL}locations`);
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
        locations: response?.data?.data
      });
      yield put(setLocations(response?.data?.data));
    }
  } catch (error) {
    yield put(getLocationsError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getLocationRevisions(action) {
  try {
    const bootstrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootstrapData?.locationRevisions) {
      yield put(setLocationRevisionsAction(bootstrapData?.locationRevisions));
    } else {
      const response = yield call(post, `${BASE_URL}location-revisions/_search`, { effectiveDate: action.payload.effectiveDate });
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, { locationRevisions: response?.data?.data?.attributes?.locationConfigs });
      yield put(setLocationRevisionsAction(response?.data?.data?.attributes?.locationConfigs));
    }
  } catch (error) {
    yield put(getLocationRevisionsActionError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getDeliveryType() {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      `${OLIO_URL}codes/_search?locale=en_US`,
      {
        'codeTypes': [DLVRY_TYP],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]
      }
    );
    yield put(
      setDeliveryType(
        response.data.data[DLVRY_TYP].map((item) => ({
          ...item,
          id: item.codeId,
          label: item.description
        }))
      )
    );
  } catch (e) {
    yield put(getDeliveryTypeError(e));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getServicePortfolio() {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      `${OLIO_URL}codes/_search?locale=en_US`,
      {
        'codeTypes': [SRVC_PRTFL],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]

      }
    );
    yield put(
      setServicePortfolio(
        response.data.data[SRVC_PRTFL].map((item) => ({
          ...item,
          id: item.codeId,
          label: item.description
        }))
      )
    );
  } catch (e) {
    yield put(setServicePortfolioError(e));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getServiceLine() {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      `${OLIO_URL}codes/_search?locale=en_US`,
      {
        'codeTypes': [SRVC_LINE],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]
      }
    );
    yield put(
      setServiceLine(
        response.data.data[SRVC_LINE].map((item) => ({
          ...item,
          id: item.codeId,
          label: item.description
        }))
      )
    );
  } catch (e) {
    yield put(setServiceLineError(e));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getProviders() {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      `${OLIO_URL}codes/_search?locale=en_US`,
      {
        'codeTypes': [PROVIDER],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]
      }
    );
    yield put(
      setProviders(
        response.data.data[PROVIDER].map((item) => ({
          ...item,
          id: item.codeId,
          label: item.description
        }))
      )
    );
  } catch (e) {
    yield put(setProvidersError(e));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getNotifications(action) {
  try {
    const response = yield call(
      post,
      `${WINDCHIME_URL}alerts/_search`,
      action.payload
    );
    yield put(setNotificationsList(response?.data));
  } catch (error) {
    yield put(getNotificationsListError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* updateNotificationStatus(action) {
  try {
    const response = yield call(
      patch,
      `${WINDCHIME_URL}alerts`,
      action.payload
    );
    yield put(updateNotificationStatusSuccess(response));
  } catch (error) {
    yield put(updateNotificationStatusError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getBillingTypeApi() {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      `${OLIO_URL}codes/_search?locale=en_US`,
      {
        'codeTypes': [BLLNG_TYP],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]
      }
    );
    yield put(
      setBillingType(
        response.data.data[BLLNG_TYP].map((item) => ({
          ...item,
          id: item.codeId,
          label: item.description
        }))
      )
    );
  } catch (error) {
    yield put(getBillingTypeError(error));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getCurrencyData() {
  try {
    const bootStrapData = yield call(getSessionItem, SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    let response = [];
    let isBootstrapData = false;
    if (bootStrapData?.currencyList?.length && bootStrapData?.currencyRevisionList?.length) {
      response = [bootStrapData?.currencyList, bootStrapData?.currencyRevisionList];
      isBootstrapData = true;
    } else {
      yield put(toggleLoading({ visibility: true }));
      response = yield all([
        call(get, `${COPPER_SERVICE_URL}currencies`),
        call(post, `${COPPER_SERVICE_URL}currency-revisions/_search`, {})
      ]);
    }
    yield put(setCurrencyList(response[0]));
    yield put(setCurrencyListRivisions(response[1]));
    if (!isBootstrapData) {
      yield call(updateObjectInSession, SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
        currencyList: response[0],
        currencyRevisionList: response[1]
      });
    }
  } catch (error) {
    yield put(setCurrencyList([]));
    yield put(setCurrencyListRivisions([]));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

function* clearBootStrapData() {
  yield call(updateObjectInSession, SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
    opportunity: null,
    pricingMaster: null,
    pricingVersionData: null,
    pricingVersionOppId: ''
  });
}

function* getInitialRoleData(action) {
  yield all([
    call(getRoleGroup),
    call(getOrgRoles),
    call(getClientRole, action),
    call(getLocation),
    call(getRateRevision, action),
    call(getCostRevision, action),
    call(getLocationRevisions, action)
  ]);
}

function* getRoleGroup() {
  try {
    const bootStrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootStrapData?.roleGroups) {
      yield put(setRoleGroups(bootStrapData?.roleGroups));
    } else {
      const response = yield call(readEndpoint, {
        param: ENKLOSE_API_PATH.ROLE_GROUPS
      });
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
        roleGroups: response
      });
      yield put(setRoleGroups(response));
    }
  } catch (error) {
    yield put(getRoleGroupsError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getOrgRoles() {
  try {
    const bootStrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootStrapData.orgRoles) {
      yield put(setRoles(bootStrapData.orgRoles));
    } else {
      const response = yield call(readEndpoint, {
        param: ENKLOSE_API_PATH.ROLES
      });
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
        orgRoles: response
      });
      yield put(setRoles(response));
    }
  } catch (error) {
    yield put(getRoleError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getClientRole(action) {
  try {
    const payload = action?.payload
      ? action?.payload?.clientRolePayload
        ? action?.payload?.clientRolePayload : action.payload : {
        param: ENKLOSE_API_PATH.CLIENT_ROLES
      };
    const bootStrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (payload?.resource?.filter === bootStrapData?.clientRoles?.filter && bootStrapData?.clientRoles?.data) {
      yield put(setClientRoles(bootStrapData?.clientRoles?.data));
    } else {
      const response = yield call(readEndpoint, payload);
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, {
        clientRoles: {
          filter: payload?.resource?.filter,
          data: response
        }
      });
      yield put(setClientRoles(response));
    }

  } catch (error) {
    yield put(getClientRolesError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getRateRevision(action) {
  try {
    const bootstrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootstrapData?.rateRevisions) {
      yield put(setRateRevisions(bootstrapData?.rateRevisions));
    } else {
      const response = yield call(post, `${BASE_URL}rate-revisions/_search`, { effectiveDate: action.payload.effectiveDate, accountId: action.payload.accountId });
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, { rateRevisions: response?.data?.data?.attributes.billRates });
      yield put(setRateRevisions(response?.data?.data?.attributes.billRates));
    }
  } catch (error) {
    yield put(getRateRevisionsError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getCostRevision(action) {
  try {
    const bootstrapData = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA);
    if (bootstrapData?.costRevisions) {
      yield put(setCostRevisions(bootstrapData?.costRevisions));
    } else {
      const response = yield call(post, `${BASE_URL}cost-revisions/_search`, { effectiveDate: action.payload.effectiveDate });
      updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, { costRevisions: response?.data?.data?.attributes.costs });
      yield put(setCostRevisions(response?.data?.data?.attributes.costs));
    }
  } catch (error) {
    yield put(getCostRevisionsError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

function* getAccountDropdown(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(post, `${`${BASE_URL}forecast-entitlements/accounts/_search`}`, action.payload);
    const accountDropdown = buildDropDownOption(response.data.data, 'attributes.name', 'id');
    if (response.data.data.length > 1) {
      accountDropdown.unshift({ label: 'All', id: 'All' });
    }
    yield put(setAccountDropdown(accountDropdown));
  } catch (error) {
    yield put(getAccountDropdownError(error));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

function* getPrograms(action) {
  const { isShowLoader, forecastEntitlement, parentEntityCodes } = action.payload;
  try {
    if (isShowLoader) yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(post, `${BASE_URL}forecast-entitlements/programs/_search`, { forecastEntitlement, parentEntityCodes });
    const programDropdown = buildDropDownOption(response.data.data, 'attributes.name', 'id');
    if (response.data.data.length > 1) {
      programDropdown.unshift({ label: 'All', id: 'All' });
    }
    yield put(setProgramDropdown(programDropdown));
  } catch (error) {
    yield put(setProgramDropdownError(error));
  } finally {
    if (isShowLoader) yield put(loadingSpinnerStack({ visibility: false , backdropLoader: false}));
  }
}

function* getUserEntitlement() {
  try {
    yield put(toggleLoading({ visibility: true }));
    const response = yield call(get, `${BASE_URL}forecast-entitlements`);
    const view = response?.data?.data?.attributes?.forecastEntitlementView;
    yield put(setEntitlements(view));
    setSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW, view);
  } catch (error) {
    yield put(setEntitlementsError(error));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
};

function* getProjectManagers(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      post,
      // TODO : Added temp Account ID for now will change in future.
      `${OLIO_URL}users/_search?sortBy=firstName`,
      action.payload
    );
    yield put(
      getProjectManagerSuccess(
        response.data.data.map((item) => ({
          ...item,
          id: item.id,
          label: `${item.firstName} ${item.lastName}`,
          level: `${item.firstName} ${item.lastName}`
        }))
      )
    );
  } catch (error) {
    yield put(getProjectMangerError(error));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export function* downloadSummaryExcel(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: false }));
  const { id, forecastingType } = action.payload;
  try {
    const response = yield call(
      get,
      `${BASE_URL}${forecastingType === FORECASTING_SUMMARY.ACCOUNT ? FORECAST_CANDIDATES.ACCOUNT_FORECAST_CANDIDATES : FORECAST_CANDIDATES.PROJECT_FORECAST_CANDIDATES}/${id}/_export`,
      { responseType: RESPONSE_TYPE.blob }
    );

    const blob = new Blob([response.data], {
      type: 'application/vnd.ms.excel'
    });
    const fileName = response.headers['content-disposition']?.split(EXCEL_DOWNLOAD_SPLIT_STRING)?.[1];
    saveAs(blob, fileName ?? '');
  } catch (error) {
    yield put(toggleLoading({ visibility: false }));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

export function* fetchForecastCycles() {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(get, `${BASE_URL}forecast-cycles`);
    yield put(getForecastCyclesSuccessAction(response?.data?.data?.attributes));
    setSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES, response?.data?.data?.attributes);
  } catch (error) {
    yield put(getForecastCyclesErrorAction(error));
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
}

export function* getAccountLogo(action) {
  try {
    yield call(get, `${BASE_URL}accounts/${action?.payload?.parentAccountId}/logo`);
    yield put(setAccountLogo(true));
  } catch (error) {
    yield put(setAccountLogo(false));
  }
}

function* fetchParentAccountOptions(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(post, `${BASE_URL}forecast-entitlements/account-forecast-candidates/_search`, action.payload);
    yield put(setParentAccountOptionsAction(buildDropDownOption(response.data.data, 'attributes.parentAccountName', 'attributes.id')));
  } catch (error) {
    yield put(getParentAccountOptionsErrorAction(error));
    yield call(handleApiErrorMessages, error?.response);
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

function* fetEntitlementForParentAccount(action) {
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true}));
    const response = yield call(post, `${BASE_URL}entitlements/grants`, action.payload);
    storeActivePermission(response?.data?.data?.attributes);
    yield put(setEntitlementsGrantsAction(response?.data?.data?.attributes));
  } catch (error) {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false}));
  }
}

function* getUserResourceList(action) {
  const { searchTerm } = action.payload;
  try {
    const response = yield call(
      post,
        `${BASE_URL}users/_search?sortBy=${RESOURCE_SEARCH_SORTBY}&&sortBy=${RESOURCE_SEARCH_SORTBY_EMAIL}&offSet=0&limit=${RESOURCE_SEARCH_LIMIT}&onlyUsers=true&includeAllUsers=false`,
        { searchTerm }
    );
    yield put(getUserResourceListSuccessAction(response?.data?.data));
  } catch (error) {
    yield put(getUserResourceListErrorAction(error?.data?.error?.errors[0]?.detail || error?.data?.error));
  }
}

function* getSalesStage() {
  yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call( get, `${BASE_URL}opportunities/sales-stages` );
    yield put(setSalesStage(response.data.data));
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  } catch (e) {
    yield put(getSalesStageError(e));
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

function* getProjectSource() {
  yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true}));
  try {
    const response = yield call( get, `${BASE_URL}project-forecast-candidates/project-sources` );
    yield put(setProjectSource(response.data?.data));
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  } catch (e) {
    yield put(getProjectSourceError(e));
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export default function* watchMetaDataSaga() {
  yield takeLatest(MetaDataActionType.GET_LOCATIONS, getLocation);
  yield takeLatest(MetaDataActionType.GET_NOTIFICATIONS_LIST, getNotifications);
  yield takeLatest(
    MetaDataActionType.UPDATE_NOTIFICATION_STATUS,
    updateNotificationStatus
  );
  yield takeLatest(MetaDataActionType.GET_DELIVERY_TYPE, getDeliveryType);
  yield takeLatest(MetaDataActionType.GET_BILLING_TYPE, getBillingTypeApi);
  yield takeLatest(MetaDataActionType.GET_SERVICE_PORTFOLIO, getServicePortfolio);
  yield takeLatest(MetaDataActionType.GET_SERVICE_LINE, getServiceLine);
  yield takeLatest(MetaDataActionType.GET_PROVIDERS, getProviders);
  yield takeLatest(MetaDataActionType.CLEAR_BOOTSTRAP_DATA, clearBootStrapData);
  yield takeLatest(MetaDataActionType.GET_ROLES, getOrgRoles);
  yield takeLatest(MetaDataActionType.GET_CLIENT_ROLES, getClientRole);
  yield takeLatest(MetaDataActionType.GET_ROLE_GROUPS, getRoleGroup);
  yield takeLatest(MetaDataActionType.GET_LOCATION_REVISIONS, getLocationRevisions);
  yield takeLatest(MetaDataActionType.GET_INITIAL_ROLE_DATA, getInitialRoleData);
  yield takeLatest(MetaDataActionType.GET_CURRENCY_DATA, getCurrencyData);
  yield takeLatest(MetaDataActionType.GET_PROJECT_MANAGERS, getProjectManagers);
  yield takeLatest(MetaDataActionType.GET_PROGRAM_DROPDOWN, getPrograms);
  yield takeLatest(MetaDataActionType.GET_ACCOUNT_DROPDOWN, getAccountDropdown);
  yield takeLatest(MetaDataActionType.DOWNLOAD_EXCEL, downloadSummaryExcel);
  yield takeLatest(MetaDataActionType.GET_FORECAST_CYCLES, fetchForecastCycles);
  yield takeLatest(MetaDataActionType.GET_ACCOUNT_LOGO, getAccountLogo);
  yield takeLatest(MetaDataActionType.GET_ENTITLEMENT, getUserEntitlement);
  yield takeLatest(MetaDataActionType.GET_PARENT_ACCOUNT_OPTIONS, fetchParentAccountOptions);
  yield takeLatest(MetaDataActionType.GET_ENTITLEMENT_GRANTS, fetEntitlementForParentAccount);
  yield takeLatest(MetaDataActionType.GET_USER_RESOURCE_LIST, getUserResourceList);
  yield takeLatest(MetaDataActionType.GET_SALES_STAGE, getSalesStage);
  yield takeLatest(MetaDataActionType.GET_PROJECT_SOURCE, getProjectSource);
}
