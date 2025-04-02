import { OpportunitiesActionType } from '../types/OpportunitiesActionType';

export const fetchOpportunityByIdSuccess = (opportunity) => ({
  type: OpportunitiesActionType.SET_OPPORTUNITY_BY_ID,
  opportunity
});

export const fetchOpportunityById = (payload) => ({
  type: OpportunitiesActionType.GET_OPPORTUNITY_BY_ID,
  payload
});

export const fetchOpportunityByIdError = (error) => ({
  type: OpportunitiesActionType.GET_OPPORTUNITY_BY_ID_ERROR,
  error
});

export const addOpportunity = (payload) => ({
  type: OpportunitiesActionType.ADD_OPPORTUNITY,
  payload
});

export const setOpportunityError = (payload) => ({
  type: OpportunitiesActionType.SET_OPPORTUNITY_ERROR,
  payload
});

export const addOpportunitySuccess = (payload) => ({
  type: OpportunitiesActionType.ADD_OPPORTUNITY_SUCCESS,
  payload
});

export const getForecastCandidates = (payload) => ({
  type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
  payload
});

export const setForecastCandidates = (payload) => ({
  type: OpportunitiesActionType.SET_FORECAST_CANDIDATES,
  payload
});

export const setForecastCandidatesError = (payload) => ({
  type: OpportunitiesActionType.SET_FORECAST_CANDIDATES_ERROR,
  payload
});

export const setSearchedForecastCanditates = (payload) => ({
  type: OpportunitiesActionType.SET_SEARCHED_FORECAST_CANDIDATES,
  payload
});

export const deleteOpportunity = (payload) => ({
  type: OpportunitiesActionType.DELETE_OPPORTUNITY,
  payload
});

export const bulkUpdateForecastCandidates = (payload) => ({
  type: OpportunitiesActionType.BULK_UPDATE_FORECAST_CANDIDATES,
  payload
});

export const editOpportunity = (payload) => ({
  type: OpportunitiesActionType.EDIT_OPPORTUNITY,
  payload
});

export const setChooseForecastCandidates = (payload) => ({
  type : OpportunitiesActionType.SET_CHOOSE_FORECAST_CANDIDATES,
  payload
});

export const setChooseForecastCandidatesError = (payload) => ({
  type: OpportunitiesActionType.SET_CHOOSE_FORECAST_CANDIDATES_ERROR,
  payload
});

export const setCRUDopSuccess = (payload) => ({
  type: OpportunitiesActionType.DELETE_OPPORTUNITY_SUCCESS,
  payload
});

export const setRoutingSuccess = (payload) => ({
  type: OpportunitiesActionType.ROUTING_SUCCESS,
  payload
});

export const changeForecastingType = (payload) => ({
  type: OpportunitiesActionType.CHANGE_FORECASTING_TYPE,
  payload
});

export const setForecastCandidatesSummaryBanner = (payload) => ({
  type: OpportunitiesActionType.SET_FORECAST_CANDIDATE_BANNER,
  payload
});

export const getAvailableProjectList = (payload) => ({
  type: OpportunitiesActionType.GET_AVAILABLE_PROJECT_LIST,
  payload
});

export const setAvailableProjectList = (payload) => ({
  type: OpportunitiesActionType.SET_AVAILABLE_PROJECT_LIST,
  payload
});

export const setAvailableProjectListError = (payload) => ({
  type: OpportunitiesActionType.SET_AVAILABLE_PROJECT_LIST_ERROR,
  payload
});

export const addAvailableProject = (payload) => ({
  type: OpportunitiesActionType.ADD_AVAILABLE_PROJECT,
  payload
});

export const addAvailableProjectSuccess = (payload) => ({
  type: OpportunitiesActionType.ADD_AVAILABLE_PROJECT_SUCCESS,
  payload
});

export const resetModal = () => ({
  type: OpportunitiesActionType.RESET_MODAL
});

export const getProgramsandManagers = (payload) => ({
  type: OpportunitiesActionType.GET_MANAGERS_PROGRAM_DROPDOWN,
  payload
});

export const setProgramsandManagers = (payload) => ({
  type: OpportunitiesActionType.SET_MANAGERS_PROGRAM_DROPDOWN,
  payload
});

export const setProgramsandManagersError =  (payload) => ({
  type: OpportunitiesActionType.SET_MANAGERS_PROGRAM_DROPDOWN_ERROR,
  payload
});

export const getForecastCandidatesAppend =  (payload) => ({
  type: OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND,
  payload
});

export const getChildAccount = (payload) => ({
  type: OpportunitiesActionType.GET_CHILD_ACCOUNTS,
  payload
});

export const setchildAccount = (payload) => ({
  type: OpportunitiesActionType.SET_CHILD_ACCOUNTS,
  payload
});

export const setchildAccountError = (payload) => ({
  type: OpportunitiesActionType.SET_CHILD_ACCOUNTS_ERROR,
  payload
});

export const getForecastCandidatesSummary = (payload) => ({
  type: OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA,
  payload
});

export const setForecastCandidatesSummary = (payload) => ({
  type: OpportunitiesActionType.SET_FORECAST_CANDIDATES_SUMMARY,
  payload
});

export const setForecastCandidatesSummaryError = (payload) => ({
  type: OpportunitiesActionType.SET_FORECAST_CANDIDATES_SUMMARY_ERROR,
  payload
});

export const deleteCustomGroupAction = (payload) => ({
  type: OpportunitiesActionType.DELETE_CUSTOM_GROUP,
  payload
});

export const getCustomGrpProjectsList = (payload) => ({
  type: OpportunitiesActionType.GET_CUSTOM_GROUP_PROJECTS_LIST,
  payload
});

export const setCustomGrpProjectsList = (payload) => ({
  type: OpportunitiesActionType.SET_CUSTOM_GROUP_PROJECTS_LIST,
  payload
});

export const setCustomGrpProjectsListError = (payload) => ({
  type: OpportunitiesActionType.SET_CUSTOM_GROUP_PROJECTS_LIST_ERROR,
  payload
});

export const addCustomGroups = (payload) => ({
  type: OpportunitiesActionType.ADD_CUSTOM_GROUP,
  payload
});

export const getCustomGroupCandidates = (payload) => ({
  type: OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES,
  payload
});

export const setCustomGroupCandidates = (payload) => ({
  type: OpportunitiesActionType.SET_CUSTOM_GROUP_CANDIDATES,
  payload
});

export const editCustomGroups = (payload) => ({
  type: OpportunitiesActionType.EDIT_CUSTOM_GROUP,
  payload
});

export const getOpportunityInfoById = (payload) => ({
  type: OpportunitiesActionType.GET_OPPORTUNITY_INFO_BY_ID,
  payload
});

export const setOpportunityInfoById = (payload) => ({
  type: OpportunitiesActionType.SET_OPPORTUNITY_INFO_BY_ID,
  payload
});

