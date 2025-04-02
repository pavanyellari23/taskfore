import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import withStyles from '@material-ui/core/styles/withStyles';
import Clock from 'react-feather/dist/icons/clock';
import CustomChip from '@revin-utils/components/custom-chip';
import { millionBillionFormatter } from '@revin-utils/utils';
import { getISTTime } from 'utils/commonFunctions';
import { FORECAST_DASHBOARD_CONSTANTS, DATE_FORMAT, IST_TEXT } from 'utils/constants';
import styles from './ForecastCard.module.scss';

const ForecastCard = ({ dates, revenue, netEbitda, grossProfitMargin, isNew, showNewCardAnimation }) => {
  const { startDate, endDate, submittedDate } = dates;
  const [showNewBackground, setShowNewBackground] = useState(false);
  const startDateObj = new Date(startDate);
  const endDateObj = new Date(endDate);
  const [formattedDate,setFormattedDate] = useState('');
  const formattedStartDate = `${startDateObj.toLocaleString('en-us', {
    month: 'short'
  })} ${startDateObj.getDate()} ${startDateObj.getFullYear()}`;
  const formattedEndDate = `${endDateObj.toLocaleString('en-us', {
    month: 'short'
  })} ${endDateObj.getDate()} ${endDateObj.getFullYear()}`;

  const submittedDateObj = new Date(submittedDate);
  const forecastSubmitDateArray = moment(submittedDateObj).format(DATE_FORMAT.FORMAT_8).split(' ');
  const formattedSubmittedDate = `${moment(submittedDateObj).format(DATE_FORMAT.FORMAT_1)} | ${getISTTime(forecastSubmitDateArray[0], forecastSubmitDateArray[1])} ${IST_TEXT}`;

  useEffect(() => {
    if (showNewCardAnimation) {
      setShowNewBackground(true);
      const timer = setTimeout(() => {
        setShowNewBackground(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showNewCardAnimation]);

  useEffect(() =>{
    setFormattedDate(moment(submittedDate).format('YY'));
  },[submittedDate]);

  return (
    <div className={`mb-3 ${styles.wrapper} ${showNewBackground && styles['new-background']}`}>
      <div className="d-flex justify-content-between">
        <div>
          <h5>
            {formattedStartDate} - {formattedEndDate} <span className={styles['fy-year']}>(FY {formattedDate})</span>
          </h5>
          <p className={`d-flex align-items-center ${styles['date-time']}`}>
            <Clock /> {formattedSubmittedDate}
          </p>
        </div>
        {isNew &&
        <CustomChip
          title={FORECAST_DASHBOARD_CONSTANTS.NEW}
          type="borderless-solid"
        />
        }
      </div>
      <div className={styles['inner-box']}>
        <div className="d-flex justify-content-between mb-3">
          {revenue && (
            <div className={styles['numbers-wrapper']}>
              <h3>
                {millionBillionFormatter(revenue.value,{isSinglePrecision:true})}
                {revenue.percentage && (
                  <span className={styles.percentage}>
                    {millionBillionFormatter(revenue.percentage,{isPercentage:true})}
                  </span>
                )}
              </h3>
              <p>{FORECAST_DASHBOARD_CONSTANTS.REVENUE}</p>
            </div>
          )}
          {grossProfitMargin && (
            <div className={styles['numbers-wrapper']}>
              <h3>
                {millionBillionFormatter(grossProfitMargin.value,{isSinglePrecision:true})}
                {grossProfitMargin.percentage && (
                  <span className={styles.percentage}>
                    {millionBillionFormatter(grossProfitMargin.percentage,{isPercentage:true})}
                  </span>
                )}
              </h3>
              <p>{FORECAST_DASHBOARD_CONSTANTS.GROSS_PROFIT_MARGIN}</p>
            </div>
          )}
        </div>
        <div className="d-flex justify-content-between">
          {netEbitda && (
            <div className={styles['numbers-wrapper']}>
              <h3>
                {millionBillionFormatter(netEbitda?.value,{isSinglePrecision:true})}
                {netEbitda?.percentage && (
                  <span className={styles.percentage}>
                    {millionBillionFormatter(netEbitda?.percentage,{isPercentage:true})}
                  </span>
                )}
              </h3>
              <p>{FORECAST_DASHBOARD_CONSTANTS.NET_EBIDTA}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

ForecastCard.propTypes = {
  dates: PropTypes.object, 
  grossProfitMargin: PropTypes .object,
  isNew: PropTypes.bool,
  netEbitda: PropTypes.object,
  percentage: PropTypes.number,
  revenue: PropTypes.object,
  showNewCardAnimation: PropTypes.bool
};

export default withStyles(styles)(ForecastCard);
