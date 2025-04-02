import { DATA_GRID_CONTROL_CELL, GRID_CONSTANTS, RESOURCE, NA, USER_STATUS } from 'utils/constants';
import { buildData, buildGridColumns, buildGridHeaderRow, buildLabelsData, gridData } from 'components/common/grid-common-helper';
import { getWorkerTooltip } from 'utils/commonFunctions';
import { getGridMonths } from 'utils/forecastingCommonFunctions';

const projectLabelColumns=[{ columnId: GRID_CONSTANTS.TOGGLE_SWITCH_CELL, width: '35rem' },
  { columnId: GRID_CONSTANTS.KEY.COST_RATE }];
export const projectGridColumns = (noOfCols) => buildGridColumns(projectLabelColumns, noOfCols); 
export const gridHeaderRow = (periodSummary, labels, total, filterRecord, sortingColumn, sortBy) => buildGridHeaderRow(periodSummary, labels, total, filterRecord, sortingColumn, sortBy);

export const gridRowsData = (forecastingData, roles=[], field, payloadSubType, colorField, otherFields, headerButtons, onRoleActionClick) => {
  const headersData = buildData({
    labelData: headerButtons,
    field: field === GRID_CONSTANTS.KEY.COST ? GRID_CONSTANTS.KEY.FINAL_RESOURCE_COST : field,
    formatOptions:{isFormat:true,isDoublePrecision:true},
    periodSummary: getGridMonths(forecastingData?.forecastingPeriodSummary),
    isHeader: true
  });
  const rolesResources = roles?.map((role, idx) => {
    const isResource = !!(role?.resourceData && Object.keys(role?.resourceData)?.length);
    const title = isResource ? `${role?.resourceData?.firstName} ${role?.resourceData?.lastName} (${role?.resourceData?.employeeId})` : `${role?.roleDescription || role?.orgRoleId} - ${role?.band}`;
    const subTitle = isResource ? `${role?.orgRoleId?.split('-')?.[0] || ''} - ${role?.band?.trim() || NA} | ${role?.countryCode || ''}` : `${role?.countryCode || ''}`;
    const customRoleResourceClass = isResource ? (role?.resourceSource === RESOURCE.USER_TYPE_CUSTOM ? DATA_GRID_CONTROL_CELL.CLASS.NEW_RESOURCE_STATUS : '') : DATA_GRID_CONTROL_CELL.CLASS.NEW_ROLE_STATUS;
    const workerTooltip = isResource ? getWorkerTooltip(role?.resourceData?.employeeType) : '';

    const labelData = buildLabelsData({
      title,
      subTitle,
      otherFields,
      obj: role,
      formatOptions: {isDoublePrecision: true},
      onRoleActionClick,
      customRoleResourceClass,
      workerTooltip
    });
  
    return buildData({
      id: role?.id,
      labelData,
      slNo: role?.slNo,
      field,
      periodSummary: getGridMonths(role?.foreCastingRolePlanPeriodDetails),
      isReadOnly: ![GRID_CONSTANTS.KEY.FTE, GRID_CONSTANTS.KEY.BILLABLE_HOURS].includes(field),
      formatOptions: {isFormat: ![GRID_CONSTANTS.KEY.FTE, GRID_CONSTANTS.KEY.BILLABLE_HOURS].includes(field)},
      payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.RESOURCE,
      payloadSubType: payloadSubType || field?.toUpperCase(),
      colorField,
      extraBorderBottom: idx === roles?.length-1,
      isDisabled: role?.resourceData?.status === USER_STATUS.INACTIVE
    });

  }) || [];
  
  return gridData([headersData, ...rolesResources]);
};

export const gridToPayload = (updatedCell, updateProjectForecastingState) => {
  if (!updatedCell) return updateProjectForecastingState;

  const { value, key, payloadSubType, slNo } = updatedCell;
  const stateCopy = { ...updateProjectForecastingState };
  const forecastingRoles = stateCopy?.projectForecastingDataLocalObject?.forecastingRoles;
  const roleIndex = forecastingRoles?.findIndex(item => item.slNo === slNo);

  if (roleIndex === -1) return stateCopy;

  const role = forecastingRoles[roleIndex];
  const periodDetailIndex = role?.foreCastingRolePlanPeriodDetails?.findIndex(detail => detail.periodId === key);

  if (periodDetailIndex === -1) return stateCopy;

  role.foreCastingRolePlanPeriodDetails[periodDetailIndex] = {
    ...role.foreCastingRolePlanPeriodDetails[periodDetailIndex],
    [payloadSubType === GRID_CONSTANTS.PAYLOAD_SUBTYPE.BILLABLE_HRS ? GRID_CONSTANTS.KEY.BILLABLE_HOURS : payloadSubType?.toLowerCase()] : value
  };

  return stateCopy;
};

