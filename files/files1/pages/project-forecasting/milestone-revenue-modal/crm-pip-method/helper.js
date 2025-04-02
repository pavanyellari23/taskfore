import { CELL_TYPES } from '@revin-utils/utils';
import { COST_VARIANCE } from 'utils/constants';
import { getYearMonthHeader, generateResourceSummary } from 'utils/forecastingCommonFunctions';

export const buildPocCrmPipGrid = (forecastingState) => {
  const returnResourceData = {'headerData': [], 'resourceData': [], 'secondaryHeader' : {}};

  const monthHeaders = getYearMonthHeader(forecastingState?.forecastingPeriodSummary, {type : 'month'});
  returnResourceData.headerData.push
  (
    {
      name:'',
      subName:'',
      id:50,
      type: CELL_TYPES.HEADER
    },
    ...monthHeaders
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    // {
    //   name: RESOURCE_FORECASTING.Total,
    //   id:54,
    //   type: CELL_TYPES.HEADER
    // }
  );

  const details = {
    fields: [
      {
        name: 'resourceRevenue',
        label: 'Revenue',
        labelType: CELL_TYPES.ROLE,
        hideControls: true,
        readOnlyType: CELL_TYPES.COST_READ_ONLY,
        showTotal: true
      },
      {
        name: 'resourceCost',
        label: 'Resource Cost(CRM/PIP)',
        labelType: CELL_TYPES.ROLE,
        readOnlyType: CELL_TYPES.COST_READ_ONLY,
        hideControls: true,
        showTotal: true,  
        blankRow: true
      },
      {
        name: 'resourceCostAdjustments',
        label: 'Adjustments',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        showTotal: true
      },
      {
        name: 'finalResourceCost',
        label: 'Final cost',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        readOnlyType: CELL_TYPES.COST_READ_ONLY,
        showTotal: true
      },
      {
        name: 'computedCompletionPercentage',
        label: 'Expected project completion %',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        fieldLevelArray : forecastingState.forecastPoCDetails?.computedCompletionPercentagePeriodDetails
      },
      {
        name: 'deliveryCompletionPercentage',
        label: 'Actual project completion %',
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true,
        fieldLevelArray : forecastingState.forecastPoCDetails?.deliveryCompletionPercentagePeriodDetails,
        tooltip: {content: COST_VARIANCE}
      }
    ],
    periodSummary: forecastingState?.forecastingPeriodSummary,
    summary: forecastingState?.summary
  };
  returnResourceData.resourceData = generateResourceSummary(details);
  return returnResourceData;
};