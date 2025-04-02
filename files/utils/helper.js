import { alphaSort, preciseNumberFormatter } from '@revin-utils/utils';
import _forEach from 'lodash/forEach';
import _cloneDeep from 'lodash/cloneDeep';
import _isNil from 'lodash/isNil';
import moment from 'moment-mini';
import { GENERIC_ERROR_MESSAGE, PROBABILITY_MODAL, 
  DATE_FORMAT, DESCRIPTION, PROJECT_FORECASTING_BREADCRUMBS, 
  FORECASTING_SELECTION_ROUTE, FORECAST_DELIVERY_TYPE, 
  INITIAL_OPP_STAGE, MANAGERS, OPP_CURR_SITUTATION, OPP_STATE, 
  OPP_TYPE, PROJECT_LEVEL_FORECAST, RESOURCE_LEVEL_FORECAST, 
  DATE_ERRORMSGS, CONST_ROW_VALUES, RESOURCE_PROJECT_LEVEL_SUMMARY, 
  ACCOUNT_LEVEL_SUMMARY, KPI_HEADER, MONTHS_STRING, 
  FORECASTING_HOME, FORECAST_BILLING_TYPE, 
  OPPORTUNITY_SOURCE,
  PROJECT_FORECASTING_TYPE,
  BILLING_DROPDOWN} from '../../src/utils/constants';
import { MESSAGES } from './messages';
import _uniqBy from 'lodash/uniqBy';
import {isPastPeriodAndPNL} from './forecastingCommonFunctions';
export const buildBillingCodes = (codes) => {
  const codeArr = [];
  if (!codeArr) {
    return codeArr;
  }

  for (const [codeId, billingTypes] of Object.entries(codes?.data?.data?.BLLNG_TYP)) {
    codeArr.push([
      codeId,
      alphaSort(billingTypes, DESCRIPTION).map((code) => ({
        ...code,
        id: code.codeId,
        label: code.description,
        level: code.description
      }))
    ]);
  }

  return codeArr;
};

export const mapCodesData = (codesData, codeType) => {
  return codesData[codeType]?.map((code) => ({
    ...code,
    id: code.codeId,
    label: code.description,
    level: code.description
  }));
};

export const sortCodeTypes = (codeTypes) => {
  if (codeTypes) {
    _forEach(codeTypes, (delivery, type) => {
      codeTypes[type] = alphaSort(delivery, DESCRIPTION);
    });
  }
  return codeTypes;
};

export const processContractingEntityResponse = (data) => {
  const contractingEntities = [];
  for (const entityCount in data) {
    const entity = data[entityCount]?.attributes;
    contractingEntities.push({
      ...entity,
      id: entity?.code,
      label: entity?.value
    });
  }
  return alphaSort(contractingEntities, 'label');
};

export const retrieveProjectManagerIds = (projectManagers) => {
  return projectManagers?.map((pm) => (pm.id));
};

export const retrieveActiveApproverIds = (activeApprovals) => {
  return activeApprovals?.map((activeApprovals) => (activeApprovals?.userDTO?.id));
};

export const retrieveAccountIds = (accounts) => {
  return accounts?.map((account) => (account?.id));
};

export const removeDuplicate = (keys, arr) => {
  return arr.filter((s => o => (k => !s.has(k) && s.add(k))(keys.map(k => o[k]).join('|')))
  (new Set)
  );
};

