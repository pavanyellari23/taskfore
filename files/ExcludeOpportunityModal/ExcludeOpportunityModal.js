import React , { useEffect , useState } from 'react';
import PropTypes from 'prop-types';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import {FORM_LABELS } from '@revin-utils/utils';
import { removeSpecialCharacters } from 'utils/helper';
import styles from './ExcludeOpportunity.module.scss';
import { CANCEL, CONTINUE, EXCLUSION_MODAL_SUBTITLE, EXCLUSION_MODAL_TITLE } from 'utils/constants';

const ExcludeOpportunityModal = ({ excludeOppModalOpen , existingExclusionReason , handleOppExcludeCancel , handleOppExcludeSubmit }) => {
  const [exclusionReason , setExclusionReason ] = useState('');

  useEffect(() => setExclusionReason(removeSpecialCharacters(existingExclusionReason, ['.'])), [existingExclusionReason]);
  
  return (
    <SnapModal
      align="center"
      className={`main-modal ${styles.wrapper}`}
      disableBackdropClick
      dividers
      footerActions={
        <>
          <div className="w-100 d-flex align-items-center justify-content-between">
            <ArrowWrapper
              data={setExclusionReason}
              handleChange={handleOppExcludeCancel}
            >
              <SnapButton
                label={CANCEL}
                name={CANCEL}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.OUTLINED}
              />
            </ArrowWrapper>
            <ArrowWrapper
              data={{exclusionReason, setExclusionReason}}
              handleChange={handleOppExcludeSubmit}
            >
              <SnapButton
                disabled={!exclusionReason?.length}
                label={CONTINUE}
                name={CONTINUE}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </ArrowWrapper>
          </div>
        </>
      }
      fullWidth
      maxWidth="lg"
      modalHeight="auto"
      modalTitle={EXCLUSION_MODAL_TITLE}
      open={excludeOppModalOpen}
    >
      <div className="p-4">
        <SnapTextbox
          handleChange={(event) => {
            if(event.target.value?.length <= 256){
              setExclusionReason(removeSpecialCharacters(event.target.value, ['.']));
            }else{
              setExclusionReason(removeSpecialCharacters(event.target.value, ['.'])?.slice(0,256));
            }
          }}
          label={EXCLUSION_MODAL_SUBTITLE} 
          multiline
          rows={8}
          type={FORM_LABELS.OUTLINED}
          value={exclusionReason}
        />
      </div>
    </SnapModal>
  );
};

ExcludeOpportunityModal.propTypes = {
  excludeOppModalOpen: PropTypes.bool,
  existingExclusionReason: PropTypes.string,
  handleOppExcludeCancel: PropTypes.func,
  handleOppExcludeSubmit: PropTypes.func
};

export default ExcludeOpportunityModal;
