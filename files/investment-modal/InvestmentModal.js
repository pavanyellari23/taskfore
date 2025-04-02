import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import _isEmpty from 'lodash/isEmpty';
import { number, object } from 'yup';
import { useFormik } from 'formik';
import { Col } from 'react-grid-system';
import _get from 'lodash/get';
import Divider from '@material-ui/core/Divider';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { RVIcon } from '@revin-utils/assets';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import { FORM_LABELS, NOTIFICATION_TYPES } from '@revin-utils/utils';
import GridRow from '@revin-utils/components/grid-row';
import ConfirmationModal from '@revin-utils/components/confirmation-modal';
import { COMPONENT_TYPE, INVESTMENT_MODAL, REQUIRED_FIELD_TEXT, RESOURCE, CANCEL, BTN_LABELS, ACCOUNT_LEVEL_CONSTANTS } from 'utils/constants';
import { getPeriods, getProjectPeriods } from 'utils/commonFunctions';
import styles from './InvestmentModal.module.scss';

const initialInvestmentValues = {
  [INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY]: '',
  [INVESTMENT_MODAL.FIELDS.EXPENSE_NAME]: '',
  [INVESTMENT_MODAL.FIELDS.COST]: '',
  [INVESTMENT_MODAL.FIELDS.PERIOD_FROM]: '',
  [INVESTMENT_MODAL.FIELDS.PERIOD_TO]: ''
};

