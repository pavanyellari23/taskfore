import React from 'react';
import PropTypes from 'prop-types';
import DialogModal from '@revin-utils/components/dialog-modal';
import { CANCEL, CONFIRM } from 'utils/constants';

const ConfirmationModal = ({ 
  description,
  handleOpenConfirmationModalClose, 
  handleOppDelete,
  title,
  openConfrimationModal
}) => {
  return(
    <DialogModal
      className="confirmation-modal"
      description={
        <div className="confirmation-modal-text">
          <strong>
            {description}
          </strong>
        </div>
      }
      handlePrimaryButton={handleOpenConfirmationModalClose}
      handleSecondaryButton={handleOppDelete}
      open={openConfrimationModal}
      primaryButton
      primaryButtonLabel={CANCEL}
      secondaryButton
      secondaryButtonLabel={CONFIRM}
      title={title}
    />
  );
};

ConfirmationModal.propTypes = {
  description: PropTypes.string,
  handleOpenConfirmationModalClose: PropTypes.func,
  handleOppDelete: PropTypes.func,
  openConfrimationModal: PropTypes.bool,
  title: PropTypes.string
};

export default ConfirmationModal;