import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { ExpandMore } from '@material-ui/icons';
import styles from './ExpandableAlertBar.module.scss';

const ExpandableAlertBar = ({
  alertType,
  children,
  className,
  isListAlert,
  alertItemList,
  isSingleText,
  position,
  collapse,
  id
}) => {
  const [expandWindow, setExpandWindow] = useState(!collapse);
  useEffect(() => {
    setExpandWindow(!collapse);
  }, [collapse]);

  const toggleExpandWindow = () => {
    setExpandWindow(!expandWindow);
  };

  return (
    <Box
      className={`
        ${className}
        ${styles['expandable-alert-bar-wrap']}
        ${styles['alert-' + alertType]}
        ${position === 'absolute' && styles['position-absolute']}
      `}
      id={id}
    >
      {isListAlert ? (
        <PerfectScrollbar className="expandable-alert-bar-scroll">
          <div className="d-flex justify-content-between">
            {children}
            {collapse && <span className={`d-flex align-items-center justify-content-center ${styles['collapse-icon']} ${expandWindow ? styles.open : styles.close}`}><ExpandMore onClick={toggleExpandWindow}/></span>}
          </div>
          {expandWindow && (
            <ul
              className={`alert-msg-list-wrap ${isSingleText && 'single-list'}`}
            >
              {alertItemList?.map(alertItem => {
                return (
                  <li
                    className="alert-msg-list-item"
                    key={alertItem.id}
                  >
                    <div className={styles['list-item-head']}>
                      {alertItem.itemHead}
                    </div>
                    <div className="list-item-desc">
                      {alertItem.itemDesc}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </PerfectScrollbar>
      ) : (<div className={styles['error']}>
        {children}
      </div>
      )}
    </Box>
  );
};

ExpandableAlertBar.propTypes = {
  alertItemList: PropTypes.any,
  alertType: PropTypes.any,
  children: PropTypes.object,
  className: PropTypes.string,
  collapse: PropTypes.bool,
  id: PropTypes.string,
  isListAlert: PropTypes.any,
  isSingleText: PropTypes.any,
  position: PropTypes.string
};

export default ExpandableAlertBar;
