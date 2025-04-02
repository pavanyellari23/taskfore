import { CELL_TYPES, EDIT_ACTION, preciseNumberFormatter, getSplitCellDataShape, getTransformedNumber } from '@revin-utils/utils';
import _uniqueId from 'lodash/uniqueId';
import _forEach from 'lodash/forEach';
import { toTitleCase } from 'utils/commonFunctions';
import { getSubCellValue, getYearMonthHeader, isPastPeriodAndNotCrossOverMonth, getGridMonths } from 'utils/forecastingCommonFunctions';
import { CELL_DATA_TYPE, INVESTMENT_MODAL, ACCOUNT_LEVEL_CONSTANTS,
  ACCOUNT_LEVEL_FORECASTING_TAB_VALUES, SALES_AND_GNA_CONSTANT, 
  RESOURCE,
  ACCOUNT_TOTAL_LABEL,
  USER_STATUS,
  FORECASTING_DATA,
  ACCOUNT_GRID_EXPENSES_LABEL} from 'utils/constants';


export const buildResourcePlanData = (forecastData, gridType, viewOnlyPermission) => {
  return generateOverallGrid(forecastData, gridType, viewOnlyPermission);
};

const generateOverallGrid = (forecastData , gridType, viewOnlyPermission) => {
  const returnData = {'headerData': [], 'resourceData': [], 'secondaryHeader' : {}};
  if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0]){
  //get top summary
    getPeriodSummary(forecastData, returnData, gridType);

    // Direct expenses collapsible row.
    generateCollapsibleRow(returnData, ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_LABEL, ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_ID);

    const projectRolledUpIndex = forecastData?.directExpense?.findIndex(item => item.category === ACCOUNT_LEVEL_CONSTANTS.PROJECT_ROLLED_UP_KEY);
    const projectRolledUp = forecastData?.directExpense?.find(item => item.category === ACCOUNT_LEVEL_CONSTANTS.PROJECT_ROLLED_UP_KEY);
    forecastData?.directExpense?.splice(projectRolledUpIndex, 1);
    forecastData?.directExpense?.unshift(projectRolledUp);
    
    forecastData?.directExpense?.forEach(item => {
      const editAction =  ACCOUNT_LEVEL_CONSTANTS[item.category] === ACCOUNT_LEVEL_CONSTANTS.OTHER ?  EDIT_ACTION.EDIT_COST : '';
      generateGridData(item?.periodDetailsList, item, returnData, ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_ID, editAction, ACCOUNT_LEVEL_CONSTANTS[item.category], '', true, viewOnlyPermission);
    });

    // Total direct expenses.
    getTotalData(forecastData, returnData, ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_ID, ACCOUNT_LEVEL_CONSTANTS.TOTAL_DIRECT_EXPENSE);

    // Show button if having MANAGE_PARENT_ACCOUNT_REVENUE_FORECAST permission
    if (!forecastData.investment?.length && !viewOnlyPermission) {
      returnData.resourceData.push([
        {
          name: ACCOUNT_LEVEL_CONSTANTS.OTHER_COR_INVESTMENT_LABEL,
          id: ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID,
          type: 'button-row-middle',
          subType: 'button',
          button: INVESTMENT_MODAL.ADD_COR_INVESTMENT,
          hideControls: true,
          parent: true
        }
      ]);
    } else {
    // Investment collapsible row.
      generateCollapsibleRow(returnData, ACCOUNT_LEVEL_CONSTANTS.OTHER_COR_INVESTMENT_LABEL, ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID);
      _forEach(forecastData.investment, (investmentData) => {
        const header = investmentData?.category === INVESTMENT_MODAL.OTHERS_CODE ? `${investmentData?.categoryDescription} (${investmentData?.categoryName?.trim()})` : investmentData?.categoryDescription;
        generateGridData(investmentData?.periodDetailsList, investmentData, returnData, ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID, EDIT_ACTION.EDIT_COST, header, '', false, viewOnlyPermission);
      });
      // Total investments.
      getTotalData(forecastData, returnData, ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID, ACCOUNT_LEVEL_CONSTANTS.TOTAL_INVESTMENT);
    }
  }else if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]){
    // Section to build grid for Sales and GnA
    getPeriodSummary(forecastData, returnData, gridType); 
    const SALES_ROWS = gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? SALES_AND_GNA_CONSTANT[0] : SALES_AND_GNA_CONSTANT[1];
    SALES_ROWS.forEach((item) => {
      generateCollapsibleRow(returnData,item?.label, item?.id);
      const rowData = Object.values(forecastData?.[item?.id]);
      rowData.forEach((rowItem, index) => {
        if (item?.id === SALES_AND_GNA_CONSTANT[1][2]?.id) {
          generateSeatCostGridData(rowItem?.periodDetailsList, rowItem, returnData, item?.id, viewOnlyPermission);
        } else {
          const data = getHeadernSubHeader(item , rowData[index] , gridType);
          generateGridData(rowData[index]?.periodDetailsList,rowData[index], returnData,item?.id,EDIT_ACTION.EDIT_COST,data?.header,data?.subHeader, data?.hideControls, viewOnlyPermission);
        }
      });
    });
    if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]) {
      getOtherAndTotalSeatCostRows(forecastData?.[SALES_AND_GNA_CONSTANT[1][1]?.id][2], SALES_AND_GNA_CONSTANT[1][2]?.id, returnData, false);
    }
  }
  return returnData;
};

