import React from 'react';
import PropTypes from 'prop-types';
import CustomChart from '@revin-utils/components/custom-charts';
import ForecastChartBar from '../forecast-chart-bar/ForecastChartBar';
import ForecastToolTipContent from '../forecast-chart-tooltip/ForecastToolTipContent';
import { FORECAST_CHART_CONFIG } from 'utils/constants';

const ForecastMiniTrends = ({ trendsData,tooltipPosition,yAxisRightId}) => {

  const yLeftDomain = [
    Math.min(...trendsData.map(data => data?.bar)),
    Math.max(...trendsData.map(data => data?.bar))
  ];
  const yRightDomain=
  [
    Math.min(...trendsData.map(data => data?.line)),
    Math.max(...trendsData.map(data => data?.line))
  ];

  return (
    <CustomChart
      barContent={<ForecastChartBar colorThreshold={0} />}
      barProps={{ dataKey: 'bar', barSize: 10 }}
      data={trendsData}
      height={'80%'}
      lineProps={{
        type: FORECAST_CHART_CONFIG.LINEAR,
        dataKey: FORECAST_CHART_CONFIG.LINE,
        stroke: FORECAST_CHART_CONFIG.STATUS_TWO,
        lineTension: 1,
        yAxisId: yAxisRightId
      }}
      showBarChart
      showLineChart
      showTooltip
      tooltipContent={ForecastToolTipContent} 
      tooltipProps={{
        cursor: { stroke: 'transparent' },
        position:tooltipPosition,
        dataKey: FORECAST_CHART_CONFIG.LINE,
        tooltipType: FORECAST_CHART_CONFIG.CUSTOM,
        toolTipLineValue: FORECAST_CHART_CONFIG.GPM
        
      }}
      width={110}
      yAxisLeftProps={{  domain: yLeftDomain, tickLine: false, axisLine: false,dataKey: 'bar' ,hide:true }}
      yAxisRightProps={{  domain:  yRightDomain,tickLine: false, axisLine: false, dataKey: FORECAST_CHART_CONFIG.LINE,yAxisId:yAxisRightId, hide:true}}
    />
  );
};

ForecastMiniTrends.propTypes ={
  tooltipPosition: PropTypes.object,
  trendsData: PropTypes.array,
  yAxisRightId:PropTypes.string

};

export default ForecastMiniTrends;
