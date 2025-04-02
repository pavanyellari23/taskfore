import { GRID_CONSTANTS, RESOURCE, USER_STATUS, DATA_GRID_CONTROL_CELL, NA } from 'utils/constants';
import { buildData, buildGridColumns, buildGridHeaderRow, buildLabelsData, buildRegionData, gridData } from '../../../common/grid-common-helper';
import { getGridMonths } from 'utils/forecastingCommonFunctions';
import { getWorkerTooltip } from 'utils/commonFunctions';

const labelColumns = [
  { columnId: GRID_CONSTANTS.TOGGLE_SWITCH_CELL, width: '35rem' },
  { columnId: GRID_CONSTANTS.KEY.BILL_RATE },
  { columnId: GRID_CONSTANTS.KEY.COST_RATE }
];
export const gridColumns = (noOfCols) => buildGridColumns(labelColumns, noOfCols);

export const gridHeaderRow = (periodSummary, labels, total, filterRecord, sortingColumn, sortBy, showAllColumns) => buildGridHeaderRow(periodSummary, labels, total, filterRecord, sortingColumn, sortBy, showAllColumns);

export const gridRowsData = (handleExpandCollapse, groupByLocations,forecastingData, roles=[], tab, otherFields, headerButtons, onRoleActionClick, viewOnlyPermission) => {
  const {key, headerKey, payloadSubType, colorKey} = tab;
  const summary = getGridMonths(forecastingData?.periodSummary);
  const otherExpensesPeriodSummary = getGridMonths(forecastingData?.otherExpenses?.periodDetailsList);
  const directExpensesPeriodSummary = getGridMonths(forecastingData?.directExpenses?.periodDetailsList);
  
  const headersData = buildData({
    labelData: headerButtons,
    field: headerKey || key,
    periodSummary: summary,
    isHeader: true,
    extraBorderBottom: true,
    formatOptions: {isFormat: true, isDoublePrecision: [GRID_CONSTANTS.KEY.FTE].includes(key)}
  });
  
  const buildRoleData = (regionRoles) => {
    const rls = regionRoles?.length ? regionRoles : roles;
    const rolesResources = rls?.map((role, idx) => {
      const isResource = !!(role?.resourceData && Object.keys(role?.resourceData)?.length);
      const title = isResource ? `${role?.resourceData?.firstName} ${role?.resourceData?.lastName} (${role?.resourceData?.employeeId})` : `${role?.roleDescription || role?.orgRoleId} - ${role?.band}`;
      const subTitle = isResource ? `${role?.orgRoleId?.split('-')?.[0] || ''} - ${role?.band?.trim() || NA} | ${role?.countryCode || ''}` : `${role?.countryCode || ''}`;
      const customRoleResourceClass = isResource ? (role?.resourceSource === RESOURCE.USER_TYPE_CUSTOM ? DATA_GRID_CONTROL_CELL.CLASS.NEW_RESOURCE_STATUS : '') : DATA_GRID_CONTROL_CELL.CLASS.NEW_ROLE_STATUS;
      const workerTooltip = isResource ? getWorkerTooltip(role?.resourceData?.employeeType) : '';
  
      const labelData = buildLabelsData({
        title: title?.toUpperCase(),
        subTitle,
        otherFields,
        obj: role,
        formatOptions: {isDoublePrecision: true},
        onRoleActionClick,
        customRoleResourceClass,
        workerTooltip,
        viewOnlyPermission
      });
      return buildData({
        id: role?.id,
        labelData,
        field: key,
        location: role?.locationValue,
        periodSummary: getGridMonths(role?.foreCastingRolePlanPeriodDetails),
        isReadOnly: viewOnlyPermission || ![GRID_CONSTANTS.KEY.FTE, GRID_CONSTANTS.KEY.BILLABLE_HOURS].includes(key),
        formatOptions: {isFormat: ![GRID_CONSTANTS.KEY.FTE].includes(key), isPercentage: key === GRID_CONSTANTS.KEY.GPM_PERCENTAGE, isDoublePrecision: key === GRID_CONSTANTS.KEY.BILLABLE_HOURS },
        payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.RESOURCE,
        payloadSubType: payloadSubType || key?.toUpperCase(),
        colorField: colorKey,
        extraBorderBottom: idx === roles?.length-1,
        isDisabled: role?.resourceData?.status === USER_STATUS.INACTIVE
      });
    }) || [];
    return rolesResources;
  };

  const groupByLocation = () => {
    const regions = [...new Set(forecastingData?.roles.map(item => item?.locationValue))];
    const groupedRoles = regions.map(region => {
      const rolesAsperRegion = forecastingData?.roles?.filter(obj => obj.locationValue === region).sort((a, b) => a?.resourceData?.firstName.localeCompare(b.a?.resourceData?.firstName));
      return {
        region,
        rolesAsperRegion,
        content: buildRegionData(region,rolesAsperRegion,handleExpandCollapse, forecastingData?.roles[0]?.foreCastingRolePlanPeriodDetails?.length)
      };
    });

    const alpabeticallySortedRegions = groupedRoles.sort((a , b) => a?.region.localeCompare(b?.region));
    const data = [];
    alpabeticallySortedRegions?.map((region) => {
      data.push(region.content);
      data.push(...buildRoleData(region?.rolesAsperRegion));
    });
    return data;
  };
  
  const otherExpensesRevenueLabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.OTHERS_REVENUE,
    otherFields,
    infoIcon: true 
  });
  const otherExpensesRevenue = buildData({
    id: forecastingData?.otherExpenses?.id,
    labelData: otherExpensesRevenueLabelData,
    field: GRID_CONSTANTS.KEY.REVENUE,
    periodSummary: otherExpensesPeriodSummary,
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.OTHER_EXP,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.REVENUE,
    formatOptions: {isFormat: true},
    isReadOnly: viewOnlyPermission
  });
  
  const otherExpensesCostLabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.OTHERS_COST,
    otherFields,
    infoIcon: true
  });
  const otherExpensesCost = buildData({
    id: forecastingData?.otherExpenses?.id,
    labelData: otherExpensesCostLabelData,
    field: GRID_CONSTANTS.KEY.COST,
    periodSummary: otherExpensesPeriodSummary,
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.OTHER_EXP,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.COST,
    formatOptions: {isFormat: true},
    isReadOnly: viewOnlyPermission,
    extraBorderBottom: true
  });

  const directExpenses$LabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.DIRECT_EXPENSES_$,
    otherFields
  });
  const directExpenses$ = buildData({
    id: forecastingData?.directExpenses?.id,
    labelData: directExpenses$LabelData,
    field: GRID_CONSTANTS.KEY.AMOUT,
    periodSummary: directExpensesPeriodSummary,
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.DIRECT_EXP,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.EXPENSE,
    formatOptions: {isFormat: true},
    isReadOnly: viewOnlyPermission
  });

  const directExpensesPercentageLabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.DIRECT_EXPENSES_PERCENT,
    otherFields
  });
  const directExpensesPercentage = buildData({
    id: forecastingData?.directExpenses?.id,
    labelData: directExpensesPercentageLabelData,
    field: GRID_CONSTANTS.KEY.PERCENTAGE,
    periodSummary: directExpensesPeriodSummary,
    formatOptions: {isFormat: true, isPercentage: true, isSinglePrecision: true},
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.DIRECT_EXP,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.PERCENTAGE,
    isReadOnly: viewOnlyPermission,
    extraBorderBottom: true
  });

  const grossMargin$LabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.GROSS_PROFIT_MARGIN_$,
    otherFields
  });
  const grossMargin$ = buildData({
    id: summary?.[0]?.id,
    labelData: grossMargin$LabelData,
    field: GRID_CONSTANTS.KEY.GROSSMARGIN,
    periodSummary: summary,
    isReadOnly: true,
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.GROSS_MARGIN,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.GROSSMARGIN,
    formatOptions: {isFormat: true}
  });

  const grossMarginPercentageLabelData = buildLabelsData({
    title: GRID_CONSTANTS.TITLE.GROSS_PROFIT_MARGIN_PERCENT,
    otherFields
  });
  const grossMarginPercentage = buildData({
    id: summary?.[0]?.id,
    labelData: grossMarginPercentageLabelData,
    field: GRID_CONSTANTS.KEY.GROSS_MARGIN_PERCENTAGE,
    periodSummary: summary,
    formatOptions: {isFormat: true, isPercentage: true},
    isReadOnly: true,
    payloadType: GRID_CONSTANTS.PAYLOAD_TYPE.GROSS_MARGIN,
    payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.PERCENTAGE
  });

  const resourceData = groupByLocations ? groupByLocation() : buildRoleData();
  const rowData = [
    headersData,
    ...resourceData,
    otherExpensesRevenue,
    otherExpensesCost,
    directExpenses$,
    directExpensesPercentage,
    grossMargin$,
    grossMarginPercentage
  ];
  return gridData(rowData);
};

