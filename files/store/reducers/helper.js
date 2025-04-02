import moment from 'moment-mini';
import _forEach from 'lodash/forEach';
import _map from 'lodash/map';
import _omit from 'lodash/omit';
import { alphaSort, buildDropDownOption } from '@revin-utils/utils';
import { SKIP_PROPERTIES, CONTROLS_LABEL, DATE_FORMAT, DESCRIPTION, RESOURCE,  ROLE_ACTION } from '../../utils/constants';

export const updateOpportunities = (opportunities, updatedOpportunities) => {
  let list = [];
  opportunities?.forEach((opportunity) => {
    updatedOpportunities?.forEach((updatedOpportunity) => {
      if (!list.map((lt) => lt.id).includes(opportunity.id)) {
        list = [
          ...list,
          opportunity.id === updatedOpportunity.id
            ? updatedOpportunity
            : opportunity
        ];
      }
    });
  });
  return list;
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

export const mapAccounts = (accounts) => {
  return accounts?.map((account) => ({
    ...account,
    label: account.name,
    level: account.name
  }));
};

export const mapResults = (accounts, splitTxt, joinTxt) => {
  return accounts?.map((account) => ({
    ...account,
    label: splitTxt && joinTxt ? account.name.split(splitTxt).join(joinTxt) : account.name,
    level: account.name
  }));
};

export const mapApprovalLogs = (data) => {
  return data?.map((approval) => (approval?.attributes));
};

//remove attribute from API
export const buildResponse = (data) => {
  return data?.map((approval) => (approval?.attributes));
};

export const buildCodes = (codes) => {
  const codesObj = {};
  if (!codes) {
    return codesObj;
  }

  _forEach(codes, (code, codeKey) => {
    codesObj[codeKey] = buildDropDownOption(code, 'description', 'codeValue');
  });

  return codesObj;
};

export const mapSelectedUser = (selectedUser, isNewResource = false) => {
  return {
    orgRoleId: selectedUser?.orgRoleId,
    billRate: selectedUser?.billRate,
    revisedBillRate: selectedUser?.revisedBillRate || selectedUser?.resourceData?.revisedBillRate,
    revisionMonth: selectedUser?.revisionMonth || selectedUser?.resourceData?.revisionMonth,
    costRate: selectedUser?.costRate,
    inflation: selectedUser?.inflation,
    anniversaryMonth: selectedUser?.anniversaryMonth || selectedUser?.resourceData?.anniversaryMonth,
    availableFte: selectedUser?.availableFte || selectedUser?.currentAllocationFTE,
    firstName: selectedUser?.userDetailDTO?.firstName || selectedUser?.resourceData?.firstName,
    lastName: selectedUser?.userDetailDTO?.lastName || selectedUser?.resourceData?.lastName,
    designation: selectedUser?.userDetailDTO?.designation || selectedUser?.orgRoleId,
    gradeCode: selectedUser?.userDetailDTO?.gradeCode || selectedUser?.band,
    employeeId: selectedUser?.userDetailDTO?.employeeId || selectedUser?.resourceData?.employeeId,
    employeeType: selectedUser?.userDetailDTO?.employmentType || selectedUser?.resourceData?.employmentType,
    userId: selectedUser?.userDetailDTO?.id || selectedUser?.resourceData?.userId,
    periodFrom: selectedUser?.startPeriodId,
    periodTo: selectedUser?.endPeriodId,
    locationId: selectedUser?.userDetailDTO?.locationCode || selectedUser?.resourceData?.locationId || selectedUser?.locationId,
    resourceSource: isNewResource ? RESOURCE.USER_TYPE_CUSTOM : selectedUser?.resourceSource,
    allocationStart: selectedUser?.allocationStart || null,
    allocationEnd: selectedUser?.allocationEnd || null,
    countryCode: selectedUser?.countryCode || '',
    locationValue: selectedUser?.locationValue || '',
    locationType: selectedUser?.locationType || ''
  };
};

export const formatControlsData = (data) => {
  return data?.map(item => ({
    ...item.attributes,
    holidayList: item.attributes?.holidayList || [],
    utilisationMap: item.attributes?.utilisationMap || {},
    overridedDailyWorkingHours: null,
    overridedMonthlyWorkingHours: null,
    overridedHolidayList: item.attributes?.holidayList || [],
    overridedUtilisationMap: item.attributes?.utilisationMap || {}
  }));
};

export const buildModifiedControls = (modifiedData = [], payload) => {
  if (payload.action === CONTROLS_LABEL.ACTION_MODIFIED) {
    const idx = modifiedData?.findIndex(f => f.id === payload.data.id);
    if (idx !== -1) {
      modifiedData[idx] = payload.data;
    } else {
      modifiedData.push(payload.data);
    }
  }
  if (payload.action === CONTROLS_LABEL.ACTION_DISCARDED && modifiedData?.length) {
    const foundIndex = modifiedData?.findIndex(f => f.id === payload.data.id);
    if (foundIndex !== -1) {
      if (payload.data?.status === CONTROLS_LABEL.ACTION_ADDED) {
        modifiedData[foundIndex] = payload.data;
      } else {
        modifiedData = modifiedData.toSpliced(foundIndex, 1);
      }
    }
  }
  return [...modifiedData];
};

export const filterHolidays = (data) => {
  return data?.map(item => ({
    ...item.attributes,
    date: moment(item.attributes.date).format(DATE_FORMAT.FORMAT_4),
    name: item.attributes.description,
    holidayType: CONTROLS_LABEL.ORG
  }));
};

export const updateParentAccounts = (parentAccounts, payload) => {
  const data = parentAccounts?.toSpliced(
    parentAccounts?.findIndex(({ id }) => id === payload?.[0]?.id),
    1,
    payload[0]
  );

  return data;
};

export const updateResourceForecastData = (resourceForecastData, payload) => {
  const {actionType, gridChanges, sourceId} = payload;
  if (actionType === ROLE_ACTION.DELETE) {
    resourceForecastData.roles = resourceForecastData?.roles?.filter(({id}) => id !== sourceId);
  }
  gridChanges?.map((item) => {
    if (item?.responseType === 'RESOURCE') {
      switch (actionType) {
        case ROLE_ACTION.EDIT: {
          const roleIndex = resourceForecastData?.roles?.findIndex(({ id }) => id === item.sourceId);
          const { periodDetails, sourceId, ...restItem } = item;
          resourceForecastData.roles = resourceForecastData?.roles?.toSpliced(roleIndex, 1, {
            ...restItem,
            foreCastingRolePlanPeriodDetails: periodDetails,
            id: sourceId
          });
        };
          break;

        case ROLE_ACTION.CREATE: {
          const restItemData = _omit(item, [SKIP_PROPERTIES.RESPONSE_TYPE, SKIP_PROPERTIES.TIMESTAMP]);
          const { periodDetails, sourceId, ...rest } = restItemData;
          resourceForecastData.roles = [...resourceForecastData?.roles, {
            foreCastingRolePlanPeriodDetails: periodDetails,
            id: sourceId,
            ...rest
          }];
        };
          break;

        case ROLE_ACTION.UPDATE_GRID: {
          const role = resourceForecastData?.roles?.find(({ id }) => id === item.sourceId);
          if (role) {
            item?.periodDetails?.map(periodDetail => {
              const idx = role?.foreCastingRolePlanPeriodDetails?.findIndex(({ periodId }) => periodId === periodDetail.periodId);
              if (idx !== -1) {
                role.foreCastingRolePlanPeriodDetails[idx] = periodDetail;
              }
            });
          }
        }
          break;
      }
    };

    if (item?.responseType === 'OTHER_EXP') {
      item?.periodDetails?.map(periodDetail => {
        const idx = resourceForecastData?.otherExpenses?.periodDetailsList?.findIndex(({ periodId }) => periodId === periodDetail.periodId);
        resourceForecastData.otherExpenses.periodDetailsList[idx] = periodDetail;
      });
    }
    if (item?.responseType === 'DIRECT_EXP') {
      item?.periodDetails?.map(periodDetail => {
        const idx = resourceForecastData?.directExpenses?.periodDetailsList?.findIndex(({ periodId }) => periodId === periodDetail.periodId);
        resourceForecastData.directExpenses.periodDetailsList[idx] = periodDetail;
      });
    }
    if (item?.responseType === 'PERIOD_SUMMARY') {
      item?.periodDetails?.map(periodDetail => {
        const idx = resourceForecastData?.periodSummary?.findIndex(({ periodId }) => periodId === periodDetail.periodId);
        resourceForecastData.periodSummary[idx] = periodDetail;
      });
    }
    if (item?.responseType === 'FY_SUMMARY') {
      item?.periodDetails?.map(periodDetail => {
        if (periodDetail?.year == moment().format(DATE_FORMAT.FORMAT_6)) {
          resourceForecastData.fySummary = periodDetail;
        }
      });
    }
  });
  return resourceForecastData;
};

export const mapPayloadToResourceModal = (resource, isNew = false) => {
  let mappedResource = {};
  const { currentAllocationFTE, locationCode, band, startPeriodId, endPeriodId, id: sourceId, orgRoleId, resourceData, userDetailDTO, ...rest } = resource;

  if (isNew) {
    const { id, ...restUserDetailDTO } = userDetailDTO;
    mappedResource = {
      periodFrom: startPeriodId,
      periodTo: endPeriodId,
      locationId: locationCode,
      resourceSource: RESOURCE.USER_TYPE_CUSTOM,
      userId: id,
      ...rest,
      ...restUserDetailDTO
    };
  } else {
    const restResourceData = _omit(resourceData, [SKIP_PROPERTIES.ID]);
    mappedResource = {
      availableFte: currentAllocationFTE,
      designation: orgRoleId,
      gradeCode: band,
      periodFrom: startPeriodId,
      periodTo: endPeriodId,
      sourceId,
      ...restResourceData,
      ...rest
    };
  };
  return mappedResource;
};

export const mapDropDownData = (data) => {
  return _map(data, (key, value) => ({
    id: value,
    label: key,
    level: value
  }));
};

export const maintainLoaderStack = (loaderStack, payload) => {
  if(Object.hasOwn(payload, 'visibility')) {
    payload?.visibility ? loaderStack.visibility++ : loaderStack.visibility--;
  };
  if(Object.hasOwn(payload, 'backdropLoader')) {
    payload?.backdropLoader ? loaderStack.backdropLoader++ : loaderStack.backdropLoader--;
  }
  return loaderStack;
};