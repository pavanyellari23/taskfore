export const MetaDataActionType = {
  GET_LOCATIONS: 'GET_LOCATIONS',
  SET_LOCATIONS: 'SET_LOCATIONS',
  GET_LOCATIONS_ERROR: 'GET_LOCATIONS_ERROR',
  GET_NOTIFICATIONS_LIST: 'GET_NOTIFICATIONS_LIST',
  SET_NOTIFICATIONS_LIST: 'SET_NOTIFICATIONS_LIST',
  GET_NOTIFICATIONS_LIST_ERROR: 'GET_NOTIFICATIONS_LIST_ERROR',
  SET_HANDLE_STALE_OPPORTUNITIES_FLAG: 'SET_HANDLE_STALE_OPPORTUNITIES_FLAG',
  UPDATE_NOTIFICATION_STATUS: 'UPDATE_NOTIFICATION_STATUS',
  UPDATE_NOTIFICATION_STATUS_SUCCESS: 'UPDATE_NOTIFICATION_STATUS_SUCCESS',
  UPDATE_NOTIFICATION_STATUS_ERROR: 'UPDATE_NOTIFICATION_STATUS_ERROR',
  GET_OPPORTUNITY_LOST_REASONS: 'GET_OPPORTUNITY_LOST_REASONS',
  SET_OPPORTUNITY_LOST_REASONS: 'SET_OPPORTUNITY_LOST_REASONS',
  GET_OPPORTUNITY_LOST_REASONS_ERROR: 'GET_OPPORTUNITY_LOST_REASONS_ERROR',
  GET_DELIVERY_TYPE: 'GET_DELIVERY_TYPE',
  SET_DELIVERY_TYPE: 'SET_DELIVERY_TYPE',
  GET_DELIVERY_TYPE_ERROR: 'GET_DELIVERY_TYPE_ERROR',
  GET_BILLING_TYPE: 'GET_BILLING_TYPE',
  SET_BILLING_TYPE: 'SET_BILLING_TYPE',
  GET_BILLING_TYPE_ERROR: 'GET_BILLING_TYPE_ERROR',
  GET_CONTRACTING_ENTITIES: 'GET_CONTRACTING_ENTITIES',
  SET_CONTRACTING_ENTITIES: 'SET_CONTRACTING_ENTITIES',
  GET_CONTRACTING_ENTITIES_ERROR: 'GET_CONTRACTING_ENTITIES_ERROR',
  SET_BILLING_CODES: 'SET_BILLING_CODES',
  GET_BILLING_CODES_ERROR: 'GET_BILLING_CODES_ERROR',
  GET_BILLING_CODES: 'GET_BILLING_CODES',
  GET_CRM_SYNC_ENABLED_STATUS: 'GET_CRM_SYNC_ENABLED_STATUS',
  SET_CRM_SYNC_ENABLED_STATUS: 'SET_CRM_SYNC_ENABLED_STATUS',
  GET_AUTH_USER_ACCOUNTS: 'GET_AUTH_USER_ACCOUNTS',
  SET_AUTH_USER_ACCOUNTS: 'SET_AUTH_USER_ACCOUNTS',
  SET_AUTH_USER_ACCOUNTS_ERROR: 'SET_AUTH_USER_ACCOUNTS_ERROR',
  SET_CURRENCY_LIST: 'SET_CURRENCY_LIST',
  SET_CURRENCY_LIST_RIVISIONS: 'SET_CURRENCY_LIST_RIVISIONS',
  CLEAR_BOOTSTRAP_DATA: 'CLEAR_BOOTSTRAP_DATA',
  SET_SERVICE_PORTFOLIO: 'SET_SERVICE_PORTFOLIO',
  SET_SERVICE_LINE: 'SET_SERVICE_LINE',
  SET_PROVIDERS: 'SET_PROVIDERS',
  GET_SERVICE_PORTFOLIO: 'GET_SERVICE_PORTFOLIO',
  GET_SERVICE_LINE: 'GET_SERVICE_LINE',
  GET_PROVIDERS: 'GET_PROVIDERS',
  GET_SERVICE_LINE_ERROR: 'GET_SERVICE_LINE_ERROR',
  GET_SERVICE_PORTFOLIO_ERROR: 'GET_SERVICE_PORTFOLIO_ERROR',
  GET_PROVIDERS_ERROR: 'GET_PROVIDERS_ERROR',
  GET_ROLES: 'GET_ROLES',
  SET_ROLES: 'SET_ROLES',
  GET_ROLES_ERROR: 'GET_ROLES_ERROR',
  GET_ROLE_GROUPS: 'GET_ROLE_GROUPS',
  SET_ROLE_GROUPS: 'SET_ROLE_GROUPS',
  GET_ROLES_GROUPS_ERROR: 'GET_ROLES_GROUPS_ERROR',
  GET_CLIENT_ROLES: 'GET_CLIENT_ROLES',
  SET_CLIENT_ROLES: 'SET_CLIENT_ROLES',
  GET_CLIENT_ROLES_ERROR: 'GET_CLIENT_ROLES_ERROR',
  GET_RATE_REVISIONS: 'GET_RATE_REVISIONS',
  SET_RATE_REVISIONS: 'SET_RATE_REVISIONS',
  GET_RATE_REVISIONS_ERROR: 'GET_RATE_REVISIONS_ERROR',
  GET_COST_REVISIONS: 'GET_COST_REVISIONS',
  SET_COST_REVISIONS: 'SET_COST_REVISIONS',
  GET_COST_REVISIONS_ERROR: 'GET_COST_REVISIONS_ERROR',
  GET_CURRENCY_DATA: 'GET_CURRENCY_DATA',
  GET_INITIAL_ROLE_DATA: 'GET_INITIAL_ROLE_DATA',
  GET_LOCATION_REVISIONS: 'GET_LOCATION_REVISIONS',
  SET_LOCATION_REVISIONS: 'SET_LOCATION_REVISIONS',
  GET_LOCATION_REVISIONS_ERROR: 'GET_LOCATION_REVISIONS_ERROR',
  SET_PROJECT_MANAGERS: 'SET_PROJECT_MANAGERS',
  GET_PROJECT_MANAGERS_ERROR: 'GET_PROJECT_MANAGERS_ERROR',
  GET_PROJECT_MANAGERS: 'GET_PROJECT_MANAGERS',
  DOWNLOAD_EXCEL: 'DOWNLOAD_EXCEL',
  SET_FEATURE_FLAG: 'SET_FEATURE_FLAG',
  SET_PARENT_ACCOUNT_DROPDOWN: 'SET_PARENT_ACCOUNT_DROPDOWN',
  SET_PARENT_ACCOUNT_DROPDOWN_ERROR: 'SET_PARENT_ACCOUNT_DROPDOWN_ERROR',
  GET_PROGRAM_DROPDOWN: 'GET_PROGRAM_DROPDOWN',
  SET_PROGRAM_DROPDOWN: 'SET_PROGRAM_DROPDOWN',
  SET_PROGRAM_DROPDOWN_ERROR: 'SET_PROGRAM_DROPDOWN_ERROR',
  GET_ACCOUNT_DROPDOWN: 'GET_ACCOUNT_DROPDOWN',
  SET_ACCOUNT_DROPDOWN: 'SET_ACCOUNT_DROPDOWN',
  GET_ACCOUNT_DROPDOWN_ERROR: 'GET_ACCOUNT_DROPDOWN_ERROR',
  GET_FORECAST_CYCLES: 'GET_FORECAST_CYCLES',
  GET_FORECAST_CYCLES_SUCCESS: 'GET_FORECAST_CYCLES_SUCCESS',
  GET_FORECAST_CYCLES_ERROR: 'GET_FORECAST_CYCLES_ERROR',
  GET_ACCOUNT_LOGO: 'GET_ACCOUNT_LOGO',
  SET_ACCOUNT_LOGO: 'SET_ACCOUNT_LOGO',
  GET_ACCOUNT_LOGO_ERROR: 'GET_ACCOUNT_LOGO_ERROR',
  GET_ENTITLEMENT: 'GET_ENTITLEMENT',
  SET_ENTITLEMENT: 'SET_ENTITLEMENT',
  SET_ENTITLEMENT_ERROR: 'SET_ENTITLEMENT_ERROR',
  GET_PARENT_ACCOUNT_OPTIONS: 'GET_PARENT_ACCOUNT_OPTIONS',
  SET_PARENT_ACCOUNT_OPTIONS: 'SET_PARENT_ACCOUNT_OPTIONS',
  GET_PARENT_ACCOUNT_OPTIONS_ERROR: 'GET_PARENT_ACCOUNT_OPTIONS_ERROR',
  MODIFY_SUBMISSION: 'MODIFY_SUBMISSION',
  GET_USER_RESOURCE_LIST: 'GET_USER_RESOURCE_LIST',
  GET_USER_RESOURCE_LIST_SUCCESS: 'GET_USER_RESOURCE_LIST_SUCCESS',
  GET_USER_RESOURCE_LIST_ERROR: 'GET_USER_RESOURCE_LIST_ERROR',
  SET_SALES_STAGE: 'SET_SALES_STAGE',
  GET_SALES_STAGE: 'GET_SALES_STAGE',
  GET_SALES_STAGE_ERROR: 'GET_SALES_STAGE_ERROR',
  GET_PROJECT_SOURCE: 'GET_PROJECT_SOURCE',
  SET_PROJECT_SOURCE: 'SET_PROJECT_SOURCE',
  GET_PROJECT_SOURCE_ERROR : 'GET_PROJECT_SOURCE_ERROR',
  GET_ENTITLEMENT_GRANTS: 'GET_ENTITLEMENT_GRANTS',
  SET_ENTITLEMENT_GRANTS: 'SET_ENTITLEMENT_GRANTS'
};
