import React from 'react';
import PropTypes from 'prop-types';

const ForecastChartLegend = ({legendItems}) => {
  return (
    <div className="custom-legend">
      {legendItems?.map((legendItem,index) =>(
        <div
          className="legend-item"
          key={`${legendItem?.label}-${index}`}
        >
          <span className="legend-label">{legendItem?.label}</span>
          <ul className={`legend-list-item ${legendItem?.className}`}>
            <li>
              <span className="legend-icon" />
              {legendItem?.barLegend}
            </li>
            <li>
              <span className="legend-icon line" />
              {legendItem?.lineLegend}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

ForecastChartLegend.propTypes={
  legendItems:PropTypes.array
};

export default ForecastChartLegend;