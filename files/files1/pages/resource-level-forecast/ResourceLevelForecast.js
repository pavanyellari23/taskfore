import React, { useEffect, useState,useCallback } from 'react';
import { Container } from 'react-grid-system';
import PropTypes from 'prop-types';
import MapPin from 'react-feather/dist/icons/map-pin';
import InfoIcon from '@material-ui/icons/Info';
import moment from 'moment-mini';
import SnapButton from '@pnp-snap/snap-button';
import { SnapToggleSwitch } from '@pnp-blox/snap';
import CustomTab from '@revin-utils/components/custom-tab';
import { Forward } from '@material-ui/icons';
import DialogModal from '@revin-utils/components/dialog-modal';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import CustomSlider from '@revin-utils/components/custom-slider';
import { getSessionItem, QUICK_ROLE_ACTION, FORM_LABELS, getPermissions, preciseNumberFormatter } from '@revin-utils/utils';
import Footer from '@revin-utils/components/footer';
import excelImg from '@pnp-revin/utils/dist/assets/images/excel-icon.png';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import LottieAnimation from '@revin-utils/components/lottie-animation';
import ErrorScreen from '@revin-utils/components/error-screen';
import { handleBreadcrumbClick } from 'utils/helper';
import ResourceLevelForecastTable from './resource-level-forecast-table/ResourceLevelForecastTable';
import SynopticSummary from 'components/common/synoptic-summary';
import HorizontalSummaryNew from './horizontal-summary/HorizontalSummaryNew';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import ForecastingControls from 'components/common/forecasting-controls';
import { validateDuplicateResource } from 'utils/forecastingCommonFunctions';
import { getUserResourceListAction } from 'store/actions/MetaData';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { resetForecastDataAction, saveForecastDataAction, downloadResourceForeCastExcel, getUserResourceAction, updateResourceForecastAction, editUserResourceAction, resetAddResourceModalAction, getInitialResourceForecastDataAction, resetForecastDataSuccess } from 'store/actions/ResourceForecast';
import { ROLE_ACTION, BTN_LABELS, SESSION_STORAGE_KEYS, OPPORTUNITY_SEARCH, DATE_FORMAT, RESOURCE_FORECASTING, ALERT_CONFIGURATION, RESOURCE, ROUTES, ROLE_SELECTION_LABELS, FORECASTING_SUMMARY, TOGGLE_FILTER_HOVER, FORECAST_DASHBOARD_CONSTANTS, GRID_CONSTANTS, RESOURCE_LABEL, PROJECT_DETAILS, CONST_MESSAGES, GROUP, GROUP_BY_LOCATION, TOGGLE_SWITCH_LABEL } from 'utils/constants';
import { useParams, useHistory } from 'react-router-dom';
import { getPreparedResourcePayloadData, getPreparedRolePaylodData, getPreparedDeleteResourcePayloadData } from './helper';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import GroupForecastTooltip from 'components/common/group-forecast-tooltip';
import { MESSAGES } from 'utils/messages';
import pulseAnimation from 'assets/lottie/pulse.json';
import styles from './ResourceLevelForecast.module.scss';

