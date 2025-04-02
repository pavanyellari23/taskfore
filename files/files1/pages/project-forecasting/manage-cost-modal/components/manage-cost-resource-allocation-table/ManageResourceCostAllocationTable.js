import React, { useEffect, useState, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import _orderBy from 'lodash/orderBy';
import _sortBy from 'lodash/sortBy';
import _find from 'lodash/find';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import withStyles from '@material-ui/core/styles/withStyles';
import { Info } from '@material-ui/icons';
import SnapButton from '@pnp-snap/snap-button';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import DataGridControl from '@revin-utils/components/data-grid-control';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import CustomTab from '@revin-utils/components/custom-tab';
import {  FORM_LABELS, QUICK_ROLE_ACTION } from '@revin-utils/utils';
import DialogModal from '@revin-utils/components/dialog-modal';
import EmptyScreen from '@revin-utils/components/empty-screen';
import NoRecordFound from 'assets/images/no-record-found.svg';
import { RESOURCE_FORECASTING, PROJECT_FORECASTING, RECALCULATE, RESOURCE, ROLE_SELECTION_LABELS, BTN_LABELS, ROLE_ACTION, ORIGIN, TOAST_MESSAGES_SUFFIX, PROJECT_FORECASTING_TYPE,EMPTY_SCREEN_MESSAGE, ALERT_CONFIGURATION, OPPORTUNITY_SEARCH ,GRID_CONSTANTS, ALLOCATION_TABLE_WARNING, RESOURCE_GRID, DATE_FORMAT} from 'utils/constants';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import {
  getUsers,
  getUser,
  updateProjectForecastingWithAPI,
  editResource,
  resetAddResourceModal
} from 'store/actions/ProjectForecasting';
import {prepareAddResourcePayload, preparePayloadForRole} from 'components/pages/resource-level-forecasting/helper';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import { getGridMonths, getOptionsListForUsers, validateDuplicateResource } from 'utils/forecastingCommonFunctions';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import { gridHeaderRow,gridRowsData, projectGridColumns,gridToPayload } from './helper';
import { getFilteredSearchData } from 'utils/commonFunctions';
import styles from './ManageResourceCostAllocationTable.module.scss';

const ManageResourceCostAllocationTable = ({
  callBackHandler,
  projectForecastingState,
  metaDataState,
  isCrmSelected,
  revenueModalPayload,
  headerTabIndex
}) => {
  const fteTabLabels = [
    { label: GRID_CONSTANTS.TITLE.FTE, key: GRID_CONSTANTS.KEY.FTE },
    { label: GRID_CONSTANTS.TITLE.BILLABLE_HOURS, key: GRID_CONSTANTS.KEY.BILLABLE_HOURS, payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.BILLABLE_HRS, colorKey:  GRID_CONSTANTS.KEY.BILLABLE_HOURS_COLOR}
  ];
  const costTabLabels = [
    { label: '', key: GRID_CONSTANTS.KEY.COST }
  ];

  const [columns, setColumns] = useState();
  const [rows, setRows] = useState([]);
  const [updatedCells, setUpdatedCells] = useState([]);
  const [showUpdateButton, setShowUpdateButton]= useState(false);
  const [filteredRoles, setFilteredRoles] = useState([]);
  const [tabLabels, setTabLables] = useState(fteTabLabels);
  const [selectedTab, setSelectedTab] = useState(0);
  const [sortingColumn, setSortingColumn] = useState();
  const [sortBy, setSortBy] = useState(null);
  const [updatedProjectForecastingState, setUpdatedProjectForecastingState] = useState(projectForecastingState);
  const [openRoleSelectionModal, setOpenRoleSelectionModal] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteRole, setDeleteRole] = useState();
  const [searchText, setSearchText] = useState('');
  const history = useHistory();
  const { projectForecastingDataLocalObject, forecastError, userList } = updatedProjectForecastingState;

  const onTableHeaderTabClick =(_, tabIndex)=>{
    setSelectedTab(tabIndex);
  };

  useEffect(()=>{
    setUpdatedProjectForecastingState(projectForecastingState);
  }, [projectForecastingState]);

  useEffect(() => {
    if (projectForecastingState?.projectForecastingDataLocalObject.forecastingPeriodSummary?.length) {
      const gridHeaderColumnLength = getGridMonths(projectForecastingState?.projectForecastingDataLocalObject.forecastingPeriodSummary);
      setColumns(projectGridColumns(gridHeaderColumnLength?.length));
    }
  }, [projectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary]);

  useEffect(() => {
    const filtered = getFilteredSearchData( updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, searchText);
    setFilteredRoles(_sortBy(filtered, obj => obj?.resourceData?.firstName));
  }, [searchText,  updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles]);

  useEffect(() => {
    const tabs =  headerTabIndex=== 0 ? fteTabLabels :  costTabLabels;
    setTabLables(tabs);
    setSelectedTab(0);
  }, [headerTabIndex]);

  const filterRecord = (periodId) => {
    setSortingColumn(periodId);
    const keyToSort = tabLabels[selectedTab].key;
    let sortByKey;
    if (periodId === sortingColumn && sortBy === 'desc'){
      sortByKey = 'asc';
    }else {
      sortByKey = (sortBy === 'asc' && periodId === sortingColumn) ? null : 'desc';
    }

    setSortBy(sortByKey);
    if(sortByKey){
      setFilteredRoles(_orderBy( updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, [
        obj => _find(obj.foreCastingRolePlanPeriodDetails, { periodId })?.[keyToSort] || 0
      ], sortByKey));
    }else{
      setFilteredRoles(_sortBy( updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, obj => obj?.resourceData?.firstName));
    }
  };

  useEffect(() => {
    if (tabLabels?.length &&  updatedProjectForecastingState?.projectForecastingDataLocalObject && Object.keys( updatedProjectForecastingState?.projectForecastingDataLocalObject)?.length  ) {
      getRows(tabLabels[selectedTab], filteredRoles);
    }
  }, [tabLabels, selectedTab,  updatedProjectForecastingState?.projectForecastingDataLocalObject, filteredRoles]);

  const getRows = (tab, roles) => {

    const headerLabels = [
      {
        label: (headerTabIndex === 0 && 
        <CustomTab
          className="small-tab"
          onChange={onTableHeaderTabClick}
          tabList={tabLabels}
          value={selectedTab}
        />)
       
      },
      {label: (<>{GRID_CONSTANTS.TITLE.COST_RATE} <br/> {GRID_CONSTANTS.TITLE.HOUR}</>)}
    ];
    const headerRow = gridHeaderRow(updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary, headerLabels, '', filterRecord, sortingColumn, sortBy);
    const headerButtons = [
      {
        content: (
          <div className="d-flex gap-1">
            <ArrowWrapper
              data={''}
              handleChange={() => onRoleClick()}
            >
              <SnapButton
                className="primary-invert"
                label={RESOURCE_GRID.ADD_ROLE}
              />
            </ArrowWrapper>
            <ArrowWrapper
              data={''}
              handleChange={() => onResourceClick()}
            >
              <SnapButton
                className="primary-invert"
                label={RESOURCE_GRID.ADD_RESOURCE}
              />
            </ArrowWrapper>
          </div>
        )},
      {content: ''}
    ];

    const rowsData = gridRowsData(updatedProjectForecastingState?.projectForecastingDataLocalObject, roles, tab.key, tab.payloadSubType,tab.colorKey, [GRID_CONSTANTS.KEY.COST_RATE], headerButtons,onRoleActionClickHandler);
    setRows([headerRow, ...rowsData]);
  };
  useEffect(() => {
    initialRoleDataCallbackHandler();
  }, []);

  useEffect(() => {
    if (updatedProjectForecastingState?.resourceModalError) {
      handleClose();
    }
  }, [history]);

  const options = useMemo(() => {
    const optionsList = getOptionsListForUsers(userList);
    return optionsList;
  }, [userList]);

  const onSearch = (value) => {
    if (value) {
      callBackHandler(getUsers({ isNotLoading: true, searchTerm: value }));
    }
  };

  const onRoleClick = () => {
    setOpenRoleSelectionModal(true);
  };
  
  const onResourceClick = () => {
    setOpen(true);
  };

  const prepareRevenueModalPayload = (payload) => {
    return {...payload, forecastingPeriodSummary: revenueModalPayload.forecastingPeriodSummary, forecastPoCDetails: revenueModalPayload.forecastPoCDetails};
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(projectForecastingDataLocalObject?.forecastingRoles, value?.id) ?
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
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASE){
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

  const handleClose = () => {
    setOpen(false);
    setModify(false);
    setDeleteResource(null);
    callBackHandler(resetAddResourceModal());
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
        effectiveDate: moment().format(DATE_FORMAT.FORMAT_8),
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
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED ){
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
      deleteResourceHandler(RESOURCE.DELETE_RESOURCE_BY_QUICK_ACTION, deleteResource?.resourceData?.userId);
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
    
    if(projectForecastingDataLocalObject?.billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED ){
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

  const handleChanges = (newRows, changes) => {
    if (changes?.length) {
      changes?.map(c => {
        const {payloadType, payloadSubType, id, key, value} = c?.newCell;
        if (c?.newCell.value !== c?.previousCell.value) {
          setRows(newRows);
          setUpdatedCells((v) => {
            const updated = {sourceId: id, key, value, payloadType, payloadSubType, timestamp: Date.now()};
            if (v.length) {
              const idx = v.findIndex(cell => cell.sourceId === updated.sourceId && cell.key === updated.key);
              if (idx !== -1) {
                v[idx] = updated;
              } else {
                v.push(updated);
              }
            } else {
              v.push(updated);
            }
            return [...v];
          });
        }
        setUpdatedProjectForecastingState(gridToPayload(c?.newCell, updatedProjectForecastingState));
      });
      setShowUpdateButton(true);
    }
  };

  const recalculateHandler = () => {
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload:projectForecastingDataLocalObject,
      actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN
    }));
  };

  const onSearchText = (text) => {
    setSearchText(text);
  };

  const onRoleActionClickHandler = ({ actionType, obj }) => {
    const isResource = obj?.resourceData ? true : false;
    if (actionType === QUICK_ROLE_ACTION.EDIT) {
      if (isResource) {
        callBackHandler( editResource(obj) );
        setModify(true);
        setOpen(true); 
      } else {
        setRoleToModify(obj);
        handleEditRoleModal();
      }
    };

    if (actionType === QUICK_ROLE_ACTION.DELETE) {
      if (isResource) {
        setDeleteResource(obj);
      } else {
        setDeleteRole(obj);
      };
      setConfirmationOpen(!footerConfirmationOpen);
    }
  };

  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      <CustomAlertBar
        alertType="error-plain-text"
        className="my-2"
      >
        <div className="d-flex align-items-center">
          <Info /> {ALLOCATION_TABLE_WARNING}
        </div>
      </CustomAlertBar>
      {forecastError && <DynamicAlertList alertList={forecastError}/>}
      <div className="d-flex justify-content-between align-items-center mb-2">   
        {((filteredRoles && filteredRoles.length >0) || searchText) &&(
          <OpportunitiesSearch
            label={OPPORTUNITY_SEARCH.LABEL}
            setSearchText={onSearchText}
          /> 
        )}        

        {!isCrmSelected && showUpdateButton && 
          <div className={`d-flex align-items-center ${!(updatedCells) && styles['btn-recalculate']}`} >
            <InfoTooltip
              infoContent={RECALCULATE.info}
            />
            <SnapButton
              className="tertiary-button"
              handleClick={recalculateHandler}
              label={RECALCULATE.LABEL}
              name={RECALCULATE.LABEL}
              type={FORM_LABELS.SUBMIT}
              variant={FORM_LABELS.CONTAINED}
            />
          </div>
        }
        
      </div>
      <div className={'resource-level-forecast-table default-scroll'}>
        <DataGridControl
          columns={columns}
          isCompactMode
          onCellsChanged={handleChanges}
          rows={rows}
          stickyTopRows={2}
        />
      </div> 
    
      {filteredRoles && filteredRoles.length === 0 && searchText && (
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
        forecastPeriodSummaryData={updatedProjectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary}
        handleClose={handleClose}
        handleDelete={onHandleDelete}
        handleSubmit={onHandleSubmit}
        modify={modify}
        onSearch={onSearch}
        onSelect={onResourceSelect}
        open={open}
        options={options}
        resourceModalError={updatedProjectForecastingState?.resourceModalError}
        selectedUser={projectForecastingState?.selectedUser}
      />

      {openRoleSelectionModal && (
        <RoleSelectionModal
          className={styles['modal-inside']}
          forecastingData={updatedProjectForecastingState?.projectForecastingDataLocalObject}
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

ManageResourceCostAllocationTable.propTypes = {
  callBackHandler: PropTypes.func,
  costUpdate: PropTypes.object,
  headerTabIndex:PropTypes.number,
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

export default withStyles(styles)(ManageResourceCostAllocationTable);
