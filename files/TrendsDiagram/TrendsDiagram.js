import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import styles from './TrendsDiagram.module.scss';
import { DURATION } from 'utils/constants';

const TrendsDiagram = ({ title, period, className }) => {
  return (
    <div className={`${styles.wrapper} ${className}`}>
      <h3>
        {title ||
          (period === DURATION.QUARTER.low && DURATION.QUARTER.upper) ||
          (period === DURATION.MONTHLY.low && DURATION.MONTHLY.upper)}
        {!title && DURATION.TREND}
      </h3>
      {(period === DURATION.QUARTER.low && DURATION.QUARTER.text) ||
        (period === DURATION.MONTHLY.low && DURATION.MONTHLY.text)}
    </div>
  );
};

TrendsDiagram.propTypes = {
  className: PropTypes.string,
  period: PropTypes.string,
  title: PropTypes.string
};

export default withStyles(styles)(TrendsDiagram);
