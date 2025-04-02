import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment-mini';
import { useLocation, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Col } from 'react-grid-system';
import Container from 'react-grid-system/build/grid/Container';
import Check from 'react-feather/dist/icons/check';
import { Info } from '@material-ui/icons';
import SnapButton from '@pnp-snap/snap-button';
import { RVIcon } from '@revin-utils/assets';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import { getPermissions, FORM_LABELS , getSessionItem } from '@revin-utils/utils';
import GridRow from '@revin-utils/components/grid-row';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import Footer from '@revin-utils/components/footer';
import DialogModal from '@revin-utils/components/dialog-modal';
import { IST_TEXT, BTN_LABELS, FORECAST_DASHBOARD_CONSTANTS, ROUTES, FORECASTING_SELECTION_ROUTE, DATE_FORMAT, VIEW_ONLY_ACCESS_ROLES, FORECAST_CHART_CONFIG, FORECAST_REVENUE_EBITDA_LEGEND , SESSION_STORAGE_KEYS, CURRENCY_STANDARD, CURRENCY_DOLLAR_ICON, BACK } from 'utils/constants';
import HistoricalForecastCards from 'components/common/historical-forecast-cards';
import AccountDropdown from 'components/common/account-dropdown/AccountDropdown';
import ForecastSummary from '../forecast-summary';
import ForecastTrends from '../forecast-trends';
import ForecastAccount from 'components/common/ForecastAccount';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { getISTTime, getSubmissionMessage } from 'utils/commonFunctions';
import sandTimer from 'assets/images/sand_timer.gif';
import styles from './ForecastDashboardSummery.module.scss';

const { iconMediumTwo } = variableStyle;