const generateSeatCostGridData = (periodSummary, rowItem, returnData, id, viewOnlyPermission) => {
  const periodData = [];
  const summary = getGridMonths(periodSummary);
  if (rowItem?.locationValue === ACCOUNT_LEVEL_CONSTANTS.OTHERS) {
    getOtherAndTotalSeatCostRows(rowItem, id, returnData, true);
  } else {
    summary.forEach((item) => {
      const isCellEditable = item?.cellState === CELL_DATA_TYPE.EDITABLE;
      const headCount = preciseNumberFormatter(item?.headCount,{info:item, isDoublePrecision: true}) ;
      const utlsn =  preciseNumberFormatter(item?.utlsn,{isPercentage:true, showPercentageSign:true, info:item});
      const cost =  preciseNumberFormatter(item?.cost,{info:item});
      const valueObject = !viewOnlyPermission && isCellEditable 
        ? {
          value: getSplitCellDataShape([headCount, utlsn, cost])
        } 
        : {
          value: headCount,
          subValue: utlsn,
          additionalValue:cost
        };

      periodData.push({
        ...valueObject,
        type: viewOnlyPermission ? CELL_TYPES.COST_SPLIT_CELL_READ_ONLY : item.cellState === CELL_DATA_TYPE.EDITABLE ? CELL_TYPES.COST_SPLIT_CELL : CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
        topCellValue: ACCOUNT_LEVEL_CONSTANTS.HEAD_COUNT_KEY,
        bottomCellValue: ACCOUNT_LEVEL_CONSTANTS.UTLSN_LABEL,
        additionalCellValue: ACCOUNT_LEVEL_CONSTANTS.COST_LABEL,
        pID: id,
        resourceId: rowItem.id,
        id: item.periodId,
        planType: id,
        isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
      });
    });

    returnData.resourceData.push([
      {
        value: toTitleCase(rowItem?.locationValue),
        type: CELL_TYPES.ROLE,
        hideControls: true,
        subValue: `Seat Cost : $${rowItem?.costPerSeat}/seat`,
        pID: id,
        groupName : ACCOUNT_LEVEL_CONSTANTS.GROUP_NAME
      },
      {
        type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
        value: ACCOUNT_LEVEL_CONSTANTS.HEAD_COUNT_LABEL.toLocaleUpperCase(),
        subValue: ACCOUNT_LEVEL_CONSTANTS.UTLSN_LABEL.toLocaleUpperCase(),
        additionalValue: ACCOUNT_LEVEL_CONSTANTS.COST_LABEL.toLocaleUpperCase(),
        pID: id
      },
      ...periodData,
      {
        type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
        value: '',
        subValue: '',
        additionalValue: rowItem?.cost,
        pID: id
      }
    ]);
  }
};

