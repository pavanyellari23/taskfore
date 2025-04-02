import moment from 'moment-mini';
import { DATE_FORMAT, EMP_TYPE, GRAPH_BUFFER_VALUE } from 'utils/constants';

export const getIdFromURL = () => {
  if (window.location.href.includes('template')) {
    return null;
  }
  return window.location.href.split('#/forecasting/')?.pop()?.split('/')[0];
};

export const getDateFromPeriod = (period, date, isStartDate, dateFormat) => {
  if (!period) {
    return '';
  }

  let periodFormat = `${`${period}`.substring(0, 4)}-${`${period}`.substring(
    4
  )}-`;

  if (`${period}` === moment(date).format(DATE_FORMAT.FORMAT_7)) {
    periodFormat += moment(date).format('DD');
  } else {
    if (isStartDate) {
      periodFormat += '01';
    } else {
      periodFormat += moment(date).endOf('month').format('DD');
    }
  }
  if (dateFormat) {
    periodFormat = moment(periodFormat).format(dateFormat);
  }
  return periodFormat;
};

export const getProjectPeriods = (periodSummary) => {
  if (!periodSummary?.length) {
    return [];
  }
  
  const periods = [];
  periodSummary.forEach((period, index) => {
    const year = `${period.periodId}`.substring(0, 4);
    const month = `${period.periodId}`.substring(4, 6);
    const newMonth = moment(month, 'MM');
    const formatted = moment(period.periodId, 'YYYYMM');
    if (moment().diff(formatted, 'month') <= 0) {
      periods.push({
        id: period.periodId,
        short: `P${index + 1}`,
        label: `${newMonth.format('MMM')} ${year}`.toUpperCase()
      });
    }
  });
  return periods;
};

export const getPeriods = (periods = [], startPeriod, endPeriod) => {
  let periodStart = [...periods];
  let periodEnd = [...periods];

  if (startPeriod) {
    periodEnd = [
      ...periods?.slice(periods?.findIndex((item) => item.id === startPeriod))
    ];
  }

  if (endPeriod) {
    periodStart = [
      ...periods?.slice(
        0,
        periods?.findIndex((item) => item.id === endPeriod) + 1
      )
    ];
  }

  return { periodStart, periodEnd };
};

export const getPeriodDates = (
  startPeriod,
  endPeriod,
  projectStartDate,
  projectEndDate
) => {
  const dates = { startPeriod: '', endPeriod: '', startDate: '', endDate: '' };

  dates.startPeriod = startPeriod;
  dates.endPeriod = endPeriod;
  dates.startDate = getDateFromPeriod(startPeriod, projectStartDate, true);
  dates.endDate = getDateFromPeriod(endPeriod, projectEndDate, false);

  return dates;
};
export const getLabelById = (id, data, isLabelWithSubtitle) => {
  if (id && data?.length) {
    const selectedData = data.find(item => item.id == id);
    if (isLabelWithSubtitle) {
      return `${selectedData?.label}  |  ${selectedData?.subtitle}` || '';
    }
    return selectedData?.label || '';
  }
  return '';
};

export const setAutocompleteValue = (value = '', setValue, key, formik, data, isSave) => {
  const selectedData = data.find(item => item.label == value);
  if (!selectedData) {
    formik.setFieldValue(key, '');
  } else {
    if (isSave) {
      formik.setFieldValue(key, selectedData.id);
    }
  }
  setValue(value);
};


export const genericSearch = (data, searchText, attributeNames) => {
  const lowerSearchText = searchText.toLowerCase().trim();
  if (!lowerSearchText) {
    return data;
  }
  const filteredData = data?.filter(item => {
    return attributeNames?.some(attr => {
      const value = item?.[attr];
      return value && value?.toLowerCase()?.includes(lowerSearchText);
    });
  });
  return filteredData || []; 
};


export const getFilteredSearchData = (forecastingRoles, searchText) => {
  let filtered;
  if (!forecastingRoles || !searchText) {
    filtered = forecastingRoles || [];
  } else {
    filtered = forecastingRoles.filter((role) => {
      const orgRoleId = role?.orgRoleId?.replace(/[_]+/g, ' ').toLowerCase() ?? '';
      const resourceData = role?.resourceData || {}; 
      const searchLowerCase = searchText.toLowerCase();
      if (!Object.keys(resourceData).length) {
        return orgRoleId.toLowerCase().includes(searchLowerCase);
      }
      const {
        firstName = '',
        lastName = '',
        employeeId = '',
        orgRoleId: orgInside = '' 
      } = resourceData;
      const orgInsideLower = orgInside.replace(/[_]+/g, ' ').toLowerCase();
      return (
        orgRoleId.toLowerCase()?.includes(searchLowerCase) ||
        firstName.toLowerCase()?.includes(searchLowerCase) ||
        lastName.toLowerCase()?.includes(searchLowerCase) ||
        employeeId.toLowerCase()?.includes(searchLowerCase) ||
        (firstName.toLowerCase() + ' ' + lastName.toLowerCase())?.includes(searchLowerCase) ||
        orgInsideLower.toLowerCase()?.includes(searchLowerCase)
      );
    });
  }
  return filtered;
};

