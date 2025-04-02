import {
  deleteApi,
  get,
  patch,
  post,
  getSessionItem,
  SESSION_STORAGE_ITEM,
  updateObjectInSession,
  buildDropDownOption,
  API_RESPONSE,
  setSessionItem
} from '@revin-utils/utils';
import { toggleLoading, showToastMessage, showMultipleToastMessage, loadingSpinnerStack } from 'store/actions/Global';
import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import { OpportunitiesActionType } from '../types/OpportunitiesActionType';
import {
  fetchOpportunityByIdSuccess,
  fetchOpportunityByIdError,
  setOpportunityError,
  setForecastCandidates,
  setForecastCandidatesError,
  addOpportunitySuccess,
  setChooseForecastCandidates,
  setCRUDopSuccess,
  setRoutingSuccess,
  setAvailableProjectListError,
  setAvailableProjectList,
  addAvailableProjectSuccess,
  setProgramsandManagers,
  setProgramsandManagersError,
  setchildAccount,
  setchildAccountError,
  setForecastCandidatesSummary,
  setForecastCandidatesSummaryError,
  setCustomGrpProjectsList,
  setCustomGrpProjectsListError,
  setCustomGroupCandidates,
  setSearchedForecastCanditates,
  setOpportunityInfoById
} from '../actions/Opportunities';
import handleApiErrorMessages from './GlobalSaga';
import { OPPORTUNITY_SERVICE_URL, BASE_URL, OLIO_URL } from 'utils/environment';
import { GROUP_DELETE_ERROR_MSG, GROUP_DELETE_SUCCESS_MSG, OPPORTUNITY_SELECTION_ERROR_CODES, getMultipleErrorMessageConfig, ADD_OTHERS_PROJECT_MODAL, PROJECT_LEVEL_FORECAST, RESOURCE_LEVEL_FORECAST, TOAST_TYPES, TOAST_MESSAGES_SUFFIX, OPPORTUNITY_DASHBOARD_LIMIT, SESSION_STORAGE_KEYS } from 'utils/constants';

function* fetchOpportunityById(action) {
  try {
    const [, oppId] = action.payload.param.split('/');
    const { opportunity } = getSessionItem(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA) || {};
    if (opportunity?.id === oppId) {
      yield put(fetchOpportunityByIdSuccess(opportunity));
    }
    else {
      const response = yield call(
        get,
        `${OPPORTUNITY_SERVICE_URL}${action.payload}`
      );
      yield call(updateObjectInSession, SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, { opportunity: response.data.data });
      yield put(fetchOpportunityByIdSuccess(response.data.data));
    }
  } catch (error) {
    yield put(fetchOpportunityByIdError(error));
    yield call(handleApiErrorMessages, error?.response);
  }
}

