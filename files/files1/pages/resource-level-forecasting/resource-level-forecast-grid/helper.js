import React from 'react';
import { CELL_TYPES, USER_TYPE, preciseNumberFormatter, getSplitCellDataShape } from '@revin-utils/utils';
import _groupBy from 'lodash/groupBy';
import _forEach from 'lodash/forEach';
import moment from 'moment-mini';
import { getGrossProfitMargin, getDirectExpenses, getOtherExpense, getPeriodSummary, generateResourceSummary, getCompletionPercentage } from 'utils/forecastingCommonFunctions';
import { RESOURCE_FORECASTING, CELL_DATA_TYPE, EMP_TYPE, USER_STATUS, TYPE, PROJECT_FORECASTING_TYPE } from 'utils/constants';
import { getProjectResourceData } from '../../project-forecasting/manage-cost-modal/helper';
import { getWorkerTooltip } from 'utils/commonFunctions';

export const buildResourcePlanData = (resourceLevelForecastData, selectedGrid, forecastingType = TYPE.RESOURCE_FORECASTING, showRevenueRow, viewOnlyPermission) => {
  const returnResourceData = { 'headerData': [], 'resourceData': [], 'secondaryHeader': {} };
  //get top summary
  getPeriodSummary(resourceLevelForecastData, returnResourceData, forecastingType, selectedGrid);

  const locationWiseResource = _groupBy(resourceLevelForecastData.forecastingRoles, 'locationId');
  _forEach(locationWiseResource, (resourceData, key) => {
    generateLocation(key, resourceData, returnResourceData, forecastingType);
    forecastingType === TYPE.PROJECT_FORECASTING ?
      getProjectResourceData(resourceData, returnResourceData, selectedGrid, viewOnlyPermission)
      :
      getResourceData(resourceData, returnResourceData, selectedGrid, viewOnlyPermission);
  });
  if (forecastingType === TYPE.RESOURCE_FORECASTING) {
    getOtherExpense(resourceLevelForecastData.otherExpenses, returnResourceData, viewOnlyPermission);
    getDirectExpenses(resourceLevelForecastData, returnResourceData, TYPE.RESOURCE_FORECASTING, viewOnlyPermission);
    getGrossProfitMargin(resourceLevelForecastData, returnResourceData, TYPE.RESOURCE_FORECASTING);
  }

  if (resourceLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow) {
    // For Adjustment and final cost
    getAdjustMentAndFinalCost(resourceLevelForecastData, returnResourceData, viewOnlyPermission);
    getCompletionPercentage(resourceLevelForecastData, returnResourceData, viewOnlyPermission);
  }
  return returnResourceData;
};

const getAdjustMentAndFinalCost = (data, returnResourceData, viewOnlyPermission) => {
  const details = {
    fields: [
      {
        name: 'resourceCostAdjustments',
        label: 'Adjustments',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        readOnlyType: viewOnlyPermission ? CELL_TYPES.COST_READ_ONLY : ''
      },
      {
        name: 'finalResourceCost',
        label: 'Final Resource cost',
        labelType: CELL_TYPES.ROLE,
        hideControls: true,
        readOnlyType: CELL_TYPES.COST_READ_ONLY
      }
    ],
    afterLabelExtraFields: [{
      value: '',
      type: CELL_TYPES.COST_READ_ONLY
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      subType: CELL_TYPES.LABEL_CELL
    }],
    periodSummary: data?.forecastingPeriodSummary,
    summary: data?.summary
  };
  returnResourceData.resourceData.push([
    {
      type: CELL_TYPES.BLANK_SPACE
    }
  ], [...generateResourceSummary(details)[0]], [...generateResourceSummary(details)[1]]);
};

const getResourceData = (resourceData, returnResourceData, selectedGrid, viewOnlyPermission) => {
  resourceData.forEach((resource) => {

    //get resource
    const data = getResourceUtilization(resource, selectedGrid, viewOnlyPermission);
    returnResourceData.resourceData.push(
      [
        {
          value: resource.resourceData ? `${resource.resourceData.firstName} ${resource.resourceData.lastName} (${resource.resourceData.employeeId})` : resource?.roleDescription || resource?.orgRoleId,
          type: CELL_TYPES.ROLE,
          subValue: getSubCellValue(resource),
          infoTooltip: (<> {EMP_TYPE.EMP_ROLE_KEY} <br /> {resource.orgRoleId} - {resource.band}</>),
          workerTooltip: getWorkerTooltip(resource?.resourceData?.employeeType),
          pID: resource.locationId,
          item: resource,
          disabled: resource?.resourceData?.status === USER_STATUS.INACTIVE,
          hideClone: true,
          hideDelete: viewOnlyPermission ? true : resource?.resourceSource === USER_TYPE.EXTERNAL,
          hideControls: viewOnlyPermission ? true : resource?.resourceData?.status === USER_STATUS.INACTIVE
        },
        {
          value: preciseNumberFormatter(resource.billRate, { isDoublePrecision: true }),
          type: CELL_TYPES.COST_READ_ONLY,
          pID: resource.locationId
        },
        {
          value: preciseNumberFormatter(resource.costRate, { isDoublePrecision: true }),
          type: CELL_TYPES.COST_READ_ONLY,
          pID: resource.locationId
        },
        {
          value: selectedGrid === RESOURCE_FORECASTING.FTE ? RESOURCE_FORECASTING.FTE_TYPE : RESOURCE_FORECASTING.REV_TYPE,
          subValue: selectedGrid === RESOURCE_FORECASTING.FTE ? RESOURCE_FORECASTING.UTLSN_TYPE : RESOURCE_FORECASTING.COST_TYPE,
          type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
          pID: resource.locationId
        },
        ...data.resourceSummaryData,
        data.totalResourceSummary
      ]
    );
  });
};

