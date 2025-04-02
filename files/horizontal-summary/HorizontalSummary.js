import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './HorizontalSummary.module.scss';

const HorizontalSummary = ({className, collapseButton, expandMore, expandedSummary, collapseSummary}) => {
  const [expand, setExpand] = useState(true);

  const handleCollapse = () => {
    setExpand(!expand);
    collapseSummary && collapseSummary(!expand);
  };

  return (
    <>
      <Box
        className={`${styles['horizontal-summary-wrapper']} ${className}
          ${expand ? styles.expand : `${styles.collapse} collapse-global`}
          ${!collapseButton && styles['with-out-collapse-button']}`}
        id={ELEMENT_ID.HORIZONTAL_SUMMARY_WRAPPER}
      >
        <Box className={`${styles['horizontal-summary-outer-wrapper']} ${'horizontal-summary-outer-wrapper-global'}`}>
          {collapseButton && (
            <Box
              className={`d-flex justify-content-between align-items-center ${styles['collapse-button']}`}
              id={ELEMENT_ID.HORIZONTAL_SUMMARY_COLLAPSE_BTN}
              onClick={handleCollapse}
            >
            Summary
              <span
                className={`d-flex justify-content-between align-items-center ${styles['rounded-arrow']}`}
              >
                <ExpandMoreIcon />
              </span>
            </Box>
          )}
          <Box
            className={`${styles['horizontal-summary-card']} ${styles['horizontal-summary-primary']} ${'horizontal-summary-global'}`}
          >
            <Box
              className={`d-flex align-items-center year-chip-global ${styles['year-chip-wrapper']}
              ${
                styles['third']
              }`}
            >
              {expandMore}
            </Box>
            {expandedSummary}
          </Box>
        </Box>
      </Box></>

  );
};

HorizontalSummary.propTypes = {
  className: PropTypes.string,
  collapseButton: PropTypes.bool,
  collapseSummary: PropTypes.func,
  expandMore: PropTypes.object,
  expandedSummary: PropTypes.object
};

export default HorizontalSummary;