const ResourceLevelForecast = ({
  callBackHandler,
  resourceForecastState,
  forecastControlsState,
  metaDataState
}) => {
  const [resourceSummary, setResourceSummary] = useState();
  const [selectedTab, setSelectedTab] = useState(0);
  const [openRoleModal, setOpenRoleModal] = useState(false);
  const [openResourceModal, setOpenResourceModal] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const [deleteRole, setDeleteRole] = useState(null);
  const [deleteResource, setDeleteResource] = useState(null);
  const [resourceToModify, setResourceToModify] = useState(false);
  const {projectForecastCandidateId} = useParams();
  const {accountForecastCandidateId} = useParams();
  const [searchText, setSearchText] = useState('');
  const [hasError, setHasError] = useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [resetButtonClicked, setResetButtonClicked] = useState(false);
  const [backButtonClicked, setBackButtonClicked] = useState(false);
  const [showAttentionMsg, setShowAttentionMsg] = useState(false);
  const history = useHistory();
  const [viewOnlyPermission, setViewOnlyPermission] = useState(false);
  const [openControlsModal, setOpenControlsModal] = useState(false);
  const [showForecastMsg, setShowForecastMsg] = useState(true);
  const [showBillRateMsg, setShowBillRateMsg] = useState(true);
  const parentAccount = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
  const managePermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
  const viewPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;
  const [dataGridRowHeight, setDataGridRowHeight] = useState('5rem'); 

  const tabLabels = [
    { label: GRID_CONSTANTS.TABS.FTE_BILLABLE_HRS },
    { label: GRID_CONSTANTS.TABS.REVENUE_COST },
    { label: GRID_CONSTANTS.TABS.GPM }
  ];

  useEffect(() => {
    getResourceLevelForecastData();
    initialRoleDataCallbackHandler();
  }, []);

  const getResourceLevelForecastData = () => {
    callBackHandler(getInitialResourceForecastDataAction({ projectForecastCandidateId }));
  };

  useEffect(() => {
    /** If MANAGE_PROJECT_REVENUE_FORECAST is false and VIEW_PROJECT_REVENUE_FORECAST is true => View-Only
        If MANAGE_PROJECT_REVENUE_FORECAST is false and VIEW_PROJECT_REVENUE_FORECAST is false => View-Only / No-Permission screen
        If MANAGE_PROJECT_REVENUE_FORECAST is true then check
          If Forecast SUBMITTED => View-Only
          If CAPTURED/IN_PROGRESS/NOT_INITIATED => Editable
   */
    const isViewOnly = (!managePermission && !viewPermission) || (!managePermission && viewPermission) || parentAccount?.locked || (parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS);
    setViewOnlyPermission(isViewOnly);
  }, [managePermission, viewPermission, parentAccount?.parentAccountForecastStatus, parentAccount?.locked]);

  useEffect(() => {
    if(resourceForecastState?.resourceForecastData?.isError){
      setHasError(true);
    }
  }, [resourceForecastState?.resourceForecastData?.isError]);

  useEffect(() => {
    if(resourceSummary?.summary){
      setResourceSummary(resourceForecastState.summary);
    }
  }, [resourceSummary?.summary]);

  const handleOnClick = (_, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateId, history, projectForecastCandidateId);
  };

  const onHeaderTabClick = (_, newValue) => {
    setSelectedTab(newValue);
  };

  const resourceOrRoleClickHandler = (event) => {
    if (RESOURCE_FORECASTING.ROLE_LABEL === event) {
      setOpenRoleModal(true);
    } else {
      setOpenResourceModal(true);
    }
  };

  const onSearch = (value) => {
    if (value) {
      callBackHandler(getUserResourceListAction({ searchTerm: value }));
    }
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      const isError = validateDuplicateResource(resourceForecastState?.resourceForecastData?.roles, value?.id);
      callBackHandler(getUserResourceAction({ userId: value?.id, isError, error: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR }));
    } else {
      callBackHandler(resetAddResourceModalAction());
    }
  };

  const handleControlsButtonClick = useCallback(() => {
    setOpenControlsModal(!openControlsModal);
  }, [openControlsModal]);

  const onHandleSubmit = (resource) => {
    const preparedPayload = getPreparedResourcePayloadData(resource, resourceToModify);
    callBackHandler(updateResourceForecastAction({
      actionType: preparedPayload.data[0].payloadSubType,
      projectForecastCandidateId,
      ...preparedPayload
    }));
    resetRoleResourceModal();
  };

  const resetRoleResourceModal = () => {
    setOpenResourceModal(false);
    setOpenRoleModal(false);
    setResourceToModify(false);
    setOpenRoleModal(false);
    setIsRoleModify(false);
    setRoleToModify(null);
    setDeleteRole(null);
    setDeleteResource(null);
    callBackHandler(resetAddResourceModalAction());
  };

  // Delete resource.
  const onHandleDeleteResource = (resource) => {
    const preparedPayload = getPreparedDeleteResourcePayloadData(resource);
    callBackHandler(updateResourceForecastAction({
      actionType: preparedPayload.data[0].payloadSubType,
      projectForecastCandidateId,
      ...preparedPayload
    }));
    resetRoleResourceModal();
  };

  // Add, edit, delete Role.
  const handleAddUpdateDeleteRole = ({ values: role, actionType }) => {
    const preparedRolePayload = getPreparedRolePaylodData(role, actionType);
    callBackHandler(
      updateResourceForecastAction({
        actionType: preparedRolePayload.data[0].payloadSubType,
        projectForecastCandidateId,
        ...preparedRolePayload
      })
    );
    resetRoleResourceModal();
  };

  const initialRoleDataCallbackHandler = () => {
    callBackHandler({
      type: MetaDataActionType.GET_INITIAL_ROLE_DATA,
      payload: {
        effectiveDate: moment().format(DATE_FORMAT.FORMAT_8),
        clientRolePayload: {
          param: 'client-roles',
          resource: {
            filter: `[client-roles]={accountId --eq '${parentAccount?.parentAccountId}'}`
          }
        },
        accountId: parentAccount?.parentAccountId
      }
    });
  };


  // Role and Resource edit, delete action from grid.
  const onRoleActionClickHandler = ({ actionType, obj }) => {
    const isResource = !!(obj?.resourceData && Object.keys(obj?.resourceData)?.length);

    if (actionType === QUICK_ROLE_ACTION.EDIT) {
      if (isResource) {
        callBackHandler(editUserResourceAction(obj));
        setResourceToModify(true);
        setOpenResourceModal(true);
      } else {
        setRoleToModify(obj);
        setIsRoleModify(true);
        setOpenRoleModal(true);
      }
    };

    if (actionType === QUICK_ROLE_ACTION.DELETE) {
      if (isResource) {
        setDeleteResource(obj);
      } else {
        setDeleteRole(obj);
      };
      setOpenConfirmationModal(!openConfirmationModal);
    };
  };

  const handleFooterContinueBtnClick = () => {
    if (!viewOnlyPermission ) {
      callBackHandler(saveForecastDataAction({ projectForecastCandidateId }));
    } else {
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.RESOURCE}/${projectForecastCandidateId}`);
    }
  };

  useEffect(() => {
    /** Navigate after save data success */
    if (resourceForecastState?.saveDataSuccess) {
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.RESOURCE}/${projectForecastCandidateId}`);
    }
  }, [resourceForecastState?.saveDataSuccess]);

  const handleFooterBackBtnClick = () => {
    if(viewOnlyPermission) {
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    } else{
      setOpenConfirmationModal(true);
      setBackButtonClicked(true);
    }
  };

  const handleReset = () => {
    setResetButtonClicked(true);
    setOpenConfirmationModal(true);
  };

  const handleModalConfirmBtnClick = () => {
    if (deleteResource) {
      onHandleDeleteResource({sourceId: deleteResource?.id, ...deleteResource?.resourceData});
    } else if (deleteRole) {
      const data = {values: {extraFields : { roleDescription: deleteRole?.roleDescription || deleteRole?.orgRoleId, id: deleteRole?.id }}, actionType: ROLE_ACTION.DELETE};
      handleAddUpdateDeleteRole(data);
    } else if (resetButtonClicked){
      callBackHandler(resetForecastDataAction({projectForecastCandidateId, successMsg: RESOURCE_FORECASTING.RESET_SUCCESS_MSG, origin: BTN_LABELS.RESET}));
      setResetButtonClicked(false);
    } else if (backButtonClicked) {
      setBackButtonClicked(false);
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    }
    resetRoleResourceModal();
    setOpenConfirmationModal(false);
  };

  const handleModalCancelBtnClick = () => {
    setOpenConfirmationModal(false);
    setResetButtonClicked(false);
    setBackButtonClicked(false);
    setDeleteRole(false);
    setDeleteResource(false);
  };

  const handleModalResetExitBtnClick = () => {
    callBackHandler(resetForecastDataAction({projectForecastCandidateId, successMsg: RESOURCE_FORECASTING.RESET_SUCCESS_MSG, origin: BTN_LABELS.RESET_EXIT}));
    setOpenConfirmationModal(false);
  };

  useEffect(() => {
    /** Navigate after reset and exit success */
    if (resourceForecastState?.resourceForecastData?.resetExitSuccess) {
      callBackHandler(resetForecastDataSuccess(false));
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    }
  }, [resourceForecastState?.resourceForecastData?.resetExitSuccess]);

  const handleExcelDownload = () => {
    !!projectForecastCandidateId && callBackHandler(downloadResourceForeCastExcel({projectForecastCandidateId}));
  };

  const selectedHeaderTabEvent = (tab) => {
    const isIncluded = [GRID_CONSTANTS.KEY.BILLABLE_HOURS, GRID_CONSTANTS.KEY.GPM_PERCENTAGE].includes(tab);
    setShowAttentionMsg(isIncluded);
  };

  const onUpdateControls = () => {
    getResourceLevelForecastData();
  };

  const [groupByLocations, setGroupByLocation] = useState(false);

  const handleGroupByLocationToggle = () => {
    setGroupByLocation(!groupByLocations);
    setDataGridRowHeight('5rem');
  };
  
  const handleDismiss = () => {
    setShowForecastMsg(false);
  };

  const handleRevisedBillRate = () => {
    setShowBillRateMsg(false);
  };

  const formatDate = (date) => moment(date).format(DATE_FORMAT.FORMAT_1);
  return (
    <div className={styles.wrapper}>
      <Container
        className={`${styles['inner-wrapper']} d-flex flex-column`}
        fluid
      >
        <div className="d-flex justify-content-between">
          { hasError ? <ErrorScreen /> :
            <>
              <div
                className={`d-flex align-items-center ${styles['breadcrumb-wrapper']}`}
              >
                <BreadcrumbNavigation
                  breadcrumbSubTitle={[
                    { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
                    { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_CHOOSE, onClick: handleOnClick },
                    {
                      label: (
                        <>
                          {resourceForecastState?.projectInfo?.type === GROUP ? resourceForecastState?.projectInfo?.groupInfo?.groupName :
                            <>{resourceForecastState?.projectInfo?.projectName}<span className="link">{resourceForecastState?.projectInfo?.projectCode}</span> </>
                          }
                        </>
                      )
                    }
                  ]}
                  titleReverse
                />  
                <InfoTooltip
                  className={styles['project-info-tooltip']}
                  infoContent={
                    resourceForecastState?.projectInfo?.type !== GROUP ?
                      <>
                        <ul className={`list-style-none ${styles['project-info-lists']}`}>
                          <li>
                            <h4>
                              {resourceForecastState?.projectInfo?.projectName}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_NAME}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {resourceForecastState?.projectInfo?.projectCode}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_ID}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {formatDate(resourceForecastState?.projectInfo?.projectStartDate)} - {formatDate(resourceForecastState?.projectInfo?.projectEndDate)}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_DURATION}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {resourceForecastState?.projectInfo?.deliveryType}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_DELIVERY_TYPE}
                            </p>
                          </li>
                          <li>
                            <h4>
                              {resourceForecastState?.projectInfo?.billingType}
                            </h4>
                            <p>
                              {PROJECT_DETAILS.PROJECT_BILLING_TYPE}
                            </p>
                          </li>
                          <li>
                            {resourceForecastState?.projectInfo?.totalContractValue ? preciseNumberFormatter(resourceForecastState?.projectInfo?.totalContractValue) : '-'}
                            <p>
                              {PROJECT_DETAILS.PROJECT_TCV}
                            </p> 
                          </li>
                        </ul>
                      </>
                      :
                      <GroupForecastTooltip forecastingData={resourceForecastState?.projectInfo}/>
                  }
                />

                {managePermission && (
                  <SnapButton
                    className="primary-invert ml-1"
                    handleClick={handleControlsButtonClick}
                    label={<MapPin />}
                  />
                )}
              </div>
              
              <SnapButton
                className={styles['excel-button']}
                handleClick={handleExcelDownload}
                icon={
                  <div className={`d-flex ${styles['icon-wrapper']}`}>
                    <img
                      alt="download excel"
                      src={excelImg}
                    />
                    <Forward />
                  </div>
                }
                isIcon
                name="edit"
                type="primary"
                variant="contained"
              />
            </>
          }
        </div>
        { !hasError && resourceForecastState.resourceForecastData.periodSummary && (
          <>
            <SynopticSummary
              expandedView={
                <HorizontalSummaryNew 
                  callBackHandler={callBackHandler}
                  resourceForecastData={resourceForecastState.resourceForecastData}
                />
              }
              finYear={moment().format(DATE_FORMAT.FORMAT_6)}
              valueGap="6"
              values={[
                { value: resourceForecastState.resourceForecastData.fySummary?.totalRevenue, label: RESOURCE_FORECASTING.RESOURCE_TOTAL_REVENUE},
                {
                  value: [resourceForecastState.resourceForecastData.fySummary?.finalResourceCostOtherCostSum, { type: 'percentage', content: preciseNumberFormatter(resourceForecastState.resourceForecastData.fySummary?.finalResourceCostOtherCostPercentage, { isSinglePrecision: true})}],
                  label: RESOURCE_FORECASTING.RESOURCE_COST_TITLE
                },
                {
                  value: [resourceForecastState.resourceForecastData.fySummary?.directExpense, { type: 'percentage', content: preciseNumberFormatter(resourceForecastState.resourceForecastData.fySummary?.directExpensePercentage, { isSinglePrecision: true})}],
                  label: RESOURCE_FORECASTING.DIRECT_EXPENSE
                },
                {
                  value: [resourceForecastState.resourceForecastData.fySummary?.grossMargin, { type: 'percentage', content: preciseNumberFormatter(resourceForecastState.resourceForecastData.fySummary?.grossMarginPercentage, { isSinglePrecision: true})}],
                  label: RESOURCE_FORECASTING.GROSS_PROFIT_MARGIN
                },
                {
                  value: [
                    resourceForecastState.resourceForecastData.fySummary?.totalPlannedCount,
                    {
                      type: 'tooltip',
                      content: (
                        <div className="summary-tooltip-list">
                          <p>{resourceForecastState.resourceForecastData.fySummary?.resourceCount}</p>
                          <p>{RESOURCE_FORECASTING.RESOURCE}</p>
                          <p className="mt-1">{resourceForecastState.resourceForecastData.fySummary?.roleCount}</p>
                          <p>{RESOURCE_FORECASTING.ROLE}</p>
                        </div>
                      )
                    }
                  ],
                  label: RESOURCE_FORECASTING.Total_Resources
                }
              ]}
            />
        
            {!!resourceForecastState?.forecastError?.length && (
              <DynamicAlertList
                alertList={resourceForecastState?.forecastError}
                className={'mt-1'}
                collapse
                isExpandable
              />
            )}
            <div className={`d-flex justify-content-between mt-2 mb-2 ${styles['action-wrapper']}`}>
              <div className="d-flex align-items-center">
                <div className="mr-2">
                  <OpportunitiesSearch 
                    label={OPPORTUNITY_SEARCH.LABEL}
                    setSearchText = {setSearchText}
                  />
                </div>
                {/* TO DO: Keeping for future implementation */}
                {/* <SnapButton
                  className={`${styles['opportunity-filter-button']} ${styles['opportunity-action-button']}`}
                  icon={
                    <RVIcon
                      icon="filter"
                      size={iconSmallTwo}
                    />
                  }
                  isIcon
                  name="opportunity-filter-button"
                  type="primary"
                  variant={FORM_LABELS.CONTAINED}
                /> */}
                <div className={`d-flex align-items-center gap-1 ${styles['group-switch']}`}>
                  {GROUP_BY_LOCATION}
                  <SnapToggleSwitch
                    handleChange={handleGroupByLocationToggle}
                    optionLabels={TOGGLE_SWITCH_LABEL?.Label}
                    small
                    value={groupByLocations}
                  />
                </div>

              </div>
              <div className="d-flex align-items-center justify-content-center">
                <CustomTab
                  className="small-tab"
                  onChange={onHeaderTabClick}
                  tabList={tabLabels}
                  value={selectedTab}
                />
                <InfoTooltip infoContent={TOGGLE_FILTER_HOVER}/>
              </div>
              <div className="d-flex align-items-center justify-content-end gap-2">
                {showAttentionMsg && (
                  <div className="d-flex gap-2 mr-1">
                    <div
                      className={`d-flex gap-1 align-items-center ${styles['status-wrapper']}`}
                    >
                      <div className={styles['error-status-indicator']} />
                      {GRID_CONSTANTS.IMMED_ACTION_REQ}
                    </div>
                    <div
                      className={`d-flex gap-1 align-items-center ${styles['status-wrapper']}`}
                    >
                      <div className={styles['attention-status-indicator']} />
                      {GRID_CONSTANTS.ATTENTION_NEEDED}
                    </div>
                  </div>
                )}

                {!viewOnlyPermission && (
                  <SnapButton
                    handleClick={handleReset}
                    label={BTN_LABELS.RESET}
                    name={BTN_LABELS.RESET}
                    type={FORM_LABELS.SUBMIT}
                    variant={FORM_LABELS.OUTLINED}
                  />
                )}

                <CustomSlider
                  onChange={(_, newValue) => {
                    const newRowHeight = `${newValue}rem`;
                    setDataGridRowHeight(newRowHeight);
                  }}
                  step={0.1}
                  value={parseFloat(dataGridRowHeight)}
                />

              </div>
            </div>
            {showForecastMsg && resourceForecastState?.projectInfo?.draftAvailable && !resourceForecastState?.resourceForecastData?.isGridUpdate && (
              <CustomAlertBar className={`${styles['resource-forecasting-alert']}`}>
                <div className="d-flex align-items-center position-relative">
                  <div className="lottie-animation">
                    <LottieAnimation  animationFile={pulseAnimation}/>
                  </div>
                  <div className="d-flex justify-content-between w-100">
                    <span className="ml-3">{CONST_MESSAGES.SAVE_AS_DRAFT}</span>
                    <div
                      className="primary-link mr-1"
                      onClick={handleDismiss}
                    >{RESOURCE_FORECASTING.DISMISS}</div>
                  </div>
                </div>
              </CustomAlertBar>
            )}
            {showBillRateMsg && (
              <CustomAlertBar
                className={`${styles['custom-alert-bar']}`}
              >
                <div className="d-flex align-items-center position-relative">
                  
                  <InfoIcon />
                  <div className="d-flex justify-content-between w-100">
                    <span>{CONST_MESSAGES.REVISED_BILL_RATE}</span>
                    <div
                      className="primary-link mr-1"
                      onClick={handleRevisedBillRate}
                    >{RESOURCE_FORECASTING.DISMISS}</div>
                  </div>
                </div>
              </CustomAlertBar>
            )}
            <div className={`default-scroll ${styles['resource-table-wrapper']}`}>
              <ResourceLevelForecastTable
                callBackHandler={callBackHandler}
                dataGridRowHeight={dataGridRowHeight}
                groupByLocations = {groupByLocations}
                onResourceOrRoleClickHandler={resourceOrRoleClickHandler}
                onRoleActionClick={onRoleActionClickHandler}
                resourceForecastState={resourceForecastState}
                searchText={searchText}
                selectedHeaderTabEvent={selectedHeaderTabEvent}
                tableTabIndex={selectedTab}
                viewOnlyPermission={viewOnlyPermission}
              />
            </div>
    
            {openRoleModal && (
              <RoleSelectionModal
                forecastingData={resourceForecastState?.resourceForecastData}
                handleClose={resetRoleResourceModal}
                handleSubmit={handleAddUpdateDeleteRole}
                locationRevisions={metaDataState?.locationRevisions}
                metaDataState={metaDataState}
                modify={isRoleModify}
                open={openRoleModal}
                roleToModify={roleToModify}
                viewMode={viewOnlyPermission}
              />)
            }
    
            <ResourceModal
              forecastPeriodSummaryData={resourceForecastState?.resourceForecastData?.periodSummary}
              handleClose={resetRoleResourceModal}
              handleDelete={onHandleDeleteResource}
              handleSubmit={onHandleSubmit}
              modify={resourceToModify}
              onSearch={onSearch}
              onSelect={onResourceSelect}
              open={openResourceModal}
              options={metaDataState?.userResourceList}
              resourceModalError={resourceForecastState?.resourceModalError}
              selectedUser={resourceForecastState?.selectedUser}
              viewMode={viewOnlyPermission}
            />
          </>
        )}

        <DialogModal
          className={styles['confirmation-modal']}
          description={
            <div className="confirmation-modal-text">
              <p className="mb-2" />
              <span>{deleteResource ? RESOURCE.DELETE_RESOURCE_MESSAGE : deleteRole ? ROLE_SELECTION_LABELS.DELETE_ROLE_CONFIRM_DESC : resetButtonClicked ? RESOURCE_FORECASTING.RESET_CONFIRM_MSG: RESOURCE_FORECASTING.BACK_BTN_CONFIRM_MSG}</span>
            </div>
          }
          handlePrimaryButton={handleModalCancelBtnClick}
          handleSecondaryButton={handleModalConfirmBtnClick}
          handleTertiaryButton={handleModalResetExitBtnClick}
          modalIcon="i"
          open={openConfirmationModal}
          primaryButton
          primaryButtonLabel={FORM_LABELS.CANCEL}
          secondaryButton
          secondaryButtonLabel={backButtonClicked ? BTN_LABELS.SAVE_DRAFT : BTN_LABELS.CONFIRM}
          tertiaryButton={backButtonClicked}
          tertiaryButtonLabel={BTN_LABELS.RESET_EXIT}
          title={FORM_LABELS.ARE_YOU_SURE}
        />
  
        {openControlsModal && resourceForecastState?.projectInfo && (
          <ForecastingControls
            billingTypeCode={resourceForecastState?.projectInfo?.billingTypeCode}
            callBackHandler={callBackHandler}
            forecastControlsState={forecastControlsState}
            handleClose={handleControlsButtonClick}
            metaData={metaDataState}
            onConfirmEvent={onUpdateControls}
            open={openControlsModal}
            parentAccountId={parentAccount?.parentAccountId}
            projectCode={resourceForecastState?.projectInfo?.projectCode}
            type={RESOURCE_LABEL}
          />)}

        <Footer
          disabledPrimaryButton={resourceForecastState?.forecastError?.length}
          handleClick={handleFooterContinueBtnClick}
          handleFooterSecondaryButton={handleFooterBackBtnClick}
          primaryLabel={BTN_LABELS.CONTINUE}
          secondaryLabel={BTN_LABELS.BACK}
        />
      </Container>
    </div>
  );
};

ResourceLevelForecast.propTypes = {
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  metaDataState: PropTypes.object,
  resourceForecastState: PropTypes.object
};

export default ResourceLevelForecast;