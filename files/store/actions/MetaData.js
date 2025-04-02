import { MetaDataActionType } from '../../../src/store/types/MetaDataActionType';

export const getBillingCodes = (payload) => ({
  type: MetaDataActionType.GET_BILLING_CODES,
  payload
});

export const setBillingCodes = (payload) => ({
  type: MetaDataActionType.SET_BILLING_CODES,
  payload
});

export const getBillingCodesError = (error) => ({
  type: MetaDataActionType.GET_BILLING_CODES_ERROR,
  error
});

export const getNotificationsList = (payload) => ({
  type: MetaDataActionType.GET_NOTIFICATIONS_LIST,
  payload
});

export const handleStaleOpportunities = (payload) => ({
  type: MetaDataActionType.SET_HANDLE_STALE_OPPORTUNITIES_FLAG,
  payload
});

export const updateNotificationStatusBulk = (payload) => ({
  type: MetaDataActionType.UPDATE_NOTIFICATION_STATUS,
  payload
});

export const getLocations = (payload) => ({
  type: MetaDataActionType.GET_LOCATIONS,
  payload
});

export const setLocations = (payload) => ({
  type: MetaDataActionType.SET_LOCATIONS,
  payload
});

export const getLocationsError = (error) => ({
  type: MetaDataActionType.GET_LOCATIONS_ERROR,
  error
});

export const setNotificationsList = (data) => ({
  type: MetaDataActionType.SET_NOTIFICATIONS_LIST,
  data
});

export const getNotificationsListError = (error) => ({
  type: MetaDataActionType.GET_NOTIFICATIONS_LIST_ERROR,
  error
});

export const updateNotificationStatusError = (error) => ({
  type: MetaDataActionType.UPDATE_NOTIFICATION_STATUS_ERROR,
  error
});

export const updateNotificationStatusSuccess = (data) => ({
  type: MetaDataActionType.UPDATE_NOTIFICATION_STATUS_SUCCESS,
  data
});

export const getOpportunityLostReasons = (payload) => ({
  type: MetaDataActionType.GET_OPPORTUNITY_LOST_REASONS,
  payload
});

export const setOpportunityLostReasons = (data) => ({
  type: MetaDataActionType.SET_OPPORTUNITY_LOST_REASONS,
  data
});

export const getOpportunityLostReasonsError = (error) => ({
  type: MetaDataActionType.GET_OPPORTUNITY_LOST_REASONS_ERROR,
  error
});

export const getDeliveryType = (payload) => ({
  type: MetaDataActionType.GET_DELIVERY_TYPE,
  payload
});

export const setDeliveryType = (payload) => ({
  type: MetaDataActionType.SET_DELIVERY_TYPE,
  payload
});

export const getDeliveryTypeError = (error) => ({
  type: MetaDataActionType.GET_DELIVERY_TYPE_ERROR,
  error
});

export const getBillingType = (payload) => ({
  type: MetaDataActionType.GET_BILLING_TYPE,
  payload
});

export const setBillingType = (payload) => ({
  type: MetaDataActionType.SET_BILLING_TYPE,
  payload
});

export const getBillingTypeError = (error) => ({
  type: MetaDataActionType.GET_BILLING_TYPE_ERROR,
  error
});

export const getCurrencyData = (data) => ({
  type: MetaDataActionType.GET_CURRENCY_DATA,
  data
});

export const setCurrencyList = (payload) => ({
  type: MetaDataActionType.SET_CURRENCY_LIST,
  payload
});

export const setCurrencyListRivisions = (payload) => ({
  type: MetaDataActionType.SET_CURRENCY_LIST_RIVISIONS,
  payload
});

export const clearBootStrapData = (payload) => ({
  type: MetaDataActionType.CLEAR_BOOTSTRAP_DATA,
  payload
});

export const getServicePortfolio = (payload) => ({
  type: MetaDataActionType.GET_SERVICE_PORTFOLIO,
  payload
});

export const setServicePortfolio = (payload) => ({
  type: MetaDataActionType.SET_SERVICE_PORTFOLIO,
  payload
});

export const getServiceLine = (payload) => ({
  type: MetaDataActionType.GET_SERVICE_LINE,
  payload
});

