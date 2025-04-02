import React from 'react';
import { CELL_TYPES,preciseNumberFormatter, getSplitCellDataShape, getTransformedNumber, getSessionItem} from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import moment from 'moment-mini';
import _cloneDeep from 'lodash/cloneDeep';
import _uniqueId from 'lodash/uniqueId';
import _filter from 'lodash/filter';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import { 
  RESOURCE_FORECASTING,
  CELL_DATA_TYPE, 
  OTHERS_INFO, TYPE,
  PROJECT_LEVEL_PRE_MONTH_HEADER, 
  USER_STATUS, 
  PROJECT_FORECASTING_TYPE, 
  CELL_FLAG, 
  COST_VARIANCE, 
  ADJUSTMENT_THRESHOLD_PEAKED, 
  ESCAPE_NUMBER,
  DATE_FORMAT,
  PROBABILITY_MODAL,
  FINANCIAL_YEAR,
  FTE,
  GPM,
  PROJECT_LEVEL_FORECAST,
  HORIZONTAL_SPLIT_CELL_SUMMARY,
  HORIZONTAL_SPLIT_CELL_SUMMARY_ACCOUNT,
  PROJECT_FORECASTING,
  CROSSOVER_MONTH_SUBTYPE,
  SESSION_STORAGE_KEYS
} from 'utils/constants';
import { monthlyLabel, quarterlyLabel } from './commonFunctions';

export const getOtherExpense = (otherExpenses, returnResourceData, viewOnlyPermission) => {
  const otherExpenseData = otherExpenses?.[0]?.periodDetailsList.map((otherExpense) => {
    const revenue =  preciseNumberFormatter(otherExpense?.revenue,{info: otherExpense});
    const cost = preciseNumberFormatter(otherExpense?.cost,{info: otherExpense}) ;
    const isCellEditable = otherExpense.cellState === CELL_DATA_TYPE.EDITABLE;
    const valueObject = !viewOnlyPermission && isCellEditable
      ? {
        value: getSplitCellDataShape([revenue, cost])
      } 
      : {
        value:  revenue,
        subValue: cost
      };
      
    return  {
      ...valueObject,
      type: viewOnlyPermission ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : otherExpense.cellState === CELL_DATA_TYPE.EDITABLE ? CELL_TYPES.COST_SPLIT_CELL : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      parent: true,
      id: otherExpense.periodId,
      topCellValue: 'revenue',
      bottomCellValue: 'cost',
      planType: 'otherExpenses'
    };
  });
  
  if(otherExpenseData){
    returnResourceData.resourceData.push([
      {
        type: CELL_TYPES.BLANK_SPACE,
        id: 'direct-expense-id'
      }
    ]);
    
    returnResourceData.resourceData.push
    ([{
      value: RESOURCE_FORECASTING.OTHERS,
      type: CELL_TYPES.ROLE,
      id: '11',
      infoTooltip: OTHERS_INFO,
      hideControls: true
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      parent: true,
      id: '12'
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      parent: true,
      id: '13'
    },
    {
      value: RESOURCE_FORECASTING.REV_TYPE,
      subValue: RESOURCE_FORECASTING.COST_TYPE,
      type: CELL_TYPES.COST_SPLIT_CELL_LABEL
    },
    ...otherExpenseData
      //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
      /* {
      value: preciseNumberFormatter(otherExpenses?.[0]?.totalRevenue),
      subValue: preciseNumberFormatter(otherExpenses?.[0]?.totalCost),
      type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      parent: true,
      id: otherExpenses?.[0].id
    }*/
    ]);
  }
};

export const getDirectExpenses = (forecastingData, returnResourceData, type, viewOnlyPermission) => {
  const directExpenses = getGridMonths(forecastingData?.directExpenses?.[0]?.periodDetailsList);
  const directExpensesData = directExpenses?.map((directExpense) => {
    const isPastPeriod = isPastPeriodAndNotCrossOverMonth(directExpense);
    const isCellEditable = directExpense.cellState === CELL_DATA_TYPE.EDITABLE;
    const amount = preciseNumberFormatter(directExpense?.amout);
    const percentage =preciseNumberFormatter(directExpense?.percentage, {isPercentage:true, showPercentageSign:true});
    const valueObject = !viewOnlyPermission && isCellEditable 
      ? {
        value: getSplitCellDataShape([amount, percentage])
      } 
      : {
        value: amount,
        subValue: percentage
      };

    return  {
      ...valueObject,
      type: viewOnlyPermission ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : directExpense.cellState === CELL_DATA_TYPE.EDITABLE ? CELL_TYPES.COST_SPLIT_CELL : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      id: directExpense.periodId,
      topCellValue: 'amout',
      bottomCellValue: 'percentage',
      planType: 'directExpenses',
      isPastPeriod
    };
  });
  
  if(directExpensesData) {
    returnResourceData.resourceData.push([
      {
        type: CELL_TYPES.BLANK_SPACE,
        id: 'direct-expense-id'
      }
    ]);
    
    const directExpensesFields = [];

    if(type === TYPE.RESOURCE_FORECASTING) {
      directExpensesFields.push(
        {
          value: '',
          type: CELL_TYPES.COST_READ_ONLY,
          id: 2
        },
        {
          value: '',
          type: CELL_TYPES.COST_READ_ONLY,
          id: 3
        },
        {
          value: '$',
          subValue: '%',
          type: CELL_TYPES.COST_SPLIT_CELL_LABEL
        }
      );
    }else{
      directExpensesFields.push(
        {
          value: '$',
          subValue: '%',
          type: CELL_TYPES.COST_SPLIT_CELL_LABEL
        }
      );
    }

    returnResourceData.resourceData.push([
      {
        value: RESOURCE_FORECASTING.DIRECT_EXPENSE,
        type: CELL_TYPES.ROLE,
        hideControls: true,
        id: 1
      },
      
      ...directExpensesFields,
      ...directExpensesData
      //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
      /* {
        value: preciseNumberFormatter(forecastingData.directExpenses?.[0]?.totalCost),
        subValue: preciseNumberFormatter(forecastingData.directExpenses?.[0].percentage,{isPercentage:true}),
        type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
        id: forecastingData.directExpenses?.[0].id
      }*/
    ]);
  }
};

