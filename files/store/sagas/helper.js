import { saveAs } from 'file-saver';
import { millionBillionFormatter,preciseNumberFormatter } from '@revin-utils/utils';
import { monthlyLabel, quarterlyLabel, setTicksAndSuffix } from 'utils/commonFunctions';
import { CONTROLS_LABEL, ALERT_CONFIGURATION, ERROR_CODE, ADJUSTMENT_THRESHOLD_KEY, FORECASTING_SUMMARY, FORECAST_CHART_CONFIG, EXCEL_DOWNLOAD_SPLIT_STRING } from 'utils/constants';

export const getAddedControls = (data) => {
  return data?.filter(item => {
    if (item.status === CONTROLS_LABEL.ACTION_ADDED) {
      delete item.id;
      return item;
    }
  });
};

export const getModifiedControls = (data) => {
  return data.filter(({ status }) => status === CONTROLS_LABEL.ACTION_MODIFIED);
};

export const forecastGridErrorControl = (errorObjects) => {
  const { FORECAST_GRID_ERROR_CODE, DUPLICATE_ERROR_CODE } = ERROR_CODE;

  const { activeErrors, extractedNames } = errorObjects.reduce(
    ({ activeErrors, extractedNames }, { code, detail }) => {

      switch (code) {
        case FORECAST_GRID_ERROR_CODE: {
          !activeErrors.some((err) => err.detail === detail) &&
            activeErrors.push({ code, detail, info: null });
          break;
        }
        case DUPLICATE_ERROR_CODE: {
          const transformedName = transformDuplicateErrors(detail);
          transformedName && extractedNames.add(transformedName);
          break;
        }
        default:
          activeErrors.push({ code, detail, info: null });
          break;
      }
      return { activeErrors, extractedNames };
    },
    { activeErrors: [], extractedNames: new Set() }
  );
  extractedNames.size > 0 &&
    activeErrors.push({
      code: DUPLICATE_ERROR_CODE,
      detail: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR,
      info: { duplicateAssociates: Array.from(extractedNames) }
    });
  return activeErrors;
};

export const transformDuplicateErrors = (errorDetail) => {
  try {
    const { firstName, lastName, employeeId } = JSON.parse(
      errorDetail.substring(
        errorDetail.indexOf('{'),
        errorDetail.lastIndexOf('}') + 1
      )
    );
    if (firstName && lastName && employeeId) {
      return `${firstName} ${lastName} (${employeeId})`;
    }
  } catch (jsonError) {
    return null;
  }
  return null;
};


export function getForecastRevenueThresholdLevel(data) {
  const item = data.find(item => item.name === ADJUSTMENT_THRESHOLD_KEY);
  return item ? parseFloat(item?.configuration?.values[0]?.configValue) : null;
}
const getPercentageValue = (data, forecastType) => {
  return data.map(item => {
    const attributes = item?.attributes || item;
    return forecastType === FORECASTING_SUMMARY.ACCOUNT 
      ? attributes?.netEbitdaPercentage || 0 
      : attributes?.grossMarginPercentage || 0;
  });
};

export function forecastTrendsMapper(data, forecastType, isQuarterly) {
  if (!data || data.length === 0) {
    return null;
  }
  const totalRevenues = data.map((item) => item?.attributes?.totalRevenue || item?.totalRevenue || 0);
  const percentageValues = getPercentageValue(data, forecastType);
  const highestTotalRevenue = Math.max(...totalRevenues);
  const lowestTotalRevenue = Math.min(...totalRevenues);
  const highestPercentage=Math.max(...percentageValues);
  const lowestPercentage=Math.min(...percentageValues);

  const { yAxisLeftTicks, suffix,yAxisRightTicks, autoDomain } = setTicksAndSuffix(highestTotalRevenue,lowestTotalRevenue,highestPercentage,lowestPercentage);
  
  const currentIndexKey = isQuarterly ? FORECAST_CHART_CONFIG.CURRENT_QUARTER : FORECAST_CHART_CONFIG.CURRENT_MONTH;
  const currentIndex = data.findIndex(item => item?.attributes?.[currentIndexKey] || item?.[currentIndexKey]);

  const forecastTrends = data?.map((value) => {
    const attributes = value?.attributes || value;
    if (attributes) {
      const { yearQuarter, yearMonth, totalRevenue, netEbitdaPercentage, netEbitda, grossMargin, grossMarginPercentage } = attributes;
      let barValue = highestTotalRevenue;
      if (suffix) {
        barValue = totalRevenue / Math.pow(10, suffix === 'B' ? 9 : (suffix === 'M' ? 6 : suffix === 'K' ? 3 : 1));
      }
      
      const area = forecastType === FORECASTING_SUMMARY.ACCOUNT ? netEbitdaPercentage : grossMarginPercentage;
      const name = isQuarterly ? quarterlyLabel(yearQuarter) : monthlyLabel(yearMonth)?.toLocaleUpperCase();
      const toolTipLabel = isQuarterly ? `${yearQuarter?.quarter} ${yearQuarter?.year}` : `${monthlyLabel(yearMonth)} ${yearMonth[0]}`;
      return {
        name,
        'label': millionBillionFormatter(totalRevenue,{isSinglePrecision: true}),
        'line': forecastType === FORECASTING_SUMMARY.ACCOUNT ?  preciseNumberFormatter(netEbitdaPercentage,{isPercentage:true}) :  preciseNumberFormatter(grossMarginPercentage,{isPercentage:true}),
        'bar':barValue,
        toolTipLabel,
        'lineDollar': forecastType === FORECASTING_SUMMARY.ACCOUNT ? preciseNumberFormatter(netEbitda) :  preciseNumberFormatter(grossMargin),
        'totalRevenue':preciseNumberFormatter(totalRevenue),
        area
      };
    }
    return null;
  });
  return { graphData: forecastTrends, leftTicks:  yAxisLeftTicks,rightTicks:yAxisRightTicks, suffix, autoDomain, currentForecastIndex: currentIndex };
}

export const DownloadExcelFile = (response) => {
  const blob = new Blob([response.data], {
    type: 'application/vnd.ms.excel'
  });
  const fileName = response.headers['content-disposition']?.split(EXCEL_DOWNLOAD_SPLIT_STRING)?.[1];
  saveAs(blob, fileName);
};

export const getArray = (error) => {
  const regex = /\[(.*?)\]/;
  const match = error.match(regex);
  return match[1].split(',').map(item => item.trim());
};
