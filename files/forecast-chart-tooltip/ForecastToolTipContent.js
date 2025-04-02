import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FORECAST_CHART_CONFIG } from 'utils/constants';

const ForecastToolTipContent = ({active, payload, toolTipLineValue}) => {

  const lineChartData = useMemo(() => payload.find((entry) => entry?.dataKey === FORECAST_CHART_CONFIG.LINE), [payload]);
  if (active && lineChartData) {
    const { value } = lineChartData;
    const { totalRevenue, toolTipLabel, lineDollar } = lineChartData?.payload || {};
    return (
      <div className="custom-tooltip">
        <p className="sub-title">{toolTipLabel}</p>
        <p className="title mt-1">${totalRevenue}</p>
        <p className="sub-title">Revenue</p>
        <p className="title mt-1">${lineDollar} | {value}%</p>
        <p className="sub-title">{toolTipLineValue}</p>
      </div>
    );
    
  }
  return null;
};

ForecastToolTipContent.propTypes = {
  active: PropTypes.bool,
  dataKey:PropTypes.string,
  label: PropTypes.string,
  payload: PropTypes.object,
  toolTipLineValue: PropTypes.string,
  tooltipType:PropTypes.string
};

export default ForecastToolTipContent ;
