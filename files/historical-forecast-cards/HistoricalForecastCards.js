import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import EmptyScreen from '@revin-utils/components/empty-screen';
import noPastSubmissions from 'assets/images/no-expense.png';
import ForecastCard from 'components/common/forecast-card';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { ROUTES, FORECAST_DASHBOARD_CONSTANTS, NO_PAST_SUBMISSIONS_MSG } from 'utils/constants';
import { getHistoricalCards } from './helper';



const HistoricalForecastCards = ({ cards, isNewCard, path, parentAccountId, callBackHandler, className }) => {

  const [historicalCards, setHistoricalCards] = useState([]);

  useEffect(() => {
    if (parentAccountId) {
      callBackHandler({
        type: ForecastDashBoardActionType.GET_FORECAST_HISTORICAL_DATA,
        payload: {
          parentAccountId,
          pageSize: FORECAST_DASHBOARD_CONSTANTS.VIEW_ALL_HISTORICAL_CARDS_LIMIT,
          page: 0
        }
      });
    }
  }, [path, parentAccountId]);

  useEffect(() => {
    const cardsToShow = path === ROUTES.FORECAST_DASHBOARD_VIEW_ALL_FORECAST.split('/')[2] ? cards : cards?.slice(0, 4);
    setHistoricalCards(cardsToShow);
  }, [cards]);

  return (
    <>
      {cards?.length ? historicalCards?.map(cards => {
        const cardData = getHistoricalCards(cards, isNewCard);
        return (
          <Col
            key={cardData?.id}
            xs={6}
          >
            <ForecastCard
              dates={cardData?.dates}
              grossProfitMargin={cardData?.grossProfitMargin}
              isNew={cardData?.isNew}
              netEbitda={cardData?.netEbitda}
              revenue={cardData?.revenue}
              showNewCardAnimation={cardData?.showNewCardAnimation}
            />
          </Col>);
      })
        :
        <Col xs={24}>
          <EmptyScreen
            center
            className={`card-empty-screen w-100 flex-row align-items-center ${className}`}
            image={noPastSubmissions}
            title={NO_PAST_SUBMISSIONS_MSG}
          />
        </Col>
      }
    </>
  );
};

HistoricalForecastCards.propTypes = {
  callBackHandler: PropTypes.func,
  cards: PropTypes.array,
  className: PropTypes.func,
  isNewCard: PropTypes.any,
  parentAccountId: PropTypes.string,
  path: PropTypes.string
};

export default HistoricalForecastCards;