export function* addOpportunity(action) {
  try {
    if (action.payload) {
      const response = yield call(
        post,
        `${OPPORTUNITY_SERVICE_URL}opportunities/`,
        action.payload
      );
      if (response.status === 201) {
        yield put(addOpportunitySuccess(response.data));
        yield put(setCRUDopSuccess({
          isDeleted: false,
          isEdited: false,
          isCreated: true
        }));
        yield put(
          showToastMessage({
            open: true,
            mode: TOAST_TYPES.SUCCESS,
            subtitle: `Opportunity ${response?.data?.data?.attributes?.primaryInfo?.projectName} is created successfully`
          })
        );
      }
    }
  } catch (error) {
    yield put(
      setOpportunityError({
        error: error?.response?.data?.error?.errors,
        component: action.payload.component
      })
    );
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

export function* getChildAccounts(action) {
  try {
    yield put(toggleLoading({ visibility: true }));
    const response = yield call(post, `${BASE_URL}forecast-entitlements/accounts/_search`, action.payload);
    const accountDropdown = buildDropDownOption(response.data.data, 'attributes.name', 'id');
    yield put(setchildAccount(accountDropdown));
  } catch (error) {
    yield put(setchildAccountError([]));
  } finally {
    yield put(toggleLoading({ visibility: false }));
  }
}

export function* getForecastCandidates(action) {
  const { pageNumber = 0, pageSize = OPPORTUNITY_DASHBOARD_LIMIT, request } = action.payload;
  yield put(loadingSpinnerStack({ visibility: action.payload.loading, backdropLoader: true}));
  try {
    if (action.payload) {
      const response = yield call(post, `${OPPORTUNITY_SERVICE_URL}project-forecast-candidates/_search?page=${pageNumber}&pageSize=${pageSize}`, request);
      if (!action.payload.getSelected) {
        if(action.payload.isSearch){
          yield put(setSearchedForecastCanditates(response.data.data?.attributes));
        }
        else{
          yield put(setSearchedForecastCanditates([]));
          yield put(setForecastCandidates(response.data.data?.attributes));
        }
      } else {
        yield put(setRoutingSuccess({
          isBulkSuccess: false,
          isChangeForecastSuccess: false
        }));
        yield put(setSearchedForecastCanditates([]));
        yield put(setForecastCandidates([]));
        yield put(setChooseForecastCandidates(response.data.data?.attributes));
      }
      yield put(setCRUDopSuccess({
        isDeleted: false,
        isEdited: false,
        isCreated: false
      }));
    }
  } catch (error) {
    yield put(
      setForecastCandidatesError(error)
    );
    if (!action.payload.getSelected) {
      yield put(setSearchedForecastCanditates([]));
      yield put(setForecastCandidates({ forecastCandidates: [], forecastCandidatesSummaryOverview: {} }));
    } else {
      yield put(setChooseForecastCandidates({ forecastCandidates: [], forecastCandidatesSummaryOverview: {} }));
    }
    //@todo : We need to move dropdown to project selection page and remove session storage
    // yield put(
    //   showToastMessage({
    //     open: true,
    //     mode: TOAST_TYPES.ERROR,
    //     subtitle: error?.data?.error?.errors[0]?.detail
    //   })
    // );
    yield put(setCRUDopSuccess({
      isDeleted: false,
      isEdited: false,
      isCreated: false
    }));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export function* getForecastSummarydata(action) {
  const { request } = action.payload;
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(post, `${BASE_URL}project-forecast-candidates/_search/summary`, request);
    yield put(setForecastCandidatesSummary(response.data.data?.attributes));
  } catch (error) {
    yield put(setForecastCandidatesSummaryError(error));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export function* deleteOpportunity(action) {
  const { id } = action.payload;
  try {
    if (action.payload) {
      const response = yield call(deleteApi, `${BASE_URL}project-forecast-candidates/${id}`);
      if (response.status === 200) {
        yield put(setCRUDopSuccess({
          isDeleted: true,
          isEdited: false,
          isCreated: false
        }));
        yield put(
          showToastMessage({
            open: true,
            mode: TOAST_TYPES.SUCCESS,
            subtitle: `Opportunity ${action.payload?.projectName} is deleted successfully`
          })
        );
      }
    }
  } catch (error) {
    yield put(
      setOpportunityError({
        error: error?.response?.data?.error?.errors
      })
    );
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

export function* editOpportunity(action) {
  try {
    if (action.payload) {
      const response = yield call(
        patch,
        `${OPPORTUNITY_SERVICE_URL}opportunities/${action.payload?.id}`,
        action.payload?.data
      );
      if (response.status === 200) {
        yield put(setCRUDopSuccess({
          isDeleted: false,
          isEdited: true,
          isCreated: false
        }));
        yield put(
          showToastMessage({
            open: true,
            mode: TOAST_TYPES.SUCCESS,
            subtitle: `Opportunity ${action.payload?.data?.data?.attributes?.primaryInfo?.projectName} is edited successfully`
          })
        );
      }
    }
  } catch (error) {
    yield put(
      setOpportunityError({
        error: error?.response?.data?.error?.errors
      })
    );
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

export function* bulkUpdateOpportunity(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    if (action.payload) {
      yield call(
        patch,
        `${OPPORTUNITY_SERVICE_URL}project-forecast-candidates/_bulk?accountForecastCandidateId=${action.payload.accountForecastCandidateId}`,
        action.payload.opportunities
      );
      yield put(setRoutingSuccess({
        isBulkSuccess: true,
        isChangeForecastSuccess: false
      }));
      yield put(setChooseForecastCandidates({
        forecastCandidates: [],
        forecastCandidatesSummaryOverview: {}
      }));
    }
  }
  catch (error) {
    const lessProbabilityErrors = error?.data?.error?.errors?.filter(error => error?.code === OPPORTUNITY_SELECTION_ERROR_CODES.PROBABILITY_OTHER_THAN_100) || [];
    if (lessProbabilityErrors?.length) {
      // From API we are getting project code in string so we need to pick project code from the string.
      const projectCodesWithLessProbability = lessProbabilityErrors?.map(error => error?.detail?.split(':')[1]?.trim()?.replaceAll('.','')) || [];
      yield put(showMultipleToastMessage({errors: projectCodesWithLessProbability, multipleErrorMessageConfig: getMultipleErrorMessageConfig(projectCodesWithLessProbability, OPPORTUNITY_SELECTION_ERROR_CODES.PROBABILITY_OTHER_THAN_100)}));
    } else {
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.ERROR,
          subtitle: error?.data?.error?.errors[0]?.detail
        })
      );
    };
  }finally{
    yield put(toggleLoading({ visibility: false, backdropLoader: false}));
  }
}

export function* changeForecastingType(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    if (action.payload) {
      const { selectedForecastCandidates, oppIdforForecastChange } = action.payload?.payloadForForecastChange;
      const filteredCandidate = selectedForecastCandidates?.forecastCandidates?.filter((item) => item?.id === oppIdforForecastChange);
      const response = yield call(
        patch,
        `${OPPORTUNITY_SERVICE_URL}project-forecast-candidates/${filteredCandidate[0]?.id}?forecastLevelType=${filteredCandidate[0]?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? PROJECT_LEVEL_FORECAST : RESOURCE_LEVEL_FORECAST}`
      );
      if (response.status === 200 && selectedForecastCandidates?.forecastCandidates?.length) {
        const updatedForecastCandidates = selectedForecastCandidates.forecastCandidates.map(opportunity => 
          opportunity.id === oppIdforForecastChange && response.data?.data?.attributes
            ? response.data.data.attributes
            : opportunity
        );
        yield put(setChooseForecastCandidates({...selectedForecastCandidates, forecastCandidates: updatedForecastCandidates}));
        yield put(setRoutingSuccess({
          isBulkSuccess: false,
          isChangeForecastSuccess: true
        }));
      }
    }
  } catch (error) {
    yield put(setRoutingSuccess({
      isBulkSuccess: false,
      isChangeForecastSuccess: false
    }));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
};

export function* getAvailableProjectList(action) {
  try {
    if (action.payload) {
      const { searchTerm, accountForecastCandidateId } = action.payload;
      const response = yield call(
        get,
        `${BASE_URL}account-forecast-candidates/${accountForecastCandidateId}/project-forecast-candidates/${searchTerm}`
      );
      if (response.status === 200) {
        yield put(setAvailableProjectList(response?.data));
      };
    }
  }
  catch (error) {
    yield put(setAvailableProjectListError(ADD_OTHERS_PROJECT_MODAL.NO_RESULT));
  }
}

export function* addAvailableProjectToForecast(action) {
  const { projectName } = action.payload;
  yield put(toggleLoading({ visibility: action.payload?.loading, backdropLoader: true }));
  try {
    const response = yield call(
      post,
      `${BASE_URL}project-forecast-candidates`,
      action.payload
    );

    if (response.status === 200) {
      yield put(addAvailableProjectSuccess({
        isDeleted: false,
        isEdited: false,
        isCreated: true
      }));
      yield put(toggleLoading({ visibility: !action.payload?.loading }));
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.SUCCESS,
          subtitle: `Candidate ${projectName} ${TOAST_MESSAGES_SUFFIX.ADD}`
        })
      );
    }
  }
  catch (error) {
    yield put(toggleLoading({ visibility: !action.payload?.loading }));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

export function* getProgramsandManagers(action) {
  try {
    yield put(toggleLoading({ visibility: true, backdropLoader: true }));
    const [programs, managers] = yield all([
      call(post, `${BASE_URL}forecast-entitlements/programs/_search`, action.payload.programs),
      call(post, `${OLIO_URL}users/_search?sortBy=firstName`, action.payload.managers)
    ]);
    yield put(setProgramsandManagers({
      programs: buildDropDownOption(programs?.data?.data, 'attributes.name', 'id'),
      managers: managers?.data?.data.map((item) => ({
        ...item,
        id: item.id,
        label: `${item.firstName} ${item.lastName}`,
        level: `${item.firstName} ${item.lastName}`
      }))
    }));
  } catch (error) {
    yield put(setProgramsandManagersError({}));
  } finally {
    yield put(toggleLoading({ visibility: false , backdropLoader: false}));
  }
}

export function* fetchMoreForecastCandidates(action) {
  const { pageNumber = 0, pageSize = OPPORTUNITY_DASHBOARD_LIMIT, request, getSelected, isSearchedActive } = action.payload;
  try {
    if (action.payload) {
      const response = yield call(post, `${OPPORTUNITY_SERVICE_URL}project-forecast-candidates/_search?page=${pageNumber}&pageSize=${pageSize}`, request);
      const { forecast_candidates, forecast_candidates_data, searched_forecast_candidates } = yield select(state => state.opportunities);
      const { forecastCandidates } = response.data.data?.attributes;
      if (!getSelected) {
        if(isSearchedActive){
          yield put(setSearchedForecastCanditates({ ...searched_forecast_candidates, forecastCandidates: [...searched_forecast_candidates.forecastCandidates, ...forecastCandidates] }));
        } else {
          yield put(setForecastCandidates({ ...forecast_candidates, forecastCandidates: [...forecast_candidates.forecastCandidates, ...forecastCandidates] }));
        }
      } else {
        yield put(setChooseForecastCandidates({ ...forecast_candidates_data, forecastCandidates: [...forecast_candidates_data.forecastCandidates, ...forecastCandidates] }));
      }
    }
  } catch (error) {
    yield put(
      setForecastCandidatesError(error)
    );
  }
}

export function* deleteCustomGroup(action) {
  const { groupId } = action.payload;
  try {
    if (groupId) {
      yield put(toggleLoading({ visibility: true, backdropLoader: true }));
      const response = yield call(deleteApi, `${BASE_URL}project-forecast-candidates/groups/${groupId}`);
      if (response.status === API_RESPONSE.SUCCESS_STATUS) {
        yield put(setCRUDopSuccess({
          isDeleted: true,
          isEdited: false,
          isCreated: false
        }));
        yield put(toggleLoading({ visibility: false, backdropLoader: false }));
        yield put(
          showToastMessage({
            open: true,
            mode: TOAST_TYPES.SUCCESS,
            subtitle: GROUP_DELETE_SUCCESS_MSG
          })
        );
      };
    } else {
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.ERROR,
          subtitle: GROUP_DELETE_ERROR_MSG
        })
      );
    }
  } catch (error) {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
    yield put(
      setForecastCandidatesError(error));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
};
  
export function* getCustomGroupProjectsList(action) {
  try {
    if (action.payload) {
      yield put(toggleLoading({ visibility: true, backdropLoader: true }));
      const response = yield call(post, `${OPPORTUNITY_SERVICE_URL}project-forecast-candidates/groups/search-members`, action.payload);
      yield put(setCustomGrpProjectsList(response.data));
      if (response?.data?.length === 0) yield put(setCustomGrpProjectsListError(ADD_OTHERS_PROJECT_MODAL.NO_RESULT));
    }
  } catch (error) {
    yield put(setCustomGrpProjectsListError(ADD_OTHERS_PROJECT_MODAL.NO_RESULT));
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
};

export function* fetchCustomGroupCandidates(action) {
  const { groupId , pageNumber } = action.payload;
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    if (action.payload) {
      const response = yield call(get, `${BASE_URL}project-forecast-candidates/groups/${groupId}?page=${pageNumber}&pageSize=20`);
      yield put(setCustomGroupCandidates(response?.data?.data?.attributes));
    }
  } catch (error) {
    yield put(toggleLoading({ visibility: false }));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  } finally {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
  }
};

export function* addCustomGroups (action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  try {
    const response = yield call(
      post,
      `${BASE_URL}project-forecast-candidates/groups?forecastEntitlementView=${getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)}`,
      action.payload
    );
    if (response.status === 200) {
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      const { forecast_candidates } = yield select(state => state.opportunities);
      yield put(setForecastCandidates({ ...forecast_candidates, forecastCandidates: [...forecast_candidates.forecastCandidates, response.data.data?.attributes]}));
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.SUCCESS,
          subtitle: `New group ${response.data?.data?.attributes?.groupInfo?.groupName} is created successfully.`
        })
      );
    }
  }
  catch (error) {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

export function* editCustomGroups(action) {
  yield put(toggleLoading({ visibility: true, backdropLoader: true }));
  const { groupId, requestPayload, isFromCustomGpPage } = action.payload;
  try {
    const response = yield call(
      patch,
      `${BASE_URL}project-forecast-candidates/groups/${groupId}?forecastEntitlementView=${getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)}`,
      requestPayload
    );
    if (response.status === 200) {
      yield put(toggleLoading({ visibility: false, backdropLoader: false }));
      const { forecast_candidates } = yield select(state => state.opportunities);
      let updatedForecastCandidates = [];
      if (forecast_candidates.forecastCandidates) {
        updatedForecastCandidates = forecast_candidates.forecastCandidates.map(item =>
          item.id === response.data?.data?.attributes?.id ? {
            ...response.data.data.attributes
          } : item
        );
      } else {
        updatedForecastCandidates.push(response.data.data.attributes);
      }
      if (isFromCustomGpPage) setSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION, { data: response.data.data.attributes, forecasting: false });
      yield put(setForecastCandidates({ ...forecast_candidates, forecastCandidates: updatedForecastCandidates }));
      yield put(
        showToastMessage({
          open: true,
          mode: TOAST_TYPES.SUCCESS,
          subtitle: `${response.data?.data?.attributes?.groupInfo?.groupName} updated successfully.`
        })
      );
    }
  }
  catch (error) {
    yield put(toggleLoading({ visibility: false, backdropLoader: false }));
    yield put(
      showToastMessage({
        open: true,
        mode: TOAST_TYPES.ERROR,
        subtitle: error?.data?.error?.errors[0]?.detail
      })
    );
  }
}

