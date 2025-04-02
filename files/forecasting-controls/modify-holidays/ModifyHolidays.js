import React, { useEffect, useState } from 'react';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import { FORM_LABELS,NOTIFICATION_TYPES } from '@revin-utils/utils';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import SnapCalendar from '@pnp-snap/snap-calendar';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import X from 'react-feather/dist/icons/x';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import { CONTROLS_LABEL, DATE_FORMAT, DUPLICATE_HOLIDAY } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import CancelIcon from '@material-ui/icons/Cancel';
import styles from './ModifyHolidays.module.scss';

const ModifyHolidays = ({ closeHolidaysModal, holidays, modifiedHolidaysEvent }) => {
  const [holidayDate, setHolidayDate] = useState(moment());
  const [holidayName, setHolidayName] = useState('');
  const [orgHolidays, setOrgHolidays] = useState([]);
  const [clientHolidays, setClientHolidays] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null); 
  
  useEffect(() => {
    const orgHlds = holidays?.filter(f => f.holidayType === CONTROLS_LABEL.ORG);
    const clientHlds = holidays?.filter(f => f.holidayType === CONTROLS_LABEL.CLIENT);
    setOrgHolidays(orgHlds);
    setClientHolidays(clientHlds);
  }, [holidays]);

  const handleHolidayDateSelection = (date) => {
    setHolidayDate(date);
  };

  const handleTextChange = (event) => {
    setHolidayName(event.target.value);
  };

  const handleAddHoliday = () => {
    const newHoliday = {
      date: moment(holidayDate).format(DATE_FORMAT.FORMAT_4),
      name: holidayName,
      holidayType: CONTROLS_LABEL.CLIENT
    };
    const isDateInClientHolidays = clientHolidays?.some(holiday => holiday.date === newHoliday.date);
    const isDateInOrgHolidays = orgHolidays?.some(holiday => holiday.date === newHoliday.date);
    if (isDateInClientHolidays || isDateInOrgHolidays) {
      setErrorMessage(DUPLICATE_HOLIDAY.DUPLICATE_HOLIDAY_ERROR_MESSEGE);
      return;
    }
    setErrorMessage(null);
    setClientHolidays([...clientHolidays, newHoliday]);
    modifiedHolidaysEvent([...orgHolidays, ...clientHolidays, newHoliday]);
    setHolidayDate(moment());
    setHolidayName('');
  };
  
  const removeClientHoliday = (data) => {
    const filtered = clientHolidays?.filter(f => f.date !== data.date);
    setClientHolidays([...filtered]);
    modifiedHolidaysEvent([...orgHolidays, ...filtered]);
  };

  const removeOrgHoliday = (data) => {
    const filtered = orgHolidays?.filter(f => f.date !== data.date);
    setOrgHolidays([...filtered]);
    modifiedHolidaysEvent([...filtered, ...clientHolidays]);
  };

  const formatDate = (date) => {
    const fd = moment(date, DATE_FORMAT.FORMAT_4).format(DATE_FORMAT.FORMAT_1);
    return fd.toLocaleUpperCase();
  };

  const getErrorAlertBar = (errorMessage) => {
    return (
      <CustomAlertBar
        alertType={NOTIFICATION_TYPES.ERROR}
        className={`${styles['error-message']}`}
      >
        <div className="d-flex align-items-center">
          <CancelIcon />
          {errorMessage}
        </div>
      </CustomAlertBar>
    );
  };

  const groupHolidaysByYear = (holidays) => {
    return holidays?.reduce((acc, holiday) => {
      const year = holiday.date.split('-')[2]; 
      if (!acc[year]) {
        acc[year] = [];
      }
      acc[year].push(holiday);
      return acc;
    }, {});
  };
  const clientHolidaysByYear=  groupHolidaysByYear(clientHolidays);
  const orgHolidaysByYear= groupHolidaysByYear(orgHolidays);

  return (
    <div>
      {errorMessage && getErrorAlertBar(errorMessage)}
      <div className={styles.wrapper}>
        <div className={styles['holidays-date']}>
          <div
            className={`d-flex align-items-center mb-3 ${styles.title}`}
            id={ELEMENT_ID.ARROW_LEFT}
            onClick={closeHolidaysModal}
          >
            <ArrowLeft/>
            {CONTROLS_LABEL.MODIFY_HOLIDAYS_BACK}
          </div>
          <SnapCalendar
            className={`w-100 mb-2 ${styles['holiday-date-calendar']}`}
            id={ELEMENT_ID.HOLIDAY_CALENDAR}
            isReadOnly
            label={CONTROLS_LABEL.HOLIDAY_DATE_LABEL}
            minDate={new Date()}
            name={CONTROLS_LABEL.HOLIDAY_DATE}
            selectedDate={holidayDate}
            setDate={handleHolidayDateSelection}
          />
          <SnapTextbox
            className="w-100 mb-2"
            handleChange={handleTextChange}
            id={ELEMENT_ID.HOLIDAY_NAME}
            label={CONTROLS_LABEL.HOLIDAY_NAME_LABEL}
            name={CONTROLS_LABEL.HOLIDAY_NAME}
            type={FORM_LABELS.OUTLINED}
            value={holidayName}
          />
          {holidayDate && holidayName && (
            <SnapButton
              className="primary-invert"
              handleClick={handleAddHoliday}
              id={ELEMENT_ID.ADD_HOLIDAY_BTN}
              label={CONTROLS_LABEL.ADD_HOLIDAY}
              name={CONTROLS_LABEL.ADD_HOLIDAY}
            />
          )}
        </div>
        <div className={`mb-2 ${styles['holidays-table']}`}>
          <header className="d-flex">
            <div className={styles.column}>{CONTROLS_LABEL.UST_HOLIDAYS}</div>
            <div className={styles.column}>{CONTROLS_LABEL.CLIENT_HOLIDAYS}</div>
          </header>
          <div className={`d-flex ${styles.body}`}>
            <div className={styles.column}>
              {Object?.keys(orgHolidaysByYear)?.map((year) => (
                <ul
                  className="list-style-none"
                  key={year}
                >
                  <div className={styles.label}>{year}</div>
                  {orgHolidaysByYear[year] && orgHolidaysByYear[year]?.map((item, i) => {
                    return (
                      <div
                        className={styles['holiday']}
                        key={`${i}-${item.date}`}
                      >
                        <li>
                          <span className={styles['format-date']}>{formatDate(item.date)}</span>
                        - {item.name}
                        </li>
                        <ArrowWrapper
                          className={styles['cross-icon']}
                          data={item}
                          handleChange={removeOrgHoliday}
                          id={ELEMENT_ID.REMOVE_ORG_HOLIDAY_ICON}
                        >
                          <X/>
                        </ArrowWrapper>
                      </div>
                    );
                  })}
                </ul>
              ))}
            </div>
            <div className={styles.column}>
              {!clientHolidays?.length && (
                <p className={`d-flex align-items-center h-100 ${styles['empty-message']}`}>
                  {CONTROLS_LABEL.EMPTY_CLIENT_HOLIDAYS_MSG}
                </p>)}

              {Object?.keys(clientHolidaysByYear)?.map((year) => (
                
                <ul
                  className="list-style-none"
                  key={year}
                >
                  <div className={styles.label}>{year}</div>
                  {clientHolidaysByYear[year] && clientHolidaysByYear[year]?.map((item, i) => {
                    return (
                      <div
                        className={styles['holiday']}
                        key={i + '-' + item.date}
                      >
                        <li>
                          <span className={styles['format-date']}>{formatDate(item.date)}</span>
                        - {item.name}
                        </li>
                        <ArrowWrapper
                          className={styles['cross-icon']}
                          data={item}
                          handleChange={removeClientHoliday}
                          id={ELEMENT_ID.REMOVE_CLIENT_HOLIDAY_ICON}
                        >
                          <X/>
                        </ArrowWrapper>
                      </div>
                    );
                  })}
                </ul>
              ))}
             
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ModifyHolidays.propTypes = {
  closeHolidaysModal: PropTypes.func,
  holidays: PropTypes.array,
  modifiedHolidaysEvent: PropTypes.func
};

export default ModifyHolidays;
