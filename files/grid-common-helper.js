import React from 'react';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import _isUndefined from 'lodash/isUndefined';
import { Trash2 } from 'react-feather';
import moment from 'moment-mini';
import CopyrightIcon from '@material-ui/icons/Copyright';
import OpenInNew from '@material-ui/icons/OpenInNew';
import { preciseNumberFormatter, QUICK_ROLE_ACTION } from '@revin-utils/utils';
import { RVIcon } from '@revin-utils/assets';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { DATA_GRID_CONTROL_CELL, ICONS, CELL_DATA_TYPE, RESOURCE, GRID_CONSTANTS, DATE_FORMAT } from 'utils/constants';
import CrossOverTooltip from 'components/common/crossover-tooltip/CrossOverTooltip';
import { isPastPeriodAndNotCrossOverMonth, getGridMonths } from 'utils/forecastingCommonFunctions';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';

const { iconSmallTwo } = variableStyle;

const generateMonths = (noOfMonths=18) => {
  const months = [];
  for(let i=1; i <= noOfMonths; i++) {
    months.push({ columnId: 'month'+i });
  }
  return months;
};

export const buildGridColumns = (labelColumns, noOfMonths, showTotal) => {
  const monthColumns = generateMonths(noOfMonths) ;
  const gridColumns = [...labelColumns, ...monthColumns];
  showTotal && gridColumns.push({ columnId: DATA_GRID_CONTROL_CELL.TOTAL_COLUMN_ID });
  return gridColumns;
};

export const buildGridHeaderRow = (periodSummary, labels, total, filterRecord, sortingColumn, sortBy, showAllColumns) => {
  const summary = showAllColumns ? periodSummary :  getGridMonths(periodSummary);
  const labelHeaders = buildHeaderFieldLabels(labels);
  const monthHeaders = getMonthLabels(summary, filterRecord, sortingColumn, sortBy);
  const totalLabel = total?.label && buildHeaderFieldLabels([total]);
  const cells = [ ...labelHeaders, ...monthHeaders ];
  total?.label && cells.push(...totalLabel);
  return {
    label: DATA_GRID_CONTROL_CELL.TYPE.HEADER,
    rowId: DATA_GRID_CONTROL_CELL.TYPE.HEADER,
    cells
  };
};

export const buildHeaderFieldLabels = (labels) => {
  return labels?.map(({ label }) => {
    return {
      type: DATA_GRID_CONTROL_CELL.TYPE.DYNAMIC_HEADER,
      content: label
    };
  }) || [];
};

export const getMonthLabels = (periodSummary, filterRecord, sortingColumn, sortBy) => {
  return periodSummary?.map(({ periodId, crossOverMonth }) => {
    const monthValue = `${periodId}`.substring(4, 6);
    const year = `${periodId}`.substring(0, 4);
    const month = moment(monthValue, DATE_FORMAT.FORMAT_14).format(DATE_FORMAT.FORMAT_15).toUpperCase();
    const labelContent = ( <span> {year}<br /> {month} </span> );
    const label = crossOverMonth ? (
      <div className="month-tooltip-container">
        {labelContent}
        <CrossOverTooltip subType="header-tooltip" />
      </div>
    ) : labelContent;;

    return {
      type: DATA_GRID_CONTROL_CELL.TYPE.DYNAMIC_HEADER,
      content: label,
      sortingId: periodId,
      sortingEnabled: sortingColumn === periodId && sortBy != null,
      filterRecord,
      isAscending: sortBy === GRID_CONSTANTS.SORT_TYPE.ASC,
      className: crossOverMonth ? DATA_GRID_CONTROL_CELL.CLASS.CROSSOVER_TOOLTIP_ACTIVE : ''
    
    };
  }) || [];
};

export const buildRegionData = (region, rolesAsperRegion, handleExpandCollapse, colspan) => {
  return [{
    type: DATA_GRID_CONTROL_CELL.TYPE.READONLY,
    nonEditable: false,
    colspan,
    className: DATA_GRID_CONTROL_CELL.CLASS.GROUP_HEADER,
    content: (
      <ArrowWrapper
        data={region}
        handleChange={handleExpandCollapse}
      >
        <div className="d-flex align-items-center gap-1">
          <RVIcon
            icon="more"
            size={iconSmallTwo}
          />
          {`${region} (${rolesAsperRegion?.length})`}
        </div>
      </ArrowWrapper>
    ),
    parent: true,
    location: region
  }
  ];
};