export const setServiceLine = (payload) => ({
  type: MetaDataActionType.SET_SERVICE_LINE,
  payload
});

export const getProviders = (payload) => ({
  type: MetaDataActionType.GET_PROVIDERS,
  payload
});

export const setProviders = (payload) => ({
  type: MetaDataActionType.SET_PROVIDERS,
  payload
});

export const setServicePortfolioError = (payload) => ({
  type: MetaDataActionType.GET_SERVICE_PORTFOLIO_ERROR,
  payload
});

export const setServiceLineError = (payload) => ({
  type: MetaDataActionType.GET_SERVICE_LINE_ERROR,
  payload
});

export const setProvidersError = (payload) => ({
  type: MetaDataActionType.GET_PROVIDERS_ERROR,
  payload
});

export const getRoles = (payload) => ({
  type: MetaDataActionType.GET_ROLES,
  payload
});

export const setRoles = (payload) => ({
  type: MetaDataActionType.SET_ROLES,
  payload
});

export const getRoleError = (error) => ({
  type: MetaDataActionType.GET_ROLES_ERROR,
  error
});

export const getRoleGroups = (payload) => ({
  type: MetaDataActionType.GET_ROLE_GROUPS,
  payload
});

export const setRoleGroups = (payload) => ({
  type: MetaDataActionType.SET_ROLE_GROUPS,
  payload
});

export const getRoleGroupsError = (error) => ({
  type: MetaDataActionType.GET_ROLES_GROUPS_ERROR,
  error
});

export const getClientRoles = (payload) => ({
  type: MetaDataActionType.GET_CLIENT_ROLES,
  payload
});

export const setClientRoles = (payload) => ({
  type: MetaDataActionType.SET_CLIENT_ROLES,
  payload
});

export const getClientRolesError = (error) => ({
  type: MetaDataActionType.GET_CLIENT_ROLES_ERROR,
  error
});

export const getRateRevisions = (payload) => ({
  type: MetaDataActionType.GET_RATE_REVISIONS,
  payload
});

export const setRateRevisions = (payload) => ({
  type: MetaDataActionType.SET_RATE_REVISIONS,
  payload
});

export const getRateRevisionsError = (error) => ({
  type: MetaDataActionType.GET_RATE_REVISIONS_ERROR,
  error
});

export const getCostRevisions = (payload) => ({
  type: MetaDataActionType.GET_COST_REVISIONS,
  payload
});

export const setCostRevisions = (payload) => ({
  type: MetaDataActionType.SET_COST_REVISIONS,
  payload
});

export const getCostRevisionsError = (error) => ({
  type: MetaDataActionType.GET_COST_REVISIONS_ERROR,
  error
});

export const getProjectManagerSuccess = (data) => ({
  type: MetaDataActionType.SET_PROJECT_MANAGERS,
  data
});

export const getProjectMangerError = (payload) => ({
  type: MetaDataActionType.GET_PROJECT_MANAGERS_ERROR,
  payload
});

export const getProjectManger = (payload) => ({
  type: MetaDataActionType.GET_PROJECT_MANAGERS,
  payload
});

export const getInitialRoleDataAction = (payload) => ({
  type: MetaDataActionType.GET_INITIAL_ROLE_DATA,
  payload
});

export const getLocationRevisionsAction = (payload) => ({
  type: MetaDataActionType.GET_LOCATION_REVISIONS,
  payload
});

export const setLocationRevisionsAction = (payload) => ({
  type: MetaDataActionType.SET_LOCATION_REVISIONS,
  payload
});

export const getLocationRevisionsActionError = (error) => ({
  type: MetaDataActionType.GET_LOCATION_REVISIONS_ERROR,
  error
});

export const downloadExcel = (payload) => ({
  type: MetaDataActionType.DOWNLOAD_EXCEL,
  payload
});

export const setFeatureFlag = (payload) => ({
  type: MetaDataActionType.SET_FEATURE_FLAG,
  payload
});

export const setParentAccountDropdown = (payload) => ({
  type: MetaDataActionType.SET_PARENT_ACCOUNT_DROPDOWN,
  payload
});

export const setParentAccountDropdownError = (payload) => ({
  type: MetaDataActionType.SET_PARENT_ACCOUNT_DROPDOWN_ERROR,
  payload
});

