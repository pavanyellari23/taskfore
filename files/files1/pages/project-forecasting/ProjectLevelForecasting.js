import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import _omit from 'lodash/omit';
import { RVIcon } from '@revin-utils/assets';
import { Container } from 'react-grid-system';
import ExpandMore from '@material-ui/icons/ExpandMore';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment-mini';
import PropTypes from 'prop-types';
import { Collapse } from '@material-ui/core';
import SnapButton from '@pnp-snap/snap-button';
import MapPin from 'react-feather/dist/icons/map-pin';
import DollarSign from 'react-feather/dist/icons/dollar-sign';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import HelperTooltip from '@revin-utils/components/helper-tooltip';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import Footer from '@revin-utils/components/footer';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import { TABLE_TYPES, preciseNumberFormatter, FORM_LABELS, TOOLTIP_POSITION, getPermissions, getSessionItem, NOTIFICATION_TYPES } from '@revin-utils/utils';
import { updateProjectForecastingWithAPI } from 'store/actions/ProjectForecasting';
import { SKIP_PROPERTIES, RESOURCE_FORECASTING, RESOURCE, BACK, PROJECT_FORECASTING, PROJECT_FORECASTING_BREADCRUMBS, FORECASTING_DATA, FINANCIAL_YEAR, PROJECT_FORECASTING_TYPE, FORECASTING_SUMMARY, RESOURCE_LEVEL_FORECAST, PROBABILITY_MODAL, MAX_NUMBER_LIMIT, ROUTES, VIEW_ONLY_ACCESS_ROLES, BTN_LABELS, SESSION_STORAGE_KEYS, PROJECT_DETAILS, DATE_FORMAT, FORECAST_DASHBOARD_CONSTANTS, PROJECT_LABEL, PROJECT_LEVEL_ERROR_MESSAGE, PROJECT_LEVEL_BANNER_MESSAGE, PROJECT_SOURCE_NAME, PROJECT_STAGE, ORIGIN, CURRENCY_USD, CURRENCY, RECALCULATE, GROUP } from 'utils/constants';
import { buildResourceSummary, getModifyProbabilityDetails } from 'utils/forecastingCommonFunctions';
import { getCurrentFinancialYear, handleBreadcrumbClick } from 'utils/helper';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import SummaryValue from 'components/common/horizontal-summary/summary-value/SummaryValue';
import GroupForecastTooltip from 'components/common/group-forecast-tooltip';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import HorizontalSummary from 'components/common/horizontal-summary';
import ProjectForecastingTable from './ProjectLevelForecastingTable';
import ManageCostModal from '../project-forecasting/manage-cost-modal';
import ManageRevenueModal from 'components/pages/project-forecasting/manage-revenue-modal-new/ManageRevenueModal';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import PerUnitRevenueModal from './per-unit-revenue-modal';
import ProbabilityModal from 'components/common/probability-modal';
import ForecastingControls from 'components/common/forecasting-controls';
import { GlobalActionType } from 'store/types/GlobalActionType';
import { getSubmissionMessage } from 'utils/commonFunctions';
import sandTimer from 'assets/images/sand_timer.gif';
import { Maximize2, Minimize2 } from 'react-feather';
import { useOutsideClick } from 'components/common/hooks/useOutsideClick';
import styles from './ProjectLevelForecasting.module.scss';

