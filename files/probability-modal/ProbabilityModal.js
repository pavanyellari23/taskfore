import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { useFormik } from 'formik';
import { object, number } from 'yup';
import _get from 'lodash/get';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { FORM_LABELS, NOTIFICATION_TYPES } from '@revin-utils/utils';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { PROBABILITY_MODAL, REQUIRED_FIELD_TEXT, PROJECT_STAGE } from 'utils/constants';
import styles from './ProbabilityModal.module.scss';

const initialResourceValues = {
  [PROBABILITY_MODAL.PROBABILITY_FIELD]: ''
};

const validationSchema = object().shape({
  [PROBABILITY_MODAL.PROBABILITY_FIELD]: number()
    .typeError(PROBABILITY_MODAL.PROBABILITY_ERROR)
    .required(`${PROBABILITY_MODAL.PROBABILITY_LABEL} ${REQUIRED_FIELD_TEXT}`)
});

const ProbabilityModal = ({ open, handleSubmit, handleClose, modifyProbabilityDetails, probabilityOverride }) => {

  const [disabledProbabilityTextBox, setDisabledProbabilityTextBox] = useState(false);

  useEffect(() => {
    formik.setFieldValue([PROBABILITY_MODAL.PROBABILITY_FIELD], probabilityOverride);
    const isDisabledProbabilityTextBox = modifyProbabilityDetails?.find(modifyProbability => modifyProbability.label === PROBABILITY_MODAL.SALES_STAGE_LABEL)?.value === PROJECT_STAGE.CONTRACT_SIGNED;
    setDisabledProbabilityTextBox(isDisabledProbabilityTextBox);
  }, [probabilityOverride, open]);

  const formik = useFormik({
    initialValues: initialResourceValues,
    validationSchema,
    onSubmit: (values) => {
      handleSubmit(values);
      formik?.resetForm();
    },
    validateOnBlur: true
  });

  const hasError = (fieldName) => {
    return _get(formik?.touched, fieldName) && _get(formik?.errors, fieldName);
  };
      
  return (
    <>
      <SnapModal
        align="right"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <div className="w-100 d-flex align-items-center justify-content-between">
            <SnapButton
              handleClick={handleClose}
              label={FORM_LABELS.CANCEL}
              name={FORM_LABELS.CANCEL}
              type={FORM_LABELS.SUBMIT}
              variant={FORM_LABELS.OUTLINED}
            />
            <SnapButton
              handleClick={formik?.handleSubmit}
              label={FORM_LABELS.CONTINUE}
              name={FORM_LABELS.CONTINUE}
              type={FORM_LABELS.SUBMIT}
              variant={FORM_LABELS.CONTAINED}
            />
          </div>
        }
        fullWidth
        maxWidth={false}
        modalHeight="full"
        modalTitle={PROBABILITY_MODAL.MODIFY_PROBABILITY}
        name={PROBABILITY_MODAL.MODIFY_PROBABILITY}
        onClose={handleClose}
        open={open}
        scroll="paper"
      >
        <PerfectScrollbar>

          <div className={styles['value-wrapper']}>
            {modifyProbabilityDetails?.map(modifyProbability => {
              return (
                <div
                  className={styles.value}
                  key={modifyProbability.id}
                >
                  <h4>{modifyProbability.value}</h4>
                  <p>{modifyProbability.label}</p>
                </div>
              );
            })}
          </div>
          {!!(
            Object.keys(formik?.errors)?.length &&
                formik?.submitCount
          ) && (
            <CustomAlertBar 
              alertType={NOTIFICATION_TYPES.ERROR} 
              className={`${styles['error-message']} mt-2`}
            >
              <div
                className="d-flex align-items-center"
              >
                {Object.values(formik?.errors)[0]}
              </div>
            </CustomAlertBar>
          )}
          <p className={`mt-3 mb-3 ${styles.label}`}>
            {PROBABILITY_MODAL.MODIFY_PROB_INFO}
          </p>
          <SnapTextbox
            error={hasError(PROBABILITY_MODAL.PROBABILITY_FIELD)}
            handleChange={formik.handleChange}
            label={PROBABILITY_MODAL.PROBABILITY_LABEL}
            name={PROBABILITY_MODAL.PROBABILITY_FIELD}
            params={{ inputProps: { disabled: disabledProbabilityTextBox } }}
            type={FORM_LABELS.OUTLINED}
            value={formik.values[PROBABILITY_MODAL.PROBABILITY_FIELD]}
          />
        </PerfectScrollbar>
      </SnapModal>
    </>
  );
};

ProbabilityModal.propTypes = {
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  modifyProbabilityDetails: PropTypes.array,
  open: PropTypes.bool,
  probabilityOverride: PropTypes.number
};

export default ProbabilityModal;