const ForecastDashboardSummery = ({
  callBackHandler,
  dashboardState,
  metaData
}) => {
  const [viewAllForecast, setViewAllForecast] = useState(false);
  const [submitModal, setSubmitModal] = useState(false);
  const [parentAccount, setParentAccount] = useState(null);
  const [isForecastSubmitPermission, setIsForecastSubmitPermission] = useState(false);
  const [hasManagePermission, setHasManagePermission] = useState(false);
  const [hasViewPermission, setHasViewPermission] = useState(false);
  const [modifySubmissionModal, setModifySubmissionModal] = useState(false);
  const history = useHistory();
  const location = useLocation();
  const parentAccountfromSession = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN);
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  const manageParentAccountPermission = getPermissions()?.MANAGE_PARENT_ACCOUNT_REVENUE_FORECAST;
  const manageProjectPermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
  const viewParentAccountPermission = getPermissions()?.VIEW_PARENT_ACCOUNT_REVENUE_FORECAST;
  const viewProjectPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;
  const path = location.pathname.split('/')[2];

  useEffect(() => {
    setIsForecastSubmitPermission(getPermissions()?.SUBMIT_PARENT_ACCOUNT_REVENUE_FORECAST);
  }, [getPermissions()?.SUBMIT_PARENT_ACCOUNT_REVENUE_FORECAST]);

  useEffect(() => {
    setHasManagePermission(manageParentAccountPermission || manageProjectPermission);
  }, [manageParentAccountPermission, manageProjectPermission]); 

  useEffect(() => {
    setHasViewPermission(viewParentAccountPermission || viewProjectPermission);
  }, [viewParentAccountPermission, viewProjectPermission]); 

  useEffect(() => {
    if (dashboardState?.selectedParentAccount) {
      setParentAccount(dashboardState?.selectedParentAccount);
    }
  }, [dashboardState?.selectedParentAccount]);

  useEffect(() => {
    if (parentAccount?.id) {
      callBackHandler({
        type: ForecastDashBoardActionType.GET_DASHBOARD_GRAPH_DATA,
        payload: {
          accountForecastCandidateId: parentAccount?.id
        }
      });
    }
  }, [parentAccount?.id]);

  useEffect(() => {
    const isViewAll = path === ROUTES.FORECAST_DASHBOARD_VIEW_ALL_FORECAST.split('/')[2];
    setViewAllForecast(isViewAll);
  }, [path]);

  const forecastSubmitDate = useMemo(() => {
    const forecastSubmitDateArray = moment(metaData?.forecastCycles?.forecastSubmissionCutoff).format(DATE_FORMAT.FORMAT_8).split(' ');
    return `${getISTTime(forecastSubmitDateArray[0], forecastSubmitDateArray[1])} ${IST_TEXT}`;
  }, [metaData?.forecastCycles?.forecastSubmissionCutoff]);

  const handleViewAll = () => {
    history.replace(ROUTES.FORECAST_DASHBOARD_VIEW_ALL_FORECAST);
    setViewAllForecast(!viewAllForecast);
  };

  const handleSubmit = () => {
    setSubmitModal(!submitModal);
  };

  const handleSubmitConfirm = () => {
    const forecastStartDate = parentAccount?.forecastCycleId === metaData?.forecastCycles?.id ? 
      moment(metaData?.forecastCycles?.startDateTime).format(DATE_FORMAT.FORMAT_10) : '';
    const forecastEndDate = parentAccount.forecastCycleId === metaData?.forecastCycles?.id ?
      moment(metaData?.forecastCycles?.endDateTime).format(DATE_FORMAT.FORMAT_10) : '';
    callBackHandler({
      type: ForecastDashBoardActionType.FORECAST_SUBMISSION,
      payload: {
        accountForecastCandidateId: parentAccount?.id,
        parentAccountId: parentAccount?.parentAccountId,
        page: FORECAST_DASHBOARD_CONSTANTS.HISTORICAL_CARDS_PAGE_NO,
        pageSize: FORECAST_DASHBOARD_CONSTANTS.VIEW_ALL_HISTORICAL_CARDS_LIMIT,
        successMsgTitle: FORECAST_DASHBOARD_CONSTANTS.FORECAST_SUBMIT_SUCCESS,
        successMsgSubTitle: `Period: ${forecastStartDate} - ${forecastEndDate}`,
        status: FORECAST_DASHBOARD_CONSTANTS.FORECAST_SUBMIT
      }
    });
    setSubmitModal(!submitModal);
  };

  const handleCancelSubmitModal = () => {
    setSubmitModal(false);
  };

  const handleBack = () => {
    history.replace(ROUTES.FORECAST_DASHBOARD);
    setViewAllForecast(!viewAllForecast);
  };

  const eventParentAccount = (data) => {
    selectedParentAccountCallBackHandler(data);
  };

  const selectedParentAccountCallBackHandler = (data) => {
    callBackHandler({
      type: ForecastDashBoardActionType.SET_SELECTED_PARENT_ACCOUNT,
      payload: data
    });
  };

  const handleForecastClick = () => {
    history.push(`${FORECASTING_SELECTION_ROUTE}/${parentAccount.id}`);
  };

  const handleReviewForecast = () => {
    history.push(`${FORECASTING_SELECTION_ROUTE}/${parentAccount.id}`);
  };

  const showSubmitButton = useMemo(() => {
    return !!isForecastSubmitPermission && parentAccount?.parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;
  }, [isForecastSubmitPermission, parentAccount]);

  const showModifySubmissionButton = useMemo(() => {
    return !!isForecastSubmitPermission && parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;
  }, [isForecastSubmitPermission, parentAccount]);

  const showForecastButton = useMemo(() => {
    return hasManagePermission && parentAccount?.parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;
  }, [hasManagePermission, parentAccount]);

  const showReviewForecastButton = useMemo(() => {
    return hasManagePermission && parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;
  }, [hasManagePermission, parentAccount]);

  const getDayDateTime = (date, format) => moment.utc(date).local().format(format);

  const handleModifySubmission = () => {
    setModifySubmissionModal(!modifySubmissionModal);
  };

  const handleModifySubmissionConfirm = () => {
    setModifySubmissionModal(false);
    callBackHandler({
      type: ForecastDashBoardActionType.FORECAST_SUBMISSION,
      payload: {
        accountForecastCandidateId: parentAccount?.id,
        parentAccountId: parentAccount?.parentAccountId,
        page: FORECAST_DASHBOARD_CONSTANTS.HISTORICAL_CARDS_PAGE_NO,
        pageSize: FORECAST_DASHBOARD_CONSTANTS.VIEW_ALL_HISTORICAL_CARDS_LIMIT,
        successMsgTitle: FORECAST_DASHBOARD_CONSTANTS.FORECAST_MODIFY_SUBMISSION,
        status: FORECAST_DASHBOARD_CONSTANTS.FORECAST_REOPEN
      }
    });
  };

  return (
    <Container
      className={styles.wrapper}
      fluid
    >
      <GridRow className="mb-5">
        {!viewAllForecast && (
          <>
            <Col
              className="mb-2"
              xs={15}
            >
              <div>
                <AccountDropdown
                  callBackHandler={callBackHandler}
                  className={styles['dropdown-actions']}
                  dashboardState={dashboardState}
                  eventParentAccount={eventParentAccount}
                  metaData={metaData}
                  showVerticalHead={VIEW_ONLY_ACCESS_ROLES.includes(metaData.entitlement)}
                />
              </div>
            </Col>
            <Col
              className={`d-flex align-items-center justify-content-end mb-2 ${styles['dashboard-actions']}`}
              xs={9}
            >
              <div className={`d-flex align-items-center ${styles['info-text-wrapper']}`}>
                <div
                  className={`d-flex align-items-center justify-content-center ${styles['dollar-icon']}`}
                >
                  {CURRENCY_DOLLAR_ICON}
                </div>
                <span className={`${styles.dollartext}`}>
                  {CURRENCY_STANDARD}
                </span>
              </div>
              {
                parentAccountfromSession?.attributes?.locked ?
                  <SnapButton
                    handleClick={handleReviewForecast}
                    label={FORECAST_DASHBOARD_CONSTANTS.REVIEW_FORECAST}
                    variant={FORM_LABELS.OUTLINED}
                  />
                  : 
                  <>
                    {showForecastButton && (
                      <SnapButton
                        handleClick={handleForecastClick}
                        label={FORECAST_DASHBOARD_CONSTANTS.FORECAST_BTN_LABEL}
                        variant={FORM_LABELS.OUTLINED}
                      />
                    )}

                    {(showReviewForecastButton || (hasViewPermission && !hasManagePermission)) && (
                      <SnapButton
                        handleClick={handleReviewForecast}
                        label={FORECAST_DASHBOARD_CONSTANTS.REVIEW_FORECAST}
                        variant={FORM_LABELS.OUTLINED}
                      />
                    )}

                    {showSubmitButton && (
                      <SnapButton
                        handleClick={handleSubmit}
                        label={BTN_LABELS.SUBMIT}
                      />
                    )}

                    {showModifySubmissionButton && (
                      <SnapButton
                        handleClick={handleModifySubmission}
                        label={FORECAST_DASHBOARD_CONSTANTS.MODIFY_SUBMISSION}
                      />
                    )}
                  </>
              }
            </Col>
            <Col xs={24}>
              <CustomAlertBar
                alertType={!parentAccountfromSession?.attributes?.locked ? parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS && 'bordered-success' : ''}
                className={`${styles.toast}`}
              >
                {
                  parentAccountfromSession?.attributes?.locked ? 
                    <div className="d-flex align-items-center position-relative">
                      <img
                        alt="empty screen"
                        className="gif-img"
                        src={sandTimer}
                      />
                      <span className="ml-3">
                        {getSubmissionMessage({
                          startDateTime: forecastCycles?.startDateTime,
                          endDateTime: forecastCycles?.endDateTime
                        })}
                      </span>
                    </div>
                    :
                    <div className="d-flex align-items-center">
                      {parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS ? (
                        <>
                          <div className={`d-flex align-items-center ${styles['check-icon']}`}>
                            <Check />
                          </div>
                          <div className={`${styles['submit-note']}`}>
                        Forecast is submitted by {parentAccount?.submittedByName}
                            {' on ' + getDayDateTime(parentAccount?.submittedOn, DATE_FORMAT.FORMAT_11) +
                          ' at ' + getDayDateTime(parentAccount?.submittedOn, DATE_FORMAT.FORMAT_12) + ' IST.'}
                          </div>
                        </>
                      ) : (
                        VIEW_ONLY_ACCESS_ROLES.includes(metaData.entitlement) ?
                          <>
                            <div className="d-flex align-items-center position-relative">
                              <div className="ripple-animation">
                                <RVIcon
                                  icon="warning"
                                  size={iconMediumTwo}
                                />
                              </div>
                            </div>
                            <div className={`${styles['in-progress-note']}`}>
                              {FORECAST_DASHBOARD_CONSTANTS.VH_BFM_WIP_MESSAGE}
                            </div>
                          </>
                          :
                          <>
                            <Info />
                            <div> {`Reminder: Submit forecasts for review by Thursday, ${forecastSubmitDate} for accurate forecast reporting.`} </div>
                          </>
                      )}
                    </div>
                }
              </CustomAlertBar>
            </Col>
            <Col xs={6}>
              <ForecastAccount
                callBackHandler={callBackHandler}
                className={styles['forecast-account-calendar']}
                dashboardState={dashboardState}
                metaData={metaData}
              />
            </Col>
            <Col xs={9}>
              <ForecastSummary
                callBackHandler={callBackHandler}
                dashboardState={dashboardState}
                isVHOrBFM={VIEW_ONLY_ACCESS_ROLES.includes(metaData?.entitlement)}
                parentAccount={parentAccount}
              />
            </Col>
            <Col xs={9}>
              <ForecastTrends
                legendProps={FORECAST_REVENUE_EBITDA_LEGEND}
                noData={!dashboardState?.dashBoardTrends || !dashboardState?.dashBoardTrends?.graphData}
                removeCardHeaderBg={false}
                trendsData={dashboardState?.dashBoardTrends}
                trendsTitle={FORECAST_CHART_CONFIG.FORECAST_TRENDS}
                yAxisRightId={parentAccount?.id}
              />
            </Col>

          </>
        )}
        <Col
          className="d-flex justify-content-between align-items-center"
          xs={viewAllForecast ? 6 : 24}
        >
          <h3 className={`${!viewAllForecast && 'my-3'} ${styles['sub-head']}`}>
            {viewAllForecast ? FORECAST_DASHBOARD_CONSTANTS.ALL : FORECAST_DASHBOARD_CONSTANTS.RECENT} {FORECAST_DASHBOARD_CONSTANTS.FORECAST}
          </h3>
          {(!viewAllForecast && dashboardState?.forecastHistoricalRecords?.length > 4) && (
            <p
              className={`${styles['primary-link']}`}
              onClick={handleViewAll}
            >
              {FORECAST_DASHBOARD_CONSTANTS.VIEW_ALL}
            </p>
          )}
        </Col>

        {viewAllForecast && (
          <>
            <Col
              className="mb-2 d-flex gap-2 justify-content-end"
              xs={18}
            >
              <AccountDropdown
                callBackHandler={callBackHandler}
                eventParentAccount={eventParentAccount}
                metaData={metaData}
              />
            </Col>
          </>
        )}

        <HistoricalForecastCards
          callBackHandler={callBackHandler}
          cards={dashboardState?.forecastHistoricalRecords}
          className={'empty-screen-content-row'}
          isNewCard={dashboardState?.isNewCard}
          parentAccountId={parentAccount?.parentAccountId}
          path={path}
        />
      </GridRow>

      {viewAllForecast && (
        <Footer
          handleFooterSecondaryButton={handleBack}
          hideSave
          primaryButton={false}
          secondaryLabel={BACK}
        />
      )}

      <DialogModal
        className="confirmation-modal"
        description={
          <div className="confirmation-modal-text">
            <p className="mx-4 my-4"> {FORECAST_DASHBOARD_CONSTANTS.SUBMIT_CONFIRM_MSG} </p>
          </div>
        }
        handleClose
        handlePrimaryButton={handleCancelSubmitModal}
        handleSecondaryButton={handleSubmitConfirm}
        modalIcon="i"
        open={submitModal}
        primaryButton
        primaryButtonLabel={BTN_LABELS.CANCEL}
        secondaryButton
        secondaryButtonLabel={BTN_LABELS.CONFIRM}
        title={FORECAST_DASHBOARD_CONSTANTS.SUBMISSION_TITLE}
      />

      <DialogModal
        className="confirmation-modal"
        description={
          <div className="confirmation-modal-text">
            <p className="mx-4 my-4"> {FORECAST_DASHBOARD_CONSTANTS.MODIFY_SUBMISSION_MODAL_MSG} </p>
          </div>
        }
        handleClose
        handlePrimaryButton={handleModifySubmission}
        handleSecondaryButton={handleModifySubmissionConfirm}
        modalIcon="i"
        open={modifySubmissionModal}
        primaryButton
        primaryButtonLabel={BTN_LABELS.CANCEL}
        secondaryButton
        secondaryButtonLabel={BTN_LABELS.CONFIRM}
        title={FORECAST_DASHBOARD_CONSTANTS.CONFIRM_MODIFY_SUBMISSION_TITLE}
      />

    </Container>
  );
};

ForecastDashboardSummery.propTypes = {
  callBackHandler: PropTypes.func,
  dashboardState: PropTypes.object,
  forecastHistoricalRecords: PropTypes.array,
  metaData: PropTypes.object
};

export default withStyles(styles)(ForecastDashboardSummery);