const { iconSmallTwo } = variableStyle;
const ProjectForecastingLicense = ({
  callBackHandler,
  forecastSaved,
  projectForecastingState,
  metaDataState,
  forecastControlsState
}) => {
  const [collapse, setCollapse] = useState(false);
  const [manageCostModal, setManageCostOpen] = useState(false);
  const [isOpenPerUnitRevenueModal, setIsOpenPerUnitRevenueModal] = useState(false);
  const [forecastingData, setForecastingData] = useState({});
  const [responseData, setResponseData] = useState({ 'headerData': [], 'resourceSummary': [] });
  const [milestoneRevenueModal, setMilestoneRevenueModal] = useState(false);
  const [probabilityModalOpen, setProbabilityModal] = useState(false);
  const [tooltip, setTooltip] = useState(true);
  const [labelData, setLabelData] = useState([]);
  const [year, setYear] = useState(null);
  const [modifyProbabilityDetails, setModifyProbabilityDetails] = useState([]);
  const { projectForecastCandidateId, accountForecastCandidateId } = useParams();
  const history = useHistory();
  const [viewOnlyPermission, setViewOnlyPermission] = useState(false);
  const accountId = projectForecastingState?.projectForecastingDataLocalObject?.accountId;
  const [tableMaximize, setTableMaximize] = useState(true);
  const [isGridUpdate, setIsGridUpdate] = useState(false);
  const [formattedStartDate, setFormattedStartDate] = useState('');
  const [formattedEndDate, setFormattedEndDate] = useState('');
  const [errorMessage, setErrorMessage] = useState(null);
  const [openControlsModal, setOpenControlsModal] = useState(false);
  const [isHideEditProbability, setIsHideEditProbability] = useState(false);
  const entitlement = metaDataState?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
  const { parentAccountId , parentAccountForecastStatus, locked } = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
  const managePermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
  const viewPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  const additionalProjectInfo = projectForecastingState?.additionalProjectInfo;

  useEffect(() => {
    const viewOnly = (!managePermission && !viewPermission) || (!managePermission && viewPermission) || (managePermission && parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) || locked;
    setViewOnlyPermission(viewOnly);
  }, [managePermission, viewPermission, parentAccountForecastStatus, locked]);

  useEffect(() => {
    const { projectForecastingData } = projectForecastingState || {};
    if (projectForecastingData) {
      const { forecastLevelType } = projectForecastingData;
      if (forecastLevelType === RESOURCE_LEVEL_FORECAST) {
        history.replace(`/${accountForecastCandidateId}/resource-forecasting/${projectForecastCandidateId}`);
      }
      const modifyProbabilityData = getModifyProbabilityDetails(projectForecastingData);
      setModifyProbabilityDetails(modifyProbabilityData);
    }
  }, [projectForecastingState.projectForecastingData]);

  useEffect(() => {
    if (forecastSaved) {
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.PROJECT}/${projectForecastCandidateId}`);
    }
  }, [forecastSaved]);

  useEffect(() => {
    accountId && getAdjustmentThresholdCallBackHandler(accountId);
  }, [accountId]);

  const getAdjustmentThresholdCallBackHandler = (accountId) => {
    callBackHandler({
      type: ProjectForecastingActionType.GET_ADJUSTMENT_THRESHOLD,
      payload: { accountId }
    });
  };

  useEffect(() => {
    if (projectForecastingState?.projectForecastingDataLocalObject) {
      setForecastingData(projectForecastingState?.projectForecastingDataLocalObject);
      setResponseData(buildResourceSummary(projectForecastingState?.projectForecastingDataLocalObject));
      if (projectForecastingState?.projectForecastingDataLocalObject?.projectSource?.toUpperCase() === PROJECT_SOURCE_NAME.CRM && projectForecastingState?.projectForecastingDataLocalObject?.opportunityStage?.toUpperCase() === PROJECT_STAGE.CONTRACT_SIGNED) {
        setIsHideEditProbability(true);
      } else {
        setIsHideEditProbability(false);
      }
    }
  }, [projectForecastingState?.projectForecastingDataLocalObject]);

  useEffect(() => {
    getProjectForecastingDataCallBackHandler(projectForecastCandidateId);
    getAdditionalProjectInfoCallBackHandler(projectForecastCandidateId);
  }, [projectForecastCandidateId]);

  const getProjectForecastingDataCallBackHandler = (projectForecastCandidateId) => {
    callBackHandler({
      type: ProjectForecastingActionType.GET_PROJECT_FORECASTING_DATA,
      payload: {
        projectForecastCandidateId,
        isInitialRender: true,
        isNotLoading: true
      }
    });
  };

  const getAdditionalProjectInfoCallBackHandler = (projectForecastCandidateId) => {
    callBackHandler({
      type: ProjectForecastingActionType.GET_ADDITIONAL_PROJECT_INFO,
      payload: { projectForecastCandidateId }
    });
  };

  const handleExpand = () => {
    setCollapse(!collapse);
  };

  useEffect(() => {
    const financialYear = getCurrentFinancialYear(forecastingData.projectFinancialYearSummary);
    setLabelData(financialYear);
  }, [forecastingData.projectFinancialYearSummary]);

  useEffect(() => {
    if (labelData && labelData?.year) {
      const lastTwoDigitsOfYear = labelData.year.toString().slice(-2);
      setYear(lastTwoDigitsOfYear);
    }
  }, [labelData]);

  useEffect(() => {
    setFormattedStartDate(moment(forecastingData?.projectStart).format(DATE_FORMAT.FORMAT_1));
    setFormattedEndDate(moment(forecastingData?.projectEnd).format(DATE_FORMAT.FORMAT_1));
  }, [forecastingData?.projectStart, forecastingData?.projectEnd]);

  const handleRowBtnClick = (event) => {
    if(event.target.innerText === FORECASTING_DATA.REVENUE_AND_COST_BUTTON_TEXT && projectForecastingState?.projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED){
      // open milestone revenue modal
      return setMilestoneRevenueModal(true);
    }
    if (event.target.innerText === FORECASTING_DATA.REVENUE_BUTTON_TEXT) {
      openPerUnitRevenueModal();
      
    } else {
      setManageCostOpen(true);
    }
  };

  const handleEditTableCellHead = ({ action }) => {
    if (action === PROJECT_FORECASTING.COST_TYPE) {
      if (projectForecastingState?.projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) {
        setMilestoneRevenueModal(true);
      } else {
        setManageCostOpen(true);
      }
    } else {
      if (projectForecastingState?.projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) {
        setMilestoneRevenueModal(true);
      } else {
        openPerUnitRevenueModal();
      }
    }
  };

  const onCloseManageCostModal = () => {
    setManageCostOpen(false);
  };

  //final Save call
  const handleSave = () => {
    const { projectRevenueComputationMethod,  projectCostComputationMethod } = projectForecastingState?.projectForecastingDataLocalObject || {};
    if (!projectRevenueComputationMethod || !projectCostComputationMethod) {
      setErrorMessage(
        !projectRevenueComputationMethod && !projectCostComputationMethod
          ? PROJECT_LEVEL_ERROR_MESSAGE.SELECT_REVENUE_COST_METHOD
          : !projectRevenueComputationMethod
            ? PROJECT_LEVEL_ERROR_MESSAGE.SELECT_REVENUE_METHOD
            : PROJECT_LEVEL_ERROR_MESSAGE.SELECT_COST_METHOD
      );
      return;
    }
    setErrorMessage(null);
    if (locked) {
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.PROJECT}/${projectForecastCandidateId}`);
    } else if (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) {
      callBackHandler({
        type: GlobalActionType.TOGGLE_FORECAST_SAVED,
        payload: true
      });
    } else {
      callBackHandler(updateProjectForecastingWithAPI({
        dryRun: false,
        isNotLoading: true,
        projectForecastCandidateId: projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
        payload: _omit(projectForecastingState?.projectForecastingDataLocalObject, [SKIP_PROPERTIES.OLD_PROBABILITY_OVERRIDE]),
        actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN
      }));
    }
  };

  const openPerUnitRevenueModal = () => {
    setIsOpenPerUnitRevenueModal(true);
  };

  const onClosePerUnitRevenueModal = () => {
    setIsOpenPerUnitRevenueModal(false);
  };

  const onCancelModal=(setModalClose)=>{
    callBackHandler({type:ProjectForecastingActionType.RESET_FORECASTING_DATA});
    callBackHandler({type:ProjectForecastingActionType.RESET_MODAL_ERROR});
    setModalClose(false);
  };

  const handleBack = () => {
    history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
  };

  const handleSubmitHandler = (event) => {
    const payload = forecastingData?.probabilityOverride === +event?.probabilityOverride ? { ...forecastingData, probabilityOverride: +event?.probabilityOverride } : { ...forecastingData, probabilityOverride: +event?.probabilityOverride, oldProbabilityOverride: forecastingData?.probabilityOverride};
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: forecastingData?.projectForecastCandidateId,
      payload
    }));
    handleProbability();
  };

  const handleProbability = () => {
    setProbabilityModal(!probabilityModalOpen);
  };

  const onOpenTooltip = () => {
    setTooltip(true);
  };

  const onCloseTooltip = () => {
    setTooltip(false);
  };

  const handleOnClick = (event, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateId, history, projectForecastCandidateId);
  };

  const footerPrimaryBtnLabel = useMemo(() => {
    return (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) || locked ? BTN_LABELS.CONTINUE : RESOURCE.SAVE_CONTINUE;
  }, [entitlement, parentAccountForecastStatus]);

  const handleTableMaximize = () => {
    setTableMaximize(!tableMaximize);
  };

  const breadcrumbSubTitle = () => {
    const titles = [{ label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_HOME, onClick: handleOnClick }];
    if (!VIEW_ONLY_ACCESS_ROLES.includes(entitlement)) {
      titles.push({ label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_OPP_SELECTION, onClick: handleOnClick });
    }
    titles.push(
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_CHOOSE_FORECASTING, onClick: handleOnClick },
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_PROJECT_LEVEL }
    );
    return titles;
  };

  const evaluateForBanner = () => {
    const { projectRevenueComputationMethod,  projectCostComputationMethod,billingType } = projectForecastingState?.projectForecastingDataLocalObject || {};
    return billingType !== PROJECT_FORECASTING_TYPE.TIM_EXP && (!projectRevenueComputationMethod || !projectCostComputationMethod);
  };

  const getErrorAlertBar = (errorMessage) => {
    return (
      <CustomAlertBar
        alertType={NOTIFICATION_TYPES.ERROR}
        className={`${styles['error-message']} mt-2`}
      >
        <div className="d-flex align-items-center">
          <InfoIcon/>
          {errorMessage}
        </div>
      </CustomAlertBar>
    );
  };

  const handleControlsButtonClick = useCallback(() => {
    setOpenControlsModal(!openControlsModal);
  }, [openControlsModal]);

  const onUpdateControls = () => {
    getProjectForecastingDataCallBackHandler(projectForecastCandidateId);
    getAdjustmentThresholdCallBackHandler(accountId);
  };

  const handleClosePOCRevenueModal = () => {
    callBackHandler({type: ProjectForecastingActionType.RESET_FORECASTING_DATA});
    callBackHandler({type:ProjectForecastingActionType.RESET_MODAL_ERROR});
    setMilestoneRevenueModal(false);
  };

  const handleRecalculateForecastData = () => {
    const payload =  _omit(forecastingData, [SKIP_PROPERTIES.OLD_PROBABILITY_OVERRIDE]);
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: forecastingData?.projectForecastCandidateId,
      payload,
      actionOrigin:ORIGIN.FORECAST_GRID_ORIGIN
    }));
  };

  const gridUpdateEvent = (value) => {
    setIsGridUpdate(value);
  };

  const tooltipRef = useOutsideClick(onCloseTooltip);

  return (
    <Container
      className={`mb-5 ${styles.wrapper} ${styles['project-level-forecasting-layout']} project-level-forecasting-layout`}
      fluid
    >
      {!tableMaximize && (
        <div className="d-flex justify-content-between">
          <BreadcrumbNavigation
            breadcrumbSubTitle={breadcrumbSubTitle()}
            breadcrumbTitle={
              <div className="d-flex align-items-center gap-1">
                {forecastingData?.projectName}
                {forecastingData?.type !== GROUP && <span className="link">{forecastingData?.projectCode}</span>}
                <InfoTooltip
                  className={styles['project-info-tooltip']}
                  infoContent={
                    forecastingData?.type !== GROUP ?
                      <>
                        <ul className={`list-style-none ${styles['project-info-lists']}`}>
                          <li>
                            <h4>
                              {forecastingData?.projectName}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_NAME}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {forecastingData?.projectCode}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_ID}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {formattedStartDate} - {formattedEndDate}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_DURATION}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {forecastingData?.deliveryType}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_DELIVERY_TYPE}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {forecastingData?.billingType}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_BILLING_TYPE}
                            </p>
                          </li>
                          <li>
                            {forecastingData?.totalContractValue ? preciseNumberFormatter(forecastingData?.totalContractValue) : '-'}
                            <p>
                              {PROJECT_DETAILS.PROJECT_TCV}
                            </p>
                          </li>
                        </ul>
                      </>
                      :
                      <GroupForecastTooltip forecastingData={forecastingData}/>
                  }
                />
                {managePermission && (
                  <SnapButton
                    className="primary-invert"
                    handleClick={handleControlsButtonClick}
                    label={<MapPin />}
                  />
                )}
              </div>
            }
            className={`mb-3 ${styles.breadcrumb}`}
            titleReverse
          />
        </div>
      )}
      <div className={`forecasting-table flex-1 ${tableMaximize && styles['fixed-summary']}`}>
        <HorizontalSummary
          className={`
            ${styles['forecast-summary-global']}
            ${styles['forecast-summary']}
            ${collapse && styles['forecast-summary-opened']}
            ${ evaluateForBanner()  && styles['.no-data-msg']}
          `}
          collapseButton={!tableMaximize}
          expandMore={
            !tableMaximize ? 
              !evaluateForBanner() &&
            <div
              className={`d-flex align-items-center ${styles['sub-label']}`}
              onClick={handleExpand}
            >
              <span
                className={`
                d-flex align-items-center justify-content-center mr-1
                ${styles['expand-icon']}
                ${collapse && styles.rotated}
              `}
              >
                <ExpandMore />
              </span>
              {` ${RESOURCE_FORECASTING.CURRENCY} (${forecastingData?.currencyCode})`}
            </div>
              :
              <div
                className={`d-flex align-items-center sub-label-global ${styles['sub-label']}`}
              >
                <h2>{`$ ${CURRENCY_USD}`}</h2>
                <p>{CURRENCY}</p>
              </div>
          }
          expandedSummary={
            evaluateForBanner() ?
              <div
                className={`d-flex align-items-center ${styles['no-data-msg']}`}
              >
                <div
                  className={`d-flex align-items-center justify-content-center mr-1 ${styles['icon-wrapper']}`}
                >
                  <DollarSign />
                </div>
                <div>
                  <h2>{PROJECT_LEVEL_BANNER_MESSAGE.COST_REVENUE_METHOD}</h2>
                  <p>
                    {PROJECT_LEVEL_BANNER_MESSAGE.BANNER_BODY}
                  </p>
                </div>
              </div>
              :
              <>
                <div className="d-flex align-items-center mt-1">
                  <div className={styles.fy}>
                    <h4>{FINANCIAL_YEAR.FY}</h4>
                    <h4>{year}</h4>
                  </div>
                  <div className={`d-flex ${styles['data-wrapper']}`}>
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.totalRevenue)
                      }
                      mainValueTitle={RESOURCE_FORECASTING.RESOURCE_TOTAL_REVENUE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.finalResourceCost)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.finalResourceCostPercentage, { isPercentage: true })
                      }
                      mainValueTitle={RESOURCE_FORECASTING.RESOURCE_COST_TITLE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.directExpense)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.directExpensePercentage, { isPercentage: true })
                      }
                      mainValueTitle={RESOURCE_FORECASTING.DIRECT_EXPENSE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.grossMargin)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.grossMarginPercentage)
                      }
                      mainValueTitle={RESOURCE_FORECASTING.GROSS_PROFIT_MARGIN}
                    />
                    <div className="d-flex align-items-end">
                      {!viewOnlyPermission ? (
                        <HelperTooltip
                          arrow
                          className="helper-tooltip current-situation-helper-tooltip"
                          open={tooltip}
                          placement={TOOLTIP_POSITION.TOP}
                          tooltipActions={<p onClick={onCloseTooltip}>{FORM_LABELS.CLOSE}</p>}
                          tooltipContent={
                            <p>
                              {PROBABILITY_MODAL.TOOLTIP_CONTENT}
                            </p>
                          }
                        >
                          <div
                            onMouseEnter={onOpenTooltip}
                            ref={tooltipRef}
                          >
                            <SummaryValue
                              mainValue={isHideEditProbability ? '100%' : forecastingData?.probabilityOverride ? `${forecastingData?.probabilityOverride}%` : ''}
                              mainValueTitle={PROBABILITY_MODAL.PROBABILITY_LABEL}
                            />
                          </div>
                        </HelperTooltip>
                      ) : (
                        <div>
                          <SummaryValue
                            mainValue={isHideEditProbability ? '100%' : forecastingData?.probabilityOverride ? `${forecastingData?.probabilityOverride}%` : ''}
                            mainValueTitle={PROBABILITY_MODAL.PROBABILITY_LABEL}
                          />
                        </div>
                      )}
                      
                      {!isHideEditProbability && !(VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) && !locked &&
                      <span
                        className={`ml-1 ${styles['rounded-button']}`}
                        onClick={handleProbability}
                      >
                        <RVIcon
                          icon={PROBABILITY_MODAL.RV_ICON_PENCIL}
                          size={iconSmallTwo}
                        />
                      </span>
                      }
                    </div>
                  </div>
                </div>
                <Collapse
                  className={styles['collapse-area']}
                  in={collapse}
                >
                  <div className={styles['collapse-wrapper']}>
                    <ForecastDataSheetControlWrapper
                      grid={responseData.resourceSummary}
                      header={responseData.headerData}
                      isFloatNumber
                      limit
                      limitRange={MAX_NUMBER_LIMIT}
                      type={TABLE_TYPES.PRICING_SUMMARY}
                      viewOnlyPermission={viewOnlyPermission}
                    />
                  </div>
                </Collapse>
              </>
            
          }
        />
      </div>
      {projectForecastingState?.projectForecastingDataLocalObject && (
        <>

          {errorMessage && getErrorAlertBar(errorMessage)}
          <ManageCostModal
            callBackHandler={callBackHandler}
            handleCancel={()=>onCancelModal(onCloseManageCostModal)}
            handleClose={onCloseManageCostModal}
            metaDataState={metaDataState}
            open={manageCostModal}
            projectForecastingState={projectForecastingState}
          />
          {/* Can be used in future, removed  feature for now
          <MilestoneRevenueModal
            callBackHandler={callBackHandler}
            metaDataState={metaDataState}
            open={milestoneRevenueModal}
            projectForecastingState={projectForecastingState}
            setMilestoneRevenueModal={setMilestoneRevenueModal}
          /> */}
          {milestoneRevenueModal && (
            <ManageRevenueModal 
              callBackHandler={callBackHandler}
              handleCloseModal={handleClosePOCRevenueModal}
              open={milestoneRevenueModal}
              projectForecastingState={projectForecastingState}
              setMilestoneRevenueModal={setMilestoneRevenueModal}
            />
          )}
          
        </>
      )}
      
      {projectForecastingState?.forecastError?.length && (
        <DynamicAlertList
          alertList={projectForecastingState?.forecastError}
          className={tableMaximize && 'sm-alert-bar'}
          collapse
          isExpandable
        />
      )}

      {getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked &&
          <CustomAlertBar>
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
          </CustomAlertBar>
      }

      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className={styles.heading}>Project Information</h3>
        <div className="d-flex justify-content-end">
          {isGridUpdate && (
            <div className="d-flex align-items-center">
              <InfoTooltip
                infoContent={RECALCULATE.info}
              />
              <SnapButton
                className="tertiary-button"
                handleClick={handleRecalculateForecastData}
                label={RECALCULATE.LABEL}
                name={RECALCULATE.LABEL}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          )}

          <SnapButton
            className={`ml-2 ${styles['expand-button']} ${tableMaximize && styles['expanded']}`}
            handleClick={handleTableMaximize}
            icon={
              <div className={`d-flex ${styles['icon-wrapper']}`}>
                {tableMaximize ? (
                  <Minimize2 className={styles['icon-minimize']} />
                ) : (
                  <Maximize2 className={styles['icon-maximize']} />
                )}
              </div>
            }
            isIcon
            name="edit"
            type="primary"
            variant="contained"
          />
        </div>
      </div>
      
      {(projectForecastingState?.adjustmentThreshold) && (
        <div className={`default-scroll ${styles['project-forecasting-table-wrapper']}`}>
          <ProjectForecastingTable
            callBackHandler={callBackHandler}
            forecastControlsState={forecastControlsState}
            forecastingData={projectForecastingState?.projectForecastingDataLocalObject}
            gridUpdateEvent={gridUpdateEvent}
            handleEditTableCellHead={handleEditTableCellHead}
            handleRowBtnClick={handleRowBtnClick}
            setTooltip={setTooltip}
            thresholdValue={projectForecastingState?.adjustmentThreshold}
            viewOnlyPermission={viewOnlyPermission}
          />
        </div>
      )}
      {isOpenPerUnitRevenueModal && (
        <PerUnitRevenueModal
          callBackHandler={callBackHandler}
          handleCancel={()=>onCancelModal(onClosePerUnitRevenueModal)}
          handleClose={onClosePerUnitRevenueModal}
          open={isOpenPerUnitRevenueModal}
          projectForecastingState={projectForecastingState}
        />
      )}
      <ProbabilityModal
        handleClose={handleProbability}
        handleSubmit={handleSubmitHandler}
        modifyProbabilityDetails={modifyProbabilityDetails}
        open={probabilityModalOpen}
        probabilityOverride={forecastingData?.probabilityOverride}
      />
      {openControlsModal && (
        <ForecastingControls
          billingTypeCode={additionalProjectInfo?.billingTypeCode}
          callBackHandler={callBackHandler}
          forecastControlsState={forecastControlsState}
          handleClose={handleControlsButtonClick}
          metaData={metaDataState}
          onConfirmEvent={onUpdateControls}
          open={openControlsModal}
          parentAccountId={parentAccountId}
          projectCode={forecastingData?.projectCode}
          type={PROJECT_LABEL}
        />)}
      <Footer
        handleClick={handleSave}
        handleFooterSecondaryButton={handleBack}
        primaryLabel={footerPrimaryBtnLabel}
        secondaryLabel={BACK}
      />
    </Container>
  );
};

ProjectForecastingLicense.propTypes = {
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  forecastSaved: PropTypes.bool,
  metaDataState: PropTypes.object,
  projectForecastingState: PropTypes.object
};

export default ProjectForecastingLicense;
