import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';
import _isNil from 'lodash/isNil';
import _isUndefined from 'lodash/isUndefined';
import { CELL_TYPES, EDIT_ACTION, preciseNumberFormatter, getTransformedNumber} from '@revin-utils/utils';
import { getYearMonthHeader, getDirectExpenses, getGrossProfitMargin, renderValueWithTooltip, isPastPeriodAndNotCrossOverMonth, getGridMonths, isPastPeriod } from 'utils/forecastingCommonFunctions';
import { TYPE, PROJECT_FORECASTING_TYPE, FORECASTING_DATA, CELL_DATA_TYPE, PROJECT_FORECASTING, COST_REVENUE_TYPE,  PROJECT_LEVEL_CONSTANTS, AD_HOC} from 'utils/constants';

export const buildProjectForecastData = (projectLevelForecastData,thresholdValue, viewOnlyPermission) => {
  const returnData = {'headerData': [], 'resourceData': [], 'secondaryHeader' : {}};

  //get top summary
  getPeriodSummary(projectLevelForecastData, returnData);
  
  //get revenue grid data
  generateRevenue(projectLevelForecastData, returnData,thresholdValue, EDIT_ACTION.EDIT_REVENUE, viewOnlyPermission);

  //get cost grid data
  generateCost(projectLevelForecastData, returnData, EDIT_ACTION.EDIT_COST, viewOnlyPermission);

  //get direct expenses
  getDirectExpenses(projectLevelForecastData, returnData, TYPE.PROJECT_FORECASTING, viewOnlyPermission);

  //gross profit margin
  getGrossProfitMargin(projectLevelForecastData, returnData);
  return returnData;
};


const generateRevenue = (projectLevelForecastData, returnData,thresholdValue, type, viewOnlyPermission) => {

  /* 
    When billing type is Milestone Based, in that case show revenue button and
    if there is no data available for revenue, then show this
  */
  if((projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) &&
    (!projectLevelForecastData?.projectCostComputationMethod || !projectLevelForecastData?.projectRevenueComputationMethod)){
    if (!viewOnlyPermission) {
      returnData.resourceData.push(
        [
          {
            type: CELL_TYPES.BLANK_SPACE,
            id: _uniqueId()
          }
        ],      
        [
          {
            name: '',
            id: _uniqueId(),
            type: CELL_TYPES.BUTTON_ROW_MIDDLE,
            subType: 'button',
            button: FORECASTING_DATA.REVENUE_AND_COST_BUTTON_TEXT
          }
        ]
      );
    }
  }else if(( projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.PER_UNIT) && 
    !projectLevelForecastData?.projectRevenueComputationMethod){
    if (!viewOnlyPermission) {
      returnData.resourceData.push(
        [
          {
            name: FORECASTING_DATA.REVENUE,
            id: _uniqueId(),
            parent: true,
            type: CELL_TYPES.BUTTON_ROW_MIDDLE,
            subType: 'button',
            button: FORECASTING_DATA.REVENUE_BUTTON_TEXT
          }
        ]
      );
    }
  }else{
    // if there is data available for revenue, then show this
    generateHeaderNames(projectLevelForecastData, returnData, type, viewOnlyPermission);
    generateGridData(projectLevelForecastData, returnData, type,thresholdValue, viewOnlyPermission);
  }
  return returnData;
};

const generateCost = (projectLevelForecastData, returnData, type, viewOnlyPermission) => {

  // if there is no data available for cost,then show this cost button
  
  if(projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED){
    if(projectLevelForecastData?.projectCostComputationMethod){
      generateHeaderNames(projectLevelForecastData, returnData, type, viewOnlyPermission);
      generateGridData(projectLevelForecastData, returnData, type, null, viewOnlyPermission);
    }
    return;
  }

  if(!projectLevelForecastData?.projectCostComputationMethod && projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.PER_UNIT){
    if (!viewOnlyPermission) {
      returnData.resourceData.push(
        [
          {
            name: FORECASTING_DATA.COST,
            id: _uniqueId(),
            parent: true,
            type: CELL_TYPES.BUTTON_ROW_MIDDLE,
            subType: 'button',
            button: FORECASTING_DATA.COST_BUTTON_TEXT
          }
        ]
      );
    }
  }else{
    // when we need to show grid for cost
    generateHeaderNames(projectLevelForecastData, returnData, type, viewOnlyPermission);
    generateGridData(projectLevelForecastData, returnData, type, null, viewOnlyPermission);
  }

};


