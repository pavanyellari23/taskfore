import React, { useEffect, useState } from 'react';
import moment from 'moment-mini';
import { object, number, string } from 'yup';
import { useFormik } from 'formik';
import _get from 'lodash/get';
import { Col } from 'react-grid-system';
import Search from 'react-feather/dist/icons/search';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { BusinessCenter } from '@material-ui/icons';
import CancelIcon from '@material-ui/icons/Cancel';
import ConfirmationModal from '@revin-utils/components/confirmation-modal';
import Divider from '@material-ui/core/Divider';
import { RVIcon } from '@revin-utils/assets';
import { FORM_LABELS, NOTIFICATION_TYPES,preciseNumberFormatter } from '@revin-utils/utils';
import { getPeriods, getProjectPeriods, getMonthAndYearLabel, toTitleCase } from 'utils/commonFunctions';
import GridRow from '@revin-utils/components/grid-row';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';

import {
  SnapAutosuggest,
  SnapButton,
  SnapDropdown,
  SnapModal,
  SnapTextbox
} from '@pnp-blox/snap';

import {
  RESOURCE,
  RESOURCE_FIELDS,
  REQUIRED_FIELD_TEXT,
  CANCEL,
  COMPONENT_TYPE,
  BTN_LABELS,
  DATE_FORMAT,
  MAX_NUMBER_LIMIT,
  TYPE,
  DASH,
  NA
} from 'utils/constants';
import { MONTH_LIST } from 'utils/mock-data/monthList';

import styles from './ResourceModal.module.scss';

const initialResourceValues = {
  firstName: '',
  lastName: '',
  projectId: '',
  userId: '',
  designation: '',
  gradeCode: '',
  employeeId: '',
  employeeType: '',
  billRate: null,
  revisedBillRate: null,
  revisionMonth: null,
  costRate: null,
  inflation: null,
  anniversaryMonth: null,
  periodFrom: null,
  periodTo: null,
  availableFte: null,
  locationInfo: null
};