export const getGrossProfitMargin = (resourceLevelForecastData, returnResourceData, type) => {
  const summary = getGridMonths(resourceLevelForecastData?.forecastingPeriodSummary);
  const grossProfitMargin = summary?.map((grossProfit) => {
    const isPastPeriod = isPastPeriodAndNotCrossOverMonth(grossProfit);
    return  {
      value: preciseNumberFormatter(grossProfit?.grossMargin),
      subValue: `${preciseNumberFormatter(grossProfit?.grossMarginPercentage ,{isPercentage: true})}%`,
      type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      topCellValue: 'grossMargin',
      bottomCellValue: 'grossMarginPercentage',
      id: grossProfit.periodId,
      isPastPeriod
    };
  });
  
  returnResourceData.resourceData.push
  (
    [
      {
        type: CELL_TYPES.BLANK_SPACE,
        id: 'gross-profit-blank-space'
      }
    ]
  );

  const grossProfitMarginFields = [];

  if(type === TYPE.RESOURCE_FORECASTING) {
    grossProfitMarginFields.push({
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      id: 22
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      id: 23
    },
    {
      value: '$',
      subValue: '%',
      type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
      id: 24
    });
  }else{
    grossProfitMarginFields.push(
      {
        value: '$',
        subValue: '%',
        type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
        id: 24
      });
  };

  returnResourceData.resourceData.push([
    {
      value: 'Gross Profit Margin',
      type: CELL_TYPES.ROLE,
      hideControls: true,
      id: 21
    },
    ...grossProfitMarginFields,
    ...grossProfitMargin,
    {
      value: preciseNumberFormatter(resourceLevelForecastData.summary.grossMargin),
      subValue: `${preciseNumberFormatter(resourceLevelForecastData.summary.grossMarginPercentage,{isPercentage:true})}%`,
      type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      id: 25
    }
  ]);
};

export const getYearMonthHeader = (forecastingPeriodSummary,type,isSplit = false,setCrossover=true) => {
  const monthAndYear = forecastingPeriodSummary?.map(({ periodId,crossOverMonth }) => {
    const monthValue = `${periodId}`.substring(4, 6);
    const yearValue = `${periodId}`.substring(0, 4);
    const month = moment(monthValue, 'MM').format('MMM').toUpperCase();
    return isSplit ? {
      name: yearValue,
      pID:periodId,
      parent: false,
      subType: crossOverMonth && setCrossover? CROSSOVER_MONTH_SUBTYPE:'',
      subName: month
    } : {
      name: yearValue,
      pID:periodId,
      parent: false,
      subType: crossOverMonth && setCrossover ? CROSSOVER_MONTH_SUBTYPE:'',
      subName: month,
      ...type
    };
  });
  return monthAndYear;
};

export const getPeriodSummary= (resourceLevelForecastData, returnResourceData, forecastingType, selectedGrid) => {

  const data = getYearMonthHeader(resourceLevelForecastData?.forecastingPeriodSummary);
  
  if (forecastingType === TYPE.PROJECT_FORECASTING) {
    returnResourceData?.headerData.push
    (
      {
        name:'',
        subName:'',
        id:50,
        type: CELL_TYPES.HEADER_TOGGLE
      },
      {
        name: PROJECT_FORECASTING.COST_TYPE,
        id:51,
        type: CELL_TYPES.HEADER,
        subName: PROJECT_FORECASTING.COST_HR
      },
      {
        name: PROJECT_FORECASTING.INFLATION,
        id:52,
        type: CELL_TYPES.HEADER,
        subName: '(%)'
      },
      {
        name: PROJECT_FORECASTING.HIRING_MONTH,
        id:53,
        type: CELL_TYPES.HEADER,
        subName:''
      },
      {
        name:'',
        id:54,
        type:CELL_TYPES.HEADER_LABEL,
        subName:''
      },
      ...data
    );
  } else {
    returnResourceData?.headerData?.push
    (
      {
        name:'',
        subName:'',
        id:50,
        type: CELL_TYPES.HEADER_TOGGLE
      },
      {
        name: RESOURCE_FORECASTING.BILL,
        id:51,
        type: CELL_TYPES.HEADER,
        subName: RESOURCE_FORECASTING.RATE_HR
      },
      {
        name: RESOURCE_FORECASTING.BASE,
        id:52,
        type: CELL_TYPES.HEADER,
        subName: RESOURCE_FORECASTING.RATE_HR
      },
      {
        name:'',
        id:51,
        type:CELL_TYPES.HEADER_LABEL,
        subName:''
      },
      ...data
    );
  }
  //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
  /* returnResourceData.headerData.push(
    {
      name: RESOURCE_FORECASTING.Total,
      id:54,
      type: CELL_TYPES.HEADER
    });*/

  getPeriodSummaryData(resourceLevelForecastData, returnResourceData, forecastingType, selectedGrid);
};
  
