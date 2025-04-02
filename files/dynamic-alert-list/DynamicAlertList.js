import React from 'react';
import PropTypes from 'prop-types';
import InfoIcon from '@material-ui/icons/Info';
import { SnapTooltip } from '@pnp-blox/snap';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import ExpandableAlertBar from '../expandable-alert-bar/ExpandableAlertBar';
import { ALERT_CONFIGURATION } from 'utils/constants';

const DynamicAlertList = ({ alertList, isExpandable, position, collapse, className}) => {

  const renderAlert = (alertItem) => {
    if (alertItem?.info) {
      return (
        <>
          {ALERT_CONFIGURATION.DUPLICATE_RECORDS_FOUND}
          <SnapTooltip
            className="main-tooltip tooltip-small"
            content={
              <ul className="tooltip-list-style">
                {alertItem.info?.duplicateAssociates?.map((name, index) => (
                  <li key={`${name}-${index}`}>{name}</li>
                ))}
              </ul>
            }
          >
            <span className="link">{ALERT_CONFIGURATION.ASSOCIATES}</span>
          </SnapTooltip>
          {ALERT_CONFIGURATION.PLEASE_VERIFY}
        </>
      );
    } else {
      return alertItem?.detail;
    }
  };

  const alertItemList = alertList?.map(alertItem => {
    if (isExpandable) {
      return {
        id: alertItem?.code,
        itemHead: renderAlert(alertItem)
      };
    }

    if (alertItem?.info) {
      return {
        code: alertItem?.code,
        detail: renderAlert(alertItem)
      };
    }
    return alertItem;
  });

  const isListAlert = alertList?.length > 1;
  const alertType = isListAlert ? ALERT_CONFIGURATION.ALERT_TYPE.ERROR_BORDERED_LIST : ALERT_CONFIGURATION.ALERT_TYPE.ERROR_BORDERED;
  const alertStyle = isListAlert ? '' : 'mt-1 mb-1 pt-1 pb-1';

  return (
    isExpandable ? (
      <ExpandableAlertBar
        alertItemList={alertItemList}
        alertType={alertType}
        className={className || alertStyle}
        collapse={collapse}
        isListAlert={isListAlert}
        isSingleText
        position={position}
      >
        <div className={'d-flex align-items-center'}>
          <InfoIcon />
          {isListAlert ? ALERT_CONFIGURATION.MULTIPLE_FORECAST_ERRORS : alertItemList[0]?.itemHead}
        </div>
      </ExpandableAlertBar>) : (
      alertItemList?.length && (
        <CustomAlertBar
          alertItemList={alertItemList}
          alertType={alertType}
          className={alertStyle}
          isListAlert={isListAlert}
          isSingleText
        >
          <div className={`d-flex align-items-center ${!isListAlert ? 'mt-1 mb-1' : ''} `}>
            <InfoIcon />
            {isListAlert ? ALERT_CONFIGURATION.MULTIPLE_FORECAST_ERRORS : alertItemList[0]?.detail}
          </div>
        </CustomAlertBar>
      ))
  );
};

DynamicAlertList.propTypes = {
  alertList: PropTypes.arrayOf(PropTypes.object),
  className: PropTypes.string,
  collapse: PropTypes.bool,
  isExpandable: PropTypes.bool,
  position: PropTypes.string
};

export default React.memo(DynamicAlertList);