export const getISTTime = (date, time) => {
  const constructDate = `${date} ${time}`;
  return moment.utc(constructDate).local().format(DATE_FORMAT.FORMAT_12);
};

export const quarterlyLabel = (quarterData) => {
  if (!quarterData || typeof quarterData !== 'object') {
    return '';
  }
  const { quarter, year } = quarterData;
  if (!quarter || !year) {
    return '';
  }
  const yearString = year?.toString()?.slice(-2);
  return `${quarter} ${yearString}`;
};

export const monthlyLabel = (monthlyData) => {
  if (!monthlyData||  monthlyData?.length<2) {
    return '';
  }
  const month=monthlyData[1];
  const newMonth = moment(month, 'MM');
  return newMonth.format('MMM');
};


export const quarterlyLabelForSummary=(quarterData) => {
  const quarter =quarterData?.slice(4);
  const year = quarterData?.slice(2, 4);
  return quarter + ' ' + year;
};

const determineSuffixAndScale = (value) => {
  let higherSuffix = '';
  let scaleFactor = 1;

  if (value >= 1e9) {
    higherSuffix = 'B';
    scaleFactor = 1e9;
  } else if (value >= 1e6) {
    higherSuffix = 'M';
    scaleFactor = 1e6;
  } else if (value >= 1e3) {
    higherSuffix = 'K';
    scaleFactor = 1e3;
  }

  return { higherSuffix, scaledValue: value / scaleFactor };
};

const generateYAxisTicks = (lowest, highest, scaledMax) => {
  const isMixedSign = lowest < 0 && highest > 0;
  const tickIncrement = Math.ceil((scaledMax * GRAPH_BUFFER_VALUE) / (isMixedSign ? 2 : 4));
  if (isMixedSign) {
    return [-2 * tickIncrement, -tickIncrement, 0, tickIncrement, 2 * tickIncrement];
  } else if (highest <= 0) {
    return Array.from({ length: 5 }, (_, i) => -4 * tickIncrement + i * tickIncrement);
  } else {
    return Array.from({ length: 5 }, (_, i) => i * tickIncrement);
  }
};

const tickSetter = (highest, lowest) => {
  const absMax = Math.max(Math.abs(highest), Math.abs(lowest));
  if (absMax === 0) {
    return { yAxisTicks: [], higherSuffix: '' };
  }

  const { higherSuffix, scaledValue } = determineSuffixAndScale(absMax);
  const yAxisTicks = generateYAxisTicks(lowest, highest, scaledValue);

  return { yAxisTicks, higherSuffix };
};

export const setTicksAndSuffix = (highestTotalRevenue, lowestTotalRevenue, highestPercentage, lowestPercentage) => {
  const { yAxisTicks: yAxisLeftTicks, higherSuffix } = tickSetter(highestTotalRevenue, lowestTotalRevenue);

  const absMaxPercentage = Math.max(Math.abs(highestPercentage), Math.abs(lowestPercentage));
  const yAxisRightTicks = absMaxPercentage !== 0
    ? generateYAxisTicks(lowestPercentage, highestPercentage, absMaxPercentage)
    : [];

  return { yAxisLeftTicks, yAxisRightTicks, suffix: higherSuffix, autoDomain: false };
};



export function getWorkerTooltip(employeeType){
  const normalizedEmployeeType = employeeType?.replace(/\s+/g, '').toUpperCase();
  return EMP_TYPE?.EMP_TYPE_KEY?.includes(normalizedEmployeeType) ?EMP_TYPE?.EMP_TYPE_VALUE: false;
}

export const getSubmissionMessage = (value) => {
  return `Forecast submission for ${moment(value?.startDateTime).format(DATE_FORMAT.FORMAT_1)} - ${moment(value?.endDateTime).format(DATE_FORMAT.FORMAT_1)} is in progress. Please wait before updating the forecast.`;
};

/* Convert to title case including paranthesis
 e.g. to the (title) case => To The (Title) Case */
export const toTitleCase = (str) => {
  return str.split(' ').map(w => {
    const i = ['('].includes(w[0]) ? 1: 0;
    return w.replace(w.charAt(i), w.charAt(i).toUpperCase());
  }).join(' ');
};

export const getMonthAndYearLabel = (dateId) => {
  if (dateId) {
    const year = `${dateId}`.substring(0, 4);
    const month = `${dateId}`.substring(4, 6);
    const newMonth = moment(month, 'MM');
    return `${newMonth.format('MMM')} ${year}`.toUpperCase();
  } else {
    return '';
  }
};