const getFTECostData = (selectedGrid, fte,resourceRevenueWeighted,finalResourceCost,grossMargin, resourceLevelForecastData) => {
  if(resourceLevelForecastData?.forecastLevelType === PROJECT_LEVEL_FORECAST ){
    if(resourceLevelForecastData?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) {
      return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(resourceRevenueWeighted) : preciseNumberFormatter(resourceRevenueWeighted);
    }
    else{
      return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(fte,{isDoublePrecision:true}) : preciseNumberFormatter(finalResourceCost);
    }
  }
  
  return selectedGrid == RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(fte,{isDoublePrecision:true}) : preciseNumberFormatter(grossMargin);
};

const getPeriodSummaryData = (resourceLevelForecastData, returnResourceData, forecastingType, selectedGrid) => {
  const data = resourceLevelForecastData.forecastingPeriodSummary?.map(({ fte, periodId,resourceRevenueWeighted,finalResourceCost, grossMargin }) => {
    return {
      name: getFTECostData(selectedGrid, fte,resourceRevenueWeighted,finalResourceCost,grossMargin, resourceLevelForecastData),
      type: CELL_TYPES.ROLE,
      subName: '',
      id: periodId
    };
  });
    
    
  if (forecastingType === TYPE.PROJECT_FORECASTING) {
    returnResourceData.secondaryHeader = {...returnResourceData.secondaryHeader, preMonthHeader: [...PROJECT_LEVEL_PRE_MONTH_HEADER, 
      {
        /* 
        if billingType is miliestone based, then we need to show cost, don't need to show fte value.
         added this check(resourceLevelForecastData?.billingType !== PROJECT_FORECASTING_TYPE.MILESTONE_BASED)
        */
        name: (selectedGrid === RESOURCE_FORECASTING.FTE && resourceLevelForecastData?.projectRevenueComputationMethod === PROJECT_FORECASTING.POC_BASED_TYPE) 
          ? RESOURCE_FORECASTING.REV_TYPE : (resourceLevelForecastData?.projectRevenueComputationMethod === PROJECT_FORECASTING.POC_BASED_TYPE && selectedGrid !== RESOURCE_FORECASTING.FTE) 
            ? RESOURCE_FORECASTING.REV_TYPE: (selectedGrid === RESOURCE_FORECASTING.FTE) 
              ? RESOURCE_FORECASTING.FTE_TYPE 
              : RESOURCE_FORECASTING.COST_TYPE,
        
        subName:'',
        id:61,
        type: CELL_TYPES.HEADER_SECONDARY,
        subType: CELL_TYPES.HEADER_LABEL
      }
    ]};
    returnResourceData.secondaryHeader = {...returnResourceData.secondaryHeader, preMonthHeader: [...returnResourceData?.secondaryHeader?.preMonthHeader, ...data]};
  } else {
    returnResourceData.secondaryHeader = 
        {
          preMonthHeader: [
            {
              name: '',
              subName: '',
              id: 57,
              type: CELL_TYPES.HEADER_SECONDARY,
              subType: CELL_TYPES.ROLE
            },
            {
              name: '',
              subName: '',
              id: 58,
              type: CELL_TYPES.HEADER_SECONDARY,
              subType: CELL_TYPES.RATE
            },
            {
              name: '',
              subName: '',
              id: 59,
              type: CELL_TYPES.HEADER_SECONDARY,
              subType: CELL_TYPES.RATE
            },
            {
              name:selectedGrid === RESOURCE_FORECASTING.FTE ? FTE : GPM,
              subName:'',
              id:60,
              type: CELL_TYPES.HEADER_SECONDARY,
              subType: CELL_TYPES.HEADER_LABEL
            },
            ...data
          ]
        };
  };

  returnResourceData.secondaryHeader = {
    ...returnResourceData.secondaryHeader
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /*postMonthHeader: [
      {
        name: selectedGrid === RESOURCE_FORECASTING.FTE ? '' :
          forecastingType === PROJECT_FORECAST ? preciseNumberFormatter(resourceLevelForecastData.summary?.resourceCost) :
            preciseNumberFormatter(resourceLevelForecastData.summary?.grossMargin)
        ,
        subName: '',
        id: 60,
        type: CELL_TYPES.HEADER_SECONDARY
      }
    ]*/
  };
};

