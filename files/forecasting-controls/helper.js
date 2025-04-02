import moment from 'moment-mini';
import { CONTROLS_LABEL, DATE_FORMAT, FORECAST_CONTROL_TYPES, PROJECT_LABEL, RESOURCE_LABEL } from 'utils/constants';

export const formatToModify = (data) => {
  return {
    id: data?.id,
    countryId: data?.countryId,
    locationValue: data?.locationValue,
    locationCode: data?.locationCode,
    dailyWorkingHours: data?.overridedDailyWorkingHours || data?.dailyWorkingHours,
    overridedDailyWorkingHours: data?.overridedDailyWorkingHours,
    monthlyWorkingHours: data?.overridedMonthlyWorkingHours || data?.monthlyWorkingHours,
    overridedMonthlyWorkingHours: data?.overridedMonthlyWorkingHours,
    utilisationMap: data?.overridedUtilisationMap || data?.utilisationMap,
    overridedUtilisationMap: data?.overridedUtilisationMap,
    holidayList : data?.overridedHolidayList || data?.holidayList,
    overridedHolidayList: data?.overridedHolidayList,
    status: data?.status || CONTROLS_LABEL.ACTION_MODIFIED
  };
};

export const formatToAdd = (data, holidayList) => {
  return {
    id: CONTROLS_LABEL.ACTION_ADDED + data?.location?.id,
    countryId: data?.location?.attributes?.countryId,
    locationValue: data?.location?.label,
    locationCode: data?.location?.attributes?.code,
    dailyWorkingHours: +data?.dailyWorkingHours,
    overridedDailyWorkingHours: null,
    monthlyWorkingHours: +data?.monthlyWorkingHours,
    overridedMonthlyWorkingHours: null,
    utilisationMap: addUtilisationMap(+data?.utilisation),
    overridedUtilisationMap: addUtilisationMap(+data?.utilisation),
    holidayList,
    overridedHolidayList: holidayList,
    status: CONTROLS_LABEL.ACTION_ADDED
  };
};

const addUtilisationMap = (value) => {
  return {
    JANUARY: value,
    FEBRUARY: value,
    MARCH: value,
    APRIL: value,
    MAY: value,
    JUNE: value,
    JULY: value,
    AUGUST: value,
    SEPTEMBER: value,
    OCTOBER: value,
    NOVEMBER: value,
    DECEMBER: value
  };
};


// TODO: We might need this in future commenting it for now.
// const getType = (status, month) => {
//   if (status === CONTROLS_LABEL.ACTION_ADDED) {
//     return CELL_TYPES.VALUE;
//   } else {
//     const currentMonth = moment().format('MMM');
//     return MONTHS[month] >= MONTHS[currentMonth] ? CELL_TYPES.VALUE : CELL_TYPES.COST_READ_ONLY;
//   }
// };

export const buildUtilisationGrid = (data, headers) => {
  const grid = [];
  headers?.forEach(item => {
    grid.push({
      id: item.month,
      value: data.overridedUtilisationMap[item.month],
      // TODO: type: 'value' can be replaced if necessary.
      // type: getType(data.status, item.subName),
      type: 'value',
      pID: item.month,
      month: item.month
    });
  });
  return [grid];
};

export const buildUtilisationMap = (data) => {
  const utilisationMap = {};
  data?.map(item => {
    utilisationMap[item.month] = +item.value;
  });
  return utilisationMap;
};

export const getForecastControlType = (type) => {
  return type === PROJECT_LABEL ? FORECAST_CONTROL_TYPES.PROJECT_CONTROLS :  type === RESOURCE_LABEL? FORECAST_CONTROL_TYPES.RESOURCE_CONTROLS: FORECAST_CONTROL_TYPES.FORECAST_CONTROLS;
};

export const generateMonths = (start, end) => {
  const startDate = moment(start, DATE_FORMAT.FORMAT_17);
  const endDate = moment(end, DATE_FORMAT.FORMAT_17);
  const diff = endDate.diff(startDate, 'month') + 1;
  const count = diff <= 12 ? diff : 12;
  const months = Array.from({ length: count }).map((_, index) => ({
    name: moment(start).add(index, 'month').format(DATE_FORMAT.FORMAT_6),
    subName: moment(start).add(index, 'month').format(DATE_FORMAT.FORMAT_15),
    type: 'month',
    month: moment(start).add(index, 'month').format(DATE_FORMAT.FORMAT_16).toUpperCase()
  }));
  return months;
};