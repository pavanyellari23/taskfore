import React from 'react';
import PropTypes from 'prop-types';
import { FORECAST_CHART_CONFIG } from 'utils/constants';

const ForecastChartBar = ({ x, y, width, height, index, colorThreshold}) => {
  const fillColor = index < colorThreshold ? FORECAST_CHART_CONFIG.STATUS_FIVE:FORECAST_CHART_CONFIG.STATUS_FOUR;
  const adjustedHeight = Math.abs(height);
  const adjustedY = height < 0 ? y + height : y;
  return (
    <rect
      fill={fillColor}
      height={adjustedHeight}
      width={width}
      x={x}
      y={adjustedY}
    />);
};

ForecastChartBar.propTypes = {
  colorThreshold: PropTypes.number,
  height: PropTypes.number,
  index: PropTypes.number,
  width: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number
};

export default ForecastChartBar;