const getHeadernSubHeader = (item , row , gridType) => {
  const data = { header: '' , subHeader: ''};
  data.header = item?.id === SALES_AND_GNA_CONSTANT[gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? 0 : 1][0]?.id
    ? createResourceInfo(row?.resourceData) : gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]
      ? row?.salesCategoryDescription : row?.gnaCategoryDescription;
  data.subHeader = row?.resourceData?.subHeader ? row?.resourceData?.subHeader : item?.id === SALES_AND_GNA_CONSTANT[gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? 0 : 1][0]?.id ? row?.projectCode : '';
  data.hideControls = row?.resourceData?.controls ? row?.resourceData?.controls : !row?.resourceData ;
  return data;
};

const generateGridData = (periodSummary, investmentData, returnData, id, editAction, header = '', subHeader= '', hideControls = false, viewOnlyPermission) => {
  const periodData = [];
  const summary = getGridMonths(periodSummary);
  const hideSeatCostRow = investmentData?.gnaCategoryDescription?.toLowerCase() ===  ACCOUNT_LEVEL_CONSTANTS.SEATS_COST_LABEL?.toLowerCase();
  summary?.forEach((item) => {
    periodData.push({
      value: preciseNumberFormatter(getEditableData(item, id)),
      updateType: editAction,
      type: getEditableType(item, viewOnlyPermission, hideSeatCostRow),
      pID: id,
      field: id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ? ACCOUNT_LEVEL_CONSTANTS.INVESTMENTS_COST_KEY : ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_AMOUNT_KEY,
      additionalValue: item?.periodId,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
    });
  });
 
  returnData.resourceData.push([
    {
      value: toTitleCase(header),
      type: CELL_TYPES.ROLE,
      hideControls,
      hideClone: true,
      hideDelete: investmentData?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL,
      subValue: subHeader ?? '',
      item: investmentData,
      disabled: investmentData?.resourceData?.status === USER_STATUS.INACTIVE,
      pID: id,
      showOpenInNewIcon: viewOnlyPermission && !hideControls
    },
    {
      value: '',
      type: CELL_TYPES.COST_READ_ONLY,
      subType: CELL_TYPES.LABEL_CELL
    },
    ...periodData
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /* {
          value: investmentData?.rowToBeRemoved ? preciseNumberFormatter(investmentData?.cost) : id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ?  preciseNumberFormatter(investmentData?.totalInvestmentCost) :  id === SALES_AND_GNA_CONSTANT[0][1].id ? preciseNumberFormatter(investmentData?.totalSalesExpenseCost) : 
          id === SALES_AND_GNA_CONSTANT[1][1].id ? preciseNumberFormatter(investmentData?.totalGnaExpenseCost) : preciseNumberFormatter(investmentData?.totalCost),
          type: CELL_TYPES.COST_READ_ONLY,
           pID: id
     }*/
  ]);
};

const getEditableData = (item, id) => {
  if(item.cellState === CELL_DATA_TYPE.NON_EXIST) {
    return '';
  }else {
    return id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ? item?.investmentCost : item.cost ?? item.salesCost ?? item?.amout;
  }
};

const getEditableType = (item, viewOnlyPermission, hideSeatCostRow) => {
  if (viewOnlyPermission || hideSeatCostRow) return CELL_TYPES.COST_READ_ONLY;
  if(item.cellState === CELL_DATA_TYPE.NON_EXIST || item.cellState === CELL_DATA_TYPE.NON_EDITABLE){
    return CELL_TYPES.COST_READ_ONLY;
  }else{
    return CELL_TYPES.VALUE;
  }
};

export const getTotalData = (forecastData, returnResourceData, id, header) => {
  const summary = getGridMonths(forecastData.forecastPeriodSummary);
  const totalDirectExpenses = summary?.map((item) => {
    const { investmentCost, investmentCostPercentage, directExpense, directExpensePercentage } = item;
    const value = ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID === id ? investmentCost : directExpense;
    const subValue = ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID === id ? investmentCostPercentage : directExpensePercentage;
    return  {
      value: preciseNumberFormatter(value),
      subValue: preciseNumberFormatter(subValue, { isPercentage: true, showPercentageSign: true, info: item}),
      type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      topCellValue: id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ? ACCOUNT_LEVEL_CONSTANTS.INVESTMENTS_COST_KEY : ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_AMOUNT_KEY,
      bottomCellValue: id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ? ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_PER : ACCOUNT_LEVEL_CONSTANTS.DIRECT_PER,
      id: item.periodId,
      pID: id,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
    };
  });
  
  returnResourceData.resourceData.push([
    {
      value: header,
      type: CELL_TYPES.ROLE,
      hideControls: true,
      id: _uniqueId(),
      pID: id
    },
    {
      value: '$',
      subValue: '%',
      type: CELL_TYPES.COST_SPLIT_CELL_LABEL,
      id: _uniqueId(),
      pID: id
    },
    ...totalDirectExpenses
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /*{
      value: id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ?  preciseNumberFormatter(forecastData.summary.investmentCost) : preciseNumberFormatter(forecastData.summary.directExpense),
      subValue: id === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ?  preciseNumberFormatter(forecastData.summary.investmentCostPercentage,{isPercentage:true}): preciseNumberFormatter(forecastData.summary.directExpensePercentage,{isPercentage:true}),
      type: CELL_TYPES.COST_SPLIT_CELL_READ_ONLY,
      id: _uniqueId()
    }*/
  ]);
};

