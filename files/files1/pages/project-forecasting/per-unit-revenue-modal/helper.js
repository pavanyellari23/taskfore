import _uniqueId from 'lodash/uniqueId';
import { CELL_TYPES, getTransformedNumber } from '@revin-utils/utils';
import { generateResourceSummary, getGridMonths, getLabelForCrmPip, getYearMonthHeader } from 'utils/forecastingCommonFunctions';
import { FORECASTING_DATA, PROJECT_FORECASTING, REVENUE, REVENUE_ALERT_LIST } from 'utils/constants';

export const buildPerUnitTableData  = (data, unit) => {
  const tableData = {'headerData': [], 'resourceSummary': []  };
  const summary = getGridMonths(data?.forecastingPeriodSummary);
  const monthHeaders = getYearMonthHeader(summary);
  tableData.headerData.push
  (
    {
      id: _uniqueId(),
      name:'',
      subName:'',
      type: CELL_TYPES.HEADER
    },
    ...monthHeaders
    //@todo:The 'total' column is temporarily commented out to accommodate potential future use.
    /* {
      id: _uniqueId(),
      name: RESOURCE_FORECASTING.Total,
      type: CELL_TYPES.HEADER
    }*/
  );

  const details = {
    fields: [
      {
        name: unit.field,
        label: unit.header,
        labelType: CELL_TYPES.ROLE,
        valueType: {
          EDITABLE: CELL_TYPES.VALUE,
          NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
        },
        hideControls: true
      },
      {
        name: 'avgRate',
        label: PROJECT_FORECASTING.AVG_RATE_$,
        labelType: CELL_TYPES.ROLE,
        hideControls: true,
        readOnlyType: CELL_TYPES.COST_READ_ONLY
      },
      {
        name: 'resourceRevenue',
        label: PROJECT_FORECASTING.REVENUE_$,
        labelType: CELL_TYPES.ROLE,
        hideControls: true,
        readOnlyType: CELL_TYPES.COST_READ_ONLY
      }
    ],
    periodSummary: summary,
    summary: data?.summary
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;
};

export const buildCrmTableData = (data) => {
  const tableData = {'headerData': [], 'resourceSummary': []  };
  const summary = getGridMonths(data?.forecastingPeriodSummary);
  const monthHeaders = getYearMonthHeader(summary);
  tableData.headerData.push
  (
    {
      name:'',
      subName:'',
      id:50,
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
      showTotal: false
    }],
    periodSummary: summary,
    isPastPeriod: true
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;
};

export const generateDynamicTableData = (list) => {
  const data = [];
  if (list?.length) {
    list?.sort((a, b) => a.slNo - b.slNo)?.map(({lowerLimit, upperLimit, rate}) => data.push([lowerLimit, upperLimit, rate]));
  }
  return data;
};

export const buildPerUnitList = (data, projectForecastCandidateId, perUnitType, incremental) => {
  const dto = [];
  data?.map((col, i) => {
    dto.push({
      slNo: i+1,
      projectForecastCandidateId,
      lowerLimit: +col[0],
      upperLimit: (i === data.length - 1 && +col[1] === 0) ? '' : +col[1],
      rate: +col[2],
      perUnitType,
      incremental
    });
  });
  return dto;
};

export const validatePerUnitLimits = (data) => {
  const errors = [];
  const errorList = (er) => {
    if (!errors.includes(er)) errors.push(er);
  };
  if (data?.length) {
    data.map((col, i) => {
      if (data.length === 1) {
        if(+col[0] !== 0) {
          errorList('lower_limit_err');
        }
        if (col[1] !== '' && +col[1] <= +col[0]) {
          errorList('upper_limit_err');
        }
        if(!+col[2]) {
          errorList('rate_err');
        }
      } else {
        if (+data[0][0] !== 0) {
          errorList('first_row_err');
        }
        if (!!data[i+1] && (+data[i+1][0] - +data[i][1]) !== 1) {
          errorList('lower_limit_1_err');
        }
        if ((i !== data.length-1) && +col[1] <= +col[0]) {
          errorList('upper_limit_err');
        }
        if ((i === data.length-1) && col[1] !== '' && +col[1] <= +col[0]) {
          errorList('upper_limit_err');
        }
        if(!+col[2]) {
          errorList('rate_err');
        }
      }
    });
  }
  return errors;
};
export const validatePerUnitTableData = (perUnitLimitData, gridData) => {
  const upperLimitLastRow = parseFloat(getTransformedNumber(perUnitLimitData[perUnitLimitData.length - 1][1]));
  if (isNaN(upperLimitLastRow)) {
    return {isValid:true};
  }
  const errorCell = gridData?.slice(0, -1)?.find(cell => {
    const value = parseFloat(getTransformedNumber(cell.value));
    return !isNaN(value) && value > upperLimitLastRow;
  });
  if (errorCell) {
    const errorMessage = {id:REVENUE_ALERT_LIST[5]?.id, detail: `${REVENUE_ALERT_LIST[5]?.detail} ${errorCell.value}` };
    return { isValid: false, errorMessage };
  }
  return {isValid:true};
};



export const buildExternalPerUnitTable = (data) => {
  const tableData = {'headerData': [], 'resourceSummary': []  };
  const summary = getGridMonths(data?.forecastingPeriodSummary);
  const monthHeaders = getYearMonthHeader(summary);
  tableData.headerData.push
  (
    {
      name:'',
      subName:'',
      id:50,
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
      valueType: {
        EDITABLE: CELL_TYPES.VALUE,
        NON_EDITABLE: CELL_TYPES.COST_READ_ONLY
      },
      showTotal: false
    }],
    periodSummary: summary
  };
  tableData.resourceSummary = generateResourceSummary(details);
  return tableData;
};

