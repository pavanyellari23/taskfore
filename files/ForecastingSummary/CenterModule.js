import React, { useEffect , useState } from 'react';
import PropTypes from 'prop-types';
import SummaryTable from 'components/common/SummaryTable';
import { FORECASTING_SUMMARY, FORECAST_CHART_CONFIG, FORECAST_REVENUE_EBITDA_LEGEND, FORECAST_REVENUE_GPM_LEGEND } from 'utils/constants';
import { getSummaryGridData } from 'utils/helper';
import ForecastTrends from 'components/pages/forecast-dashboard/components/forecast-trends/ForecastTrends';
import styles from './CenterModule.module.scss';

const CenterModule = ({ forecastingType, monthlyTrends, quarterlyTrends, transition, forecastData}) => {
  const [kpiTableHeader , setkpiTableHeader] = useState([]);
  const [kpiTableRowData , setkpiTableRowData] = useState([]);

  useEffect(() => {
    const summaryData = forecastData?.forecastingPeriodSummary ?? forecastData?.forecastPeriodSummary;
    const quarterlyData = forecastData?.quarterYearSummary ?? forecastData?.projectQuarterYearSummaries;
    if(summaryData && quarterlyData){
      getSummaryGridData([...summaryData, ...quarterlyData], forecastingType === FORECASTING_SUMMARY.ACCOUNT && true, setkpiTableRowData, setkpiTableHeader );
    }
  }, [JSON.stringify(forecastData)]);
  return (
    <div  className={styles['center-module']}>
      <div className="d-flex gap-4">
        <ForecastTrends
          className={`${styles.diagrams} ${!transition && styles['expanded']}`} 
          hideYAxis={transition}
          legendProps={forecastingType === FORECASTING_SUMMARY.ACCOUNT ? FORECAST_REVENUE_EBITDA_LEGEND:FORECAST_REVENUE_GPM_LEGEND}
          noData={!quarterlyTrends  || !quarterlyTrends?.graphData}
          removeCardHeaderBg
          toolTipLineValue={forecastingType === FORECASTING_SUMMARY.ACCOUNT? FORECAST_CHART_CONFIG.NET_EBITDA:FORECAST_CHART_CONFIG.GPM}
          trendsData={quarterlyTrends}
          trendsTitle={FORECAST_CHART_CONFIG.QUARTERLY_TRENDS}
          xAxisHeight={10}
          yAxisRightId={FORECAST_CHART_CONFIG.QUARTERLY_TRENDS_ID}
        />
        <ForecastTrends
          className={`${styles.diagrams} ${!transition && styles['expanded']}`} 
          hideYAxis={transition} 
          legendProps={forecastingType === FORECASTING_SUMMARY.ACCOUNT ? FORECAST_REVENUE_EBITDA_LEGEND:FORECAST_REVENUE_GPM_LEGEND}
          noData={!monthlyTrends  || !monthlyTrends?.graphData}
          removeCardHeaderBg
          toolTipLineValue={forecastingType === FORECASTING_SUMMARY.ACCOUNT? FORECAST_CHART_CONFIG.NET_EBITDA:FORECAST_CHART_CONFIG.GPM}
          trendsData={monthlyTrends}
          trendsTitle={FORECAST_CHART_CONFIG.MONTHLY_TRENDS}
          xAxisHeight={10}
          yAxisRightId={FORECAST_CHART_CONFIG.MONTHLY_TRENDS_ID}
        />
      </div>
      { kpiTableHeader && kpiTableRowData && 
      <SummaryTable
        summaryTableHeader={kpiTableHeader}
        summaryTableRowData={kpiTableRowData}
      />
      }
    </div>
  );
};

CenterModule.propTypes = {
  forecastData: PropTypes.object,
  forecastingType: PropTypes.string,
  monthlyTrends:PropTypes.object,
  quarterlyTrends: PropTypes.object,
  styles: PropTypes.any,
  transition: PropTypes.any
};

export default CenterModule;