// Horizontal split-cell summary
export const buildHorizontalSplitCellSummary = (resourceLevelForecastData , isAccountLevel = false) => {
  const returnResourceData = {'headerData': [], 'resourceSummary': []  };
  getSummaryHeaderMonth(resourceLevelForecastData?.forecastingPeriodSummary ?? resourceLevelForecastData?.forecastPeriodSummary , returnResourceData, true);

  returnResourceData?.resourceSummary?.push
  (
    [
      {
        type: CELL_TYPES.BLANK_SPACE,
        id: 'header-blank-space'
      }
    ]
  );

  const gridData = isAccountLevel ? HORIZONTAL_SPLIT_CELL_SUMMARY_ACCOUNT : HORIZONTAL_SPLIT_CELL_SUMMARY;
  const clonedgridData = _cloneDeep(gridData);
  const periodSummary = resourceLevelForecastData.forecastingPeriodSummary ?? resourceLevelForecastData?.forecastPeriodSummary;
  periodSummary.forEach((summaryItem) => {
    clonedgridData.forEach(item => {
      const obj = {
        value: preciseNumberFormatter(summaryItem[item[0]?.uid]),
        isPastPeriod: isPastPeriodAndNotCrossOverMonth(summaryItem)
      };
      if(item[0]?.subUID){
        obj['subValue'] = `${preciseNumberFormatter(summaryItem[item[0]?.subUID],{isPercentage:true})}%`;
        obj['type'] = 'cost-split-cell-read-only';
      }else{
        obj['type'] = 'cost-read-only';
      }
      item.push(obj);
    });
  });
  clonedgridData.forEach((item) => {
    const obj = {
      value: preciseNumberFormatter(resourceLevelForecastData[item[0]?.uid])
    };
    if(item[0]?.subUID){
      obj['subValue'] = `${preciseNumberFormatter(resourceLevelForecastData[item[0]?.subUID],{isPercentage:true})}%`;
      obj['type'] = 'cost-split-cell-read-only';
    }else{
      obj['type'] = 'cost-read-only';
    }
    item.push(obj);
  });
  returnResourceData?.resourceSummary?.push(...clonedgridData);
  return returnResourceData;
};

//Expanded summary-grid
export const buildResourceSummary = (resourceLevelForecastData) => {
  const returnResourceData = {'headerData': [], 'resourceSummary': []  };
  getSummaryHeaderMonth(resourceLevelForecastData?.forecastingPeriodSummary ?? resourceLevelForecastData?.forecastPeriodSummary , returnResourceData);
  getResourceSummary(resourceLevelForecastData, returnResourceData);
  return returnResourceData;
};

const getResourceSummary = (resourceLevelForecastData, returnResourceData) => {
  returnResourceData?.resourceSummary?.push
  (
    [
      {
        type: CELL_TYPES.BLANK_SPACE,
        id: 'header-blank-space'
      }
    ]
  );
  
  const summaryData = {resourceRevenue: [], resourceCost: [], grossMargin: []};
  const periodSummary = resourceLevelForecastData.forecastingPeriodSummary ?? resourceLevelForecastData?.forecastPeriodSummary;
  periodSummary.forEach((item) => {
    summaryData.resourceRevenue.push({
      value: preciseNumberFormatter(item?.totalRevenue),
      type: CELL_TYPES.COST_READ_ONLY,
      pID:  `${item.periodId}`,
      isPastPeriod:isPastPeriodAndNotCrossOverMonth(item)
    });
    summaryData.resourceCost.push({
      value: resourceLevelForecastData?.forecastLevelType != null ? preciseNumberFormatter(item.finalResourceCost): preciseNumberFormatter(item.resourceCost),
      type: CELL_TYPES.COST_READ_ONLY,
      pID:  `${item.periodId}`,
      isPastPeriod:isPastPeriodAndNotCrossOverMonth(item)

    });
    summaryData.grossMargin.push({
      value: preciseNumberFormatter(item.grossMargin),
      type: CELL_TYPES.COST_READ_ONLY,
      pID:  `${item.periodId}`,
      isPastPeriod:isPastPeriodAndNotCrossOverMonth(item)
    });
  });

  returnResourceData.resourceSummary.push(
    [
      {
        value: 'Total Revenue',
        type: CELL_TYPES.COST_READ_ONLY
      },
      ...summaryData.resourceRevenue,
      {
        value: preciseNumberFormatter(resourceLevelForecastData?.summary?.totalRevenue),
        type: CELL_TYPES.COST_READ_ONLY
      }
    ]
  );
  returnResourceData.resourceSummary.push(
    [
      {
        value: 'Resource Cost',
        type: CELL_TYPES.COST_READ_ONLY
      },
      ...summaryData.resourceCost,
      {
        value: preciseNumberFormatter(resourceLevelForecastData.summary?.finalResourceCost),
        type: CELL_TYPES.COST_READ_ONLY
      }
    ]
  );
  returnResourceData.resourceSummary.push(
    [
      {
        value: 'Gross Profit Margin',
        type: CELL_TYPES.COST_READ_ONLY
      },
      ...summaryData.grossMargin,
      {
        value: preciseNumberFormatter(resourceLevelForecastData.summary?.grossMargin),
        type: CELL_TYPES.COST_READ_ONLY
      }
    ]
  );
};