export const handleBreadcrumbClick = (label, accountId, history, opportunityId = null) => {
  switch (label) {
    case MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME:
      history.push(`/${FORECASTING_HOME}`);
      break;
    case MESSAGES.RESOURCE_FORECASTING_SUMMARY_SELECTION:
      history.push(`/${accountId}`);
      break;
    case MESSAGES.RESOURCE_FORECASTING_SUMMARY_CHOOSE:
      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountId}/`);
      break;
    case PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_RESOURCE_LEVEL:
      if (opportunityId !== null) {
        history.push(`/${accountId}/resource-forecasting/${opportunityId}`);
      }
      break;
    case PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_PROJECT_LEVEL:
      if (opportunityId !== null) {
        history.push(`/${accountId}/project-forecasting/${opportunityId}`);
      }
      break;
    case PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_ACCOUNT_LEVEL:
      history.push(`/account-forecasting/${accountId}`);
      break;
    default:
      break;
  };
};

export const forecastType = (label) => {
  switch (label) {
    case FORECAST_DELIVERY_TYPE.STAFF_AUGMENTATION:
    case FORECAST_DELIVERY_TYPE.MANAGED_SERVICES:
    case FORECAST_DELIVERY_TYPE.MANAGED_CAPACITY:
      return RESOURCE_LEVEL_FORECAST;
    case FORECAST_DELIVERY_TYPE.OUTCOME_BASED:
    case FORECAST_DELIVERY_TYPE.FIXED_BID:
    case FORECAST_BILLING_TYPE.PER_UNIT:
    case FORECAST_BILLING_TYPE.MILESTONE_BASED:
      return PROJECT_LEVEL_FORECAST;
    default:
      return RESOURCE_LEVEL_FORECAST;
  }
};

export const buildAddOppportunityPayload = (payloadData, dates, projectManagers) => {
  return {
    'data': {
      'type': 'opportunities',
      'attributes': {
        'projectManagerIds': projectManagers.map((item) => (item.id)),
        'type': OPP_TYPE.AD_HOC,
        'state': OPP_STATE,
        'stage': INITIAL_OPP_STAGE,
        'accountId': payloadData?.account,
        'currentSituation': OPP_CURR_SITUTATION,
        'programId': payloadData?.program,
        'primaryInfo': {
          'projectName': payloadData.projectName,
          'needOrPotentialSolution': payloadData?.needOrPotentialSolution,
          'description': payloadData?.description,
          'deliveryType': payloadData.deliveryType,
          'billingType': payloadData.billingType,
          'estimatedRevenue': payloadData?.estRevenue,
          'estimatedRevenueCurrencyCode': payloadData?.estRevenueCurrency,
          'services': payloadData?.services,
          'estimatedClosureDate': dates?.estClosureDate,
          'estimatedStartDate': dates?.estStartDate,
          'estimatedEndDate': dates?.estEndDate,
          'estimatedCost': payloadData?.estCost,
          'estimatedCostCurrencyCode': payloadData?.estCostCurrency
        },
        'meddpicc': {},
        'prospectInfo': {}
      }
    }
  };
};

export const getFilteredDropDownData = (metaData, data, dataTobeFiltered, relationType, relationFilter) => {
  return metaData[data]?.filter(item => item?.codeId === relationFilter || item?.description === relationFilter)[0]
    ?.relations[relationType].map(ditem => {
      return metaData[dataTobeFiltered]?.filter((bitem) => ditem === bitem?.codeValue)[0];
    });
};

export const getManagersPayload = (accounts) => {
  let entityRoles = [];
  if (typeof accounts === 'string') {
    entityRoles = [
      {
        roleName: MANAGERS.ACCOUNT,
        entityId: accounts,
        entityType: MANAGERS.ENTITY
      },
      {
        roleName: MANAGERS.PROJECT,
        entityId: accounts,
        entityType: MANAGERS.ENTITY
      }
    ];
  } else {
    entityRoles = accounts?.map(account => {
      return ({
        roleName: MANAGERS.ACCOUNT,
        entityId: account.id,
        entityType: MANAGERS.ENTITY
      },
      {
        roleName: MANAGERS.PROJECT,
        entityId: account.id,
        entityType: MANAGERS.ENTITY
      });
    });
  }
  return {
    entityRoles
  };
};

export const dateValidation = (label, date, dates, setErrorText) => {
  switch (label) {
    case 'estStartDate':
      moment(date) > moment(dates.estEndDate)
        ? setErrorText(DATE_ERRORMSGS.startDateGreater) : setErrorText('');
      break;
    case 'estEndDate': moment(date) < moment(dates.estStartDate) ? setErrorText(DATE_ERRORMSGS.endDateGreaterThanstartDate)
      : setErrorText('');
      break;
    default:
      break;
  }
};

const createHeaderData = (item) => {
  const headerColumn = {
    name: !item?.quarter ? item?.periodId?.toString()?.slice(0, 4) : `${item?.quarter?.slice(4)}-${parseInt(item?.quarter?.slice(0, 4)) % 100}`,
    type: item?.year ? 'header' : 'month',
    dynamicClasses: item?.quarter ? ['quarter-value-cell'] : []
  };
  return item?.year ? headerColumn : { ...headerColumn, subName: MONTHS_STRING[parseInt(item?.periodId?.toString()?.slice(-2)) - 1] };
};

export const getSummaryGridData = (summaryData, isAccountLevel = false, setkpiTableRowData, setkpiTableHeader) => {
  const tableHeader = [KPI_HEADER];
  const gridData = isAccountLevel ? ACCOUNT_LEVEL_SUMMARY : RESOURCE_PROJECT_LEVEL_SUMMARY;
  const clonedgridData = _cloneDeep(gridData);
  summaryData?.forEach((summaryItem) => {
    clonedgridData.forEach(item => {
      if (item[0]?.uid) {
        item?.push({
          ...CONST_ROW_VALUES,
          value: item[0]?.isPercentage ?
            `${preciseNumberFormatter(isAccountLevel ? summaryItem[item[0]?.accountUid] ?? summaryItem[item[0]?.uid] : summaryItem[item[0]?.uid], { isPercentage: true, showPercentageSign: true, isDoublePrecision: true})}` :
            preciseNumberFormatter(isAccountLevel ? summaryItem[item[0]?.accountUid] ?? summaryItem[item[0]?.uid] : summaryItem[item[0]?.uid], { info: summaryItem }),
          isPastPeriod : isPastPeriodAndPNL(summaryItem),
          dynamicClasses: summaryItem?.quarter ? ['quarter-value-cell'] : []
        });
      }
    });
    tableHeader.push(createHeaderData(summaryItem));
  });
  setkpiTableRowData(clonedgridData);
  setkpiTableHeader(tableHeader);
};

export const getCurrentFinancialYear = (projectFinancialYearSummary) => {
  if (projectFinancialYearSummary && Array.isArray(projectFinancialYearSummary)) {
    return projectFinancialYearSummary.find(year => year.currentFY);
  }
  return null;
};

export const getProgramArray = (selectedIds, programs = []) => {
  if (!(selectedIds.find(item => item.id === 'All'))) {
    return selectedIds.map(item => item.id);
  } else {
    return programs?.filter(filterData => filterData.id != 'All').map(item => item.id);
  }
};

export const getAccountEntityCodeArray = (selectedIds, accounts = []) => {
  if (!(selectedIds.find(item => item.id === 'All'))) {
    return selectedIds.map(item => item.attributes?.entityCode);
  } else {
    return accounts?.filter(filterData => filterData.id != 'All').map(item => item.attributes.entityCode);
  }
};

export const getAccountIdArray = (selectedIds, accounts = []) => {
  if (!(selectedIds.find(item => item.id === 'All'))) {
    return selectedIds.map(item => item.id);
  } else {
    return accounts?.filter(filterData => filterData.id != 'All').map(item => item.attributes.id);
  }
};

export const mappedAddProjectInfo = (project) => {

  const { data, error } = project;

  const managers = (data?.projectManagerDetails || []).map(({ projectManagerName, projectManagerAvatarUrl }) => {
    return {
      firstName: projectManagerName?.split(' ')[0],
      lastName: projectManagerName?.split(' ')[1],
      name: projectManagerName,
      image: projectManagerAvatarUrl
    };
  });

  return {
    projectName: data?.projectName,
    projectCode: data?.projectCode || '',
    details: [
      {
        value: !_isNil(data?.financialYearMRRTotal) ? data?.financialYearMRRTotal?.toLocaleString() : '--',
        label: `MRR (FY${moment(data?.currentFY).format('YY')})`
      },
      {
        value: !_isNil(data?.totalContractValue) ? data?.totalContractValue?.toLocaleString() : '--',
        label: PROBABILITY_MODAL.TCV_LABEL
      },
      {
        value: !_isNil(data?.crmProbability) ? data?.crmProbability?.toLocaleString() : '--',
        label: PROBABILITY_MODAL.PROBABILITY_LABEL
      }
    ],
    dates: [
      {
        value: data?.opportunityStage,
        label: PROBABILITY_MODAL.SALES_STAGE_LABEL
      },
      {
        value: data?.projectStartDate ? moment(data?.projectStartDate?.toLocaleString()).format(DATE_FORMAT.FORMAT_9) : '--',
        label: PROBABILITY_MODAL.START_DATE_LABEL
      },
      {
        value: data?.projectEndDate ? moment(data?.projectEndDate?.toLocaleString()).format(DATE_FORMAT.FORMAT_9) : '--',
        label: PROBABILITY_MODAL.END_DATE_LABEL
      }
    ],
    projectManagers: managers,
    error: !_isNil(error) ? (error?.errors[0]?.detail || GENERIC_ERROR_MESSAGE) : null,
    isProjectInfoAvailable: true
  };
};

export const billingTypeDropDown = (deliveryType, billingType, projectSource, metaData) => {
  const formatBillingType = (description) => ({
    label: description === PROJECT_FORECASTING_TYPE.TIM_EXP ? BILLING_DROPDOWN.TIME_AND_EXPENSE : description,
    value: description,
    selected: description === billingType
  });

  if (!deliveryType) {
    return metaData?.billingTypeData?.map(bt => formatBillingType(bt?.description)) || [];
  }

  if (projectSource !== OPPORTUNITY_SOURCE.INTERNAL) {
    return [formatBillingType(billingType)];
  }

  const billingTypes = getFilteredDropDownData(
    metaData,
    BILLING_DROPDOWN.DELIVERY_TYPE_DATA,
    BILLING_DROPDOWN.BILLING_TYPE_DATA,
    BILLING_DROPDOWN.BILLING_TYPE,
    deliveryType
  );

  return billingTypes?.map(bt => formatBillingType(bt?.description)) || [];
};


export const getBillingTypeList = (deliveryTypes, metaData) => {
  const billingCodes = [];
  deliveryTypes?.forEach(delCode => {
    const selectedDeliveryType = metaData?.deliveryTypeData?.filter(item => item?.codeId === delCode.codeId)[0];
    selectedDeliveryType?.relations?.BLLNG_TYP.map(ditem => {
      billingCodes.push(metaData?.billingTypeData?.filter((bitem) => ditem === bitem?.codeValue)[0]);
    });
  });
  return _uniqBy(billingCodes, 'codeId');
};

export const removeSpecialCharacters = (input, fieldSpecificChars = []) => {
  const allowedChars = fieldSpecificChars.map(char => `\\${char}`).join('');
  return input?.replace(/&amp;/g, '')
    .replace(/&lt;/g, '')
    .replace(/&gt;/g, '')
    .replace(/&quot;/g, '')
    .replace(/&#39;/g, '')
    .replace(/â/g, '')
    .replace(/\?\?/g, '')
    .replace(new RegExp(`[^a-zA-Z0-9 _${allowedChars}\\-]`, 'g'), '');
};