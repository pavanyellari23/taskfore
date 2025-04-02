import React from 'react';
import  PropTypes from 'prop-types';
import { Box, Typography } from '@material-ui/core';
import { SnapCalendar } from '@pnp-blox/snap';
import styles from './TimelineCard.module.scss';

const TimelineCalendar = ({
  startDate,
  endDate,
  totalMonths,
  periodStart = false,
  periodEnd = false,
  className = false,
  isSolidBg = false,
  disableClick
}) => {
  const [startDateCalendar, setStartDateCalendar] = React.useState();
  const [endDateCalendar, setEndDateCalendar] = React.useState();
  const [openDateRange, setOpenDateRange] = React.useState(false);
  const openCalendarView = () => setOpenDateRange(true);
  const closeCalendarView = () => setOpenDateRange(false);
  const disableCalendarView = () => {
    setOpenDateRange(false);
  };
  return (
    <Box className={`timeline-calendar-global ${styles.wrapper}`} >
      <Box
        className={`${className} ${styles.calendar} ${isSolidBg && styles['solid-bg']} ${disableClick && styles['disable-cursor']}`}
        onClick={disableClick ? disableCalendarView : openCalendarView}
      >
        {startDate && (
          <Box className={styles['calendar-item']}>
            {periodStart && (
              <span className={`period-global ${styles.period}`}>
                {periodStart}
              </span>
            )}
            <span className={`date-global ${styles.date}`}>
              {startDate}
            </span>
          </Box>
        )}
        {totalMonths && (
          <Box className={styles['total-month']}>
            <Typography className={`${styles.months} months-global`}>
              {totalMonths}
            </Typography>
          </Box>
        )}
        {endDate && (
          <Box className={styles['calendar-item']}>
            {periodEnd && (
              <span className={`period-global ${styles.period}`}>
                {periodEnd}
              </span>
            )}
            <span className={`date-global ${styles.date}`}>
              {endDate}
            </span>
          </Box>
        )}
      </Box>

      <SnapCalendar
        endDate={endDateCalendar}
        isRangeMode
        onCalendarClose={closeCalendarView}
        setEndDate={setEndDateCalendar}
        setStartDate={setStartDateCalendar}
        show={openDateRange}
        startDate={startDateCalendar}
      />
    </Box>
  );
};

TimelineCalendar.propTypes = {
  className :PropTypes.string,
  disableClick :PropTypes.any,
  endDate :PropTypes.string,
  isSolidBg: PropTypes.any,
  periodEnd :PropTypes.bool,
  periodStart :PropTypes.bool,
  startDate : PropTypes.string,
  startMonth :PropTypes.string,
  totalMonths :PropTypes.string
};

export default TimelineCalendar;
