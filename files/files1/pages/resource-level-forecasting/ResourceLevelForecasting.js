import React, { useEffect, useState, useMemo,useCallback} from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import { Container } from 'react-grid-system';
import moment from 'moment-mini';
import SnapButton from '@pnp-snap/snap-button';
import MapPin from 'react-feather/dist/icons/map-pin';
import DialogModal from '@revin-utils/components/dialog-modal';
import { TABLE_TYPES, FORM_LABELS,preciseNumberFormatter, getPermissions, getValuesFromSplitCellData, getTransformedNumber, getSessionItem } from '@revin-utils/utils';
import { withStyles } from '@material-ui/core/styles';
import { Collapse } from '@material-ui/core';
import ExpandMore from '@material-ui/icons/ExpandMore';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import Footer from '@revin-utils/components/footer';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { MESSAGES } from 'utils/messages';
import { RESOURCE_FORECASTING, BACK, 
  RESOURCE, ROLE_SELECTION_LABELS, 
  BTN_LABELS, ROLE_ACTION, ROUTES,
  TOAST_MESSAGES_SUFFIX, ORIGIN, 
  FINANCIAL_YEAR, FORECASTING_SUMMARY,
  PROJECT_LEVEL_FORECAST,ALERT_CONFIGURATION,PROJECT_FORECASTING_BREADCRUMBS, 
  VIEW_ONLY_ACCESS_ROLES,
  SESSION_STORAGE_KEYS, PROJECT_DETAILS, DATE_FORMAT,
  FORECAST_DASHBOARD_CONSTANTS,
  RESOURCE_LABEL,
  CURRENCY_USD,
  CURRENCY} from 'utils/constants';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import HorizontalSummary from 'components/common/horizontal-summary';
import SummaryValue from 'components/common/horizontal-summary/summary-value/SummaryValue';
import ResourceLevelForecastGrid from './resource-level-forecast-grid/ResourceLevelForecastGrid';
import { buildResourceSummary, getOptionsListForUsers, validateDuplicateResource, updateSplitCellValue } from 'utils/forecastingCommonFunctions';
import {  } from 'utils/commonFunctions';
import { ResourceForecastingActionType } from 'store/types/ResourceForecastingActionType';
import {
  getUsers,
  getUser,
  updateResourceForecastingWithAPI,
  editResource,
  resetAddResourceModal,
  resetResourceForecastingData
} from 'store/actions/ResourceForecasting';
import ForecastingControls from 'components/common/forecasting-controls';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import {prepareAddResourcePayload, preparePayloadForRole} from './helper';
import { getCurrentFinancialYear, handleBreadcrumbClick } from 'utils/helper';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import styles from './ResourceLevelForecasting.module.scss';
import { GlobalActionType } from 'store/types/GlobalActionType';

