import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './DataWithUpdateIndicator.module.scss';

const DataWithUpdateIndicator = ({
  heading,
  id,
  displayData,
  fromValue,
  showUpdateIndicator,
  toValue
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (fromValue && toValue) {
      setShowTooltip(fromValue !== toValue && showUpdateIndicator);
    }
  }, [fromValue, toValue, showUpdateIndicator]);

  return (
    <div
      className={styles['update-indicator-wrap']}
    >
      {showTooltip && (
        <SnapTooltip
          className={`main-tooltip p-2 ${styles['update-indicator-tooltip']}`}
          content={
            <>
              <p className="mb-2">{heading}</p>
              <div className="d-flex align-items-center">
                <div className={`mr-4 ${styles['update-from']}`}>
                  <div className={styles['update-label']}>From</div>
                  <span>{fromValue}</span>
                </div>
                <div className={styles['update-to']}>
                  <div className={styles['update-label']}>To</div>
                  <span>{toValue}</span>
                </div>
              </div>
            </>
          }
          id={ELEMENT_ID.DATA_WITH_UPDATE_INDICATOR_TOOLTIP}
        >
          <div className={styles['update-indicator']} />
        </SnapTooltip>
      )}
      <div id={id}>{displayData}</div>
    </div>
  );
};

DataWithUpdateIndicator.propTypes = {
  displayData: PropTypes.string,
  fromValue: PropTypes.string,
  heading: PropTypes.string,
  id: PropTypes.string,
  showUpdateIndicator: PropTypes.bool,
  toValue: PropTypes.string
};

export default DataWithUpdateIndicator;