function* fetchOpportunityInfoById(action) {
  const { includeTrends, includeKPIs } = action.payload;
  try {
    yield put(loadingSpinnerStack({ visibility: true, backdropLoader: true }));
    const response = yield call(
      get,
        `${BASE_URL}project-forecast-candidates/${action.payload.projectForecastCandidateId}?includeTrends=${includeTrends}&includeKPIs=${includeKPIs}`
    );
    yield put(setOpportunityInfoById(response?.data?.data?.attributes));
  } catch (error) {
    const errMsg = error?.data?.error?.errors[0]?.detail || error?.data?.error;
    yield put(showToastMessage({ open: true, mode: TOAST_TYPES.ERROR, subtitle: errMsg }));
  } finally {
    yield put(loadingSpinnerStack({ visibility: false, backdropLoader: false }));
  }
}

export default function* watchOpportunitiesSaga() {
  yield takeLatest(
    OpportunitiesActionType.GET_OPPORTUNITY_BY_ID,
    fetchOpportunityById
  );
  yield takeLatest(OpportunitiesActionType.ADD_OPPORTUNITY, addOpportunity);
  yield takeLatest(OpportunitiesActionType.GET_FORECAST_CANDIDATES, getForecastCandidates);
  yield takeLatest(OpportunitiesActionType.DELETE_OPPORTUNITY, deleteOpportunity);
  yield takeLatest(OpportunitiesActionType.EDIT_OPPORTUNITY, editOpportunity);
  yield takeLatest(OpportunitiesActionType.BULK_UPDATE_FORECAST_CANDIDATES, bulkUpdateOpportunity);
  yield takeLatest(OpportunitiesActionType.CHANGE_FORECASTING_TYPE, changeForecastingType);
  yield takeLatest(OpportunitiesActionType.GET_AVAILABLE_PROJECT_LIST, getAvailableProjectList);
  yield takeLatest(OpportunitiesActionType.ADD_AVAILABLE_PROJECT, addAvailableProjectToForecast);
  yield takeLatest(OpportunitiesActionType.GET_MANAGERS_PROGRAM_DROPDOWN, getProgramsandManagers);
  yield takeLatest(OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND, fetchMoreForecastCandidates);
  yield takeLatest(OpportunitiesActionType.GET_CHILD_ACCOUNTS, getChildAccounts);
  yield takeLatest(OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA, getForecastSummarydata);
  yield takeLatest(OpportunitiesActionType.DELETE_CUSTOM_GROUP, deleteCustomGroup);
  yield takeLatest(OpportunitiesActionType.GET_CUSTOM_GROUP_PROJECTS_LIST, getCustomGroupProjectsList);
  yield takeLatest(OpportunitiesActionType.ADD_CUSTOM_GROUP, addCustomGroups);
  yield takeLatest(OpportunitiesActionType.EDIT_CUSTOM_GROUP, editCustomGroups);
  yield takeLatest(OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES, fetchCustomGroupCandidates);
  yield takeLatest(OpportunitiesActionType.GET_OPPORTUNITY_INFO_BY_ID, fetchOpportunityInfoById);
}