const getSummaryHeaderMonth = (forecastingPeriodSummary, returnResourceData, isSplit = false) => {
  const data = getYearMonthHeader(forecastingPeriodSummary, {type: 'month'} , isSplit);
  if(isSplit){
    returnResourceData?.headerData?.push
    (
      {
        name:'',
        subName:'',
        id:50,
        type:'header'
      },
      {
        name:'',
        id:51,
        type:'header-label',
        subName:''
      },
      ...data
    );
  }else{
    returnResourceData?.headerData?.push(
      {
        type:CELL_TYPES.HEADER
      },
      ...data
      //@todo The 'total' column is temporarily commented out to accommodate potential future use.
    /*
    {
      name: RESOURCE_FORECASTING.Total,
      type:CELL_TYPES.HEADER
    }
    */
    );
  }
};

//split cell update
export const splitCellUpdate = (value, planType, id, resourceId, valueToUpdate, forecastingData) => {
  if(planType === 'forecastingRoles'){
    const updatedResource = forecastingData[planType].find((item) => item.slNo == resourceId);
    const updatedCell = updatedResource?.foreCastingRolePlanPeriodDetails?.find((foreCastingRolePlanPeriodDetail) => foreCastingRolePlanPeriodDetail.periodId === id);
    
    // eslint-disable-next-line no-useless-escape
    updatedCell[valueToUpdate] = Number(value.replace(ESCAPE_NUMBER,''));
  }else{
    const updatedResource = forecastingData[planType][0];
    const updatedCell = updatedResource?.periodDetailsList?.find((periodDetailList) => periodDetailList.periodId === id);
    updatedCell['percentageAllowed'] = (planType === RESOURCE_FORECASTING.DIRECT_EXPENSE_KEY && valueToUpdate === RESOURCE_FORECASTING.PERCENTAGE_KEY);
    if(updatedCell){
      // eslint-disable-next-line no-useless-escape
      updatedCell[valueToUpdate] = Number(value.replace(ESCAPE_NUMBER,''));
    }
  }
};

export const getSubValue = (rolePlanPeriodDetail, selectedGrid) => {
  if(rolePlanPeriodDetail.cellState === CELL_DATA_TYPE.NON_EXIST) {
    return '';
  }else{
    return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(rolePlanPeriodDetail?.utilisationPercentage, { isDoublePrecision: true, showPercentageSign: true, info: rolePlanPeriodDetail }) : '';
  }
};

export const getCellValue = (rolePlanPeriodDetail, selectedGrid, value) => {
  if(rolePlanPeriodDetail.cellState === CELL_DATA_TYPE.NON_EXIST){
    return '';
  }else{
    return selectedGrid === RESOURCE_FORECASTING.FTE ? preciseNumberFormatter(rolePlanPeriodDetail?.fte, { isDoublePrecision: true, info: rolePlanPeriodDetail }) : value;
  }
};

export const getIsCellEditable = (rolePlanPeriodDetail,resource, selectedGrid, forecastingType, viewOnlyPermission) => {
  if (viewOnlyPermission) return  CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  if(resource?.resourceData?.status == USER_STATUS.INACTIVE){
    return  CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  }else{
    return selectedGrid !== RESOURCE_FORECASTING.FTE ? forecastingType === TYPE.PROJECT_FORECASTING ? CELL_TYPES.COST_READ_ONLY : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : rolePlanPeriodDetail.cellState === CELL_DATA_TYPE.EDITABLE ? CELL_TYPES.COST_SPLIT_CELL : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY;
  }
};

