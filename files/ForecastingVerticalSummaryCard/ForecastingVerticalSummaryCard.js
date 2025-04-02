import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { preciseNumberFormatter} from '@revin-utils/utils';
import { FORECASTING_SUMMARY } from 'utils/constants';
import styles from './ForecastingVerticalSummaryCard.module.scss';

const ForecastingVerticalSummaryCard = ({className, title, subTitle, values, forecastingType}) => {
  return(
    <Box className={`${className} ${styles.wrapper}  `}>
      <Box className={styles['title-wrapper']}>
        {title && <Typography className={styles.title}>{title}</Typography>}
        {subTitle && <p>{subTitle}</p>}
      </Box>
      {values.map((value, index) => (
        <Box
          className={styles['value-wrapper']}
          key={index}
        >
          <div className={styles['value-inner-wrapper']}>
            <Typography className={styles.value}>
              {forecastingType === FORECASTING_SUMMARY.ACCOUNT ? preciseNumberFormatter(value.value) : preciseNumberFormatter(value.value)}
              {value.percentage && (
                <span className={styles.percentage}>{preciseNumberFormatter(value.percentage,{isPercentage:true})} %</span>
              )}
            </Typography>
            <Typography className={styles['sub-title']}>
              {value.label}
            </Typography>
          </div>
        </Box>
      ))}
    </Box>
  );
};

ForecastingVerticalSummaryCard.propTypes = {
  className: PropTypes.string,
  forecastingType: PropTypes.string,
  subTitle: PropTypes.string,
  title: PropTypes.string,
  values: PropTypes.any
};

export default ForecastingVerticalSummaryCard;