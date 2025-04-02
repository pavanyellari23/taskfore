import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import withStyles from '@material-ui/core/styles/withStyles';
import _cloneDeep from 'lodash/cloneDeep';
import SnapButton from '@pnp-snap/snap-button';
import { TABLE_TYPES, FORM_LABELS, getValuesFromSplitCellData, getTransformedNumber } from '@revin-utils/utils';
import DialogModal from '@revin-utils/components/dialog-modal';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import NoRecordFound from 'assets/images/no-record-found.svg';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import {
  buildResourcePlanData
} from 'components/pages/resource-level-forecasting/resource-level-forecast-grid/helper';
import { RESOURCE_FORECASTING, PROJECT_FORECASTING, RECALCULATE, RESOURCE, ROLE_SELECTION_LABELS, BTN_LABELS, ROLE_ACTION, TYPE, ORIGIN, TOAST_MESSAGES_SUFFIX, PROJECT_FORECASTING_TYPE,EMPTY_SCREEN_MESSAGE, ALERT_CONFIGURATION, MAX_NUMBER_LIMIT, OPPORTUNITY_SEARCH } from 'utils/constants';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import {
  getUsers,
  getUser,
  updateProjectForecastingWithAPI,
  editResource,
  resetAddResourceModal
} from 'store/actions/ProjectForecasting';
import {prepareAddResourcePayload, preparePayloadForRole} from 'components/pages/resource-level-forecasting/helper';
import EmptyScreen from '@revin-utils/components/empty-screen';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import { splitCellUpdate, getOptionsListForUsers, formatGridPayloadToAPIPayload, validateDuplicateResource, updateSplitCellValue } from 'utils/forecastingCommonFunctions';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styles from './ManageCostAllocationTable.module.scss';

