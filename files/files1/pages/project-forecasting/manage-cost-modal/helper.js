import React from 'react';
import { CELL_TYPES, USER_TYPE, getSplitCellDataShape,preciseNumberFormatter } from '@revin-utils/utils';
import { RESOURCE_FORECASTING, EMP_TYPE, USER_STATUS, TYPE } from 'utils/constants';
import { getSubCellValue, getSubValue, getCellValue, getIsCellEditable, getYearMonthHeader, getLabelForCrmPip, isPastPeriodAndNotCrossOverMonth, getGridMonths } from 'utils/forecastingCommonFunctions';
import { MONTH_LIST } from 'utils/mock-data/monthList';
import { getWorkerTooltip } from 'utils/commonFunctions';

export const buildCrmPipCostPlanData = (forecastingDataData) => {
  const returnResourceData = {'headerData': [], 'resourceData': [], 'secondaryHeader' : {}};
  getCrmPipPeriodSummary(forecastingDataData, returnResourceData);
  return returnResourceData;
};

const getCrmPipPeriodSummary= (forecastingDataData, returnResourceData) => {
  const summary = getGridMonths(forecastingDataData?.forecastingPeriodSummary);
  const data = getYearMonthHeader(summary);
  returnResourceData.headerData.push
  (
    {
      name:'',
      subName:'',
      id:50,
      type: CELL_TYPES.HEADER
    },
    ...data
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /* {
      name: RESOURCE_FORECASTING.Total,
      id:54,
      type: CELL_TYPES.HEADER
    }*/
  );
  getCrmPipPeriodSummaryData(forecastingDataData, returnResourceData);
};

const getCrmPipPeriodSummaryData = (forecastingDataData, returnResourceData) => {

  const summary = getGridMonths(forecastingDataData?.forecastingPeriodSummary);
  const data = summary?.map((item) => {
    return {
      name: preciseNumberFormatter( item?.resourceCost),
      subName: '',
      id: item?.periodId,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
    };
  });

  returnResourceData.secondaryHeader = 
    {
      preMonthHeader: [
        {
          name: getLabelForCrmPip(RESOURCE_FORECASTING.RESOURCE_COST_TITLE,forecastingDataData?.costDataSource),
          subName: '',
          id: 58,
          type: CELL_TYPES.ROLE,
          subType: CELL_TYPES.COST
        },
        ...data
      ]
      //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /*  postMonthHeader: [
        {
          name: forecastingDataData.summary.totalCost,
          subName: '',
          id: 60,
          type: CELL_TYPES.HEADER_SECONDARY
        }
      ] */
    };
};


export const getProjectResourceData = (resourceData, returnResourceData, selectedGrid, viewOnlyPermission) => {
  resourceData.forEach((resource) => {
    
    //get resource
    const data = getResourceUtilization(resource, selectedGrid, viewOnlyPermission);
    returnResourceData.resourceData.push(
      [
        {
          value: resource.resourceData ? `${resource.resourceData.firstName} ${resource.resourceData.lastName} (${resource.resourceData.employeeId})` :  resource?.roleDescription || resource?.orgRoleId,
          type: CELL_TYPES.ROLE,
          subValue: getSubCellValue(resource),
          infoTooltip: (<> {EMP_TYPE.EMP_ROLE_KEY} <br/> {resource.orgRoleId} - {resource.band}</>),
          workerTooltip: getWorkerTooltip( resource?.resourceData?.employeeType),
          pID: resource.locationId,
          item: resource,
          disabled: resource?.resourceData?.status === USER_STATUS.INACTIVE,
          hideClone: true,
          hideDelete: viewOnlyPermission ? true : resource?.resourceSource === USER_TYPE.EXTERNAL,
          hideControls: viewOnlyPermission ? true : resource?.resourceData?.status === USER_STATUS.INACTIVE
        },
        {
          value: resource.costRate,
          type: CELL_TYPES.COST_READ_ONLY,
          pID: resource.locationId
        },
        {
          value: resource?.resourceData ? resource.inflation : '',
          type: CELL_TYPES.COST_READ_ONLY,
          pID: resource.locationId
        },
        {
          value: resource?.resourceData ? MONTH_LIST.find(month => month.id === resource.anniversaryMonth)?.short_name : '',
          type: CELL_TYPES.COST_READ_ONLY,
          pID: resource.locationId
        },
        {
          value: selectedGrid == RESOURCE_FORECASTING.FTE ? RESOURCE_FORECASTING.FTE_TYPE : RESOURCE_FORECASTING.COST_TYPE,
          subValue: selectedGrid == RESOURCE_FORECASTING.FTE ? RESOURCE_FORECASTING.UTLSN_TYPE : '',
          type: selectedGrid == RESOURCE_FORECASTING.FTE ? CELL_TYPES.COST_SPLIT_CELL_LABEL : CELL_TYPES.COST_READ_ONLY,
          subType: CELL_TYPES.LABEL_CELL,
          pID: resource.locationId
        },
        ...data?.resourceSummaryData,
        data.totalResourceSummary
      ]
    );
  });
};

const getResourceUtilization = (resource, selectedGrid, viewOnlyPermission) => {
  const resourceSummaryData = resource.foreCastingRolePlanPeriodDetails?.map((rolePlanPeriodDetail) => {

    const value = getCellValue(rolePlanPeriodDetail, selectedGrid, rolePlanPeriodDetail?.cost);
    const subValue =  getSubValue(rolePlanPeriodDetail, selectedGrid);
    const cellType = getIsCellEditable(rolePlanPeriodDetail,resource, selectedGrid, TYPE.PROJECT_FORECASTING, viewOnlyPermission);
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
      blockNegative: true,
      isPastPeriod: true
    };
  });

  const totalResourceSummary = {
    value:  selectedGrid == RESOURCE_FORECASTING.FTE ? '' : resource.cost,
    subValue: '',
    type: selectedGrid === RESOURCE_FORECASTING.FTE ?  CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : CELL_TYPES.COST,
    pID: resource.locationId
  };

  return {resourceSummaryData, totalResourceSummary};
};
