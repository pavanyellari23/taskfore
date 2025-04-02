import _uniqueId from 'lodash/uniqueId';
import { CELL_TYPES } from '@revin-utils/utils';
import { generateResourceSummary, isPastPeriodAndNotCrossOverMonth, getYearMonthHeader } from 'utils/forecastingCommonFunctions';
import { REVENUE, RESOURCE_FORECASTING } from 'utils/constants';

export const buildCRMGrid = (data, crmMethod) => {
  const tableData = {'headerData': [], 'resourceSummary': []};
  const monthHeaders = getYearMonthHeader(data?.forecastingPeriodSummary, {type : 'month'});

  const total = !crmMethod && {
    id: _uniqueId(),
    name: RESOURCE_FORECASTING.Total,
    type: CELL_TYPES.HEADER
  };

  tableData.headerData.push
  (
    {
      name:'',
      subName:'',
      id:50,
      type: CELL_TYPES.HEADER
    },
    ...monthHeaders,
    total
  );
  
  const details = {
    fields: [{
      name: 'resourceRevenue',
      label: REVENUE,
      labelType: CELL_TYPES.ROLE,
      hideControls: true,
      readOnlyType: CELL_TYPES.COST_READ_ONLY,
      showTotal: !crmMethod,
      isPastPeriod: isPastPeriodAndNotCrossOverMonth(data?.forecastingPeriodSummary)
    }],
    periodSummary: data?.forecastingPeriodSummary,
    summary: data?.summary
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;    
};