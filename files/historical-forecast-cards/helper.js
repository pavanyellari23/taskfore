import moment from 'moment-mini';
import { DATE_FORMAT } from 'utils/constants';

export const getHistoricalCards = (cardData, isNewCard) => {

  const { attributes, id } = cardData;

  return {
    id,
    dates: {
      startDate: moment(attributes?.forecastCycleStartDateTime).format(DATE_FORMAT.FORMAT_1),
      endDate: moment(attributes?.forecastCycleEndDateTime).format(DATE_FORMAT.FORMAT_1),
      submittedDate: attributes?.submittedOn
    },
    revenue: {
      value: attributes?.totalRevenue
    },
    grossProfitMargin : {
      value: attributes?.grossMargin,
      percentage: attributes?.grossMarginPercentage
    },
    netEbitda : {
      value: attributes?.netEbitda,
      percentage: attributes?.netEbitdaPercentage
    },
    isNew: attributes?.showNewLabel,
    showNewCardAnimation: isNewCard === id
  };
};