//it will generate first column, to show revenue and cost labels
const generateHeaderNames = (projectLevelForecastData, returnData, type, viewOnlyPermission) => {
  const isMilestoneOrPerUnit = (projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED ||
    projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.PER_UNIT) ;
  let editHeader;
  if(((projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) || (projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.PER_UNIT)) && (type === EDIT_ACTION.EDIT_COST || type === EDIT_ACTION.EDIT_REVENUE)){
    editHeader = type;
  }
  
  if(type === EDIT_ACTION.EDIT_COST){
    editHeader = type;
  }

  returnData.resourceData.push
  (
    [
      {
        value: (type === EDIT_ACTION.EDIT_COST) ? PROJECT_LEVEL_CONSTANTS.COST : PROJECT_LEVEL_CONSTANTS.REVENUE,
        subName: getSubName(projectLevelForecastData, type),
        type: CELL_TYPES.LABEL_ROW_HEADER,
        parent: true,
        editHeader: (!isMilestoneOrPerUnit || viewOnlyPermission) ? '' : editHeader,
        id: projectLevelForecastData.accountForecastCandidateId
      },
      {
        value: '',
        type: CELL_TYPES.LABEL_ROW,
        subType: CELL_TYPES.LABEL_CELL
      },
      {
        value: '',
        type: CELL_TYPES.LABEL_ROW,
        colSpan: 19
      }
    ] 
  );
};

