import React from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './SummaryValue.module.scss';

const SummaryValue = ({
  mainValue,
  mainValueTitle,
  className,
  mainValueSecondary,
  currency,
  valueAdornment,
  secondarySmallLabel,
  summaryValueField
}) => (
  <Box className={className}>
    <Box className={styles['main-value-wrapper']}>
      <Typography
        className="main-value"
        id={`${ELEMENT_ID.SUMMARY_VALUE}${summaryValueField}`}
      >
        {mainValue} 
        {currency && <span className={styles.currency}>{currency}</span>}
        {valueAdornment && (
          <span className={styles.percentage}>{valueAdornment}</span>
        )}
        {mainValueSecondary &&
            <span className={`${styles.secondary} ${secondarySmallLabel && styles['secondary-small']}`} >
              {mainValueSecondary} <span className={styles.percentage}>%</span>
              {secondarySmallLabel &&
                                <span className={`secondary-small-label-global ${styles['secondary-small-label']}`}>{secondarySmallLabel}</span>
              }
            </span>
        }
      </Typography>
      <Typography
        className="main-value-title"
        id={`${ELEMENT_ID.SUMMARY_LABEL}${summaryValueField}`}
      >{mainValueTitle}</Typography>
    </Box>
  </Box>
);

SummaryValue.propTypes = {
  className: PropTypes.string,
  currency: PropTypes.bool,
  mainValue: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
    PropTypes.element
  ]),
  mainValueSecondary: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  mainValueTitle: PropTypes.string,
  secondarySmallLabel: PropTypes.any,
  summaryValueField: PropTypes.string,
  valueAdornment: PropTypes.string
};

export default SummaryValue;
