import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import SnapTextbox from '@pnp-snap/snap-textbox';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import { FORM_LABELS,getSessionItem } from '@revin-utils/utils';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import { ELEMENT_ID } from 'utils/test-ids';
import { useFormik } from 'formik';
import { CONTROLS_LABEL, DROPDOWN_TYPE, FORECAST_CONTROLS_COL_KEYS, SESSION_STORAGE_KEYS } from 'utils/constants';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import styles from './AddLocation.module.scss';

const AddLocation = ({ addLocationEvent, callBackHandler, closeAddLocationModal, locations }) => {
  const formik = useFormik({
    initialValues: {
      location: '',
      dailyWorkingHours: '',
      monthlyWorkingHours: '',
      utilisation: ''
    }
  });

  useEffect(() => {
    addLocationEvent(formik.values);
  }, [formik.values]);

  const onLocationChange = (e, data) => {
    getHolidaysByLocationId(data.id);
    formik.setFieldValue(CONTROLS_LABEL.LOCATION, data);
  };

  const getHolidaysByLocationId = (locationId) => {
    const response=getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);;
    const windowStartDate = response?.forecastDisplayWindowStartDate;
    const windowEndDate = response?.forecastDisplayWindowEndDate;
    callBackHandler({
      type: ForecastControlsActionType.GET_HOLIDAYS_BY_LOCATION_ID,
      payload: { locationId,windowStartDate, windowEndDate}
    });
  };

  return (
    <div className={styles.wrapper}>
      <div
        className={`d-flex align-items-center mb-3 ${styles.title}`}
        id={ELEMENT_ID.ADD_LOCATION_ARROW_LEFT}
        onClick={closeAddLocationModal}
      >
        <ArrowLeft />
        {CONTROLS_LABEL.ADD_LOCATION1}
      </div>
      <div className={styles['location-field-wrap']}>
        <SnapDropdown
          className="search-location"
          data={locations}
          handleChange={onLocationChange}
          id={ELEMENT_ID.SEARCH_LOCATION}
          label={CONTROLS_LABEL.SEARCH_LOCATION_LABEL}
          name={CONTROLS_LABEL.LOCATION}
          type={DROPDOWN_TYPE.AUTOCOMPLETE}
          value={formik.values.location}
        />
        <div className={`d-flex align-items-center my-2 gap-2 ${styles.fields}`}>
          <SnapTextbox
            baseValue={0}
            decimalPoints={2}
            handleChange={formik.handleChange}
            id={ELEMENT_ID.WORKING_HRS_DAY}
            isNonNegativeNumber
            label={CONTROLS_LABEL.WORKING_HRS_DAY_LABEL}
            name={FORECAST_CONTROLS_COL_KEYS.COL_DAILY_WORKING_HOURS}
            type={FORM_LABELS.OUTLINED}
            value={formik.values.dailyWorkingHours}
          />
          <SnapTextbox
            baseValue={0}
            decimalPoints={2}
            handleChange={formik.handleChange}
            id={ELEMENT_ID.WORKING_HRS_MONTH}
            isNonNegativeNumber
            label={CONTROLS_LABEL.WORKING_HRS_MONTH_LABEL}
            name={FORECAST_CONTROLS_COL_KEYS.COL_MONTHLY_WORKING_HOURS}
            type={FORM_LABELS.OUTLINED}
            value={formik.values.monthlyWorkingHours}
          />
        </div>
        <div className={`d-flex align-items-center my-2 gap-2 ${styles.fields}`}>
          <SnapTextbox
            baseValue={0}
            decimalPoints={0}
            handleChange={formik.handleChange}
            id={ELEMENT_ID.UTILISATION}
            isNonNegativeNumber
            label={CONTROLS_LABEL.UTILISATION_LABEL}
            name={CONTROLS_LABEL.UTILISATION}
            type={FORM_LABELS.OUTLINED}
            value={formik.values.utilisation}
          />
        </div>
      </div>
    </div>
  );
};

AddLocation.propTypes = {
  addLocationEvent: PropTypes.func,
  callBackHandler: PropTypes.func,
  closeAddLocationModal: PropTypes.func,
  locations: PropTypes.array
};

export default AddLocation;