const generateCollapsibleRow = (returnData, name, id) => {

  returnData.resourceData.push([
    {
      subName: name,
      type: CELL_TYPES.LABEL_ROW_HEADER,
      parent: true,
      id
    },
    {
      value: '',
      parent: true,
      type: CELL_TYPES.LABEL_ROW,
      colSpan: 20
    }
  ]);
};

const getPeriodSummary= (forecastData, returnData, gridType) => {
  let data=[];
  const summary = getGridMonths(forecastData?.forecastPeriodSummary);
  if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] || gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]){
    data = getYearMonthHeader(getGridMonths(getPeriodSummaryForSalesAndGnA(gridType, forecastData)));
  }
  else if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0]){ 
    data = getYearMonthHeader(summary,{}, false, false);
  }
  else{
    data = getYearMonthHeader(summary);
  }
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
    /*{
      name: RESOURCE_FORECASTING.Total,
      id: _uniqueId(),
      type: CELL_TYPES.HEADER
    }*/
  );
  
  getPeriodSummaryData(summary, returnData, gridType);
};

const getPeriodSummaryData = (summary, returnData, gridType) => {
  let tabTotalCost;

  switch (gridType) {
    case ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0]:
      tabTotalCost = (item) => item?.projectLevelRolledUpTotalCost;
      break;
    case ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]:
      tabTotalCost = (item) => item?.salesTotalSummaryCost;
      break;
    case ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]:
      tabTotalCost = (item) => item?.gnaTotalSummaryCost;
      break;
    default:
      tabTotalCost = () => 0;
  }

  const data = summary?.map((item) => {
    return {
      name: preciseNumberFormatter(tabTotalCost(item)),
      type: '',
      subName: '',
      id: item?.periodId,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
    };
  });
  
  returnData.secondaryHeader = {
    preMonthHeader: [
      {
        name: gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0] && INVESTMENT_MODAL.ADD_COR_INVESTMENT,
        subName: '',
        id: _uniqueId(),
        type: CELL_TYPES.HEADER_SECONDARY,
        subType: CELL_TYPES.ROLE
      },
      {
        name: 'Total',
        id: _uniqueId(),
        type: CELL_TYPES.HEADER_SECONDARY,
        subType: CELL_TYPES.HEADER_LABEL,
        ...(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0] && { infoTooltipContent: ACCOUNT_TOTAL_LABEL })
      },
      ...data
    ]
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /* postMonthHeader: [
      {
        name: preciseNumberFormatter(summaryTotalCost),
        subName: '',
        id: _uniqueId(),
        type: CELL_TYPES.HEADER_SECONDARY
      }
    ]*/
  };
};


export const formatGridPayloadToAPIPayload = (stateData, gridData) => {
  const gridSubSections = getDataRows(gridData);
  let pid = gridSubSections[0][0]?.pID;
  let colIndex = 0;
  gridSubSections.forEach((subArray) => {
    subArray.slice(2)?.forEach((item , index) => {
      if(pid === item?.pID){
        const currentData = getGridMonths(stateData[item?.pID][colIndex][ACCOUNT_LEVEL_CONSTANTS.PERIOD_DETAILS_LIST]);
        if(item?.field && index < subArray?.length - 1) {
          if(currentData[index]){
            Object.hasOwn(currentData[index] , ACCOUNT_LEVEL_CONSTANTS.INVESTMENTS_COST_KEY) || item.pID === ACCOUNT_LEVEL_CONSTANTS.INVESTMENT_ID ?
              currentData[index].investmentCost = getTransformedNumber(item.value) :
              currentData[index].amout = getTransformedNumber(item.value);
          }
        }
      }else {
        colIndex = 0;
        pid = item?.pID;
      }
    });
    colIndex++;
  });
  return stateData;
};

