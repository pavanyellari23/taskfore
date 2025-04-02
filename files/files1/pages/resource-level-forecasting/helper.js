import { ROLE_ACTION, RESOURCE, ACCOUNT_LEVEL_FORECASTING_TAB_VALUES } from 'utils/constants';

const buildPayloadForSalesnGNA = (resource, forecastingData, tableType) => {
  const payload = {
    accountId: forecastingData?.accountId,
    orgRoleId: resource?.orgRoleId,
    billRate: resource?.billRate,
    costRate: resource?.costRate,
    inflation: +resource?.inflation,
    department: tableType.toUpperCase(),
    band: resource?.gradeCode,
    locationId: resource?.locationId,
    startPeriodId: resource?.periodFrom,
    endPeriodId: resource?.periodTo,
    currentAllocationFTE: +resource?.availableFte,
    cost: forecastingData?.summary?.resourceCost,
    revenue: forecastingData?.summary?.resourceRevenue,
    utlizationPercentage: forecastingData?.summary?.utilizationPercentage ?? 0,
    revisedBillRate: +resource?.revisedBillRate,
    anniversaryMonth: +resource?.anniversaryMonth,
    revisionMonth: resource?.revisionMonth,
    resourceSource: 'CUSTOM',
    periodDetailsList: [],
    resourceData: {
      forecastingResourceId: forecastingData?.id,
      employeeType: resource?.employeeType,
      userId: resource?.userId,
      firstName: resource?.firstName,
      lastName: resource?.lastName,
      employeeId: resource?.employeeId,
      status: 'ACTIVE'
    }
  };
  return payload;
};

export const prepareAddResourcePayload = (resource, forecastingData, modify, tableType = 'resource') => {
  const roleArrayVariableName = tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2] ? 'rolePlan' : 'forecastingRoles';
  const periodListVariable = tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2] ? 'periodDetailsList' : 'foreCastingRolePlanPeriodDetails';
  if (modify) {
    const updatingForecastingRoleIndex = forecastingData?.[roleArrayVariableName].findIndex(role =>
      role?.resourceData?.employeeId === resource?.employeeId
    );

    const updatedForecastingRole = {
      ...forecastingData?.[roleArrayVariableName][updatingForecastingRoleIndex],
      billRate: resource?.billRate,
      costRate: resource?.costRate,
      inflation: +resource?.inflation,
      band: resource?.gradeCode,
      startPeriodId: resource?.periodFrom,
      endPeriodId: resource?.periodTo,
      currentAllocationFTE: +resource?.availableFte,
      revisedBillRate: +resource?.revisedBillRate,
      anniversaryMonth: +resource?.anniversaryMonth,
      revisionMonth: resource?.revisionMonth,
      [periodListVariable]: resource?.resourceSource === RESOURCE.USER_TYPE_CUSTOM
        ? updatedForeCastingRolePlanPeriodDetails(forecastingData?.[roleArrayVariableName][updatingForecastingRoleIndex], resource, periodListVariable)
        : forecastingData?.[roleArrayVariableName]?.[updatingForecastingRoleIndex]?.[periodListVariable]
    };

    const updatedForecastingRoles = forecastingData?.[roleArrayVariableName].toSpliced(updatingForecastingRoleIndex, 1, updatedForecastingRole);
    
    const payloadWithNewlyAddedResource = {
      ...forecastingData,
      [roleArrayVariableName]: updatedForecastingRoles
    };

    return payloadWithNewlyAddedResource;

  } else {
    const payload = {
      orgRoleId: resource?.orgRoleId,
      roleGroupId: resource?.roleGroupId,
      clientRoleId: resource?.clientRoleId,
      billRate: resource?.billRate,
      costRate: resource?.costRate,
      inflation: +resource?.inflation,
      band: resource?.gradeCode,
      locationId: resource?.locationId,
      startPeriodId: resource?.periodFrom,
      endPeriodId: resource?.periodTo,
      currentAllocationFTE: +resource?.availableFte,
      cost: forecastingData?.summary?.resourceCost,
      revenue: forecastingData?.summary?.resourceRevenue,
      utlizationPercentage:
        forecastingData?.summary?.utilizationPercentage,
      revisedBillRate: +resource?.revisedBillRate,
      anniversaryMonth: +resource?.anniversaryMonth,
      revisionMonth: resource?.revisionMonth,
      resourceData: {
        forecastingResourceId: forecastingData?.id,
        employeeType: resource?.employeeType,
        userId: resource?.userId
      }
    };

    const payloadWithNewlyAddedResource = {
      ...forecastingData,
      [roleArrayVariableName]: [
        ...forecastingData[roleArrayVariableName], tableType === 'resource' ? payload : buildPayloadForSalesnGNA(resource, forecastingData, tableType)
      ]
    };

    return payloadWithNewlyAddedResource;
  }

};

