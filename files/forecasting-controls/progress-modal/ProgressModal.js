import React from 'react';
import PropTypes from 'prop-types';
import DialogModal from '@revin-utils/components/dialog-modal';
import LottieAnimation from '@revin-utils/components/lottie-animation';
import progressAnimation from 'assets/lottie/progress.json';
import { BTN_LABELS, CONTROLS_LABEL } from 'utils/constants';
import styles from './ProgressModal.module.scss';

const ProgressModal = ({open, handleClose, handleSubmit}) => {

  return (
    <DialogModal
      className={styles['progress-modal']}
      description={
        <div className="confirmation-modal-text">
          <p className="mb-2">
            {CONTROLS_LABEL.CONTROL_CONFIRM_MODAL_MSG_1}<br/>
            {CONTROLS_LABEL.CONTROL_CONFIRM_MODAL_MSG_2}
          </p>
        </div>
      }
      handleClose={handleClose}
      handleSecondaryButton={handleSubmit}
      modalIcon={<LottieAnimation animationFile={progressAnimation}/>}
      open={open}
      secondaryButton
      secondaryButtonLabel={BTN_LABELS.OK_GOT_IT}
      title={CONTROLS_LABEL.CONTROL_CONFIRM_MODAL_TITLE}
    />
  );
};

ProgressModal.propTypes = {
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  open: PropTypes.bool
};

export default ProgressModal;