const getSubCellValue = (resource) => {
  const monthValueStart = `${resource.startPeriodId}`.substring(4, 6);
  const yearValueStart = `${resource.startPeriodId}`.substring(0, 4);
  const monthStart = moment(monthValueStart, 'MM').format('MMM').toUpperCase();

  const monthValueEnd = `${resource.endPeriodId}`.substring(4, 6);
  const yearValueEnd = `${resource.endPeriodId}`.substring(0, 4);
  const monthEnd = moment(monthValueEnd, 'MM').format('MMM').toUpperCase();

  const startDay = moment(monthValueStart).startOf('month').format('DD');
  const endDay = moment(monthValueEnd).endOf('month').format('DD');
  return `${startDay} ${monthStart} ${yearValueStart} to ${endDay} ${monthEnd} ${yearValueEnd}`;
};

const getResourceUtilization = (resource, selectedGrid, viewOnlyPermission) => {
  const resourceSummaryData = resource.foreCastingRolePlanPeriodDetails.map((rolePlanPeriodDetail) => {

    const value = getCellValue(rolePlanPeriodDetail, selectedGrid);
    const subValue = getSubValue(rolePlanPeriodDetail, selectedGrid);
    const cellType = getIsCellEditable(rolePlanPeriodDetail, resource, selectedGrid, viewOnlyPermission);
    const isEditableSplitCell = cellType === CELL_TYPES.COST_SPLIT_CELL;
    const valueObject = isEditableSplitCell
      ? {
        value: getSplitCellDataShape([value, subValue])
      }
      : {
        value,
        subValue
      };

    return {
      ...valueObject,
      type: cellType,
      pID: resource.locationId,
      id: rolePlanPeriodDetail.periodId,
      resourceId: resource.slNo,
      topCellValue: 'fte',
      bottomCellValue: 'utilisationPercentage',
      planType: 'forecastingRoles',
      blockNegative: true
    };
  });

  const totalResourceSummary = {
    value: selectedGrid === RESOURCE_FORECASTING.FTE ? '' : preciseNumberFormatter(resource.revenue),
    subValue: selectedGrid === RESOURCE_FORECASTING.FTE ? '' : preciseNumberFormatter(resource.cost),
    type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
    pID: resource.locationId
  };

  return { resourceSummaryData, totalResourceSummary };
};

const getIsCellEditable = (rolePlanPeriodDetail, resource, selectedGrid, viewOnlyPermission) => {
  if (viewOnlyPermission) return CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  if (resource?.resourceData?.status === USER_STATUS.INACTIVE) {
    return CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  } else {
    return selectedGrid !== RESOURCE_FORECASTING.FTE ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : rolePlanPeriodDetail.cellState === CELL_DATA_TYPE.EDITABLE ? CELL_TYPES.COST_SPLIT_CELL : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  }
};

const getCellValue = (rolePlanPeriodDetail, selectedGrid) => {
  if (rolePlanPeriodDetail?.cellState === CELL_DATA_TYPE.NON_EXIST) {
    return '';
  } else {
    return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(rolePlanPeriodDetail?.fte, { isDoublePrecision: true, info: rolePlanPeriodDetail }) : preciseNumberFormatter(rolePlanPeriodDetail?.revenue,{info:rolePlanPeriodDetail});
  }
};

const getSubValue = (rolePlanPeriodDetail, selectedGrid) => {
  if (rolePlanPeriodDetail?.cellState === CELL_DATA_TYPE.NON_EXIST) {
    return '';
  } else {
    return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(rolePlanPeriodDetail?.utilisationPercentage, { isDoublePrecision: true, showPercentageSign: true, info: rolePlanPeriodDetail }) : preciseNumberFormatter(rolePlanPeriodDetail?.cost);
  }

};

const generateLocation = (location, resourceData, returnResourceData, forecastingType) => {

  const locationArray = [];

  locationArray.push(
    {
      value: ' ',
      type: CELL_TYPES.LABEL_ROW,
      colSpan: forecastingType === TYPE.PROJECT_FORECASTING ? 3 : 2
    },
    {
      value: '',
      type: CELL_TYPES.LABEL_ROW,
      subType: CELL_TYPES.LABEL_CELL
    },
    {
      value: ' ',
      type: CELL_TYPES.LABEL_ROW,
      colSpan: resourceData[0]?.foreCastingRolePlanPeriodDetails?.length + 1
    }
  );

  returnResourceData.resourceData.push([
    {
      subName: `${location} (${resourceData.length})`,
      type: CELL_TYPES.LABEL_ROW_HEADER,
      parent: true,
      id: `${location}`
    },
    ...locationArray
  ]);
};