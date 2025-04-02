import React, {useEffect, useMemo, useState } from 'react';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import SnapButton from '@pnp-snap/snap-button';
import SnapModal from '@pnp-snap/snap-modal';
import SnapTable from '@pnp-snap/snap-table';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import EmptyScreen from '@revin-utils/components/empty-screen';
import { FORM_LABELS } from '@revin-utils/utils';
import { RVIcon } from '@revin-utils/assets'; 
import { Info } from '@material-ui/icons';
import MapPin from 'react-feather/dist/icons/map-pin';
import Check from 'react-feather/dist/icons/check';
import { ELEMENT_ID } from 'utils/test-ids';
import X from 'react-feather/dist/icons/x';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import { CONTROLS_ALERT_LIST, CONTROLS_LABEL, FORECAST_CONTROLS_COL_KEYS, FORECAST_CONTROLS_HEADERS,
  FORECAST_CONTROLS_KEYS, WORK_HOURS , DATE_FORMAT, BTN_LABELS, ICONS, UTILISATION_LIMIT,
  PROJECT_LABEL, RESOURCE_LABEL, ALERT_CONFIGURATION, BILLING_TYPE_CODE} from 'utils/constants';
import { formatToModify, formatToAdd, buildUtilisationMap, getForecastControlType } from './helper';
import { ForecastControlsActionType } from 'store/types/ForecastControlsActionType';
import ModifyUtilisation from './modify-utilisation/ModifyUtilisation';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import noLocationImage from 'assets/images/no-location.svg';
import ForecastControlsCell from './ForecastControlsCell';
import ProgressModal from './progress-modal/ProgressModal';
import AddLocation from './add-location/AddLocation';
import ModifyHolidays from './modify-holidays';
import styles from './ForecastingControls.module.scss';

const { iconSmallTwo, iconMediumTwo} = variableStyle;

const {
  DAILY_WORKING_HOURS,
  MONTHLY_WORKING_HOURS,
  CITY,
  UTILISATION,
  HOLIDAYS,
  ACTION
} = FORECAST_CONTROLS_HEADERS;

const {
  COL_ACTION_ICON,
  COL_CITY,
  COL_DAILY_WORKING_HOURS,
  COL_MONTHLY_WORKING_HOURS,
  COL_UTILISATION,
  COL_HOLIDAYS
} = FORECAST_CONTROLS_COL_KEYS;

