import { OpportunitiesActionType } from '../types/OpportunitiesActionType';

const INITIAL_STATE = {
  no_pm_opportunities: [],
  forecast_candidates: [],
  searched_forecast_candidates: [],
  new_adhoc_opportunity: {},
  forecast_candidates_data: {
    forecastCandidates: [],
    forecastCandidatesSummaryOverview: {},
    totalCandidateCount: 0
  },
  forecast_candidates_summary_data: {},
  crud_flags: {
    isDeleted: false,
    isEdited: false,
    isCreated: false
  },
  routing_flags: {
    isBulkSuccess: false,
    isChangeForecastSuccess: false
  },
  otherProjectList: [],
  otherProjectListError: null,
  managers: [],
  programs: [],
  child_accounts: [],
  customGroupProjectsList: [],
  custom_grouped_candidates : [],
  customGroupProjectsListError: null,
  opportunityInfoById: null
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case OpportunitiesActionType.ADD_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        new_adhoc_opportunity: action.payload
      };
    case OpportunitiesActionType.ADD_OPPORTUNITY_FAILED:
      return {
        ...state,
        opportunityManualStageChangeErrorMessage: '',
        flags: {
          ...state.flags,
          opportunityStatus: OpportunitiesActionType.ADD_OPPORTUNITY_FAILED,
          opportunityCreated: false,
          opportunityManualStageChanged: false,
          opportunityManualStageChangeError: false
        }
      };
    case OpportunitiesActionType.CLEAR_OPPORTUNITY_DATA:
      return {
        ...state,
        list: [],
        opportunityCount: 0
      };
    case OpportunitiesActionType.SET_OPPORTUNITY_BY_ID:
      return {
        ...state
      };
    case OpportunitiesActionType.SET_OPPORTUNITY_ERROR:
      return {
        ...state,
        opportunityError: action.payload
      };
    case OpportunitiesActionType.SET_SEARCHED_FORECAST_CANDIDATES:
      return {
        ...state,
        searched_forecast_candidates: action.payload
      };
    case OpportunitiesActionType.SET_FORECAST_CANDIDATES:
      return {
        ...state,
        forecast_candidates: action.payload
      };
    case OpportunitiesActionType.SET_FORECAST_CANDIDATES_ERROR:
      return {
        ...state,
        choose_forecast_candidates: []
      };
    case OpportunitiesActionType.SET_CHOOSE_FORECAST_CANDIDATES:
      return {
        ...state,
        forecast_candidates_data: {...action.payload}
      };
    case OpportunitiesActionType.DELETE_OPPORTUNITY_SUCCESS:
      return {
        ...state,
        crud_flags: { ...action.payload }
      };
    case OpportunitiesActionType.SET_AVAILABLE_PROJECT_LIST:
      return {
        ...state,
        otherProjectList: action.payload,
        otherProjectListError: null
      };
    case OpportunitiesActionType.SET_AVAILABLE_PROJECT_LIST_ERROR:
      return {
        ...state,
        otherProjectList: [],
        otherProjectListError: action.payload
      };
    case OpportunitiesActionType.ADD_AVAILABLE_PROJECT_SUCCESS:
      return {
        ...state,
        crud_flags: { ...action.payload }
      };
    case OpportunitiesActionType.RESET_MODAL:
      return {
        ...state,
        otherProjectListError: null,
        otherProjectList: []
      };
    case OpportunitiesActionType.ROUTING_SUCCESS:
      return {
        ...state,
        routing_flags: action.payload
      };
    case OpportunitiesActionType.SET_MANAGERS_PROGRAM_DROPDOWN:
      return {
        ...state,
        managers: action.payload.managers,
        programs: action.payload.programs
      };
    case OpportunitiesActionType.SET_MANAGERS_PROGRAM_DROPDOWN_ERROR:
      return {
        ...state,
        managers: [],
        programs: []
      };
    case OpportunitiesActionType.SET_CHILD_ACCOUNTS:
      return {
        ...state,
        child_accounts: action.payload
      };
    case OpportunitiesActionType.SET_CHILD_ACCOUNTS_ERROR:
      return {
        ...state,
        child_accounts: []
      };
    case OpportunitiesActionType.SET_FORECAST_CANDIDATES_SUMMARY:
      return {
        ...state,
        forecast_candidates_summary_data: action.payload
      };
    case OpportunitiesActionType.SET_CUSTOM_GROUP_PROJECTS_LIST:
      return {
        ...state,
        customGroupProjectsList: action.payload,
        customGroupProjectsListError: null
      };
    case OpportunitiesActionType.SET_CUSTOM_GROUP_CANDIDATES:
      return {
        ...state,
        custom_grouped_candidates: action.payload
      };
    case OpportunitiesActionType.SET_CUSTOM_GROUP_PROJECTS_LIST_ERROR:
      return {
        ...state,
        customGroupProjectsList: [],
        customGroupProjectsListError: action.payload
      };
    case OpportunitiesActionType.SET_OPPORTUNITY_INFO_BY_ID:
      return {
        ...state,
        opportunityInfoById: action.payload
      };
    default:
      return { ...state };
  }
};

export default reducer;
