import React from 'react';
import PropTypes from 'prop-types';
import MoreVertical from 'react-feather/dist/icons/more-vertical';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import { DELETE, EDIT, MODIFY, BTN_LABELS } from 'utils/constants';
import styles from './OpportunitySelectionTable.module.scss';

const EditDropdown = ({ deleteOpportunity, openAdhocOppEditModal, opportunityData, hideEdit = false, hideModify = false, openCustomGroupEditModal }) => {
  return (
    <SnapTooltip
      className={`main-tooltip ${styles['action-tooltip']}`}
      content={
        <ul className="list-style-none">
          {
            hideEdit &&
            <ArrowWrapper
              data={opportunityData}
              handleChange={openAdhocOppEditModal}
            >
              <li>
                {EDIT}
              </li>
            </ArrowWrapper>
          }
          {
            hideModify &&
            <ArrowWrapper
              data={opportunityData}
              handleChange={openCustomGroupEditModal}
            >
              <li>
                {MODIFY}
              </li>
            </ArrowWrapper>
          }
          <ArrowWrapper
            data={opportunityData}
            handleChange={deleteOpportunity}
          >
            <li>
              {hideModify ? BTN_LABELS.UNGROUP : DELETE}
            </li>
          </ArrowWrapper>
        </ul>
      }
    >
      <MoreVertical />
    </SnapTooltip>
  );
};

EditDropdown.propTypes = {
  deleteOpportunity: PropTypes.func,
  hideEdit: PropTypes.bool,
  hideModify: PropTypes.bool,
  openAdhocOppEditModal: PropTypes.func,
  openCustomGroupEditModal: PropTypes.func,
  opportunityData: PropTypes.object
};

export default EditDropdown;