const ManageCostAllocationTable = ({ callBackHandler, costUpdate, projectForecastingState, metaDataState, isCrmSelected, idtUpdate, showRevenueRow, setRevenueModalPayload, revenueModalPayload, setShowAlertErrorMessage,filteredData, searchTextEvent}) => {
  const tabLabelsConstant = [
    { label: RESOURCE_FORECASTING.FTE },
    { label: PROJECT_FORECASTING.COST_LABEL }
  ];
  const [responseData, setResponseData] = useState({});
  const [selectedGrid, setSelectedGrid] = useState(tabLabelsConstant[0].label);
  const [openRoleSelectionModal, setOpenRoleSelectionModal] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [isGridUpdate, setIsGridUpdate] = useState(false);
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteRole, setDeleteRole] = useState();
  const [searchText,setSearchText] = useState('');
  const { userList } = projectForecastingState;
  const history = useHistory();
  const { projectForecastingDataLocalObject, forecastError } = projectForecastingState;

  useEffect(() => {
    const gridData = buildResourcePlanData(
      { ...projectForecastingDataLocalObject, forecastingRoles: filteredData },
      selectedGrid,
      TYPE.PROJECT_FORECASTING,
      showRevenueRow
    );
    
    setResponseData(gridData);
    //this condition is for revenue modal, when type is milestone
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow){
      setRevenueModalPayload(preparePayload());
      setShowAlertErrorMessage(gridData.resourceData[0].find((item) => item.showErrorCell));
    }
  },[selectedGrid, projectForecastingState?.projectForecastingDataLocalObject, showRevenueRow,filteredData]);

  useEffect(() => {
    initialRoleDataCallbackHandler();
  }, []);

  useEffect(() => {
    if (projectForecastingState?.resourceModalError) {
      handleClose();
    }
  }, [history]);

  const handleFilter = (event) => {
    setSelectedGrid(event);
  };

  const options = useMemo(() => {
    const optionsList = getOptionsListForUsers(userList);
    return optionsList;
  }, [userList]);

  const onSearch = (value) => {
    if (value) {
      callBackHandler(getUsers({ isNotLoading: true, searchTerm: value }));
    }
  };

  const prepareRevenueModalPayload = (payload) => {
    return {...payload, forecastingPeriodSummary: revenueModalPayload.forecastingPeriodSummary, forecastPoCDetails: revenueModalPayload.forecastPoCDetails};
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, value?.id) ?
        callBackHandler(
          {
            type: ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
            payload: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR
          }
        )
        :
        callBackHandler(getUser({ isNotLoading: true, userId: value?.id }));
    } else {
      callBackHandler(resetAddResourceModal());
    }
  };

  const onHandleSubmit = (resource) => {

    let resourceDetails = prepareAddResourcePayload(resource, projectForecastingDataLocalObject, modify);
    resourceDetails = {...resourceDetails, projectCostComputationMethod: isCrmSelected ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow){
      resourceDetails = prepareRevenueModalPayload(resourceDetails);
    }
    callBackHandler(
      updateProjectForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
        payload: resourceDetails,
        message: `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${modify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`,
        actionType: modify ? RESOURCE.EDIT_ACTION : RESOURCE.ADD_RESOURCE
      })
    );

    handleClose();
  };

  const onHandleDelete = (resource) => {
    deleteResourceHandler(RESOURCE.DELETE, resource?.userId);
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

  const handleClose = () => {
    setOpen(false);
    setModify(false);
    setDeleteResource(null);
    callBackHandler(resetAddResourceModal());
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
  };

  const initialRoleDataCallbackHandler = () => {
    const parentAccountId = projectForecastingDataLocalObject?.parentAccountId;
    callBackHandler({
      type: ProjectForecastingActionType.GET_INITIAL_ROLE_DATA,
      payload : {
        effectiveDate: moment().format('YYYY-MM-DD HH:mm:ss'),
        clientRolePayload: {
          param: 'client-roles',
          resource: {
            filter: `[client-roles]={accountId --eq '${parentAccountId}'}`
          }
        },
        accountId: parentAccountId
      }
    });
  };
  
  const deleteResourceHandler = (actionType, resourceUserId) => {
    const { forecastingRoles, projectForecastCandidateId } = projectForecastingDataLocalObject;
    const { resourceData } = forecastingRoles?.find(role => role?.resourceData?.userId === resourceUserId);
    let filteredResources = forecastingRoles?.filter(role => role?.resourceData?.userId !== resourceUserId);
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow){
      filteredResources = prepareRevenueModalPayload(filteredResources);
    }

    callBackHandler(
      updateProjectForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId,
        payload: {
          ...projectForecastingDataLocalObject,
          forecastingRoles : filteredResources
        },
        message: `${RESOURCE.RESOURCE_TEXT} ${resourceData?.firstName?.toUpperCase()} ${resourceData?.lastName?.toUpperCase()} (${resourceData?.employeeId}) ${TOAST_MESSAGES_SUFFIX.DELETE}`,
        actionType
      })
    );
    handleClose();
  };

  const handleBackButtonClick = () => {
    setConfirmationOpen(!footerConfirmationOpen);
    setDeleteResource(null);
    setDeleteRole(null);
  };

  const handleConfirmClick = () =>{
    if (deleteResource) {
      deleteResourceHandler(RESOURCE.DELETE_RESOURCE_BY_QUICK_ACTION, deleteResource);
    } 
    if (deleteRole) {
      const data = {values: {extraFields : {id: deleteRole?.id,slNo:deleteRole?.slNo}, roleForm: { orgRoleId: deleteRole?.orgRoleId}}, actionType: ROLE_ACTION.DELETE};
      handleAddUpdateDeleteRole(data);
    }
    handleBackButtonClick();
  };

  const handleAddUpdateDeleteRole = (data) => {
    let preparedPayload = preparePayloadForRole(data.values, projectForecastingDataLocalObject, data.actionType);
    preparedPayload = {...preparedPayload, projectCostComputationMethod: isCrmSelected ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow){
      preparedPayload = prepareRevenueModalPayload(preparedPayload);
    }
    callBackHandler(updateProjectForecastingWithAPI({
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
      payload: preparedPayload,
      message: `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${data.values?.roleForm?.orgRoleId?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[data.actionType]}`,
      actionOrigin: ORIGIN.ROLE_MODAL_ORIGIN
    }));
    handleCloseRoleSelectionModal();
  };

  const handleUpdateForecastData = () => {
    const payload = preparePayload();

    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload,
      actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN
    }));
  };

  const preparePayload = () => {
    let payload;
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED) {
      const forecastingPeriodSummary = formatGridPayloadToAPIPayload(projectForecastingDataLocalObject?.forecastingPeriodSummary, responseData.resourceData, ['resourceCostAdjustments']);
      const forecastPoCDetails = formatGridPayloadToAPIPayload(projectForecastingDataLocalObject?.forecastPoCDetails?.deliveryCompletionPercentagePeriodDetails, responseData.resourceData, ['deliveryCompletionPercentage']);
      payload = {...projectForecastingDataLocalObject, forecastingPeriodSummary, forecastPoCDetails : {...projectForecastingDataLocalObject?.forecastPoCDetails, ...costUpdate,  deliveryCompletionPercentagePeriodDetails:forecastPoCDetails}};
    }else{
      payload = {...projectForecastingDataLocalObject, projectCostComputationMethod: isCrmSelected ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    }
    return payload;
  };

  const onSplitGridChanged = (value, planType, id, resourceId, valueToUpdate) => {
    const payloadData = _cloneDeep({...projectForecastingState, projectForecastingDataLocalObject : preparePayload()});
    splitCellUpdate(value, planType, id, resourceId, valueToUpdate, payloadData.projectForecastingDataLocalObject);
    setIsGridUpdate(true);
    callBackHandler({
      type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
      payload: payloadData
    });
    setRevenueModalPayload(payloadData?.projectForecastingDataLocalObject);
  };


  const onGridChanged = (grid, changes) => {
    const splitCellEvent = typeof(changes[0].value) === 'object';
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED && showRevenueRow && !splitCellEvent){
      setResponseData({...responseData, resourceData: grid});
      setRevenueModalPayload(preparePayload());
    }
    if(splitCellEvent) {
      const payloadData = _cloneDeep({...projectForecastingState, projectForecastingDataLocalObject : preparePayload()});
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
          payloadData?.projectForecastingDataLocalObject
        );
      });
      callBackHandler({
        type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
        payload: payloadData
      });
      showRevenueRow && setRevenueModalPayload(payloadData?.projectForecastingDataLocalObject);
    }
    setIsGridUpdate(true);
  };

  const onSearchText = (text) => {
    setSearchText(text);
    searchTextEvent(text);
  };

  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      {forecastError && <DynamicAlertList alertList={forecastError}/>}
      <div className="d-flex justify-content-between align-items-center mb-2">   
        {((filteredData && filteredData.length >0) || searchText) &&(
          <OpportunitiesSearch
            label={OPPORTUNITY_SEARCH.LABEL}
            setSearchText={onSearchText}
          /> 
        )}        
        <div className={`d-flex align-items-center ${!(isGridUpdate || idtUpdate) && styles['btn-recalculate']}`} >
          <InfoTooltip
            infoContent={RECALCULATE.info}
          />
          <SnapButton
            className="tertiary-button"
            handleClick={handleUpdateForecastData}
            label={RECALCULATE.LABEL}
            name={RECALCULATE.LABEL}
            type={FORM_LABELS.SUBMIT}
            variant={FORM_LABELS.CONTAINED}
          />
        </div>
      </div>
      
      {(filteredData && filteredData.length > 0) && (
        <PerfectScrollbar
          className={'custom-scrollbar'}
          style={{height: 'calc(56vh + 5px)'}}
        >
          <ForecastDataSheetControlWrapper
            disablePerfectScrollBar
            grid={responseData.resourceData}
            handleFilter={handleFilter}
            handleQuickAction={handleQuickAction}
            handleRoleSelectionModal={handleRoleSelectionModal}
            header={responseData.headerData}
            isNonNegative={false}
            limit
            limitRange={MAX_NUMBER_LIMIT}
            onGridChanged={onGridChanged}
            onSplitGridChanged={onSplitGridChanged}
            openResourceModal={openResourceModal}
            parentHeaderColSpan={1}
            secondaryHeaders={responseData.secondaryHeader}
            selectedGrid={selectedGrid}
            splitCellUpdate
            switchView
            tabLabels={tabLabelsConstant}
            type={TABLE_TYPES.RESOURCE}
          />  
        </PerfectScrollbar>
      )}
  
      {filteredData && filteredData.length === 0 && searchText && (
        <EmptyScreen
          center
          className={styles['no-opportunity-card']}
          image={NoRecordFound}
          subTitle={EMPTY_SCREEN_MESSAGE.SUBTITLE}
          title={EMPTY_SCREEN_MESSAGE.TITLE}
        />
      )} 
      <ResourceModal
        className={styles['modal-inside']}
        forecastPeriodSummaryData={projectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary}
        handleClose={handleClose}
        handleDelete={onHandleDelete}
        handleSubmit={onHandleSubmit}
        modify={modify}
        onSearch={onSearch}
        onSelect={onResourceSelect}
        open={open}
        options={options}
        resourceModalError={projectForecastingState?.resourceModalError}
        selectedUser={projectForecastingState?.selectedUser}
      />

      {openRoleSelectionModal && (
        <RoleSelectionModal
          className={styles['modal-inside']}
          forecastingData={projectForecastingState?.projectForecastingDataLocalObject}
          handleClose={handleCloseRoleSelectionModal}
          handleSubmit={handleAddUpdateDeleteRole}
          locationRevisions={metaDataState?.locationRevisions}
          metaDataState={metaDataState}
          modify={isRoleModify}
          open={openRoleSelectionModal}
          roleToModify={roleToModify}
        />
      )}

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
    </div>
  );
};

ManageCostAllocationTable.propTypes = {
  callBackHandler: PropTypes.func,
  costUpdate: PropTypes.object,
  filteredData: PropTypes.array,
  idtUpdate: PropTypes.bool,
  isCrmSelected: PropTypes.bool,
  metaDataState: PropTypes.object,
  projectForecastingState: PropTypes.object,
  resourceForecastingState: PropTypes.object,
  revenueModalPayload: PropTypes.object,
  searchTextEvent:PropTypes.func,
  setRevenueModalPayload: PropTypes.func,
  setShowAlertErrorMessage: PropTypes.func,
  showRevenueRow: PropTypes.bool
};

export default withStyles(styles)(ManageCostAllocationTable);
