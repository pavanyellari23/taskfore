import React from 'react';
import SnapCard from '@pnp-snap/snap-card';
import withStyles from '@material-ui/core/styles/withStyles';
import EmptyScreen from '@revin-utils/components/empty-screen';
import PropTypes from 'prop-types';
import { FORECAST_CHART_CONFIG } from 'utils/constants';
import  CustomChart from '@revin-utils/components/custom-charts';
import blankChart from 'assets/images/blank-chart.svg';
import styles from './ForecastTrends.module.scss';
import ForecastToolTipContent from 'components/common/forecast-chart-tooltip';
import ForecastChartLegend from 'components/common/forecast-chart-legend';
import ForecastChartBar from 'components/common/forecast-chart-bar';

const ForecastTrends = ({trendsData,removeCardHeaderBg,className, trendsTitle,yAxisRightId,legendProps,hideYAxis= false,toolTipLineValue=FORECAST_CHART_CONFIG.NET_EBITDA,noData,xAxisHeight}) => {

  return (
    <SnapCard
      className={`main-card ${className} ${styles.wrapper} ${removeCardHeaderBg && 'no-header-bg'}`}
      content={
        noData ? (
          <EmptyScreen
            center
            className={styles['empty-screen']}
            image={blankChart}
            subTitle={FORECAST_CHART_CONFIG.EMPTY_SCREEN_SUBTITLE}
            title={FORECAST_CHART_CONFIG.EMPTY_SCREEN_TITLE}
          />
        ):
          <CustomChart
            areaProps={{ type: FORECAST_CHART_CONFIG.LINEAR, dataKey: 'area', fill: 'url(#myGradient)',yAxisId:yAxisRightId }}
            barContent={<ForecastChartBar colorThreshold={trendsData?.currentForecastIndex}/>}
            barProps={{ dataKey: 'bar', barSize: 20}}
            data={trendsData?.graphData}
            gradientValue={FORECAST_CHART_CONFIG.STATUS_TWO}
            labelListProps={{ dataKey: 'label', position: 'top' }}
            legendContent={ForecastChartLegend}
            legendProps={{legendItems:legendProps}}
            lineProps={{ type: FORECAST_CHART_CONFIG.LINEAR, dataKey:FORECAST_CHART_CONFIG.LINE, stroke: FORECAST_CHART_CONFIG.STATUS_TWO, lineTension: 1, strokeWidth:1.5, dot: { r: 5 }, activeDot: { r: 6, stroke: FORECAST_CHART_CONFIG.STATUS_TWO, fill: FORECAST_CHART_CONFIG.STATUS_LIGHT },yAxisId:yAxisRightId }}
            referenceLineProps={{y:0,stroke:'#d7e0e3be'}}
            showAreaChart
            showBarChart
            showLegend
            showLineChart
            showLinearGradient
            showReferenceLine
            showTooltip
            showXAxis
            showYAxisLeft
            showYAxisRight
            tooltipContent={ForecastToolTipContent}
            tooltipProps={{ cursor: { stroke: 'transparent' }, dataKey: FORECAST_CHART_CONFIG.LINE, tooltipType:  FORECAST_CHART_CONFIG.CUSTOM, toolTipLineValue}}
            xAxisProps={{ dataKey: 'name', tickLine: false, axisLine: false,height:xAxisHeight }}
            yAxisLeftProps={{ tickFormatter: (value) => `${value}${value !== 0 ? trendsData?.suffix:''}`, domain: [0, 'dataMax+1' ], ticks:trendsData?.leftTicks,tickLine: false, axisLine: false,minTickGap:4 ,dataKey: 'bar' ,hide:hideYAxis }} 
            yAxisRightId=""
            yAxisRightProps={{ tickFormatter: (value) => `${value}%`, domain:  [0,'dataMax+10'], ticks: trendsData?.rightTicks,tickLine: false, axisLine: false, dataKey: FORECAST_CHART_CONFIG.LINE,minTickGap:4 ,yAxisId:yAxisRightId, hide:hideYAxis}}
          />
          
         
      }
      title={trendsTitle}
    />
  );
};

ForecastTrends.propTypes = {
  className:PropTypes.string,
  graphHeight:PropTypes.number,
  hideYAxis:PropTypes.bool,
  legendProps: PropTypes.array,
  noData: PropTypes.bool,
  removeCardHeaderBg:PropTypes.bool,
  toolTipLineValue: PropTypes.string,
  trendsData:PropTypes.array,
  trendsTitle:PropTypes.string,
  xAxisHeight:PropTypes.number,
  yAxisLeftProps:PropTypes.array,
  yAxisRightId:PropTypes.string,
  yAxisRightProps:PropTypes.array
};
export default withStyles(styles)(ForecastTrends);