export const buildLabelsData = (data) => {
  const { title, subTitle, otherFields, obj, formatOptions, onRoleActionClick, customRoleResourceClass, workerTooltip, infoIcon, viewOnlyPermission } = data;
  const other = otherFields.length && otherFields?.map((item) => {
    return {
      content: !_isUndefined(obj?.[item]) && !isNaN(obj?.[item]) && formatOptions ? preciseNumberFormatter(obj?.[item], formatOptions) : obj?.[item]
    };
  }) || [];

  return [
    {content: (
      <div className={`text-left w-100 position-relative grid-title-wrapper ${customRoleResourceClass}`}>
        <div className="d-flex align-items-center">
          <h4>{title}</h4>
          {workerTooltip &&
              <div className={'copy-right-icon'}>
                <InfoTooltip
                  icon={<CopyrightIcon />}
                  infoContent={workerTooltip}
                />
              </div>}
          {infoIcon && <InfoTooltip infoContent={GRID_CONSTANTS.OTHERS_INFO_MSG}/>}
        </div>
        <p>{subTitle}</p>
        {onRoleActionClick &&
            <div className={'d-flex align-items-center h-100 gap-1 action-wrapper'}>
              {
                viewOnlyPermission ? 
                  <OpenInNew onClick={() => onRoleActionClick({ obj, actionType: QUICK_ROLE_ACTION.EDIT })}/>
                  :
                  <>
                    <RVIcon
                      icon={ICONS.PENCIL}
                      onClick={() => onRoleActionClick({ obj, actionType: QUICK_ROLE_ACTION.EDIT })}
                    />
                    {
                      obj?.resourceSource !== RESOURCE.USER_TYPE_EXTERNAL &&
                      <Trash2 onClick={() => onRoleActionClick({ obj, actionType: QUICK_ROLE_ACTION.DELETE })} />
                    }
                  </>
              }
            </div>}
      </div>)},
    ...other
  ];
};

export const buildData = (data) => {
  const { id, labelData, field, periodSummary, formatOptions, isHeader, isReadOnly, payloadType, payloadSubType, totalSummary, colorField, slNo, extraBorderBottom, isDisabled } = data;
  const extraBorderClass = extraBorderBottom && DATA_GRID_CONTROL_CELL.CLASS.EXTRA_BORDER_BOTTOM;
  const disabledClass = isDisabled && DATA_GRID_CONTROL_CELL.CLASS.DISABLED_CELL;
  const labelsData = labelData?.map(({ content }) => {
    return {
      type: DATA_GRID_CONTROL_CELL.TYPE.READONLY,
      content,
      className: `${extraBorderClass} ${disabledClass}`,
      location: data?.location,
      label: isHeader ?  DATA_GRID_CONTROL_CELL.TYPE.HEADER : ''
    };
  }) || [];
  
  const periodsData = periodSummary?.map((item) => {
    const formattedValue = formatOptions?.isFormat && !_isUndefined(item?.[field]) ? preciseNumberFormatter(item?.[field], formatOptions) : item?.[field];
    const value = handlePrecisionFormat(item?.[field], formatOptions);
    const textColor = item?.[colorField] || '';
    const textDisabled = isPastPeriodAndNotCrossOverMonth(item) && DATA_GRID_CONTROL_CELL.CLASS.TEXT_DISABLED;

    return (isReadOnly || isHeader || item?.cellState === CELL_DATA_TYPE.NON_EDITABLE || isDisabled) ?
      {
        type: DATA_GRID_CONTROL_CELL.TYPE.READONLY,
        content: formatOptions?.isPercentage && !_isUndefined(formattedValue) ? formattedValue + '%' : handlePrecisionFormat(formattedValue, formatOptions),
        className: `${GRID_CONSTANTS.CLR_BG_CLS[textColor]} ${extraBorderClass} ${disabledClass} ${textDisabled}`,
        location: data?.location,
        label: isHeader ? DATA_GRID_CONTROL_CELL.TYPE.HEADER : ''
      } : {
        id,
        label: isHeader ? DATA_GRID_CONTROL_CELL.TYPE.HEADER : '',
        location: data?.location,
        type: DATA_GRID_CONTROL_CELL.TYPE.CUSTOM_NUMBER,
        text: `${value}`,
        value: +value,
        valueUnit: formatOptions?.isPercentage && !_isUndefined(value) ? '%' : '',
        key: item?.periodId,
        className: `${GRID_CONSTANTS.CLR_TXT_CLS[textColor]} ${extraBorderClass} ${disabledClass}`,
        payloadType,
        payloadSubType,
        slNo
      };
  }) || [];
  const gridArray = [...labelsData, ...periodsData];

  totalSummary && gridArray.push({
    type: DATA_GRID_CONTROL_CELL.TYPE.READONLY,
    content: !_isUndefined(totalSummary) ? preciseNumberFormatter(totalSummary, formatOptions) : ''
  });

  return gridArray;
};

export const gridData = (rowData) => rowData?.map((row, idx) => {
  const cells = row?.map(value => {
    if (typeof value === GRID_CONSTANTS.DATA_TYPE.OBJECT) {
      return value;
    }
    return {
      type:
        typeof value === GRID_CONSTANTS.DATA_TYPE.STRING && !!value
          ? DATA_GRID_CONTROL_CELL.TYPE.READONLY
          : DATA_GRID_CONTROL_CELL.TYPE.TEXT,
      text: `${value}`,
      allowFocus: typeof value === GRID_CONSTANTS.DATA_TYPE.STRING && !!value ? false : true,
      content: value
    };
  });

  return {
    rowId: idx,
    cells
  };
});

const handlePrecisionFormat = (value, formatOptions) => {
  // true is expected here, switch case is depends on formatOptions value.
  switch(true) {
    case formatOptions?.isDoublePrecision:  return !_isUndefined(value) ? +value : value;
    case formatOptions?.isSinglePrecision:  return preciseNumberFormatter(value, formatOptions);
    default: return value;
  }
};