const ResourceModal = ({
  className,
  open,
  handleClose,
  handleDelete,
  handleSubmit,
  modify,
  onSearch,
  options,
  onSelect,
  forecastPeriodSummaryData,
  selectedUser,
  resourceModalError,
  forecastType,
  viewMode
}) => {

  const [startPeriods, setStartPeriods] = useState([]);
  const [endPeriods, setEndPeriods] = useState([]);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [noOptionsText, setNoOptionsText] = useState(RESOURCE.RESOURCE_SEARCH_BY_NAME_UID);
  const [startMonthYearLabel, setStartMonthYearLabel] = useState(null);
  const [endMonthYearLabel, setEndMonthYearLabel] = useState(null);

  const validationSchema = object().shape({
    periodFrom: modify && selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ? number().nullable() : number().required(`${RESOURCE.PERIOD_FROM} ${REQUIRED_FIELD_TEXT}`),
    periodTo: modify && selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ? number().nullable() : number().required(`${RESOURCE.PERIOD_TO} ${REQUIRED_FIELD_TEXT}`),
    availableFte: modify ? number().notRequired() : number()
      .required(`${RESOURCE.ALLOCATION} ${REQUIRED_FIELD_TEXT}`)
      .min(0.1, RESOURCE.ALLOCATION_VALIDATION_ERROR)
      .max(1, RESOURCE.ALLOCATION_VALIDATION_ERROR),
    revisedBillRate: number().required(
      `${RESOURCE.REVISED_BILL_RATE} ${REQUIRED_FIELD_TEXT}`
    ).max(MAX_NUMBER_LIMIT),
    revisionMonth: string().required(
      `${RESOURCE.REVISION_MONTH} ${REQUIRED_FIELD_TEXT}`
    ),
    anniversaryMonth: string().required(),
    inflation: number().required(`${RESOURCE.INFLATION} ${REQUIRED_FIELD_TEXT}`).max(MAX_NUMBER_LIMIT),
    costRate: number().required(`${RESOURCE.REVISED_BILL_RATE} ${REQUIRED_FIELD_TEXT}`)
  });

  const accountLevelValidationSchema = object().shape({
    periodFrom: modify && selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ? number().nullable() : number().required(`${RESOURCE.PERIOD_FROM} ${REQUIRED_FIELD_TEXT}`),
    periodTo: modify && selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ? number().nullable() : number().required(`${RESOURCE.PERIOD_TO} ${REQUIRED_FIELD_TEXT}`),
    availableFte: modify ? number().notRequired() : number()
      .required(`${RESOURCE.ALLOCATION} ${REQUIRED_FIELD_TEXT}`)
      .min(0.1, RESOURCE.ALLOCATION_VALIDATION_ERROR)
      .max(1, RESOURCE.ALLOCATION_VALIDATION_ERROR)
  });

  const formik = useFormik({
    initialValues: initialResourceValues,
    validationSchema: forecastType === TYPE.ACCOUNT_FORECASTING ? accountLevelValidationSchema : validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
      formik?.resetForm();
    },
    validateOnBlur: true
  });

  const onHandleClose = () => {
    formik?.resetForm();
    handleClose();
  };

  useEffect(() => {
    if (selectedUser) {
      const formattedSelectedUser = {
        ...selectedUser,
        billRate: preciseNumberFormatter(selectedUser.billRate, { isDoublePrecision: true }),
        revisedBillRate: preciseNumberFormatter(selectedUser.revisedBillRate, { isDoublePrecision: true }),
        costRate: preciseNumberFormatter(selectedUser?.costRate || 0, { isDoublePrecision: true }),
        locationInfo: `| ${selectedUser?.countryCode || NA} - ${selectedUser?.locationValue || NA} ${selectedUser?.locationType ? toTitleCase(`(${selectedUser?.locationType?.toLowerCase()})`) : ''}`
      };
      formik.setValues(formattedSelectedUser);
      setStartMonthYearLabel(getMonthAndYearLabel(selectedUser?.periodFrom));
      setEndMonthYearLabel(getMonthAndYearLabel(selectedUser?.periodTo));
    }
  }, [selectedUser]);

  const {
    firstName,
    lastName,
    designation,
    gradeCode,
    employeeId,
    billRate,
    revisedBillRate,
    revisionMonth = null,
    costRate,
    inflation,
    anniversaryMonth,
    periodFrom = null,
    periodTo = null,
    availableFte,
    locationInfo
  } = formik.values;

  useEffect(() => {
    const rolePeriods = getProjectPeriods(
      forecastPeriodSummaryData
    );
    if (rolePeriods?.length) {
      setPeriodOptions(
        rolePeriods,
        periodFrom,
        rolePeriods[rolePeriods.length - 1].id
      );
    }
  }, [selectedUser, periodFrom]);
  
  const setPeriodOptions = (periodList, startPeriod, endPeriod) => {
    const { periodStart, periodEnd } = getPeriods(
      periodList,
      startPeriod,
      endPeriod
    );
    setStartPeriods(periodStart);
    setEndPeriods(periodEnd);
  };

  const onHandleChange = (value) => {
    if (value) {
      onSearch(value.currentTarget.value?.trim());
      setNoOptionsText(RESOURCE.UNAVAILABLE_RESOURCE);
    } else {
      setNoOptionsText(RESOURCE.RESOURCE_SEARCH_BY_NAME_UID);
    }
  };

  const hasError = (fieldName) => {
    return _get(formik?.touched, fieldName) && _get(formik?.errors, fieldName);
  };

  const handleConfirmDeleteResource = () => {
    setOpenDeleteModal(false);
    handleDelete(selectedUser);
  };

  const toggleDeleteResourceModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const getErrorAlertBar = (errorMessage) => {
    return (
      <CustomAlertBar
        alertType={NOTIFICATION_TYPES.ERROR}
        className={`${styles['error-message']} mt-2`}
      >
        <div className="d-flex align-items-center">
          <CancelIcon />
          {errorMessage}
        </div>
      </CustomAlertBar>
    );
  };

  return (
    <>
      <SnapModal
        align="right"
        className={`main-modal ${styles.wrapper} ${className}`}
        disableBackdropClick
        dividers
        footerActions={
          <div className="w-100 d-flex align-items-center justify-content-between">
            <SnapButton
              handleClick={onHandleClose}
              label={viewMode ? BTN_LABELS.Close : CANCEL}
              name={CANCEL}
              type={FORM_LABELS.SUBMIT_ALT}
              variant={FORM_LABELS.OUTLINED}
            />
            <div className="d-flex">
              {!viewMode &&
                <>
                  {modify && selectedUser?.resourceSource !== RESOURCE.USER_TYPE_EXTERNAL && (
                    <SnapButton
                      className="mr-1 error-button"
                      handleClick={toggleDeleteResourceModal}
                      label={RESOURCE.DELETE}
                      name={RESOURCE.DELETE}
                      type={FORM_LABELS.SUBMIT}
                      variant={FORM_LABELS.OUTLINED}
                    />
                  )
                  }
                  <SnapButton
                    disabled={!formik.isValid}
                    handleClick={formik?.handleSubmit}
                    label={modify ? FORM_LABELS.CONTINUE : FORM_LABELS.ADD}
                    name={modify ? FORM_LABELS.CONTINUE : FORM_LABELS.ADD}
                    type={FORM_LABELS.SUBMIT}
                    variant={FORM_LABELS.CONTAINED}
                  />
                </>
              }
            </div>
          </div>
        }

        fullWidth
        maxWidth={false}
        modalHeight="full"
        modalTitle={viewMode ? RESOURCE.RESOURCE_DETAILS : `${modify ? FORM_LABELS.MODIFY : FORM_LABELS.ADD} Resource`}
        name={RESOURCE.ADD}
        onClose={onHandleClose}
        open={open}
        scroll="paper"
      >
        <PerfectScrollbar className={`${modify && 'pt-2'}`}>
          {!modify ? (
            <>
              <SnapAutosuggest
                handleChange={onSelect}
                handleTextChange={onHandleChange}
                hideLabel
                icon={<Search />}
                itemPosition="left"
                noOptionsText={noOptionsText}
                options={options}
                placeholder={RESOURCE.SEARCH_USER_BY_UID}
              />
              {employeeId && !resourceModalError && (
                <div className={`d-flex align-items-center justify-content-between ${styles['designation-wrap']}`}>
                  <h5
                    className={`d-flex align-items-center ${styles.designation}`}
                  >
                    <BusinessCenter />
                    <small>{gradeCode ? `${designation} - ${gradeCode}` : designation}</small>
                  </h5>
                </div>
              )}
            </>
          ) : (
            <div className={`${styles['designation-wrap']} ${styles['remove-border']}`}>
              <h5 className={`${styles.designation} ${viewMode ? 'pb-1' : 'pb-05'}`}>
                {`${firstName} ${lastName} (${employeeId})`}
                <small>{`${designation || NA} ${
                gradeCode ? `- ${gradeCode}` : NA
              } ${locationInfo}`}</small>
              </h5>
              {
                (viewMode || selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL) &&
                <div className={`d-flex flex-column ${styles.designation} ${viewMode ? 'pt-1' : 'pb-05'}`}>
                  <div className="d-flex align-items-center">
                    <small>{RESOURCE.PERIOD}</small>
                    {selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL && <InfoTooltip infoContent={RESOURCE.PEOPLE_ALLOCATION_INFO}/>}
                  </div>
                  {selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ?
                    <h4>{moment(selectedUser?.allocationStart).format(DATE_FORMAT.FORMAT_1)} - {moment(selectedUser?.allocationEnd).format(DATE_FORMAT.FORMAT_1)}</h4>
                    :
                    <h4>{startMonthYearLabel} - {endMonthYearLabel}</h4>
                  }
                </div>
              }
            </div>
          )}
          {resourceModalError && (
            getErrorAlertBar(resourceModalError)
          )}
          {employeeId && !resourceModalError && (
            <>
              {Object.keys(formik?.errors)?.length > 0 &&
                formik?.submitCount > 0 && (
                getErrorAlertBar(Object.values(formik?.errors)[0])
              )}
              <div className={styles['form-wrapper']}>
                {
                  !viewMode && <GridRow className="mt-3">
                    {selectedUser?.resourceSource !== RESOURCE.USER_TYPE_EXTERNAL &&
                      <>
                        <Col xs={8}>
                          <SnapDropdown
                            data={startPeriods}
                            error={hasError(RESOURCE_FIELDS.PERIOD_FROM)}
                            handleChange={formik.handleChange}
                            label={RESOURCE.PERIOD_FROM}
                            name={RESOURCE_FIELDS.PERIOD_FROM}
                            type={COMPONENT_TYPE.DROPDOWN}
                            value={periodFrom}
                          />
                        </Col><Col xs={8}>
                          <SnapDropdown
                            data={endPeriods}
                            error={hasError(RESOURCE_FIELDS.PERIOD_TO)}
                            handleChange={formik.handleChange}
                            label={RESOURCE.PERIOD_TO}
                            name={RESOURCE_FIELDS.PERIOD_TO}
                            type={COMPONENT_TYPE.DROPDOWN}
                            value={periodTo}
                          />
                        </Col>
                      </>
                    }
                    {!modify && <Col xs={8}>
                      <SnapTextbox
                        error={hasError(RESOURCE_FIELDS.AVAILABLE_FTE)}
                        handleChange={formik.handleChange}
                        label={RESOURCE.ALLOCATION}
                        name={RESOURCE_FIELDS.AVAILABLE_FTE}
                        type={FORM_LABELS.OUTLINED}
                        value={availableFte}
                      />
                    </Col>}
                  </GridRow>
                }
                {viewMode ?
                  <div className={`${styles['project-info']}`}>
                    <div className={styles['card-title']}>{RESOURCE.BILLING_DETAILS}</div>
                    <div className={styles['project-details']}>
                      <div className={styles.value}>
                        <h4>{billRate || DASH}</h4>
                        <p>{RESOURCE.BILL_RATE}</p>
                      </div>
                      <div className={styles.value}>
                        <h4>{revisedBillRate || DASH}</h4>
                        <p>{RESOURCE.REVISED_BILL_RATE}</p>
                      </div>
                      <div className={styles.value}>
                        <h4>{MONTH_LIST.find(month => month.id === revisionMonth)?.label || DASH}</h4>
                        <p>{RESOURCE.REVISION_MONTH}</p>
                      </div>
                    </div>

                    <div className={styles['card-title']}>{RESOURCE.COST_DETAILS}</div>
                    <div className={styles['project-details']}>
                      <div className={styles.value}>
                        <h4>{costRate || DASH}</h4>
                        <p>{RESOURCE.COST_RATE}</p>
                      </div>
                      <div className={styles.value}>
                        <h4>{inflation || DASH}</h4>
                        <p>{RESOURCE.INFLATION_LABEL}</p>
                      </div>
                      <div className={styles.value}>
                        <h4>{MONTH_LIST.find(month => month.id === anniversaryMonth)?.label || DASH}</h4>
                        <p>{RESOURCE.ANNIVESARY_MONTH}</p>
                      </div>
                    </div>
                  </div>
                  :
                  <>
                    {forecastType !== TYPE.ACCOUNT_FORECASTING &&
                    <>
                      <h4
                        className={`${selectedUser?.resourceSource === RESOURCE.USER_TYPE_EXTERNAL ? 'pt-0' : 'pt-3'} pb-3`}
                      >{RESOURCE.BILLING_DETAILS}</h4>
                      <GridRow>
                        <Col xs={8}>
                          <SnapTextbox
                            className={styles['textbox-disabled']}
                            label={`${RESOURCE.BILL_RATE}*`}
                            name={RESOURCE_FIELDS.BILL_RATE}
                            readOnly
                            type={FORM_LABELS.OUTLINED}
                            value={billRate}
                          />
                        </Col>
                        <Col xs={8}>
                          <SnapTextbox
                            error={hasError(RESOURCE_FIELDS.REVISED_BILL_RATE)}
                            handleChange={formik.handleChange}
                            label={`${RESOURCE.REVISED_BILL_RATE}*`}
                            name={RESOURCE_FIELDS.REVISED_BILL_RATE}
                            type={FORM_LABELS.OUTLINED}
                            value={revisedBillRate}
                          />
                        </Col>
                        <Col xs={8}>
                          <SnapDropdown
                            data={MONTH_LIST}
                            error={hasError(RESOURCE_FIELDS.REVISED_MONTH)}
                            handleChange={formik.handleChange}
                            label={`${RESOURCE.REVISION_MONTH}*`}
                            name={RESOURCE_FIELDS.REVISED_MONTH}
                            type={COMPONENT_TYPE.DROPDOWN}
                            value={revisionMonth}
                          />
                        </Col>
                      </GridRow>
                      <h4 className="pt-4 pb-3">{RESOURCE.COST_DETAILS}</h4>
                      <GridRow>
                        <Col xs={8}>
                          <SnapTextbox
                            className={(selectedUser?.resourceSource === RESOURCE.USER_TYPE_CUSTOM) || !selectedUser?.costRate ? '' : styles['textbox-disabled']}
                            handleChange={formik.handleChange}
                            label={`${RESOURCE.COST_RATE}*`}
                            name={RESOURCE_FIELDS.COST_RATE}
                            type={FORM_LABELS.OUTLINED}
                            value={costRate}
                          />
                        </Col>
                        <Col xs={8}>
                          <SnapTextbox
                            error={hasError(RESOURCE_FIELDS.INFLATION)}
                            handleChange={formik.handleChange}
                            label={RESOURCE.INFLATION}
                            name={RESOURCE_FIELDS.INFLATION}
                            type={FORM_LABELS.OUTLINED}
                            value={inflation}
                          />
                        </Col>
                        <Col xs={8}>
                          <SnapDropdown
                            data={MONTH_LIST}
                            handleChange={formik.handleChange}
                            label={`${RESOURCE.ANNIVESARY_MONTH}*`}
                            name={RESOURCE_FIELDS.ANNIVERSARY_MONTH}
                            type={COMPONENT_TYPE.DROPDOWN}
                            value={MONTH_LIST.find(month => month.id === anniversaryMonth)?.id}
                          />
                        </Col>
                      </GridRow>
                    </>
                    }
                  </>
                }
              </div>
            </>
          )}
        </PerfectScrollbar>


        {openDeleteModal &&
              <ConfirmationModal>
                <div className={styles['confirmation-message']}>
                  <span className={styles['rounded-icon']}>
                    <RVIcon
                      icon="info"
                    />
                  </span>
                  <div className={styles['confirmation-title']}>{RESOURCE.ARE_YOU_SURE}</div>
                  <p className={styles['confirmation-desc']}>{RESOURCE.DELETE_RESOURCE_MESSAGE}</p>
                  <Divider
                    className="my-4"
                    variant="fullWidth"
                  />
                  <div className="mt-5">
                    <SnapButton
                      className="mx-1"
                      handleClick={toggleDeleteResourceModal}
                      label={CANCEL}
                      name={CANCEL}
                      type={FORM_LABELS.SUBMIT_ALT}
                      variant={FORM_LABELS.OUTLINED}
                    />
                    <SnapButton
                      className="mx-1"
                      handleClick={handleConfirmDeleteResource}
                      label={BTN_LABELS.CONFIRM}
                      name={BTN_LABELS.CONFIRM}
                      type={FORM_LABELS.SUBMIT_ALT}
                      variant={FORM_LABELS.CONTAINED}
                    />
                  </div>
                </div>
              </ConfirmationModal>
        }
      </SnapModal>
    </>
  );
};

ResourceModal.propTypes = {
  className: PropTypes.string,
  endPeriods: PropTypes.array,
  forecastPeriodSummaryData: PropTypes.object,
  forecastType: PropTypes.string,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  handleSubmit: PropTypes.func,
  modify: PropTypes.bool,
  onSearch: PropTypes.func,
  onSelect: PropTypes.func,
  open: PropTypes.bool,
  options: PropTypes.array,
  resourceModalError: PropTypes.string,
  selectedUser: PropTypes.object,
  startPeriods: PropTypes.array,
  viewMode: PropTypes.bool
};

export default ResourceModal;