const getDataSource = (revenueDataSource , costDataSource , type, probabilityOverride) => {
  if(type === EDIT_ACTION.EDIT_REVENUE && revenueDataSource){
    return `${ revenueDataSource} | ${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
  }else if(costDataSource){
    return `${ costDataSource} | ${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
  }else{
    return `${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
  }
};

const getCRMPIPLabel = (projectLevelForecastData,type) => {
  const { revenueDataSource, probabilityOverride,costDataSource, projectRevenueComputationMethod } = projectLevelForecastData;

  if(projectLevelForecastData.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED){
    if(projectRevenueComputationMethod === COST_REVENUE_TYPE.EXTERNAL_POC){
      return `${COST_REVENUE_TYPE.EXTERNAL_POC_KEY} | ${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
    }else{
      return getDataSource(revenueDataSource, costDataSource , type , probabilityOverride);
    }
  }
  return getDataSource(revenueDataSource, costDataSource , type , probabilityOverride);
};

const getSubName = (projectLevelForecastData, type) => {
  const { billingType, projectRevenueComputationMethod, probabilityOverride, forecastPerUnitList, projectCostComputationMethod } = projectLevelForecastData;
  const incremental = forecastPerUnitList?.[0]?.incremental ?? undefined;
  const isMilestoneOrPerUnit = billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED || billingType === PROJECT_FORECASTING_TYPE.PER_UNIT;
  if(type === PROJECT_LEVEL_CONSTANTS.REVENUE.toUpperCase() && projectLevelForecastData?.opportunityType === AD_HOC && projectRevenueComputationMethod === PROJECT_FORECASTING.CRM_PIP){
    return `${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
  }
  if(type === PROJECT_LEVEL_CONSTANTS.COST.toUpperCase() &&  projectLevelForecastData?.opportunityType === AD_HOC && projectCostComputationMethod === PROJECT_FORECASTING.CRM_PIP){
    return `${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
  }
  if (type === EDIT_ACTION.EDIT_REVENUE) {
    if (isMilestoneOrPerUnit) {
      switch (projectRevenueComputationMethod) {
        case COST_REVENUE_TYPE.POC_BASED:
          return PROJECT_FORECASTING.POC_BASED;
        case COST_REVENUE_TYPE.EXTERNAL_PER_UNIT:
          return `${PROJECT_FORECASTING.EXTERNAL_PU_LABEL} | ${PROJECT_LEVEL_CONSTANTS.PROBABILITY} : ${probabilityOverride}%`;
        case COST_REVENUE_TYPE.PER_UNIT:
          return `${PROJECT_FORECASTING.PLAN_PU_LABEL} | ${incremental ? PROJECT_FORECASTING.INCREMENTAL : PROJECT_FORECASTING.NON_INCREMENTAL}`;
        default:
          return getCRMPIPLabel(projectLevelForecastData,type);
      }
    }
    return getCRMPIPLabel(projectLevelForecastData, type);
  } else {
    return projectCostComputationMethod === PROJECT_FORECASTING.USER_ALLOCATION ? PROJECT_FORECASTING.ALLOCATION : getCRMPIPLabel(projectLevelForecastData);
  }
};



const generateGridData = (projectLevelForecastData, returnData, type,thresholdValue=null, viewOnlyPermission) => {
  const revenue = { revenueData :[], weighted : [], unWeighted :[], adjustments: [], finalRevenue: []};

  const summary = getGridMonths(projectLevelForecastData?.forecastingPeriodSummary);
  summary?.forEach((item) => {
    if (type === PROJECT_LEVEL_CONSTANTS.REVENUE.toUpperCase()) {
      revenue.unWeighted.push({ value: preciseNumberFormatter(item.resourceRevenue),summary:item});
      revenue.weighted.push({ value: preciseNumberFormatter(item.resourceRevenueWeighted),summary:item});
    } else {
      revenue.unWeighted.push({ value: preciseNumberFormatter(item.resourceCost),summary:item});
      revenue.weighted.push({ value: preciseNumberFormatter(item.resourceCostWeighted),summary:item});
    }
 
    const adjustmentChecker= getAdjustmentError(thresholdValue,item);

    revenue.adjustments.push({
      value: getAdjustmentRowData(item, type),
      showErrorCell:adjustmentChecker,
      copyRenderer:true,
      valueRenderer:adjustmentChecker? renderValueWithTooltip: false,
      pID: projectLevelForecastData.accountForecastCandidateId,
      type: getAdjustmentRowType(item, viewOnlyPermission),
      isPastPeriod:isPastPeriodAndNotCrossOverMonth(item)
    });
    
    revenue.finalRevenue.push({
      value: type === EDIT_ACTION.EDIT_COST ? preciseNumberFormatter(item.finalResourceCost) : preciseNumberFormatter(item.finalResourceRevenue),
      type: CELL_TYPES.COST_READ_ONLY,
      pID: projectLevelForecastData.accountForecastCandidateId,
      isPastPeriod:isPastPeriodAndNotCrossOverMonth(item)
    });
  });

  const unWeightedlabel = type === PROJECT_LEVEL_CONSTANTS.REVENUE.toUpperCase() ? PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_REVENUE : PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_COST;
  const weightedlabel = type === PROJECT_LEVEL_CONSTANTS.REVENUE.toUpperCase() ? PROJECT_LEVEL_CONSTANTS.WEIGHTED_REVENUE : PROJECT_LEVEL_CONSTANTS.WEIGHTED_COST;
  weightedUnweightedRows(returnData, projectLevelForecastData, unWeightedlabel, revenue.unWeighted);
  weightedUnweightedRows(returnData, projectLevelForecastData, `${weightedlabel} (${projectLevelForecastData?.probabilityOverride}%)`, revenue.weighted);

  
  //resource-data with total
  // if(isMilestoneOrPerUnit){
  //   returnData.resourceData.push([
  //     {
  //       value: type === EDIT_ACTION.EDIT_REVENUE ? REVENUE : isCrmPipCostMethod ? PROJECT_FORECASTING.COST_LABEL : PROJECT_FORECASTING.RESOURCE_COST,
  //       subValue: PROJECT_FORECASTING.WEIGHTED_UNWEIGHTED_SUBHEADER,
  //       type: CELL_TYPES.ROLE,
  //       hideControls: true,
  //       pID: projectLevelForecastData.accountForecastCandidateId
  //     },
  //     {
  //       value: PROJECT_FORECASTING.UNWTD,
  //       subValue: PROJECT_FORECASTING.WTD,
  //       type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
  //       subType: CELL_TYPES.LABEL_CELL
  //     },
  //     ...revenue.revenueData
  //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
  /* {
      value: type === EDIT_ACTION.EDIT_REVENUE ? preciseNumberFormatter(projectLevelForecastData.summary.resourceRevenue) : preciseNumberFormatter(projectLevelForecastData.summary.resourceCost),
      subValue: type === EDIT_ACTION.EDIT_REVENUE ? preciseNumberFormatter(projectLevelForecastData.summary?.resourceRevenueWeighted) : preciseNumberFormatter(projectLevelForecastData.summary?.resourceCostWeighted),
      type: type === EDIT_ACTION.EDIT_REVENUE ? (isCrmPipRevenueMethod ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : CELL_TYPES.COST_READ_ONLY) : (isCrmPipCostMethod ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : CELL_TYPES.COST_READ_ONLY)
    }*/
  //   ]);
  // }

  //adjustment, with total value
  returnData.resourceData.push([
    {
      value: FORECASTING_DATA.ADJUSTMENT,
      updateType: type === EDIT_ACTION.EDIT_COST ? EDIT_ACTION.EDIT_COST : EDIT_ACTION.EDIT_REVENUE,
      type: CELL_TYPES.ROLE,
      hideControls: true,
      pID: projectLevelForecastData.accountForecastCandidateId
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      subType: CELL_TYPES.LABEL_CELL
    },
    ...revenue.adjustments,
    {
      value: type === EDIT_ACTION.EDIT_COST ? preciseNumberFormatter(projectLevelForecastData.summary.resourceCostAdjustments): preciseNumberFormatter(projectLevelForecastData.summary.resourceRevenueAdjustments),
      type:CELL_TYPES.COST_READ_ONLY,
      pID: projectLevelForecastData.accountForecastCandidateId
    }
  ]);

  //Final revenue, with total value
  returnData.resourceData.push([
    {
      value: type === EDIT_ACTION.EDIT_REVENUE ? PROJECT_FORECASTING.FINAL_REVENUE : PROJECT_FORECASTING.FINAL_RESOURCE_COST,
      type: CELL_TYPES.ROLE,
      hideControls: true,
      pID: projectLevelForecastData.accountForecastCandidateId
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      subType: CELL_TYPES.LABEL_CELL
    },
    ...revenue.finalRevenue,
    {
      value: type === EDIT_ACTION.EDIT_COST ? preciseNumberFormatter(projectLevelForecastData.summary.finalResourceCost): preciseNumberFormatter(projectLevelForecastData.summary.finalResourceRevenue),
      type: CELL_TYPES.COST_READ_ONLY,
      pID: projectLevelForecastData.accountForecastCandidateId
    }
  ]);
};

const getAdjustmentRowData = (item, type) => {
  if(item.cellState === CELL_DATA_TYPE.NON_EXIST){
    return '';
  }else{
    return type === EDIT_ACTION.EDIT_COST ? preciseNumberFormatter(item?.resourceCostAdjustments) : preciseNumberFormatter(item?.resourceRevenueAdjustments);
  }
};

const getAdjustmentRowType = (item, viewOnlyPermission) => {
  if (viewOnlyPermission) return CELL_TYPES.COST_READ_ONLY;
  return (item.cellState === CELL_DATA_TYPE.NON_EXIST || item.cellState === CELL_DATA_TYPE.NON_EDITABLE) ? CELL_TYPES.COST_READ_ONLY : CELL_TYPES.VALUE;
};


const getAdjustmentError = (thresholdValue, item) => {

  if (
    !thresholdValue ||
    _isNil(item?.resourceRevenueWeighted) ||
    _isNil(item?.resourceRevenueAdjustments) ||
    isNaN(item.resourceRevenueWeighted) ||
    isNaN(item.resourceRevenueAdjustments)
  ) {
    if (_isUndefined(item?.resourceRevenueWeighted)|| _isUndefined(item?.resourceRevenueAdjustments)) {
      console.log('undefined key and object = ', item);
    }
    return false;
  }

  const adjustedRevenueNumber = parseFloat(getTransformedNumber(item.resourceRevenueAdjustments));
  const currentRevenue = parseFloat(getTransformedNumber(item.resourceRevenueWeighted));

  return isOutsideThreshold(currentRevenue, adjustedRevenueNumber, thresholdValue);
};


function isOutsideThreshold(currentRevenue, adjustedValue, threshold) {
  const absoluteRevenue=Math.abs(currentRevenue);
  const thresholdValue = absoluteRevenue / threshold;
  return Math.abs(adjustedValue) > thresholdValue;
};

const getPeriodSummary= (resourceLevelForecastData, returnData) => {
  // Removed this as part of RFM-2886, may need in future
  // const data = getYearMonthHeader(resourceLevelForecastData.forecastingPeriodSummary);

  const summary = getGridMonths(resourceLevelForecastData.forecastingPeriodSummary);
  const data = getYearMonthHeader(summary);

  returnData.headerData.push
  (
    {
      name: '',
      id: _uniqueId(),
      type: CELL_TYPES.HEADER,
      subName: ''
    },
    {
      name:'',
      id: _uniqueId(),
      type:CELL_TYPES.HEADER_LABEL,
      subName:''
    },  
    ...data
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /* {
      name: RESOURCE_FORECASTING.Total,
      id: _uniqueId(),
      type: CELL_TYPES.HEADER
    }*/
  );
};

export const gridUpdate = (gridObj, payloadData) => {
  const summary = getGridMonths(payloadData.forecastingPeriodSummary);
  
  let costData = '';
  let revenueData = '';
  let unweightedRevenue = '';
  let unweightedCost = '';
  //it will iterate through each index if array
  gridObj.some((gridRow, key) => {
    costData = '';
    revenueData = '';
    unweightedRevenue = '';
    unweightedCost = '';

    //if get data for updateType: cost || revenue, update the payload data
    costData = _find(gridRow, {updateType: EDIT_ACTION.EDIT_COST});
    revenueData = _find(gridRow, {updateType: EDIT_ACTION.EDIT_REVENUE});
    unweightedRevenue = _find(gridRow, {updateType: PROJECT_LEVEL_CONSTANTS.unweightedRevenueKey});
    unweightedCost = _find(gridRow, {updateType: PROJECT_LEVEL_CONSTANTS.unweightedCostKey});

    let k = 0;
    
    if(costData?.updateType || revenueData?.updateType || unweightedRevenue?.updateType || unweightedCost?.updateType){
      for(let i = 2; i < gridObj[key].length - 1; i++){
        if(costData?.updateType == EDIT_ACTION.EDIT_COST){
          summary[k].resourceCostAdjustments  = getTransformedNumber(gridObj[key][i].value);
        }
        if(revenueData?.updateType == EDIT_ACTION.EDIT_REVENUE){
          summary[k].resourceRevenueAdjustments = getTransformedNumber(gridObj[key][i].value);
        }
        if(unweightedRevenue?.updateType == PROJECT_LEVEL_CONSTANTS.unweightedRevenueKey){
          summary[k].resourceRevenue = getTransformedNumber(gridObj[key][i].value);
        }
        if(unweightedCost?.updateType == PROJECT_LEVEL_CONSTANTS.unweightedCostKey){
          summary[k].resourceCost = getTransformedNumber(gridObj[key][i].value);
        }
        k++;
      }
    }
  });
};


const weightedUnweightedRows = (returnData, projectLevelForecastData, value, data) => {
  const rowData = [
    {
      value,
      type: CELL_TYPES.ROLE,
      hideControls: true,
      pID: projectLevelForecastData?.accountForecastCandidateId
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      subType: CELL_TYPES.LABEL_CELL
    },

    ...data.map(item => {
      return {
        value: item.value,
        updateType: getUpdateType(value),
        type: isEditableForWeightedROws(projectLevelForecastData,value,item?.summary),
        isPastPeriod: isPastPeriodAndNotCrossOverMonth(item?.summary) 
      };
    })
  ];

  returnData.resourceData.push(rowData);
};

const isEditableForWeightedROws = ({opportunityType, billingType},label,data) =>{
  const isMilestoneOrPerUnit = (billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED ||
    billingType === PROJECT_FORECASTING_TYPE.PER_UNIT) ;
  const isFuturePeriod = !(isPastPeriod(data));
  if(isFuturePeriod && opportunityType === AD_HOC && ((label === PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_REVENUE) || (label === PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_COST)) && !isMilestoneOrPerUnit){
    return CELL_TYPES.VALUE;
  }
  else{
    return CELL_TYPES.COST_READ_ONLY;
  }
};

const getUpdateType = (value) => {
  if(value === PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_REVENUE){
    return PROJECT_LEVEL_CONSTANTS.unweightedRevenueKey;
  } 
  if(value === PROJECT_LEVEL_CONSTANTS.UNWEIGHTED_COST){
    return PROJECT_LEVEL_CONSTANTS.unweightedCostKey;
  }
};