const InvestmentModal = ({ open, handleClose, handleSubmit, modify, className, investmentCategories, forecastingState, editInvestData, handleDelete }) => {
  const [startPeriods, setStartPeriods] = useState([]);
  const [endPeriods, setEndPeriods] = useState([]);
  const [isAddBtnDisabled, setIsAddBtnDisabled] = useState(true);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);

  const validationSchema = object().shape({
    [INVESTMENT_MODAL.FIELDS.COST]: number()
      .typeError(INVESTMENT_MODAL.ERROR)
      .required(`${INVESTMENT_MODAL.FIELDS.COST} ${REQUIRED_FIELD_TEXT}`)
      .min(1, INVESTMENT_MODAL.ERROR)
  });

  const formik = useFormik({
    initialValues: initialInvestmentValues,
    validationSchema,
    onSubmit: (values) => {
      const investmentData = {
        ...values,
        categoryData: investmentCategories?.find(category => category.id === values[INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY])
      };
      handleSubmit(investmentData);
      formik?.resetForm();
    }
  });

  const otherCategoryCode = useMemo(() => {
    const otherCategoryCodeId = investmentCategories?.find(category => category.codeValue === INVESTMENT_MODAL.OTHERS_CODE)?.codeId;
    return otherCategoryCodeId;
  }, [investmentCategories]);

  useEffect(() => {
    const rolePeriods = getProjectPeriods(
      forecastingState?.forecastingData?.forecastPeriodSummary
    );
    if (rolePeriods?.length) {
      setPeriodOptions(
        rolePeriods,
        formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_FROM],
        rolePeriods[rolePeriods.length - 1].id
      );
    }
  }, [forecastingState?.forecastingData, formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_FROM]]);

  const setPeriodOptions = (periodList, startPeriod, endPeriod) => {
    const { periodStart, periodEnd } = getPeriods(
      periodList,
      startPeriod,
      endPeriod
    );
    setStartPeriods(periodStart);
    setEndPeriods(periodEnd);
  };

  const onHandleClose = () => {
    formik?.resetForm();
    handleClose();
  };

  useEffect(() => {
    let enabled = true;
    enabled = !(formik.values[INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY] &&
      formik.values[INVESTMENT_MODAL.FIELDS.COST] &&
      formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_FROM] &&
      formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_TO]);

    if (formik.values[INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY] === otherCategoryCode && !enabled) {
      enabled = formik.values[INVESTMENT_MODAL.FIELDS.EXPENSE_NAME] ? false : true;
    };

    setIsAddBtnDisabled(enabled);
  }, [formik.values]);

  useEffect(() => {
    if (!_isEmpty(editInvestData)) {
      const investmentDatails = {
        [INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY]: editInvestData?.categoryId,
        [INVESTMENT_MODAL.FIELDS.EXPENSE_NAME]: editInvestData?.categoryName,
        [INVESTMENT_MODAL.FIELDS.COST]: editInvestData?.investmentCost,
        [INVESTMENT_MODAL.FIELDS.PERIOD_FROM]: +editInvestData?.startPeriodId,
        [INVESTMENT_MODAL.FIELDS.PERIOD_TO]: +editInvestData?.endPeriodId
      };
      formik.setValues(investmentDatails);
    } else {
      formik.setValues(initialInvestmentValues);
    };
  }, [editInvestData]);

  const hasError = (fieldName) => {
    return _get(formik?.touched, fieldName) && _get(formik?.errors, fieldName);
  };

  const toggleDeleteResourceModal = () => {
    setOpenDeleteModal(!openDeleteModal);
  };

  const handleConfirmDeleteInvestment = () => {
    handleDelete({
      action: RESOURCE.DELETE_ACTION,
      headerItem: {
        item: {
          id: editInvestData?.id,
          origin: INVESTMENT_MODAL.INSIDE_MODAL_DELETE
        }
      }
    });
    setOpenDeleteModal(false);
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
              label={FORM_LABELS.CANCEL}
              name={FORM_LABELS.CANCEL}
              type={FORM_LABELS.SUBMIT}
              variant={FORM_LABELS.OUTLINED}
            />
            <div className="d-flex">
              {modify && (
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
                disabled={isAddBtnDisabled}
                handleClick={formik?.handleSubmit}
                label={modify ? FORM_LABELS.CONTINUE : FORM_LABELS.ADD}
                name={FORM_LABELS.ADD}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          </div>
        }
        fullWidth
        modalHeight="full"
        modalTitle={modify ? INVESTMENT_MODAL.MODIFY_INVESTMENT : INVESTMENT_MODAL.ADD_INVESTMENT}
        name={INVESTMENT_MODAL.ADD_INVESTMENT}
        onClose={handleClose}
        open={open}
        scroll="paper"
      >
        <PerfectScrollbar>
          {!!(Object.keys(formik?.errors)?.length && formik?.submitCount) && (
            <CustomAlertBar
              alertType={NOTIFICATION_TYPES.ERROR}
              className={`${styles['error-message']}`}
            >
              <div
                className="d-flex align-items-center"
              >
                {Object.values(formik?.errors)[0]}
              </div>
            </CustomAlertBar>
          )
          }
          <div className="mb-2">
            <SnapDropdown
              data={investmentCategories}
              handleChange={formik.handleChange}
              label={INVESTMENT_MODAL.INVESTMENT_CATEGORY}
              name={INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY}
              type={COMPONENT_TYPE.DROPDOWN}
              value={formik?.values[INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY]}
            />

            {
              formik?.values[INVESTMENT_MODAL.FIELDS.INVESTMENT_CATEGORY] === otherCategoryCode &&
              <SnapTextbox
                className="mt-2"
                handleChange={formik.handleChange}
                label={INVESTMENT_MODAL.EXPENSE_NAME}
                name={INVESTMENT_MODAL.FIELDS.EXPENSE_NAME}
                params={{ inputProps: { maxLength: 20 } }}
                type={FORM_LABELS.OUTLINED}
                value={formik.values[INVESTMENT_MODAL.FIELDS.EXPENSE_NAME]}
              />
            }

          </div>
          <div className={`pb-3 ${styles['detail-content']}`}>
            <GridRow>
              <Col
                xs={12}
              >
                <SnapTextbox
                  error={hasError(INVESTMENT_MODAL.FIELDS.COST)}
                  handleChange={formik.handleChange}
                  icon={INVESTMENT_MODAL.USD}
                  label={INVESTMENT_MODAL.COST}
                  name={INVESTMENT_MODAL.FIELDS.COST}
                  type={FORM_LABELS.OUTLINED}
                  value={formik.values[INVESTMENT_MODAL.FIELDS.COST]}
                />
              </Col>
            </GridRow>
            <GridRow className="mt-2">
              <Col xs={12}>
                <SnapDropdown
                  data={startPeriods}
                  handleChange={formik.handleChange}
                  label={INVESTMENT_MODAL.FROM}
                  name={INVESTMENT_MODAL.FIELDS.PERIOD_FROM}
                  type={COMPONENT_TYPE.DROPDOWN}
                  value={formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_FROM]}
                />
              </Col><Col xs={12}>
                <SnapDropdown
                  data={endPeriods}
                  handleChange={formik.handleChange}
                  label={INVESTMENT_MODAL.TO}
                  name={INVESTMENT_MODAL.FIELDS.PERIOD_TO}
                  type={COMPONENT_TYPE.DROPDOWN}
                  value={formik.values[INVESTMENT_MODAL.FIELDS.PERIOD_TO]}
                />
              </Col>
            </GridRow>
          </div>
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
              <p className={styles['confirmation-desc']}>{ACCOUNT_LEVEL_CONSTANTS.DELETE_INVESTMENT_MODAL_MSG}</p>
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
                  handleClick={handleConfirmDeleteInvestment}
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

InvestmentModal.propTypes = {
  className: PropTypes.string,
  editInvestData: PropTypes.object,
  forecastingState: PropTypes.object,
  handleClose: PropTypes.func,
  handleDelete: PropTypes.func,
  handleSubmit: PropTypes.func,
  investmentCategories: PropTypes.array,
  modify: PropTypes.bool,
  open: PropTypes.bool
};

export default InvestmentModal;