const ForecastingControls = ({
  callBackHandler,
  forecastControlsState,
  handleClose,
  metaData,
  open,
  parentAccountId,
  type,
  projectCode,
  onConfirmEvent,
  billingTypeCode
}) => {
  const controls = forecastControlsState?.controls[getForecastControlType(type)];
  const modifiedControls = forecastControlsState?.modifiedControls[getForecastControlType(type)];
  const {holidaysByLocation} = forecastControlsState;
  const [modifiedUtilisations, setModifiedUtilisations] = useState([]);
  const [isEditUtilisations, setIsEditUtilisations] = useState(false);
  const [isOpenAddLocation, setIsOpenAddLocation] = useState(false);
  const [forecastControls, setForecastControls] = useState([]);
  const [modifiedHolidays, setModifiedHolidays] = useState([]);
  const [isEmptyLocation, setIsEmptyLocation] = useState(true);
  const [isEditHolidays, setIsEditHolidays] = useState(false);
  const [utilisations, setUtilisations] = useState([]);
  const [selectedRowId, setSelectedRowId] = useState(null);
  const [addedLocation, setAddedLocation] = useState({});
  const [holidays, setHolidays] = useState([]);
  const [alertList, setAlertList] = useState([]);
  const [errors, setErrors] = useState([]);
  const [rows, setRows] = useState([]);
  const [isModifiedControls, setIsModifiedControls]=useState(false);
  const [openControlsModal, setOpenControlsModal] = useState(open);
  const [openProgressModal, setOpenProgressModal] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const hasModifiedControls = modifiedControls?.length > 0;
    setIsModifiedControls(hasModifiedControls);
  },[modifiedControls, type]);

  useEffect(() => {
    callBackHandler({
      type: ForecastControlsActionType.GET_FORECAST_CONTROLS,
      payload: { parentAccountId, type, projectCode }
    });
  }, []);

  useEffect(() => {
    if (!controls?.length) {
      setIsEmptyLocation(true);
    } else {
      setForecastControls(controls);
    }
  }, [controls]);

  useEffect(() => {
    if (isOpenAddLocation) {
      callBackHandler({ type: MetaDataActionType.GET_LOCATIONS });
    }
  }, [isOpenAddLocation]);

  useEffect(() => {
    if (forecastControlsState?.saveControlsSuccess) {
      (type === PROJECT_LABEL || type === RESOURCE_LABEL) ? setOpenProgressModal(true) : handleClose();
    } else {
      setOpenProgressModal(false);
    }
  }, [forecastControlsState?.saveControlsSuccess, type]);

  const cells = () => {
    if (((type === RESOURCE_LABEL) || (type === PROJECT_LABEL)) && [BILLING_TYPE_CODE.TIME_EXPENSE].includes(billingTypeCode)) {
      return [{
        id: COL_DAILY_WORKING_HOURS,
        label: DAILY_WORKING_HOURS
      }];
    } else if (((type === RESOURCE_LABEL) || (type === PROJECT_LABEL)) && [BILLING_TYPE_CODE.FLAT_FEE_MONTHLY, BILLING_TYPE_CODE.LICENSE_FEE, BILLING_TYPE_CODE.MILESTONE, BILLING_TYPE_CODE.PER_UNIT].includes(billingTypeCode)) {
      return [{
        id: COL_MONTHLY_WORKING_HOURS,
        label: MONTHLY_WORKING_HOURS
      }];
    } else return [
      {
        id: COL_DAILY_WORKING_HOURS,
        label: DAILY_WORKING_HOURS
      },{
        id: COL_MONTHLY_WORKING_HOURS,
        label: MONTHLY_WORKING_HOURS
      }
    ];
  };

  const headCells = [
    {
      id: COL_CITY,
      label: CITY
    },
    ...cells(),
    {
      id: COL_HOLIDAYS,
      label: HOLIDAYS
    },
    {
      id: COL_UTILISATION,
      label: (<div className="d-flex align-items-center">
        {UTILISATION}
        <InfoTooltip infoContent={CONTROLS_LABEL.UTILISATION_INFO} />
      </div>)
    },
    {
      id: COL_ACTION_ICON,
      label: ACTION
    }
  ];

  const formatDate = (date) => {
    const fd = moment(date, DATE_FORMAT.FORMAT_4).format(DATE_FORMAT.FORMAT_5);
    return fd.toLocaleUpperCase();
  };

  const currentYear = () => {
    return moment().format(DATE_FORMAT.FORMAT_6);
  };

  const utilisationPercentage = (data) => {
    const values = data && [...new Set(Object?.values(data))];
    return values?.length === 1 ? values[0] + '%' : CONTROLS_LABEL.UNEQUALLY;
  };

  useEffect(() => {
    setRows(
      forecastControls?.length &&
        forecastControls?.map((item) => {
          const {
            id,
            isEdit,
            countryId,
            locationValue,
            dailyWorkingHours,
            overridedDailyWorkingHours,
            monthlyWorkingHours,
            overridedMonthlyWorkingHours,
            overridedHolidayList,
            overridedUtilisationMap
          } = item;
          setIsEmptyLocation(false);
          const error = errors.find(({ rowId }) => id === rowId) || {};
          return {
            id,
            [COL_CITY]: (<div className="d-flex">{countryId} - {locationValue}</div>),
            [COL_DAILY_WORKING_HOURS]: (
              <ForecastControlsCell
                error={error[COL_DAILY_WORKING_HOURS]}
                handleCellChange={handleCellChange}
                isEdit={isEdit}
                newValue={overridedDailyWorkingHours}
                newValueKey={FORECAST_CONTROLS_KEYS.OVERRIDED_DAILY_WORKING_HOURS}
                oldValue={dailyWorkingHours}
                overriddenStatus={checkIfOverridden( dailyWorkingHours, overridedDailyWorkingHours )}
                rowId={id}
              />
            ),
            [COL_MONTHLY_WORKING_HOURS]: (
              <ForecastControlsCell
                error={error[COL_MONTHLY_WORKING_HOURS]}
                handleCellChange={handleCellChange}
                isEdit={isEdit}
                newValue={overridedMonthlyWorkingHours}
                newValueKey={FORECAST_CONTROLS_KEYS.OVERRIDED_MONTHLY_WORKING_HOURS}
                oldValue={monthlyWorkingHours}
                overriddenStatus={checkIfOverridden( monthlyWorkingHours, overridedMonthlyWorkingHours )}
                rowId={id}
              />
            ),
            [COL_HOLIDAYS]: (
              <div>
                {isEdit ? (
                  <ArrowWrapper
                    className={styles.link}
                    data={item}
                    handleChange={openHolidaysModal}
                  >
                    {CONTROLS_LABEL.HOLIDAYS_LINK}
                  </ArrowWrapper>
                ) : (
                  <SnapTooltip
                    className={`main-tooltip ${styles['holiday-tooltip']}`}
                    content={
                      overridedHolidayList?.length > 0 &&
                      <>
                        <h5>Holidays {currentYear()}</h5>
                        <ul className="list-style-none">
                          {overridedHolidayList?.map((h, i) => {
                            return <li key={i + '-' + h.date}>
                              <span className={styles['format-date']}>{formatDate(h.date)}</span> - {h.name}
                            </li>;
                          })}
                        </ul>
                      </>
                    }
                    position="right"
                  >
                    <div
                      className={`d-flex align-items-center justify-content-center ${styles.days}`}
                    >
                      {overridedHolidayList?.length}
                    </div>
                  </SnapTooltip>
                )}
              </div>
            ),
            [COL_UTILISATION]: (
              <div id={id}>
                {isEdit ? (
                  <ArrowWrapper
                    className={styles.link}
                    data={item}
                    handleChange={openUtilisationsModal}
                  >
                    {CONTROLS_LABEL.UTILISATION_LINK}
                  </ArrowWrapper>
                ) : (
                  utilisationPercentage(overridedUtilisationMap)
                )}
              </div>
            ),
            [COL_ACTION_ICON]: isEdit ? (
              <div className="d-flex align-items-center">
                <ArrowWrapper
                  className={styles['hidden-close']}
                  data={item}
                  handleChange={handleDiscardRow}
                >
                  <X/>
                </ArrowWrapper>
                <div className={styles['submit-wrapper']}>
                  <ArrowWrapper
                    data={item}
                    handleChange={handleSaveRow}
                  >
                    <SnapButton
                      className={`${styles['submit-button']}`}
                      label={<Check />}
                    />
                  </ArrowWrapper>
                </div>
              </div>
            ) : (
              <ArrowWrapper
                className={`${styles['edit-icon']}`}
                data={id}
                handleChange={handleEditRow}
              >
                <RVIcon
                  className={`${styles['project-controls-icon']}`}
                  icon={ICONS.PENCIL}
                  size={iconSmallTwo}
                />
              </ArrowWrapper>
            )
          };
        })
    );
  }, [errors, forecastControls]);

  useEffect(() => {
    if (!isEditHolidays && !isEditUtilisations && scrollPosition) {
      setTimeout(() => {
        document.querySelector('.modal-content .MuiTableContainer-root').scrollTop = scrollPosition;
      }, 50);
    }
  }, [isEditHolidays, isEditUtilisations, scrollPosition]);


  const handleCellChange = (rowId, newValueKey, value) => {
    forecastControls.find(({ id }) => `${id}` === rowId)[newValueKey] = value;
  };

  const updateControlsData = ({ rowId, property, value }) => {
    const forecastControlsCopy = forecastControls?.map((item) => {
      return { ...item };
    });
    forecastControlsCopy.find(({ id }) => `${id}` === rowId)[property] = value;
    setForecastControls(forecastControlsCopy);
  };

  const handleEditRow = (rowId) => {
    updateControlsData({ rowId, property: 'isEdit', value: true });
  };

  const handleDiscardRow = (rowData) => {
    const controlsData = [...forecastControls];
    controlsData?.forEach(f => {
      if (f.id === rowData.id) {
        f.overridedDailyWorkingHours = f.dailyWorkingHours;
        f.overridedMonthlyWorkingHours = f.monthlyWorkingHours;
        f.overridedHolidayList = f.holidayList;
        f.overridedUtilisationMap = f.utilisationMap;
        f['isEdit'] = false;
      }
    });
    validateData(rowData.id);
    setForecastControls(controlsData);
    callBackHandler({
      type: ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE,
      payload: {
        data: rowData,
        action: CONTROLS_LABEL.ACTION_DISCARDED,
        type
      }
    });
  };

  const checkIfHolidaysOverriden = (list1, list2) => {
    const deleted = compare(list1, list2);
    const added = compare(list2, list1);
    return JSON.stringify(deleted) !== JSON.stringify(added);
  };

  const compare = (arr1, arr2) => {
    return arr1?.filter(a => !arr2?.some(b =>
      (a.date === b.date) && (a.name === b.name) && (a.holidayType === b.holidayType)
    ));
  };

  const checkIfRowUpdated = (rowData) => {
    const dailyHrsOverridden = checkIfOverridden(rowData.dailyWorkingHours, rowData.overridedDailyWorkingHours);
    const monthlyHrsOverridden = checkIfOverridden(rowData.monthlyWorkingHours, rowData.overridedMonthlyWorkingHours);
    const holidaysOverridden = checkIfHolidaysOverriden(rowData.holidayList, rowData?.overridedHolidayList);
    const utilisationOverridden = !!modifiedUtilisations.length;
    return (dailyHrsOverridden || monthlyHrsOverridden || holidaysOverridden || utilisationOverridden);
  };

  const handleSaveRow = (rowData) => { 
    const dataErrors = validateData(rowData.id);
    if (dataErrors?.length) return;
    updateControlsData({ rowId: rowData.id, property: 'isEdit', value: false });
    const updated = checkIfRowUpdated(rowData);
    if (updated) {
      const modified = formatToModify(rowData);
      callBackHandler({
        type: ForecastControlsActionType.UPDATE_FORECAST_CONTROLS_STATE,
        payload: {
          data: modified,
          action: CONTROLS_LABEL.ACTION_MODIFIED,
          type
        }
      });
    }
  };

  const openHolidaysModal = (rowData) => {
    if (rowData?.id) {
      setIsEditHolidays(true);
      setSelectedRowId(rowData?.id);
      setHolidays(rowData?.holidayList);
      setModifiedHolidays(rowData?.holidayList);
      setRowElementScrollPosition(rowData);
    }
  };

  const closeHolidaysModal = () => {
    setIsEditHolidays(false);
  };

  const modifiedHolidaysEvent = (list) => {
    setModifiedHolidays(list);
  };

  const openUtilisationsModal = (rowData) => {
    if (rowData?.id) {
      setUtilisations(rowData);
      setSelectedRowId(rowData?.id);
      setIsEditUtilisations(true);
      setModifiedUtilisations([]);
      setRowElementScrollPosition(rowData);
    };
  };

  const setRowElementScrollPosition = (rowData) => {
    const elem = document.getElementById(rowData?.id).parentNode.parentNode.parentNode.parentNode.parentNode;
    setScrollPosition(elem.scrollTop);
  };

  const closeUtilisationsModal = () => {
    setIsEditUtilisations(false);
  };

  const modifiedUtilisationsEvent = (list) => {
    setModifiedUtilisations(list);
  };

  const checkIfOverridden = (value, overriddenValue) => {
    return overriddenValue != null ? value !== overriddenValue : false;
  };

  const checkIfNotInRange = (min, max, value) => {
    return ((value < min) || (value > max));
  };

  const validateData = (rowId) => {
    const errorsInData = forecastControls
      .filter(({ id }) => id === rowId)
      .map(
        ({
          id,
          dailyWorkingHours,
          overridedDailyWorkingHours,
          monthlyWorkingHours,
          overridedMonthlyWorkingHours
        }) => {
          const workingHoursValue = +overridedDailyWorkingHours;
          const monthlyWorkingHoursValue = +overridedMonthlyWorkingHours;
          return {
            rowId: id,
            [COL_DAILY_WORKING_HOURS]: checkIfOverridden(dailyWorkingHours, overridedDailyWorkingHours) &&
              checkIfNotInRange(WORK_HOURS.DAILY.MIN, WORK_HOURS.DAILY.MAX, workingHoursValue),
            [COL_MONTHLY_WORKING_HOURS]: checkIfOverridden(monthlyWorkingHours, overridedMonthlyWorkingHours) &&
              checkIfNotInRange(WORK_HOURS.MONTHLY.MIN, WORK_HOURS.MONTHLY.MAX, monthlyWorkingHoursValue)
          };
        }
      );
    const errorAlertList = CONTROLS_ALERT_LIST.filter((item) =>
      errorsInData.some((error) => error[item.id])
    );
    setErrors(errorsInData);
    setAlertList(errorAlertList);
    return errorAlertList;
  };

  const handleSaveClick = () => {
    if (alertList?.length) return;
    callBackHandler({
      type: ForecastControlsActionType.SAVE_FORECAST_CONTROLS,
      payload:{ parentAccountId, data: modifiedControls, type, projectCode }
    });
    setIsModifiedControls(false);
    setOpenControlsModal(false);
  };

  const handleUpdateClick = () => {
    if (isEditHolidays) {
      updateHolidayListForSelectedRow();
    }
    if (isEditUtilisations) {
      const error = validateUtilisation();
      if (error) return;
      updateUtilisationsForSelectedRow();
    }
  };

  const validateUtilisation = () => {
    const found = modifiedUtilisations?.[0]?.find(({value}) => 
      (value === '') || checkIfNotInRange(UTILISATION_LIMIT.MIN, UTILISATION_LIMIT.MAX, +value)
    );
    const error = found ? [CONTROLS_ALERT_LIST[2]] : [];
    setAlertList(error);
    return !!found;
  };

  const updateHolidayListForSelectedRow = () => {
    setIsEditHolidays(false);
    setHolidays([...modifiedHolidays]);
    updateControlsData({ rowId: selectedRowId, property: 'overridedHolidayList', value: [...modifiedHolidays]});
  };

  const updateUtilisationsForSelectedRow = () => {
    setIsEditUtilisations(false);
    setUtilisations([...modifiedUtilisations]);
    const data = buildUtilisationMap(modifiedUtilisations?.[0]);
    updateControlsData({ rowId: selectedRowId, property: 'overridedUtilisationMap', value: {...data}});
  };


  const isUpdateButtonDisabled = useMemo(() => {
    if (isEditHolidays) {
      return !checkIfHolidaysOverriden(holidays, modifiedHolidays);
    } if (isEditUtilisations) {
      return !modifiedUtilisations?.length;
    }
  }, [isEditHolidays, holidays, modifiedHolidays, isEditUtilisations, modifiedUtilisations]);

  const openAddLocationModal = () => {
    setIsOpenAddLocation(true);
    setIsEmptyLocation(false);
  };

  const closeAddLocationModal = () => {
    setIsOpenAddLocation(false);
    if (!forecastControls?.length) {
      setIsEmptyLocation(true);
    }
    setAlertList([]);
  };

  const validateAddedData = (data) => {
    const { location, dailyWorkingHours, monthlyWorkingHours, utilisation } = data;
    const isLocationExists = forecastControls.some(item => item.countryId === location.attributes.countryId && item.locationValue === location.attributes.value);
    const errorsInData = [
      {
        rowId: location.id,
        [COL_DAILY_WORKING_HOURS]: checkIfNotInRange(WORK_HOURS.DAILY.MIN, WORK_HOURS.DAILY.MAX, +dailyWorkingHours),
        [COL_MONTHLY_WORKING_HOURS]: checkIfNotInRange(WORK_HOURS.MONTHLY.MIN, WORK_HOURS.MONTHLY.MAX, +monthlyWorkingHours),
        [COL_UTILISATION]: checkIfNotInRange(UTILISATION_LIMIT.MIN, UTILISATION_LIMIT.MAX, +utilisation),
        [COL_CITY]: isLocationExists
      }
    ];
    const errorAlertList = CONTROLS_ALERT_LIST.filter((item) =>
      errorsInData.some((error) => error[item.id])
    );
    setAlertList(errorAlertList);
    return errorAlertList;
  };

  const handleAddLocationClick = () => {
    const errors = validateAddedData(addedLocation);
    if (errors.length) return;
    const data = formatToAdd(addedLocation, holidaysByLocation);
    callBackHandler({
      type: ForecastControlsActionType.ADD_LOCATION_IN_CONTROLS_STATE,
      payload: {
        data,
        type
      }
    });
    setIsOpenAddLocation(false);
    setIsEmptyLocation(false);
  };

  const addLocationEvent = (data) => {
    setAddedLocation(data);
  };

  const isAddLocationBtnDisabled = useMemo(() => {
    return !(addedLocation.location &&
    addedLocation.dailyWorkingHours &&
    addedLocation.monthlyWorkingHours &&
    addedLocation.utilisation);
  }, [addedLocation]);

  const handleCancel = () => {
    if (isOpenAddLocation) {
      closeAddLocationModal();
    }
    if (isEditHolidays) {
      closeHolidaysModal();
    }
    if (isEditUtilisations) {
      closeUtilisationsModal();
    }
  };

  const handleModalConfirmBtnClick = () => {
    callBackHandler({ type: ForecastControlsActionType.SAVE_CONTROLS_SUCCESS_STATUS });
    setOpenProgressModal(false);
    onConfirmEvent();
    handleClose();
  };

  const handleControlsModal = () => {
    setOpenControlsModal(false);
    handleClose();
  };

  return (
    <>
      <SnapModal
        align="center"
        className={`main-modal ${styles['project-controls-modal']} ${isEmptyLocation ? styles['bg-color-light'] : ''}`}
        disableBackdropClick
        dividers
        footerActions={
          <>
            <div className="w-100 d-flex align-items-center justify-content-between">
              {(isOpenAddLocation || isEditHolidays || isEditUtilisations) ? (
                <SnapButton
                  handleClick={handleCancel}
                  id={ELEMENT_ID.CANCEL_BUTTON}
                  label={BTN_LABELS.CANCEL}
                  name={BTN_LABELS.CANCEL}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.OUTLINED}
                />) : (
                <SnapButton
                  handleClick={handleClose}
                  id={ELEMENT_ID.CLOSE_BUTTON}
                  label={BTN_LABELS.Close}
                  name={BTN_LABELS.Close}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.OUTLINED}
                />)}
              {!isEmptyLocation && (isOpenAddLocation ? (
                <SnapButton
                  disabled={isAddLocationBtnDisabled}
                  handleClick={handleAddLocationClick}
                  id={ELEMENT_ID.ADD_LOCATION_BUTTON}
                  label={BTN_LABELS.ADD}
                  name={BTN_LABELS.ADD}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.CONTAINED}
                />
              ) : (isEditHolidays || isEditUtilisations) ? (
                <SnapButton
                  disabled={isUpdateButtonDisabled}
                  handleClick={handleUpdateClick}
                  id={ELEMENT_ID.UPDATE_BUTTON}
                  label={BTN_LABELS.UPDATE}
                  name={BTN_LABELS.UPDATE}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.CONTAINED}
                />
              ) : (
                <SnapButton
                  disabled={!isModifiedControls}
                  handleClick={handleSaveClick}
                  id={ELEMENT_ID.SAVE_BUTTON}
                  label={BTN_LABELS.SAVE}
                  name={BTN_LABELS.SAVE}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.CONTAINED}
                />
              ))}
            </div>
          </>
        }
        fullWidth
        id={ELEMENT_ID.FORECAST_CONTROLS_MODAL}
        maxWidth="lg"
        modalHeight="auto"
        modalTitle={
          <div className="d-flex align-items-center">
            <MapPin /> {CONTROLS_LABEL.HEADER_LABEL} 
          </div>
        }
        name={CONTROLS_LABEL.HEADER_LABEL}
        onClose={handleControlsModal}
        open={openControlsModal}
        scroll="paper"
      >
        <div className="px-4 pt-3 pb-1">
          {!!alertList.length && (
            <CustomAlertBar
              alertType="error" 
              className={styles['alert-bar-error']}
            >
              {alertList?.map((alert, i) => {
                return (
                  <div
                    className="d-flex align-items-center"
                    key={i + '-' + alert.detail}
                  >
                    <Info /> {alert.detail}
                  </div>);
              })
              }
            </CustomAlertBar>
          )}
          {
            isEmptyLocation ? (
              <EmptyScreen
                center
                className="card-empty-screen mt-2"
                image={noLocationImage}
                moreAction={
                  !(type===PROJECT_LABEL || type===RESOURCE_LABEL) &&
                  <SnapButton
                    className="primary-invert mx-1"
                    handleClick={openAddLocationModal}
                    label={CONTROLS_LABEL.ADD_LOCATION1}
                    variant={FORM_LABELS.CONTAINED}
                  />
                }
                subTitle={CONTROLS_LABEL.ADD_LOC_SUBTITLE}
                title={CONTROLS_LABEL.NO_LOCATION_FOUND}
              />) : isOpenAddLocation ? (
              <AddLocation
                addLocationEvent={addLocationEvent}
                callBackHandler={callBackHandler}
                closeAddLocationModal={closeAddLocationModal}
                locations={metaData.locations}
              />
            ) : isEditHolidays ? (
              <ModifyHolidays
                closeHolidaysModal={closeHolidaysModal}
                holidays={holidays}
                modifiedHolidaysEvent={modifiedHolidaysEvent}
              />
            ) : isEditUtilisations ? (
              <ModifyUtilisation
                closeUtilisationsModal={closeUtilisationsModal}
                modifiedUtilisationsEvent={modifiedUtilisationsEvent}
                utilisations={utilisations}
              />
            ) : (
              <div className={styles['project-controls-table']}>
                <div className="d-flex align-items-center justify-content-between mb-2">
                  <div className={styles['project-controls-info']}>
                    {CONTROLS_LABEL.HEADER_DESC}
                  </div>
                  { !(type===PROJECT_LABEL || type===RESOURCE_LABEL) &&
                  <ArrowWrapper
                    className={styles.link}
                    handleChange={openAddLocationModal}
                    id={ELEMENT_ID.ADD_LOCATION}
                  >
                    {CONTROLS_LABEL.ADD_LOCATION}
                  </ArrowWrapper>
                  }
                </div>

                <CustomAlertBar
                  alertType={ALERT_CONFIGURATION.ALERT_TYPE.SOLID_ERROR}
                  className="error-with-btn"
                >
                  <div className="d-flex align-items-center ml-3">
                    <RVIcon
                      icon="warning"
                      size={iconMediumTwo}
                    />
                    {(type === PROJECT_LABEL || type === RESOURCE_LABEL) ? CONTROLS_LABEL.CONTROLS_INFO_MSG_1 : CONTROLS_LABEL.CONTROLS_INFO_MSG_2}
                  </div>
                </CustomAlertBar>

                <SnapTable
                  headCells={headCells || []}
                  hover	
                  id={ELEMENT_ID.CONTROLS_TABLE}
                  name={CONTROLS_LABEL.CONTROLS_TABLE}
                  rows={rows || []}
                />
              
              </div>)}
        </div>
      </SnapModal>

      <ProgressModal
        handleSubmit={handleModalConfirmBtnClick}
        open={openProgressModal}
      />

    </>
  );
};

ForecastingControls.propTypes = {
  billingTypeCode: PropTypes.string,
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  handleClose: PropTypes.func,
  metaData: PropTypes.object,
  onConfirmEvent: PropTypes.func,
  open: PropTypes.any,
  parentAccountId: PropTypes.string,
  projectCode:PropTypes.string,
  type: PropTypes.string
};

export default ForecastingControls;