export const getProgramDropdown = (payload) => ({
  type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
  payload
});

export const setProgramDropdown = (payload) => ({
  type: MetaDataActionType.SET_PROGRAM_DROPDOWN,
  payload
});

export const setProgramDropdownError = (error) => ({
  type: MetaDataActionType.SET_PROGRAM_DROPDOWN_ERROR,
  error
});

export const setAccountDropdown = (payload) => ({
  type: MetaDataActionType.SET_ACCOUNT_DROPDOWN,
  payload
});

export const getAccountDropdown = (payload) => ({
  type: MetaDataActionType.GET_ACCOUNT_DROPDOWN,
  payload
});

export const getAccountDropdownError = (payload) => ({
  type: MetaDataActionType.GET_ACCOUNT_DROPDOWN_ERROR,
  payload
});

export const getForecastCyclesAction = (payload) => ({
  type: MetaDataActionType.GET_FORECAST_CYCLES,
  payload
});

export const getForecastCyclesSuccessAction = (payload) => ({
  type: MetaDataActionType.GET_FORECAST_CYCLES_SUCCESS,
  payload
});

export const getForecastCyclesErrorAction = (payload) => ({
  type: MetaDataActionType.GET_FORECAST_CYCLES_ERROR,
  payload
});

export const getAccountLogo = (payload) => ({
  type: MetaDataActionType.GET_ACCOUNT_LOGO,
  payload
});

export const setAccountLogo = (payload) => ({
  type: MetaDataActionType.SET_ACCOUNT_LOGO,
  payload
});

export const setAccountLogoError = (payload) => ({
  type: MetaDataActionType.GET_ACCOUNT_LOGO_ERROR,
  payload
});

export const getEntitlements = () => ({
  type: MetaDataActionType.GET_ENTITLEMENT
});

export const setEntitlements = (payload) => ({
  type: MetaDataActionType.SET_ENTITLEMENT,
  payload
});

export const setEntitlementsError = (payload) => ({
  type: MetaDataActionType.SET_ENTITLEMENT_ERROR,
  payload
});

export const getParentAccountOptionsAction = (payload) => ({
  type: MetaDataActionType.GET_PARENT_ACCOUNT_OPTIONS,
  payload
});

export const getEntitlementsGrantsAction = (payload) => ({
  type: MetaDataActionType.GET_ENTITLEMENT_GRANTS,
  payload
});

export const setEntitlementsGrantsAction = (payload) => ({
  type: MetaDataActionType.SET_ENTITLEMENT_GRANTS,
  payload
});

export const setParentAccountOptionsAction = (payload) => ({
  type: MetaDataActionType.SET_PARENT_ACCOUNT_OPTIONS,
  payload
});

export const getParentAccountOptionsErrorAction = (payload) => ({
  type: MetaDataActionType.GET_PARENT_ACCOUNT_OPTIONS_ERROR,
  payload
});

export const modifySubmissionAction = (payload) => ({
  type: MetaDataActionType.MODIFY_SUBMISSION,
  payload
});

export const getUserResourceListAction = (payload) => ({
  type: MetaDataActionType.GET_USER_RESOURCE_LIST,
  payload
});

export const getUserResourceListSuccessAction = (payload) => ({
  type: MetaDataActionType.GET_USER_RESOURCE_LIST_SUCCESS,
  payload
});

export const getUserResourceListErrorAction = (payload) => ({
  type: MetaDataActionType.GET_USER_RESOURCE_LIST_ERROR,
  payload
});

export const setSalesStage = (payload) => ({
  type: MetaDataActionType.SET_SALES_STAGE,
  payload
});

export const getSalesStageError = (error) => ({
  type: MetaDataActionType.GET_SALES_STAGE_ERROR,
  error
});

export const getSalesStage = (data) => ({
  type: MetaDataActionType.GET_SALES_STAGE,
  data
});

export const getProjectSource = (data) => ({
  type: MetaDataActionType.GET_PROJECT_SOURCE,
  data
});

export const getProjectSourceError = (error) => ({
  type: MetaDataActionType.GET_PROJECT_SOURCE_ERROR,
  error
});

export const setProjectSource = (payload) => ({
  type: MetaDataActionType.SET_PROJECT_SOURCE,
  payload
});