const ResourceLevelForecasting = ({
  callBackHandler, 
  resourceForecastingState, 
  metaDataState,
  forecastControlsState,
  forecastSaved
}) => {

  const [collapse, setCollapse] = useState(false);
  const [responseData, setResponseData] = useState({'headerData': [], 'resourceSummary': [] });
  const [resourceSummary, setResourceSummary] = useState({});
  const [openRoleSelectionModal, setOpenRoleSelectionModal] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isGridUpdate, setIsGridUpdate] = useState(false);
  const [selectedGrid, setSelectedGrid] = useState(RESOURCE_FORECASTING.FTE);
  const [payloadData, setPayLoadData] = useState([]);
  const [open, setOpen] = useState(false);
  const [openControlsModal, setOpenControlsModal] = useState(false);
  const [labelData,setLabelData] = useState([]);
  const [year,setYear]= useState(null);
  const [modify, setModify] = useState(false);
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteRole, setDeleteRole] = useState();
  const { userList, resourceModalError, resourceForecastingData, forecastError, closeRoleModal } = resourceForecastingState;
  const { projectForecastCandidateId } = useParams();
  const { accountForecastCandidateId } = useParams();
  const history = useHistory();
  const [viewOnlyPermission, setViewOnlyPermission] = useState(false);
  const [tableMaximize, setTableMaximize] = useState(true);
  const [isCollapseSummary, setIsCollapseSummary] = useState(false);
  const [formattedStartDate,setFormattedStartDate] = useState('');
  const [formattedEndDate,setFormattedEndDate] = useState('');
  const entitlement = metaDataState?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
  const parentAccountForecastStatus = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes.parentAccountForecastStatus;
  const manageResourceForecastPermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
  const viewResourceForecastPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;

  useEffect(() => {
    if((!manageResourceForecastPermission && !!viewResourceForecastPermission) || getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked) {
      setViewOnlyPermission(true);
    } else if(parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) {
      setViewOnlyPermission(true);
    } else {
      setViewOnlyPermission(false);
    }
  }, [manageResourceForecastPermission, viewResourceForecastPermission, parentAccountForecastStatus]);

  useEffect(() => {
    const { resourceForecastingData } = resourceForecastingState || {};
    if (resourceForecastingData) {
      const { forecastLevelType } = resourceForecastingData;
      if (forecastLevelType === PROJECT_LEVEL_FORECAST) {
        history.replace(`/${accountForecastCandidateId}/project-forecasting/${projectForecastCandidateId}`);
      }
    }
  }, [resourceForecastingState?.resourceForecastingData]);

  useEffect(() => {
    if(forecastSaved){
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.RESOURCE}/${projectForecastCandidateId}`);
    }
  }, [forecastSaved]);

  useEffect(() => {
    if (resourceModalError) {
      setOpen(true);
    }
  }, [resourceModalError]);

  useEffect(() => {
    if(closeRoleModal) {
      handleCloseRoleSelectionModal();
    }
  }, [closeRoleModal]);

  useEffect(() => {
    if (resourceModalError) {
      handleClose();
    }
  }, [history]);

  useEffect(() => {
    if(resourceForecastingState?.resourceForecastingData?.projectForecastCandidateId !== projectForecastCandidateId){
      callBackHandler({
        type: ResourceForecastingActionType.GET_RESOURCE_FORECASTING_DATA,
        payload: {
          projectForecastCandidateId,
          isNotLoading: true
        } 
      });
    }
  }, [projectForecastCandidateId]);

  useEffect(() => {
    if(resourceForecastingState?.resourceForecastingData){
      setResponseData(buildResourceSummary(resourceForecastingState.resourceForecastingData));
      setResourceSummary(resourceForecastingState.resourceForecastingData);
      initialRoleDataCallbackHandler();
    }else{
      setResponseData({'headerData': [], 'resourceSummary': [] });
      setResourceSummary({});
    }
  }, [resourceForecastingState?.resourceForecastingData]);

  useEffect(() =>{
    const financialYear = getCurrentFinancialYear(resourceSummary.projectFinancialYearSummary);
    setLabelData(financialYear);
  },[resourceSummary.projectFinancialYearSummary]);

  useEffect(()=>{
    if (labelData && labelData?.year){
      const lastTwoDigitsOfYear = labelData.year.toString().slice(-2);
      setYear(lastTwoDigitsOfYear);
    }
  },[labelData]);

  useEffect(() =>{
    setFormattedStartDate(moment(resourceSummary?.projectStart).format(DATE_FORMAT.FORMAT_1));
    setFormattedEndDate(moment(resourceSummary?.projectEnd).format(DATE_FORMAT.FORMAT_1));
  },[resourceSummary?.projectStart,resourceSummary?.projectEnd]);

  const options = useMemo(() => {
    const optionsList = getOptionsListForUsers(userList);
    return optionsList;
  }, [userList]);

  const onSearch = (value) => {
    if (value) {
      callBackHandler(getUsers({ searchTerm: value }));
    }
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(resourceForecastingState?.resourceForecastingData?.forecastingRoles, value?.id) ?
        callBackHandler(
          {
            type: ResourceForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
            payload: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR
          }
        )
        :
        callBackHandler(getUser({ userId: value?.id }));
    } else {
      callBackHandler(resetAddResourceModal());
    }
  };

  const onHandleSubmit = (resource) => {

    const resourceDetails = prepareAddResourcePayload(resource, resourceForecastingData, modify);

    callBackHandler(
      updateResourceForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId: resourceForecastingData?.projectForecastCandidateId,
        payload: resourceDetails,
        message: `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${modify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`
      })
    );

    handleClose();
  };

  const onHandleDelete = (resource) => {
    deleteResourceHandler(resource?.userId);
  };

  const handleQuickAction = ({action, headerItem}) => {
    const item = headerItem?.item;
    if (RESOURCE.EDIT_ACTION === action) {
      if (item?.resourceData) {
        callBackHandler( editResource(item) );
        setModify(true);
        setOpen(true); 
      } else {
        setRoleToModify(item);
        handleEditRoleModal();
      }
    }
    if (RESOURCE.DELETE_ACTION === action) {
      if (item?.resourceData) {
        setDeleteResource(item?.resourceData?.userId);
      } else {
        setDeleteRole(item);
      }
      setConfirmationOpen(!footerConfirmationOpen);
    }
  };

  const handleControlsButtonClick = useCallback(() => {
    setOpenControlsModal(!openControlsModal);
  }, [openControlsModal]);

  const handleClose = () => {
    setOpen(false);
    setModify(false);
    setDeleteResource(null);
    callBackHandler(resetAddResourceModal());
  };

  const handleExpand = () => {
    setCollapse(!collapse);
  };

  const openResourceModal = () => {
    setOpen(true);
  };

  const handleRoleSelectionModal = () => {
    setOpenRoleSelectionModal(true);
  };
    
  const handleEditRoleModal = () => {
    setOpenRoleSelectionModal(true);
    setIsRoleModify(true);
  };

  const handleCloseRoleSelectionModal = () => {
    setOpenRoleSelectionModal(false);
    setIsRoleModify(false);
    setRoleToModify(null);
    callBackHandler({ type: ResourceForecastingActionType.RESET_ROLE_MODAL_ERROR });
  };

  const initialRoleDataCallbackHandler = () => {
    callBackHandler({
      type: MetaDataActionType.GET_INITIAL_ROLE_DATA,
      payload : {
        effectiveDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        clientRolePayload: {
          param: 'client-roles',
          resource: {
            filter: `[client-roles]={accountId --eq '${resourceForecastingData?.parentAccountId}'}`
          }
        },
        accountId: resourceForecastingData?.parentAccountId
      }
    });
  };
  
  const deleteResourceHandler = (resourceUserId) => {
    const { forecastingRoles, projectForecastCandidateId } = resourceForecastingData;
    const { resourceData } = forecastingRoles?.find(role => role?.resourceData?.userId === resourceUserId);
    const filteredResources = forecastingRoles?.filter(role => role?.resourceData?.userId !== resourceUserId);
    callBackHandler(
      updateResourceForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId,
        payload: {
          ...resourceForecastingData,
          forecastingRoles : filteredResources
        },
        actionOrigin:ORIGIN.FORECAST_GRID_ORIGIN,
        message: `${RESOURCE.RESOURCE_TEXT} ${resourceData?.firstName?.toUpperCase()} ${resourceData?.lastName?.toUpperCase()} (${resourceData?.employeeId}) ${TOAST_MESSAGES_SUFFIX.DELETE}`
      })
    );
    setDeleteResource(null);
    handleClose();
  };

  const handleBackButtonClick = () => {
    setConfirmationOpen(!footerConfirmationOpen);
  };

  const handleConfirmClick = () =>{
    if (deleteResource) {
      deleteResourceHandler(deleteResource);
    } else if (deleteRole) {
      const data = {values: {extraFields : {id: deleteRole?.id, slNo:deleteRole.slNo}, roleForm: { orgRoleId: deleteRole?.orgRoleId}}, actionType: ROLE_ACTION.DELETE};
      handleAddUpdateDeleteRole(data);
    } else {
      callBackHandler(resetResourceForecastingData());
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    }
    handleBackButtonClick();
  };

  const handleAddUpdateDeleteRole = (data) => {
    const preparedPayload = preparePayloadForRole(data.values, resourceForecastingData, data.actionType);
    callBackHandler(updateResourceForecastingWithAPI({
      isNotLoading: true,
      projectForecastCandidateId: resourceForecastingData?.projectForecastCandidateId,
      payload : preparedPayload,
      message: `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${data.values?.extraFields?.roleDescription?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[data.actionType]}`,
      actionOrigin: ORIGIN.ROLE_MODAL_ORIGIN
    }));
    setDeleteRole(null);
  };

  const handleBackButtonGridClick = () => {
    if(isGridUpdate) {
      setConfirmationOpen(!footerConfirmationOpen);
    }else{
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    }
  };

  // on click of recalculate, this function will trigger
  const handleUpdateForecastData = () => {
    callBackHandler(updateResourceForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN,
      projectForecastCandidateId: resourceForecastingData?.projectForecastCandidateId,
      type: ResourceForecastingActionType.SET_UPDATE_RESOURCE_FORECASTING,
      payload: payloadData
    }));
  };

  const handleFilter = (value) => {
    setSelectedGrid(value);
  };

  const handleSave = () => {
    if(getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked){
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.RESOURCE}/${projectForecastCandidateId}`);
    } else if (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) {
      callBackHandler({
        type: GlobalActionType.TOGGLE_FORECAST_SAVED,
        payload: true
      });
    } else if (!forecastError) {
      callBackHandler(updateResourceForecastingWithAPI({
        dryRun: false,
        isNotLoading: true,
        projectForecastCandidateId: resourceForecastingData?.projectForecastCandidateId,
        actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN,
        payload: resourceForecastingData
      }));
    }
  };
    
  const onGridChanged = (grid, changes) => {
    const splitCellEvent = typeof(changes[0]?.value) === 'object';
    if (splitCellEvent) {
      //split cell update.
      const payloadData = _cloneDeep(resourceForecastingState);
      changes.forEach(({cell,value}) => {
        const {planType, id, resourceId, topCellValue, bottomCellValue} = cell.cellDataObj;
        const splitCellArr = getValuesFromSplitCellData(value);
        const valueToUpdate = {
          [topCellValue]: getTransformedNumber(splitCellArr[0]),
          [bottomCellValue]: getTransformedNumber(splitCellArr[1])
        };
        updateSplitCellValue(
          planType,
          id,
          resourceId,
          valueToUpdate,
          payloadData?.resourceForecastingData
        );
      });
      setPayLoadData(payloadData.resourceForecastingData);
      setIsGridUpdate(true);
      callBackHandler({
        type: ResourceForecastingActionType.UPDATE_RESOURCE_FORECASTING,
        payload: payloadData
      });
    };
  };

  const handleOnClick = (event,label) =>{
    handleBreadcrumbClick(label,accountForecastCandidateId,history,projectForecastCandidateId);
  };

  const footerPrimaryBtnLabel = useMemo(() => {
    return (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) || getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked ? BTN_LABELS.CONTINUE : RESOURCE.SAVE_CONTINUE;
  }, [entitlement, parentAccountForecastStatus]);

  const breadcrumbLabels = useMemo(() => {
    const labels = [{ label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick }];
    if (!VIEW_ONLY_ACCESS_ROLES.includes(entitlement)) {
      labels.push({ label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_SELECTION, onClick: handleOnClick  });
    }
    labels.push(
      { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_CHOOSE, onClick: handleOnClick},
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_RESOURCE_LEVEL }
    );
    return labels;
  }, [entitlement]);

  const handleTableMaximizeEvent = () => {
    setTableMaximize(!tableMaximize);
  };

  const collapseSummary = (v) => {
    setIsCollapseSummary(v);
  };
  
  return (
    <Container
      className={`mb-5 ${styles.wrapper}`}
      fluid
    >
      <div id="first-div">
        {!tableMaximize && (
          <div className="d-flex justify-content-between">
            {!tableMaximize && (
              <BreadcrumbNavigation
                breadcrumbSubTitle={breadcrumbLabels}
                breadcrumbTitle={
                  <div className="d-flex align-items-center">
                    {resourceSummary?.projectName}
                    <span className="link">{resourceSummary?.projectCode}</span>
                    <InfoTooltip
                      className={styles['project-info-tooltip']}
                      infoContent={
                        <>
                          <ul className={`list-style-none ${styles['project-info-lists']}`}>
                            <li>
                              <h4>
                                {resourceSummary?.projectName}
                              </h4>
                              <p>
                                {PROJECT_DETAILS.PROJECT_NAME}
                              </p>
                            </li>
                            <li>
                              <h4>
                                {resourceSummary?.projectCode}
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
                                {resourceSummary?.deliveryType}
                              </h4>
                              <p>
                                {PROJECT_DETAILS.PROJECT_DELIVERY_TYPE}
                              </p>
                            </li>
                            <li>
                              <h4>
                                {resourceSummary?.billingType}
                              </h4>
                              <p>
                                {PROJECT_DETAILS.PROJECT_BILLING_TYPE}
                              </p>
                            </li>
                            <li>
                              {resourceSummary?.totalContractValue ? preciseNumberFormatter(resourceSummary?.totalContractValue) : '-'}
                              <p>
                                {PROJECT_DETAILS.PROJECT_TCV}
                              </p> 
                            </li>
                          </ul>
                        </>
                      }
                    />  
                    <SnapButton
                      className="primary-invert"
                      handleClick={handleControlsButtonClick}
                      label={<MapPin />}
                    />
                  </div>
                }
                className={`mb-3 ${styles.breadcrumb}`}
                titleReverse
              />        
            )}
          </div>
        )}

        <div className={`flex-1 ${tableMaximize && styles['fixed-summary']}`}>
          <HorizontalSummary
            className={`
              ${styles['forecast-summary-global']}
              ${styles['forecast-summary']}
              ${collapse && styles['forecast-summary-opened']}
            `}
            collapseButton={!tableMaximize}
            collapseSummary={collapseSummary}
            expandMore={
              !tableMaximize ?
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
                  {` ${RESOURCE_FORECASTING.CURRENCY} (${resourceSummary.currencyCode})`}
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
              <>
                <div className="d-flex align-items-center">
                  <div className={`fy-global ${styles.fy}`}>
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
                        preciseNumberFormatter(labelData?.finalResourceCostOtherCostSum)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.finalResourceCostOtherCostPercentage,{isPercentage:true})
                      }
                      mainValueTitle={RESOURCE_FORECASTING.RESOURCE_COST_TITLE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.directExpense)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.directExpensePercentage,{isPercentage:true})
                      }
                      mainValueTitle={RESOURCE_FORECASTING.DIRECT_EXPENSE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.grossMargin)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.grossMarginPercentage,{isPercentage:true})
                      }
                      mainValueTitle={RESOURCE_FORECASTING.GROSS_PROFIT_MARGIN}
                    /> 
                    <SummaryValue
                      mainValue={ 
                        <>
                          {preciseNumberFormatter(labelData?.totalPlannedCount)}
                          <InfoTooltip
                            infoContent={
                              <div className={styles['tooltip-content']}>
                                <h4>{preciseNumberFormatter(labelData?.resourceCount)}</h4>
                                <p className="mb-2">{RESOURCE_FORECASTING.RESOURCE}</p>
                                <h4>{preciseNumberFormatter(labelData?.roleCount)}</h4>
                                <p>{RESOURCE_FORECASTING.ROLE}</p>
                              </div>
                            }
                          />
                        </>
                      }
                      mainValueTitle={RESOURCE_FORECASTING.Total_Resources}
                    />           
                  </div>
                </div>
                <Collapse
                  className={styles['collapse-area']}
                  in={collapse}
                >
                  <div className={styles['collapse-wrapper']}>
                    <ForecastDataSheetControlWrapper
                      disablePerfectScrollBar
                      grid={responseData.resourceSummary}
                      header={responseData.headerData}
                      switchView
                      type={TABLE_TYPES.PRICING_SUMMARY}
                      viewOnlyPermission={viewOnlyPermission}
                    />
                  </div>
                </Collapse>
              </>
            }
          /> 
        </div>
      </div>

      <ResourceLevelForecastGrid 
        callBackHandler={callBackHandler}
        disablePerfectScrollBar
        forecastError={forecastError}
        gridDataApiResponse={resourceForecastingState} 
        handleFilter={handleFilter}
        handleQuickAction={handleQuickAction}
        handleRoleSelectionModal={handleRoleSelectionModal}
        handleTableMaximizeEvent={handleTableMaximizeEvent}
        handleUpdateForecastData={handleUpdateForecastData}
        isCollapseSummary={isCollapseSummary}
        isGridUpdate={isGridUpdate}
        onGridChanged={onGridChanged}
        openResourceModal={openResourceModal}
        selectedGrid={selectedGrid}
        setIsGridUpdate={setIsGridUpdate}
        setPayLoadData={setPayLoadData}
        viewOnlyPermission={viewOnlyPermission}
      />

      <ResourceModal
        forecastPeriodSummaryData={resourceForecastingState?.resourceForecastingData?.forecastingPeriodSummary}
        handleClose={handleClose}
        handleDelete={onHandleDelete}
        handleSubmit={onHandleSubmit}
        modify={modify}
        onSearch={onSearch}
        onSelect={onResourceSelect}
        open={open}
        options={options}
        resourceModalError={resourceForecastingState?.resourceModalError}
        selectedUser={resourceForecastingState?.selectedUser}
      />

      {openRoleSelectionModal && (
        <RoleSelectionModal 
          forecastingData={resourceForecastingState?.resourceForecastingData}
          handleClose={handleCloseRoleSelectionModal}
          handleSubmit={handleAddUpdateDeleteRole}
          locationRevisions={metaDataState?.locationRevisions}
          metaDataState={metaDataState}
          modify={isRoleModify}
          open={openRoleSelectionModal}
          roleToModify={roleToModify}
        />
      )}

      {openControlsModal && (
        <ForecastingControls
          callBackHandler={callBackHandler}
          forecastControlsState={forecastControlsState}
          handleClose={handleControlsButtonClick}
          metaData={metaDataState}
          open={openControlsModal}
          parentAccountId={resourceForecastingData?.parentAccountId}
          projectCode={resourceForecastingState?.resourceForecastingData?.projectCode}
          type={RESOURCE_LABEL}
        />)}

      <Footer
        handleClick={handleSave}
        handleFooterSecondaryButton={handleBackButtonGridClick}
        primaryLabel={footerPrimaryBtnLabel}
        secondaryLabel={BACK}
      />
      <DialogModal
        className={styles['confirmation-modal']}
        description={
          <div className="confirmation-modal-text">
            <p className="mb-2" />
            {deleteResource ? RESOURCE.DELETE_RESOURCE_MESSAGE : deleteRole ? ROLE_SELECTION_LABELS.DELETE_ROLE_CONFIRM_DESC : RESOURCE_FORECASTING.BACK_BUTTON_MODAL}
          </div>
        }
        handlePrimaryButton={handleBackButtonClick}
        handleSecondaryButton={handleConfirmClick}
        modalIcon="i"
        open={footerConfirmationOpen}
        primaryButton
        primaryButtonLabel={FORM_LABELS.CANCEL}
        secondaryButton
        secondaryButtonLabel={BTN_LABELS.CONFIRM}
        title={FORM_LABELS.ARE_YOU_SURE}
      />
    </Container>
  );
};

ResourceLevelForecasting.propTypes = {
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  forecastSaved: PropTypes.bool,
  metaDataState: PropTypes.object,
  resourceForecastingState: PropTypes.object
};

export default withStyles(styles)(ResourceLevelForecasting);
