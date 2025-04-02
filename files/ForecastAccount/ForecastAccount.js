import React, { useEffect, useState } from 'react';
import moment from 'moment-mini';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { getPermissions, getSessionItem } from '@revin-utils/utils';
import { BASE_URL } from 'utils/environment';
import { CURRENT_WEEK, DATES_LABELS, DATE_FORMAT, FORECAST_ACCOUNT, OPP_ID_LABEL, FORECASTING_SUMMARY, SESSION_STORAGE_KEYS, FORECAST_DASHBOARD_CONSTANTS } from 'utils/constants';
import TimelineCalendar from 'components/common/TimelineCard';
import ToggleTextBox from 'components/common/ToggleTextBox';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import styles from './ForecastAccount.module.scss';

const ForecastAccount = ({ callBackHandler, dashboardState, metaData, className , opportunityDetails, savedCommentData, setCommentData, isVHorBFM, commentsUpdatedBy, forecastingType  }) => {

  const [isViewOnly , setIsViewOnly] = useState(false);

  useEffect(() => {
    if(dashboardState?.selectedParentAccount?.parentAccountId){
      callBackHandler({
        type: MetaDataActionType.GET_ACCOUNT_LOGO,
        payload: { parentAccountId : dashboardState?.selectedParentAccount?.parentAccountId}
      });
    }
  }, [dashboardState?.selectedParentAccount?.parentAccountId]);

  useEffect(() => {
    if ([FORECASTING_SUMMARY.ACCOUNT, FORECASTING_SUMMARY.PROJECT, FORECASTING_SUMMARY.RESOURCE].includes(forecastingType)) {
      const manageProjectPermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
      const viewProjectPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;
      const parentAccount = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
      const isLocked = parentAccount?.locked;
      if ((!manageProjectPermission && !!viewProjectPermission) || isLocked || parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) {
        setIsViewOnly(true);
      } else {
        setIsViewOnly(false);
      }
    }
  },[]);

  return (
    <div className={`${styles.wrapper} ${className}`}>
      <div className={styles['logo-wrapper']}>
        {metaData?.accountLogo ? (
          <img
            alt={`Logo of ${dashboardState?.selectedParentAccount?.parentAccountName}`}
            className={styles.logo}
            src={`${BASE_URL}accounts/${dashboardState?.selectedParentAccount?.parentAccountId}/logo`}
          />
        ) : (
          <div
            className={`d-flex align-items-center justify-content-center ${styles['without-logo']}`}
          >
            {dashboardState?.selectedParentAccount?.parentAccountName}
          </div>
        )}
      </div>
      {opportunityDetails?.oppId &&
        <div className={styles['opp-id']}>
          {opportunityDetails?.oppId}
          <p>
            {OPP_ID_LABEL}
          </p>
        </div>
      }
      <div className={styles['forecast-period']}>
        <h2>
          {FORECAST_ACCOUNT.FORECAST_PERIOD}
        </h2>
        <TimelineCalendar
          className={styles['stacked-data-timeline-calendar']}
          disableClick
          endDate={moment(metaData?.forecastCycles?.forecastDurationEndDate).format(DATE_FORMAT.FORMAT_13)}
          periodEnd={DATES_LABELS.END_DATE}
          periodStart={DATES_LABELS.START_DATE}
          startDate={moment(metaData?.forecastCycles?.forecastDurationStartDate).format(DATE_FORMAT.FORMAT_13)}
          totalMonths={` ${Math.ceil(moment(metaData?.forecastCycles?.forecastDurationEndDate).diff(metaData?.forecastCycles?.forecastDurationStartDate, 'months', true))} Months`} 
        />
      </div>
      <div className={styles['current-week']}>
        <svg
          height="35.027"
          viewBox="0 0 35.028 35.027"
          width="35.028"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g
            id="calendar"
            transform="translate(-8 -8)"
          >
            <path
              d="M14.776,12H36.251c.877,0,1.585,0,2.161.039a5,5,0,0,1,1.612.331A4.864,4.864,0,0,1,42.657,15a5.024,5.024,0,0,1,.331,1.613c.039.576.039,1.284.039,2.161V37.332c0,.877,0,1.585-.039,2.161a5.023,5.023,0,0,1-.331,1.612,4.864,4.864,0,0,1-2.633,2.633,5.024,5.024,0,0,1-1.613.331c-.576.039-1.284.039-2.161.039H14.776c-.877,0-1.585,0-2.161-.039A5.023,5.023,0,0,1,11,43.738,4.865,4.865,0,0,1,8.37,41.106a5.024,5.024,0,0,1-.331-1.613C8,38.918,8,38.21,8,37.333V18.776c0-.877,0-1.585.039-2.161A5.023,5.023,0,0,1,8.37,15,4.865,4.865,0,0,1,11,12.371a5,5,0,0,1,1.613-.331C13.191,12,13.9,12,14.776,12Zm-2.029,1.981a3.141,3.141,0,0,0-1,.188,2.919,2.919,0,0,0-1.58,1.58,3.161,3.161,0,0,0-.188,1c-.034.5-.034,1.143-.034,2.063V37.3c0,.919,0,1.562.034,2.063a3.141,3.141,0,0,0,.188,1,2.919,2.919,0,0,0,1.58,1.58,3.162,3.162,0,0,0,1,.188c.5.034,1.143.034,2.063.034H36.217c.919,0,1.562,0,2.063-.034a3.141,3.141,0,0,0,1-.188,2.919,2.919,0,0,0,1.58-1.58,3.162,3.162,0,0,0,.188-1c.034-.5.034-1.143.034-2.063V18.811c0-.919,0-1.562-.034-2.063a3.141,3.141,0,0,0-.188-1,2.919,2.919,0,0,0-1.58-1.58,3.162,3.162,0,0,0-1-.188c-.5-.034-1.143-.034-2.063-.034H14.811c-.919,0-1.562,0-2.063.034Z"
              data-name="Path 40386"
              fill="#7a7480"
              fillRule="evenodd"
              id="Path_40386"
              transform="translate(0 -1.081)"
            />
            <path
              d="M9.333,20.649a.973.973,0,0,1,.973-.973H42.415a.973.973,0,1,1,0,1.946H10.306a.973.973,0,0,1-.973-.973ZM18.09,8a.973.973,0,0,1,.973.973v3.892a.973.973,0,0,1-1.946,0V8.973A.973.973,0,0,1,18.09,8ZM33.658,8a.973.973,0,0,1,.973.973v3.892a.973.973,0,0,1-1.946,0V8.973A.973.973,0,0,1,33.658,8Z"
              data-name="Path 40387"
              fill="#7a7480"
              fillRule="evenodd"
              id="Path_40387"
              transform="translate(-0.36)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3031"
              fill="#0097ac"
              id="Ellipse_3031"
              r="1.946"
              transform="translate(15.783 25.514)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3032"
              fill="#0097ac"
              id="Ellipse_3032"
              r="1.946"
              transform="translate(23.567 25.514)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3033"
              fill="#0097ac"
              id="Ellipse_3033"
              r="1.946"
              transform="translate(31.352 25.514)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3034"
              fill="#7a7480"
              id="Ellipse_3034"
              r="1.946"
              transform="translate(15.783 33.298)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3035"
              fill="#7a7480"
              id="Ellipse_3035"
              r="1.946"
              transform="translate(23.567 33.298)"
            />
            <circle
              cx="1.946"
              cy="1.946"
              data-name="Ellipse 3036"
              fill="#7a7480"
              id="Ellipse_3036"
              r="1.946"
              transform="translate(31.352 33.298)"
            />
          </g>
        </svg>
        <p>
          {moment(metaData?.forecastCycles?.startDateTime).format(DATE_FORMAT.FORMAT_13)} - {moment(metaData?.forecastCycles?.endDateTime).format(DATE_FORMAT.FORMAT_13)}
          <small>{CURRENT_WEEK}</small>
        </p>
      </div>
      {(forecastingType === FORECASTING_SUMMARY.ACCOUNT || forecastingType === FORECASTING_SUMMARY.PROJECT || forecastingType === FORECASTING_SUMMARY.RESOURCE) &&
        <div className={styles.comment}>
          <ToggleTextBox
            commentsUpdatedBy={commentsUpdatedBy}
            isEditable={!isVHorBFM && !isViewOnly}
            label={`Comments (${commentsUpdatedBy})`}
            savedNotes={savedCommentData?.notes}
            setCommentData={setCommentData}
          />
        </div>}
    </div>
  );
};

ForecastAccount.propTypes = {
  callBackHandler: PropTypes.func,
  className: PropTypes.string,
  commentsUpdatedBy: PropTypes.string,
  dashboardState: PropTypes.object,
  forecastingType: PropTypes.string,
  isVHorBFM: PropTypes.bool,
  metaData: PropTypes.string,
  opportunityDetails: PropTypes.object,
  savedCommentData: PropTypes.string,
  setCommentData: PropTypes.func
};

export default withStyles(styles)(ForecastAccount);