const updatedForeCastingRolePlanPeriodDetails = (resource, updatedResource, periodListVariable) => {
  const updatedPeriodDetails = resource?.[periodListVariable]?.map(period => {
    const updateFTE = period?.periodId >= updatedResource?.periodFrom && period?.periodId <= updatedResource?.periodTo;
    return {
      ...period,
      fte: updateFTE ? resource?.currentAllocationFTE : period?.fte
    };
  });
  return updatedPeriodDetails;
};

const updatedRolePlanPeriodDetails = (role, periodDetailsList, updatedRole) => {
  const updatedPeriodDetails = periodDetailsList?.map(period => {
    if (role?.roleType === 'role' && period?.periodId >= updatedRole?.startPeriodId && period?.periodId <= updatedRole?.endPeriodId) {
      return {
        ...period,
        fte: updatedRole?.currentAllocationFTE
      };
    } else {
      return {
        ...period,
        fte: 0
      };
    }
  });
  return updatedPeriodDetails;
};


export const preparePayloadForRole = (data, forecastingData, actionType, tableType = 'resource') => {
  const roleArrayVariableName = tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2] ? 'rolePlan' : 'forecastingRoles';
  const periodListVariable = tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2] ? 'periodDetailsList' : 'foreCastingRolePlanPeriodDetails';
  const payload = {
    id: data?.extraFields?.id || '',
    roleGroupId: data?.roleForm?.roleGroupId || '',
    clientRoleId: data?.roleForm?.clientRoleId || '',
    orgRoleId: data?.roleForm?.orgRoleId || '',
    currentAllocationFTE: +data?.roleForm?.currentAllocationFTE || 0,
    locationType: data?.roleForm?.locationType || '',
    locationId: data?.roleForm?.locationId || '',
    startPeriodId: data?.roleForm?.startPeriodId || '',
    endPeriodId: data?.roleForm?.endPeriodId || '',
    inflation: +data?.roleForm?.inflation || 0,
    costRate: data?.roleForm?.costRate || 0,
    billRate: data?.roleForm?.billRate || 0,
    revisedBillRate: data?.roleForm?.billRate || 0,
    band: data?.extraFields?.band || '',
    roleDescription: data?.extraFields?.roleDescription || '',
    roleType: 'role'
  };

  if (tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || tableType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]) {
    payload.department = tableType.toUpperCase();
    payload.periodDetailsList = [];
  }

  let modifiedRoles = [];
  if (actionType === ROLE_ACTION.ADD) {
    delete payload.id;
    modifiedRoles = [...forecastingData?.[roleArrayVariableName], payload];
  }

  if ([ROLE_ACTION.EDIT, ROLE_ACTION.DELETE].includes(actionType)) {
    const foundIndex = forecastingData?.[roleArrayVariableName]?.findIndex(role => role?.id ? role?.id === data?.extraFields?.id : role.slNo === data?.extraFields.slNo);
    if (actionType === ROLE_ACTION.EDIT) {
      const modifiedRole = { ...forecastingData?.[roleArrayVariableName][foundIndex], ...payload };
      modifiedRole[periodListVariable] = updatedRolePlanPeriodDetails(forecastingData?.[roleArrayVariableName][foundIndex], forecastingData?.[roleArrayVariableName][foundIndex]?.[periodListVariable], modifiedRole);
      modifiedRoles = forecastingData?.[roleArrayVariableName].toSpliced(foundIndex, 1, modifiedRole);
    }
    if (actionType === ROLE_ACTION.DELETE) {
      modifiedRoles = forecastingData?.[roleArrayVariableName].toSpliced(foundIndex, 1);
    }
  }

  const updatedForecastState = {
    ...forecastingData,
    [roleArrayVariableName]: modifiedRoles
  };
  return updatedForecastState;
};