export const formatGridPayloadToAPIPayloadForSalesNGnA = (stateData , gridData , selectedTab) => {
  const gridSubSections = getDataRows(gridData, selectedTab);
  const updatedRolePlan = [];
  const updatedForecastingPeriodSummary = [];
  const updatedotherExpenses = [];
  const updatedAdjustments = [];
  const idforOtherExpenses = selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? ACCOUNT_LEVEL_CONSTANTS.SALES_ID : ACCOUNT_LEVEL_CONSTANTS.GNA_ID;
  gridSubSections.forEach((subArray) => {
    const mainItem = subArray[0];
    let valueFromApiresponse = []; 
    subArray.slice(2)?.forEach((item, index) => {
      if(index < subArray.slice(2)?.length){
        if(!mainItem?.item?.rowToBeRemoved && mainItem?.item?.resourceData){  
          if(mainItem?.item?.resourceData?.userId){
            valueFromApiresponse = stateData?.rolePlan?.filter((item) => ((item?.resourceData?.userId === mainItem?.item?.resourceData?.userId) && item?.projectCode === mainItem?.item?.projectCode && item?.department === mainItem?.item?.department));
            
            //To get the 18 column data
            const currentData = getGridMonths(valueFromApiresponse[0].periodDetailsList);
            currentData[index].cost = parseInt(getTransformedNumber(item?.value));

          }else if(mainItem?.item?.slNo){
            valueFromApiresponse = stateData?.rolePlan?.filter((item) => ((item?.slNo === mainItem?.item?.slNo) && item?.projectCode === mainItem?.item?.projectCode && item?.department === mainItem?.item?.department));
            
            //To get the 18 column data
            const currentData = getGridMonths(valueFromApiresponse[0].periodDetailsList);
            currentData[index].cost = parseInt(getTransformedNumber(item?.value));
          }
        }else if(mainItem?.value === FORECASTING_DATA.ADJUSTMENT){
          valueFromApiresponse = stateData?.adjustments?.filter(item => item?.type?.toLocaleUpperCase() === selectedTab?.toLocaleUpperCase());
          
          //To get the 18 column data
          const currentData = getGridMonths(valueFromApiresponse[0].periodDetailsList);
          currentData[index].cost = parseInt(getTransformedNumber(item?.value));
        }
        else if(mainItem?.value === SALES_AND_GNA_CONSTANT[2][0]?.label){
          valueFromApiresponse = getGridMonths(stateData?.forecastPeriodSummary); 

          valueFromApiresponse[index][selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? SALES_AND_GNA_CONSTANT[2][0]?.id : SALES_AND_GNA_CONSTANT[3][0]?.id] = parseInt(getTransformedNumber(item?.value));
        }else{
          valueFromApiresponse = stateData[selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? ACCOUNT_LEVEL_CONSTANTS.OTHER_SALES_EXP : ACCOUNT_LEVEL_CONSTANTS.OTHER_GNA_EXP]?.filter((item) => item[idforOtherExpenses] === mainItem?.item[idforOtherExpenses]);
          
          //To get the 18 column data
          const currentData = getGridMonths(valueFromApiresponse[0].periodDetailsList);
          currentData[index].cost = parseInt(getTransformedNumber(item?.value));
        }
      }
    });
    if(!mainItem?.item?.rowToBeRemoved && mainItem?.item?.resourceData) updatedRolePlan.push(...valueFromApiresponse);
    else if(mainItem?.value === FORECASTING_DATA.ADJUSTMENT) updatedAdjustments.push(...valueFromApiresponse);
    else if (mainItem?.value === SALES_AND_GNA_CONSTANT[2][0]?.label) updatedForecastingPeriodSummary.push(...valueFromApiresponse);
    else updatedotherExpenses.push(...valueFromApiresponse);
  });
  stateData[selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? ACCOUNT_LEVEL_CONSTANTS.OTHER_SALES_EXP : ACCOUNT_LEVEL_CONSTANTS.OTHER_GNA_EXP] = updatedotherExpenses;
  return {
    ...stateData,
    rolePlan: [...updatedRolePlan, ...stateData?.rolePlan?.filter((item) => item?.department !== selectedTab?.toLocaleUpperCase())],
    adjustments: [...updatedAdjustments, ...stateData?.adjustments?.filter((item => item?.type?.toLocaleUpperCase() !== selectedTab?.toLocaleUpperCase()))]
  };
};