export const getSubCellValue = (resource) => {
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

export const getOptionsListForUsers = (userList) => {
  let optionsList = [];
  if (userList) {
    optionsList = userList.map(({id, firstName, lastName, employeeId, email}) => ({
      id,
      content: `${firstName} ${lastName} (${employeeId} | ${email})`,
      label:
      `${firstName} ${lastName} (${employeeId} | ${email})`
    }));
  }
  
  return optionsList;
};

/**
 * 
 * @param {
*   fields: [],
*   periodSummary: [],
*   summary: {}
* }
* @returns [resourceSummary]
*/
export const generateResourceSummary = ({afterLabelExtraFields = [], fields = [], periodSummary = [], readOnlyType = CELL_TYPES.COST_READ_ONLY}) => {
  
  const hasValue = (value,name) => (value !== undefined && value !== null) ? formatResourceSummary(name,value) : '';
  if (fields?.length) {
    const data = [];
    fields?.map(field => {
      const rowData = [];
      // This is for creating cell values
      if(field?.blankRow){
        data.push([{
          type: CELL_TYPES.BLANK_SPACE
        }]);
      }
      const pastPeriod = periodSummary.some(item => isPastPeriodAndNotCrossOverMonth(item));
      // This is for creating cell for label
      rowData.push({
        id: field?.id || '',
        value:  field?.label || '',
        subValue:  field?.subLabel || '',
        type: field?.labelType,
        hideControls: field?.hideControls,
        pID: field?.pID || '',
        isPastPeriod: pastPeriod
      });
      // This is for adding empty cells after label
      if(afterLabelExtraFields?.length){
        rowData.push(...afterLabelExtraFields);
      };
        
      // This is for creating cell values
      if ((field?.fieldLevelArray?.length && field?.fieldLevelArray) || (periodSummary?.length)) {
        const iterator = field?.fieldLevelArray?.length ? field?.fieldLevelArray : periodSummary;
        iterator?.map(item => {
          rowData.push({
            field: field?.name,
            value: hasValue(item[field?.name],field?.name),
            subValue: hasValue(item[field?.name],field?.name),
            type: field?.readOnlyType || field?.valueType[item?.cellState] || readOnlyType,
            pID: field?.pID || '',
            showErrorCell: item?.cellFlag === CELL_FLAG.IMPORTANT,
            updateType: field?.updateType || '',
            isPastPeriod:isPastPeriodAndNotCrossOverMonth(item),
            /* eslint-disable react/display-name */
            valueRenderer: (item?.cellFlag === CELL_FLAG.IMPORTANT && field?.tooltip) ? (value) => <SnapTooltip
              className="main-tooltip value-tooltip"
              content={field?.tooltip?.content(item?.costVariance)}
              // eslint-disable-next-line react/jsx-closing-bracket-location
            >
              <span className="value-viewer-inline">
                {value}
              </span>
            </SnapTooltip> : false
            // @todo : Alternate WIP approach for dynamic tooltip.
            //...((hasValue(field?.toolTip) && item?.cellFlag === CELL_FLAG.IMPORTANT) && {valueRenderer: field?.toolTip.bind(hasValue(item[field?.name]), item.costVariance)}) 
          });
        });
      }
      //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
      // This is for creating cell for total, default showTotal: true
      /*if (field?.showTotal || field?.showTotal === undefined) {
        rowData.push({
          field: field?.name,
          value: hasValue(summary[field?.name],field?.name),
          subValue: hasValue(summary[field?.name],field?.name),
          type: field?.readOnlyType || readOnlyType,
          pID: field?.pID || ''
        });
      }*/
      data.push(rowData);
    });
    return data;
  }
};

const formatResourceSummary = (fieldName, data) => {
  if (fieldName.toLowerCase().includes('percentage')) {
    return preciseNumberFormatter(data, { isPercentage: true });
  } else if (fieldName.toLowerCase() === 'avgrate') {
    return preciseNumberFormatter(data, { isSinglePrecision: true });
  }
  return preciseNumberFormatter(data);
};

export const formatForecastingPeriodSummary = (data, gridData) => {
  // const formatted = _cloneDeep(data);
  const summary = getGridMonths(data);
  summary.map((item, i) => {
    gridData?.map(col => {
      const value = col[i + 1].value;
      if (typeof value === 'string') {
        item[col[i + 1].field] = parseInt(getTransformedNumber(value));
      } else {
        item[col[i + 1].field] = value; 
      }
    });
  });
  return summary;
};

export const formatGridPayloadToAPIPayload = (data, gridData, fieldsToUpdate) => {
  const stateData = _cloneDeep(data);

  gridData?.map((col, index) => {
    const searchedIndex = col.findIndex(gridRow => fieldsToUpdate.includes(gridRow?.field));
    if(searchedIndex > 0){
      let k = 0;
      for(let i = searchedIndex; i < searchedIndex + stateData?.length; i++){
        stateData[k][gridData[index][i]?.field] = getTransformedNumber(gridData[index][i]?.value);
        k++;
      }
    }
  });
  return stateData;
};

export const getCompletionPercentage = (data, returnResourceData, viewOnlyPermission) => {
  const details = {
    fields: [
      {
        name: 'computedCompletionPercentage',
        label: 'Expected project completion %',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        fieldLevelArray : data.forecastPoCDetails?.computedCompletionPercentagePeriodDetails,
        readOnlyType: viewOnlyPermission ? CELL_TYPES.COST_READ_ONLY : ''
      },
      {
        name: 'deliveryCompletionPercentage',
        label: 'Actual project completion %',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        tooltip: {content: COST_VARIANCE},
        hideControls: true,
        readOnlyType: viewOnlyPermission ? CELL_TYPES.COST_READ_ONLY : ''
      }
    ],
    afterLabelExtraFields : [{
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
    periodSummary: data?.forecastPoCDetails?.deliveryCompletionPercentagePeriodDetails,
    summary: data?.summary
  };
  returnResourceData.resourceData.push(generateResourceSummary(details)[0], generateResourceSummary(details)[1]);
};

export const renderValueWithTooltip = (value) => {
  return (
    <SnapTooltip
      className="main-tooltip value-tooltip"
      content={ADJUSTMENT_THRESHOLD_PEAKED}
    >
      <span className="value-viewer-inline">
        {value}
      </span>
    </SnapTooltip>
  );
};

export const validateDuplicateResource = (forecastingData, userId, tab) => {
  if (!Array.isArray(forecastingData)) {
    return false;
  }
  if(tab){
    return forecastingData.some(item => item && item.resourceData && item.department?.toLowerCase() === tab?.toLowerCase() && item.resourceData.userId === userId);
  }else{
    return forecastingData.some(item => item && item.resourceData && item.resourceData.userId === userId);
  }
};

export const getModifyProbabilityDetails = (forecastData) => {

  const { financialYearMRRTotal , totalContractValue, probabilityOverride, opportunityStage, projectStart, projectEnd} = forecastData;

  return [
    {
      id: _uniqueId(),
      value: financialYearMRRTotal || '--',
      label: PROBABILITY_MODAL.MRR_LABEL
    },
    {
      id: _uniqueId(),
      value: totalContractValue,
      label: PROBABILITY_MODAL.TCV_LABEL
    },
    {
      id: _uniqueId(),
      value: probabilityOverride,
      label: PROBABILITY_MODAL.PROBABILITY_LABEL
    },{
      id: _uniqueId(),
      value: opportunityStage || '--',
      label: PROBABILITY_MODAL.SALES_STAGE_LABEL
    },
    {
      id: _uniqueId(),
      value: moment(projectStart).format(DATE_FORMAT.FORMAT_9),
      label: PROBABILITY_MODAL.START_DATE_LABEL
    },
    {
      id: _uniqueId(),
      value: moment(projectEnd).format(DATE_FORMAT.FORMAT_9),
      label: PROBABILITY_MODAL.END_DATE_LABEL
    }
  ];
};

export const updateSplitCellValue = (planType, id, resourceId, valueToUpdate,forecastingData) => {
  if(planType === 'forecastingRoles'){  
    const updatedResource = forecastingData[planType].find((item) => item.slNo == resourceId);
    const updatedCell = updatedResource?.foreCastingRolePlanPeriodDetails?.find((foreCastingRolePlanPeriodDetail) => foreCastingRolePlanPeriodDetail.periodId === id);
    for (const [key, val] of Object.entries(valueToUpdate)) {
      updatedCell[key] = String(val).includes('%') ? val?.replace('%', '') : val;
    }
  }else{
    const updatedResource = resourceId ? forecastingData[planType]?.find(item => item.id === resourceId) : forecastingData[planType][0];
    const updatedCell = updatedResource?.periodDetailsList?.find((periodDetailList) => periodDetailList.periodId === id);
    // @todo : Below line can be removed in future
    //updatedCell['percentageAllowed'] = (planType === RESOURCE_FORECASTING.DIRECT_EXPENSE_KEY && valueToUpdate === RESOURCE_FORECASTING.PERCENTAGE_KEY);
    if(updatedCell) {
      for (const [key, val] of Object.entries(valueToUpdate)) {
        updatedCell['percentageAllowed'] = false;
        if(key === RESOURCE_FORECASTING.PERCENTAGE_KEY && preciseNumberFormatter(updatedCell[key], {isPercentage:true}) !== preciseNumberFormatter(val, {isPercentage:true})){
          updatedCell['percentageAllowed'] = true;
        }
        updatedCell[key] = String(val).includes('%') ? val?.replace('%', '') : val;      
      }
    }
  }
};

export const getForecastingTableHeader = (financialYear) => {
  return [
    {
      id: 'opportunity',
      label: <div className="cell-header">Opportunity Name & ID</div>
    },
    {
      id: 'salesStage',
      label: <div className="cell-header">Engagement & Billing Type</div>
    },
    {
      id: 'forecast',
      label: <div className="cell-header">Forecasting Type</div>
    },
    {
      id: 'mrr',
      label: <div className="cell-header">Unweighted<br/>MRR {FINANCIAL_YEAR.FY}{financialYear}</div> 
    },
    {
      id: 'weightedMRR',
      label: <div className="cell-header">Weighted<br/>MRR {FINANCIAL_YEAR.FY}{financialYear}</div>
    },
    {
      id: 'forecastRev',
      label: <div className="cell-header">Forecast<br/>Revenue {FINANCIAL_YEAR.FY}{financialYear}</div>
    },
    {
      id: 'gpm',
      label: <div className="cell-header">Forecast<br/>GPM {FINANCIAL_YEAR.FY}{financialYear}</div>
    },
    {
      id: 'monthlyTrends',
      label: (
        <div className="cell-header text-center">Monthly Trends <br/>(Revenue,GP)</div>
      )
    },
    {
      id: 'quarterlyTrends',
      label: (
        <div className="cell-header text-center">Quarterly Trends <br/>(Revenue,GP)</div>
      )
    },
    {
      id: 'update',
      label: <div className="cell-header">Updated By</div>
    },
    {
      id: 'checkbox',
      label: <div className="cell-header" />
    }
  ];
};

export function miniGraphMapper(data,isQuarterly) {
  if (!data || data.length === 0) {
    return null;
  }

  const forecastTrends = data?.map((value) => {
    if (value) {
      const { yearQuarter, yearMonth, totalRevenue, grossMargin, grossMarginPercentage } = value;
      const area =  grossMargin ;
      const name = isQuarterly ? quarterlyLabel(yearQuarter) : monthlyLabel(yearMonth)?.toLocaleUpperCase();
      const toolTipLabel = isQuarterly ? `${yearQuarter?.quarter} ${yearQuarter?.year}` : `${yearMonth[0]} ${monthlyLabel(yearMonth)}`;
      return {
        name,
        'label': preciseNumberFormatter(totalRevenue),
        'line': Math.round( grossMarginPercentage * 100) / 100,
        'bar': totalRevenue,
        toolTipLabel,
        'lineDollar': preciseNumberFormatter(grossMargin),
        'totalRevenue':preciseNumberFormatter(totalRevenue),
        area
      };
    }
    return null;
  });
  
  return forecastTrends;
}

export const getLabelForCrmPip = (modalType, source) => `${modalType}${source ? ` (${source})` : ''}`;

export const isPastPeriodAndNotCrossOverMonth = (item) => {
  return isPastPeriod(item) && !item?.crossOverMonth;
};

export const isPastPeriodAndPNL = (item) => {
  return (isPastPeriod(item) && !isLastMonth(item)) || (isLastMonth(item) && item?.source === 'PNL') ;
};

export const isLastMonth = (item) => {
  if (!item?.periodId) return false;
  const periodId = item?.periodId.toString();
  const periodYear = parseInt(periodId.slice(0, 4));
  const periodMonth = parseInt(periodId.slice(4, 6));
  const currentYear = moment().year();
  const lastMonth = moment().month(); 
  return (periodYear === currentYear && periodMonth === lastMonth);
};

export const isPastPeriod = (item) => {
  if (!item?.periodId) return false;
  const periodId = item?.periodId.toString();
  const periodYear = parseInt(periodId.slice(0, 4));
  const periodMonth = parseInt(periodId.slice(4, 6));
  const currentYear = moment().year();
  const currentMonth = moment().month()+1; 
  return (periodYear < currentYear) || (periodYear === currentYear && periodMonth < currentMonth);
};

export const getGridMonths = (filteringArray) => {
  const startAndEndDate = getStartAndEndDate();
  if(startAndEndDate){
    return _filter(filteringArray, (record) => {
      return record.periodId >= startAndEndDate[0] && record.periodId <= startAndEndDate[1];
    });;
  }
  return filteringArray;
};

export const getStartAndEndDate = () => {
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  if(forecastCycles?.forecastDisplayWindowStartDate && forecastCycles?.forecastDisplayWindowEndDate){
    const startDate = forecastCycles?.forecastDisplayWindowStartDate?.split('-');
    const forecastDisplayWindowStartDate = `${startDate[0]}${startDate[1]}`;
  
    const endDate = forecastCycles?.forecastDisplayWindowEndDate?.split('-');
    const forecastDisplayWindowEndDate = `${endDate[0]}${endDate[1]}`;
    return [forecastDisplayWindowStartDate, forecastDisplayWindowEndDate];
  }
  return false;
};

export const opportunityTableHeader = (financialYear) => {
  return([
    { 
      id: 'opportunity',
      label: <div className="cell-header">Opportunity Name & ID</div>
    },
    {
      id: 'source',
      label: <div className="cell-header">Source</div>
    },
    { id: 'engagementType',
      label: <div className="cell-header">Engagement Type</div>
    },
    {
      id:'billingType',
      label: <div className="cell-header">Billing Type</div>
    },
    {
      id: 'salesStage',
      label: <div className="cell-header">Sales Stage</div>
    },
    {
      id: 'mrr',
      label: <div className="cell-header">Unweighted<br/>MRR {FINANCIAL_YEAR.FY}{financialYear}</div>
    },

    {
      id: 'tcv',
      label: <div className="cell-header">TCV</div>
    },
    {
      id: 'startDate',
      label: <div className="cell-header">Start Date</div>
    },
    {
      id: 'endDate',
      label: <div className="cell-header">End Date</div>
    },
    {
      id: 'projectManager',
      label: <div className="cell-header">Project Manager</div>
    },
    {
      id: 'override',
      label: <div className="cell-header">Updated<br/>Probability
        <InfoTooltip
          infoContent={
            'Probability updates limited to forecasting scope only, not CRM.'
          }
        />
      </div>
    },
    // TODO: Commenting out will need in future: Custom Groups
    // {
    //   id: 'phase',
    //   label: <div className="cell-header">Phase</div>
    // },
    {
      id: 'checkbox',
      label: <div className="cell-header">Include</div>
    },
    {
      id: 'edit',
      label: <div className="cell-header"/>
    }
  ]);
};

export const getForecastCycleDuration = () => {
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  if(forecastCycles?.forecastDurationStartDate && forecastCycles?.forecastDurationEndDate){
    const startDate = forecastCycles?.forecastDurationStartDate?.split('-');
    const forecastDurationStartDate = `${startDate[0]}${startDate[1]}`;
  
    const endDate = forecastCycles?.forecastDurationEndDate?.split('-');
    const forecastDurationEndDate = `${endDate[0]}${endDate[1]}`;
    return {forecastDurationStartDate, forecastDurationEndDate};
  }
};