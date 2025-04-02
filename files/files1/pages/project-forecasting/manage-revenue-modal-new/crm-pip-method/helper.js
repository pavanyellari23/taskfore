import _uniqueId from 'lodash/uniqueId';
import { CELL_TYPES } from '@revin-utils/utils';
import { generateResourceSummary, getGridMonths, getLabelForCrmPip, getYearMonthHeader } from 'utils/forecastingCommonFunctions';
import {FORECASTING_DATA,REVENUE } from 'utils/constants';

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
      label: getLabelForCrmPip(REVENUE,data?.revenueDataSource),
      labelType: CELL_TYPES.ROLE,
      hideControls: true,
      readOnlyType: CELL_TYPES.COST_READ_ONLY,
      blankRow: true
    },
    {
      name: 'resourceCost',
      label:getLabelForCrmPip( FORECASTING_DATA.COST,data?.costDataSource),
      labelType: CELL_TYPES.ROLE,
      hideControls: true,
      readOnlyType: CELL_TYPES.COST_READ_ONLY,
      blankRow: true
    }
    ],
    periodSummary: summary,
    summary: data?.summary
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;    
};