import { alphaSort, buildDropDownOption, sortObject } from '@revin-utils/utils';
import { MetaDataActionType } from '../../../src/store/types/MetaDataActionType';
import { getOptionsListForUsers } from 'utils/forecastingCommonFunctions';
import { mapAccounts, updateParentAccounts, mapDropDownData } from './helper';
import { buildBillingCodes, processContractingEntityResponse } from '../../../src/utils/helper';

const INITIAL_STATE = {
  billingTypeData: [],
  deliveryTypeData: [],
  codeTypes: {},
  contractingEntities: [],
  salesStageData: [],
  projectSource: [],
  opportunityLostReasons: [],
  isCRMSyncEnabled: false,
  notifications: {},
  isStaleOpportunityPresent: false,
  authUserAccountList: [],
  authUserAccountListError: null,
  currencyData: {
    list: [],
    revisions: []
  },
  servicePortfolioData: null,
  serviceLines: null,
  providers: null,
  apicodes: null,
  roles: [],
  clientRoles: [],
  roleGroups: [],
  locations: [],
  rateRevisions: null,
  costRevisions: null,
  parentAccounts: [],
  accounts: [],
  programs: [],
  projectManagers: [],
  featureFlag: null,
  forecastCycles: null,
  entitlement: null,
  accountLogo: false,
  userResourceList: [],
  foreCastFilterConditions: {
    parentAccountId: null,
    selectedAccounts: [],
    selectedPrograms: [],
    salesStages: [],
    projectSources: [],
    billingTypesIds: [],
    deliveryTypesIds: [],
    includeCompletedProjects: false,
    projectManagerIds: []
  },
  grantsObject : {}
};

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case MetaDataActionType.SET_OPPORTUNITY_LOST_REASONS:
      return {
        ...state,
        opportunityLostReasons: action.data
      };
    case MetaDataActionType.SET_DELIVERY_TYPE:
      return {
        ...state,
        deliveryTypeData: alphaSort(action.payload, 'description')
      };
    case MetaDataActionType.SET_BILLING_TYPE:
      return {
        ...state,
        billingTypeData: alphaSort(action.payload, 'description')
      };
    case MetaDataActionType.SET_SALES_STAGE:
      return {
        ...state,
        salesStageData: mapDropDownData(sortObject(action.payload))
      };
    case MetaDataActionType.SET_PROJECT_SOURCE:
      return {
        ...state,
        projectSource: mapDropDownData(sortObject(action.payload))
      };
    case MetaDataActionType.SET_BILLING_CODES:
      return {
        ...state,
        billingCodes: buildBillingCodes(action.payload)
      };
    case MetaDataActionType.SET_CONTRACTING_ENTITIES:
      return {
        ...state,
        contractingEntities: processContractingEntityResponse(action?.data)
      };
    case MetaDataActionType.SET_CRM_SYNC_ENABLED_STATUS:
      return {
        ...state,
        isCRMSyncEnabled: action.payload
      };
    case MetaDataActionType.SET_NOTIFICATIONS_LIST:
      return {
        ...state
        // @todo : commenting this code, because getOpportunities function getting undefined in Topbar from utils-web-app, 
        // this needs to be addressed in future
        // notifications: filterNotifications(action.data)
      };
    case MetaDataActionType.SET_HANDLE_STALE_OPPORTUNITIES_FLAG:
      return {
        ...state,
        isStaleOpportunityPresent: true
      };
    case MetaDataActionType.SET_AUTH_USER_ACCOUNTS:
      return {
        ...state,
        authUserAccountList: mapAccounts(alphaSort(action.payload, 'name')),
        authUserAccountListError: null
      };
    case MetaDataActionType.SET_AUTH_USER_ACCOUNTS_ERROR:
      return {
        ...state,
        authUserAccountList: [],
        authUserAccountListError: action.payload
      };
    case MetaDataActionType.SET_CURRENCY_LIST:
      return {
        ...state,
        currencyData: {
          ...state.currencyData,
          list: action?.payload?.data?.data?.map((item) => ({
            ...item.attributes,
            description: item.attributes.currencyCode,
            id: item.id,
            label: item.attributes.currencyCode
          }))
        }
      };
    case MetaDataActionType.SET_CURRENCY_LIST_RIVISIONS:
      return {
        ...state,
        currencyData: {
          ...state.currencyData,
          revisions: action?.payload?.data?.data?.attributes?.currencyRates
        }
      };
    case MetaDataActionType.SET_SERVICE_PORTFOLIO: {
      return {
        ...state,
        servicePortfolioData: alphaSort(action.payload, 'description')
      };
    };
    case MetaDataActionType.SET_SERVICE_LINE: {
      return {
        ...state,
        serviceLines: alphaSort(action.payload, 'description')
      };
    };
    case MetaDataActionType.SET_PROVIDERS: {
      return {
        ...state,
        providers: alphaSort(action.payload, 'description')
      };
    };
    case MetaDataActionType.SET_ROLES:
      return {
        ...state,
        roles: buildDropDownOption(action.payload, 'attributes.description')
      };
    case MetaDataActionType.SET_CLIENT_ROLES:
      return {
        ...state,
        clientRoles: buildDropDownOption(
          action.payload,
          'attributes.description'
        )
      };
    case MetaDataActionType.SET_ROLE_GROUPS:
      return {
        ...state,
        roleGroups: buildDropDownOption(
          action.payload,
          'attributes.value',
          'attributes.code'
        )
      };
    case MetaDataActionType.SET_RATE_REVISIONS:
      return {
        ...state,
        rateRevisions: action.payload
      };
    case MetaDataActionType.SET_COST_REVISIONS:
      return {
        ...state,
        costRevisions: action.payload
      };
    case MetaDataActionType.SET_ACCOUNT_DROPDOWN:
      return {
        ...state,
        accounts: action.payload
      };
    case MetaDataActionType.GET_ACCOUNT_DROPDOWN_ERROR:
      return {
        ...state,
        accounts: []
      };
    case MetaDataActionType.SET_PROGRAM_DROPDOWN:
      return {
        ...state,
        programs: action.payload
      };
    case MetaDataActionType.SET_PROGRAM_DROPDOWN_ERROR:
      return {
        ...state,
        programs: []
      };
    case MetaDataActionType.SET_LOCATIONS:
      return {
        ...state,
        locations: buildDropDownOption(
          action.payload,
          'attributes.value',
          'attributes.code'
        )
      };
    case MetaDataActionType.SET_FEATURE_FLAG:
      return {
        ...state,
        featureFlag: action.payload
      };
    case MetaDataActionType.SET_PROGRAM_SEARCH:
      return {
        ...state,
        programs: action.payload
      };
    case MetaDataActionType.SET_PROJECT_MANAGERS:
      return {
        ...state,
        projectManagers: alphaSort(action.data, 'label')
      };
    case MetaDataActionType.SET_LOCATION_REVISIONS:
      return {
        ...state,
        locationRevisions: action.payload
      };
    case MetaDataActionType.SET_ENTITLEMENT:
      return {
        ...state,
        entitlement: action.payload
      };
    case MetaDataActionType.GET_FORECAST_CYCLES_SUCCESS:
      return {
        ...state,
        forecastCycles: action.payload
      };
    case MetaDataActionType.GET_FORECAST_CYCLES_ERROR:
      return {
        ...state,
        forecastCycles: null
      };
    case MetaDataActionType.SET_ACCOUNT_LOGO:
      return {
        ...state,
        accountLogo: action.payload
      };
    case MetaDataActionType.GET_ACCOUNT_LOGO_ERROR:
      return {
        ...state,
        accountLogo: ''
      };
    case MetaDataActionType.SET_PARENT_ACCOUNT_OPTIONS:
      return {
        ...state,
        parentAccounts: action.payload
      };
    case MetaDataActionType.SET_ENTITLEMENT_GRANTS:
      return {
        ...state,
        grantsObject: action.payload
      }; 
    case MetaDataActionType.MODIFY_SUBMISSION:
      return {
        ...state,
        parentAccounts: updateParentAccounts(state.parentAccounts, action.payload)
      };
    case MetaDataActionType.GET_USER_RESOURCE_LIST_SUCCESS:
      return {
        ...state,
        userResourceList: getOptionsListForUsers(action.payload)
      };

    default:
      return { ...state };
  }
};

export default reducer;
