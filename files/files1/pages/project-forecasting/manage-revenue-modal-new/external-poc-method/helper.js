import _uniqueId from 'lodash/uniqueId';
import _find from 'lodash/find';
import { CELL_TYPES, EDIT_ACTION, getTransformedNumber } from '@revin-utils/utils';
import { generateResourceSummary, getGridMonths, getYearMonthHeader } from 'utils/forecastingCommonFunctions';
import { FORECASTING_DATA, PROJECT_FORECASTING, REVENUE } from 'utils/constants';

export const buildCRMGrid = (data) => {
  const tableData = {'headerData': [], 'resourceSummary': []};
  const summary = getGridMonths(data?.forecastingPeriodSummary);
  const monthHeaders = getYearMonthHeader(summary, {type : 'month'});

  tableData.headerData.push
  (
    {
      name:'',
      subName:'',
      id: _uniqueId(),
      type: CELL_TYPES.HEADER
    },
    ...monthHeaders
  );
  
  const details = {
    fields: [{
      name: 'resourceRevenue',
      label: REVENUE,
      labelType: CELL_TYPES.ROLE,
      hideControls: true,
      updateType: EDIT_ACTION.EDIT_REVENUE,
      valueType: {
        EDITABLE: CELL_TYPES.VALUE,
        NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
      },
      blankRow: true
    },
    {
      name: 'resourceCost',
      label: FORECASTING_DATA.COST,
      labelType: CELL_TYPES.ROLE,
      hideControls: true,
      updateType: EDIT_ACTION.EDIT_COST,
      valueType: {
        EDITABLE: CELL_TYPES.VALUE,
        NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
      },
      blankRow: true
    }
    ],
    periodSummary: summary,
    summary: data?.summary
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;    
};

export const gridUpdateMilestone = (gridObj, payloadData) => {
  const summary = getGridMonths(payloadData.forecastingPeriodSummary);
  let costData = '';
  let revenueData = '';
  //it will iterate through each index if array
  gridObj.some((gridRow, key) => {
    costData = '';
    revenueData = '';

    //if get data for updateType: cost || revenue, update the payload data
    costData = _find(gridRow, {updateType: EDIT_ACTION.EDIT_COST});
    revenueData = _find(gridRow, {updateType: EDIT_ACTION.EDIT_REVENUE});
    let k = 0;
    if(costData?.updateType || revenueData?.updateType){
      for(let i = 1; i < gridObj[key].length; i++){
        if(costData?.updateType == EDIT_ACTION.EDIT_COST){
          summary[k].resourceCost = getTransformedNumber(gridObj[key][i].value);
        }
        if(revenueData?.updateType == EDIT_ACTION.EDIT_REVENUE){
          summary[k].resourceRevenue = getTransformedNumber(gridObj[key][i].value);
        }
        k++;
      }
    }
  });
};