const getDataRows = (gridData , selectedTab = '') => {
  const gridSubSections = [];
  let slicedArray = [];
  if(selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]){
    const index = gridData?.findIndex((item) => item[0]?.id === SALES_AND_GNA_CONSTANT[1][2].id);
    slicedArray = gridData.slice(0, index);
  }else slicedArray = gridData;
  slicedArray?.forEach((row) => {
    if(!row[0]?.parent && row[0]?.value?.slice(0,5) !== 'Total'){
      gridSubSections.push(row);
    }});
  return gridSubSections;
};

export const getPreparedInvestmentPayload = (investmentData, accountForecastCandidateId) => {
  const investmentDatails = {
    categoryId: investmentData.categoryData?.id,
    category: investmentData.categoryData.codeValue,
    categoryDescription: investmentData.categoryData?.description,
    categoryName: investmentData.expenseName,
    accountForecastCandidateId,
    investmentCost: investmentData.cost,
    startPeriodId: investmentData.periodFrom,
    endPeriodId: investmentData.periodTo
  };
  return investmentDatails;
};

const createResourceInfo = (resourceData) => 
  resourceData?.firstName ? `${resourceData?.firstName} ${resourceData?.lastName} (${resourceData?.employeeId})` : 
    resourceData?.rowTitle ? `${resourceData?.rowTitle}` : `${resourceData?.firstName}`; 

export const buildResponseForSalesNGnaGrid = (forecastingData, selectedTab) => {
  const salesCompensationsRoles = [];
  const gnaCompensationsRoles = [];
  const roleData = forecastingData?.rolePlan?.filter((item) => !item?.resourceData && item?.department === selectedTab?.toLocaleUpperCase());
  const processedRoleData =  roleData.map((rowItem) => ({
    ...rowItem,
    resourceData: {
      rowTitle: rowItem?.roleDescription || rowItem?.orgRoleId,
      subHeader: getSubCellValue(rowItem)
    },
    periodDetailsList: rowItem?.periodDetailsList
  }));
  const salesAdjustment = forecastingData?.adjustments?.filter((item)=> item.type === selectedTab?.toLocaleUpperCase());
  const processedSales = salesAdjustment.map((rowItem) =>({
    ...rowItem,
    rowToBeRemoved: true,
    resourceData: {
      rowTitle:'Adjustments',
      controls: true
    },
    periodDetailsList: rowItem?.periodDetailsList
  }));
  const gnaAdjustment = forecastingData?.adjustments?.filter((item) => 
    item.type.toLocaleUpperCase() === selectedTab?.toLocaleUpperCase()
  );  

  const processedGna = gnaAdjustment.map((rowItem) =>({
    ...rowItem,
    rowToBeRemoved: true,
    resourceData: {
      rowTitle:'Adjustments',
      controls: true
    },
    periodDetailsList: rowItem?.periodDetailsList
  }));
  if(forecastingData?.rolePlan?.length){
    if(selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]){
      salesCompensationsRoles.push(...forecastingData?.rolePlan?.filter((item) => item?.department === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]?.toLocaleUpperCase() && item?.resourceData));
      salesCompensationsRoles.push(...processedRoleData);
      salesCompensationsRoles.push(...processedSales);
    }else{
      gnaCompensationsRoles.push(...forecastingData?.rolePlan?.filter((item) => item?.department === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[2]?.toLocaleUpperCase() && item?.resourceData));
      gnaCompensationsRoles.push(...processedRoleData);
      gnaCompensationsRoles.push(...processedGna);
    }
  }
  const data = SALES_AND_GNA_CONSTANT[selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? 2 : 3].map((item) => schemaBuilderMissingRows(item, forecastingData));
  const otherExpensesArray = selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? [...forecastingData?.otherSalesExp ] : [...forecastingData?.otherGnaExp];
  otherExpensesArray.slice(-1)[0][selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? ACCOUNT_GRID_EXPENSES_LABEL.SALES : ACCOUNT_GRID_EXPENSES_LABEL.GNA ] !== SALES_AND_GNA_CONSTANT[ selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1] ? 2 : 3 ][1].label && otherExpensesArray.push({...data[1]});
  if(selectedTab === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]){
    salesCompensationsRoles.push(...data.slice(0,1));
    if(forecastingData?.otherSalesExp?.slice(-1)[0]?.salesCategoryDescription !== SALES_AND_GNA_CONSTANT[2][2]?.label) forecastingData.otherSalesExp = [...otherExpensesArray];
  }else{
    gnaCompensationsRoles.push(...data.slice(0,1));
    if(forecastingData?.otherGnaExp?.slice(-1)[0]?.gnaCategoryDescription !== SALES_AND_GNA_CONSTANT[3][2]?.label) forecastingData.otherGnaExp = [...otherExpensesArray];
  }
  return {
    ...forecastingData,
    salesCompensationsRoles,
    gnaCompensationsRoles
  };
};

const schemaBuilderMissingRows = (rowItem , forecastingData) => {
  const periodDetailsList = [];
  getGridMonths(forecastingData?.forecastPeriodSummary)?.map((item) => {
    const obj = {
      periodId: item?.periodId,
      slNo: item?.slNo,
      cellState: rowItem?.nonEditable ? CELL_DATA_TYPE.NON_EDITABLE : item?.cellState,
      cellFlag: item?.cellFlag,
      source: item?.source
    };
    periodDetailsList.push({...obj , cost : item[rowItem?.id]});
  });
  return rowItem?.other ? 
    {
      cost: forecastingData?.summary[rowItem?.id],
      [`${rowItem?.catergoryDescription}`]: rowItem?.label,
      periodDetailsList,
      rowToBeRemoved: true
    }
    :
    {
      cost: forecastingData?.summary[rowItem.label === SALES_AND_GNA_CONSTANT[2][0].label ? rowItem?.totalAdjustments : rowItem?.id],
      resourceData: {
        rowTitle: rowItem?.label,
        controls: rowItem?.controls
      },
      periodDetailsList,
      rowToBeRemoved: true
    };
};

export const getUpdatedForecastPeriodDetails = (investment, updatedInvestment) => {
  const updatedPeriodDetails = investment?.periodDetailsList?.map(period => {
    const isInvestmentUpdated = period?.periodId >= updatedInvestment?.periodFrom && period?.periodId <= updatedInvestment?.periodTo;
    return {
      ...period,
      investmentCost : isInvestmentUpdated ? updatedInvestment?.cost : ''
    };
  });

  return updatedPeriodDetails;
};

const getPeriodSummaryForSalesAndGnA=(gridType,forecastData)=>{
  if(gridType === ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[1]){
    return forecastData?.otherSalesExp[0]?.periodDetailsList;
  }
  return forecastData?.otherGnaExp[0]?.periodDetailsList;
};

const getOtherAndTotalSeatCostRows = (rowItem, id, returnData, isOthersRow) => {
  const summary = getGridMonths(rowItem?.periodDetailsList);

  const periodData = summary.map((item) => {
    const totalSeatCost = preciseNumberFormatter(item?.cost,{info:{item}}) ;
    return {
      type: CELL_TYPES.COST_READ_ONLY,
      value: totalSeatCost,
      pID: id,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(item)
    };
  });

  returnData.resourceData.push([
    {
      type: CELL_TYPES.ROLE,
      hideControls: true,
      value: isOthersRow ? rowItem?.locationValue : ACCOUNT_LEVEL_CONSTANTS.TOTAL_SEAT_COST,
      pID: id,
      groupName : isOthersRow ? ACCOUNT_LEVEL_CONSTANTS.GROUP_NAME : ACCOUNT_LEVEL_CONSTANTS.GROUP_NAME_BOLD
    },
    {
      type: CELL_TYPES.COST_READ_ONLY,
      value: isOthersRow ? ACCOUNT_LEVEL_CONSTANTS.COST_LABEL.toLocaleUpperCase() : '',
      subType: CELL_TYPES.LABEL_CELL
    },
    ...periodData
  ]);
};