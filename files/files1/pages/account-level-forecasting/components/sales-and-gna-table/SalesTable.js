import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DialogModal from '@revin-utils/components/dialog-modal';
import _cloneDeep from 'lodash/cloneDeep';
import withStyles from '@material-ui/core/styles/withStyles';
import { FORM_LABELS, TABLE_TYPES, getValuesFromSplitCellData, getTransformedNumber } from '@revin-utils/utils';
import PropTypes from 'prop-types';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import SnapButton from '@pnp-snap/snap-button';
import { BTN_LABELS, ORIGIN, RESOURCE, ROLE_ACTION, ROLE_SELECTION_LABELS, TOAST_MESSAGES_SUFFIX, RECALCULATE, MAX_NUMBER_LIMIT, ALERT_CONFIGURATION, TYPE } from 'utils/constants';
import { prepareAddResourcePayload, preparePayloadForRole } from 'components/pages/resource-level-forecasting/helper';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import { getOptionsListForUsers, updateSplitCellValue, validateDuplicateResource } from 'utils/forecastingCommonFunctions';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { buildResourcePlanData, buildResponseForSalesNGnaGrid, formatGridPayloadToAPIPayloadForSalesNGnA } from 'components/pages/account-level-forecasting/helper';
import { Maximize2, Minimize2 } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styles from './SalesTable.module.scss';

const SalesTable = ({
  forecastingState,
  callBackHandler,
  metaDataState,
  selectedTab,
  cleanPayloadForAPI,
  handleGridUpdate,
  viewOnlyPermission,
  isCollapseSummary,
  handleTableMaximizeEvent,
  tableMaximize
}) => {
  const {forecastingData ,userList, selectedUser, resourceModalError, closeRoleModal } = forecastingState;
  const [isOpenRoleModal, setIsOpenRoleModal] = useState(false);
  const [isOpenResourceModal, setIsOpenResourceModal] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [isResourceModify, setIsResourceModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const [deleteResource, setDeleteResource] = useState(null);
  const [deleteRole, setDeleteRole] = useState();
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [gridData , setGridData] = useState();
  const [isGridUpdate, setIsGridUpdate] = useState({
    Sales: false,
    GnA: false
  });
  const { accountForecastCandidateId } = useParams();

  useEffect(() => {
    if (forecastingState?.forecastingData) {
      const processedForecastData = buildResponseForSalesNGnaGrid(forecastingState?.forecastingData, selectedTab);
      setGridData(buildResourcePlanData(processedForecastData , selectedTab, viewOnlyPermission));
    }
  }, [selectedTab, forecastingState?.forecastingData]);

  useEffect(() => {
    if(closeRoleModal) {
      onCloseRoleModal();
    }
  }, [closeRoleModal]);

  const onOpenRoleModal = ()  => {
    setIsOpenRoleModal(true);
  };

  const onCloseRoleModal = ()  => {
    setIsRoleModify(false);
    setIsOpenRoleModal(false);
    setRoleToModify({});
  };

  const onOpenResourceModal = ()  => {
    setIsOpenResourceModal(true);
  };

  const onCloseResourceModal = ()  => {
    setIsOpenResourceModal(false);
    setIsResourceModify(false);
    setConfirmationOpen(false);
    callBackHandler({
      type: AccountForecastingActionType.EDIT_RESOURCE,
      payload:{
        clearItem: true
      }
    });
  };

  const handleSubmitRole = (data) => {
    const preparedPayload = preparePayloadForRole(data.values, forecastingData, data.actionType, selectedTab);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        accountForecastCandidateId,
        isNotLoading: true,
        payload: cleanPayloadForAPI(preparedPayload),
        message: `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${data.values?.extraFields?.roleDescription?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[data.actionType]}`,
        actionOrigin: ORIGIN.ROLE_MODAL_ORIGIN
      }});
    setDeleteRole(null);
    onCloseRoleModal();
  };

  const resourceOptions = useMemo(() => {
    const optionsList = getOptionsListForUsers(userList);
    return optionsList;
  }, [userList]);

  const handleResourceDelete = (resource) => {
    deleteResourceHandler(resource?.userId);
  };

  const handleResourceSubmit = (resource) => {
    const resourceDetails = prepareAddResourcePayload(resource, forecastingData, isResourceModify, selectedTab);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        accountForecastCandidateId,
        isNotLoading: true,
        payload: cleanPayloadForAPI(resourceDetails),
        message: `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${isResourceModify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`,
        actionType: isResourceModify ? RESOURCE.EDIT_ACTION : RESOURCE.ADD_RESOURCE
      }
    });
    onCloseResourceModal();
  };

  const onSearchResource = (value) => {
    if (value) {
      callBackHandler({
        type: AccountForecastingActionType.GET_RESOURCE_USERS,
        payload: {
          isNotLoading: true,
          searchTerm: value
        }
      });
    }
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(forecastingData?.rolePlan, value?.id, selectedTab) ?
        callBackHandler(
          {
            type: AccountForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
            payload: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR
          }
        )
        :
        callBackHandler({
          type: AccountForecastingActionType.GET_RESOURCE_USER,
          payload: {
            isNotLoading: true,
            userId: value?.id
          }
        });
    } else {
      callBackHandler({type: AccountForecastingActionType.RESET_RESOURCE_MODAL_ERROR});
    }
  };

  const handleEditRoleModal = () => {
    setIsOpenRoleModal(true);
    setIsRoleModify(true);
  };

  const handleQuickAction = ({action, headerItem}) => {
    const item = headerItem?.item;
    if (RESOURCE.EDIT_ACTION === action) {
      if (item?.resourceData?.firstName) {
        callBackHandler({
          type: AccountForecastingActionType.EDIT_RESOURCE,
          payload:{
            item,
            clearItem: false
          }
        });
        setIsResourceModify(true);
        setIsOpenResourceModal(true); 
      } else {
        setRoleToModify(item);
        handleEditRoleModal();
      }
    }
    if (RESOURCE.DELETE_ACTION === action) {
      if (item?.resourceData?.firstName) {
        setDeleteResource(item?.resourceData?.userId);
      } else {
        setDeleteRole(item);
      }
      setConfirmationOpen(!footerConfirmationOpen);
    }
  };

  const handleBackButtonClick = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmClick = () =>{
    if (deleteResource) {
      deleteResourceHandler(deleteResource);
    } 
    if (deleteRole) {
      const data = {values: {extraFields : {id: deleteRole?.id , roleDescription : deleteRole?.roleDescription }, roleForm: { orgRoleId: deleteRole?.orgRoleId}}, actionType: ROLE_ACTION.DELETE};
      handleSubmitRole(data);
    }
    handleBackButtonClick();
  };

  const deleteResourceHandler = (resourceUserId) => {
    const { rolePlan, accountForecastCandidateId } = forecastingData;
    const { resourceData } = rolePlan?.find(role => role?.resourceData?.userId === resourceUserId);
    const filteredResources = rolePlan?.filter(role => role?.resourceData?.userId !== resourceUserId);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        isNotLoading: true,
        accountForecastCandidateId,
        payload: { ...cleanPayloadForAPI(forecastingData), rolePlan : filteredResources },
        message: `${RESOURCE.RESOURCE_TEXT} ${resourceData?.firstName?.toUpperCase()} ${resourceData?.lastName?.toUpperCase()} (${resourceData?.employeeId}) ${TOAST_MESSAGES_SUFFIX.DELETE}`
      }
    });
    setDeleteResource(null);
    onCloseResourceModal();
  };

  const onGridChanged = (grid, changes) => {
    const splitCellEvent = typeof(changes[0]?.value) === 'object';
    if (splitCellEvent) {
      const payloadData = _cloneDeep(formatGridPayloadToAPIPayloadForSalesNGnA(forecastingState?.forecastingData, gridData.resourceData, selectedTab));
      changes.forEach(({cell,value}) => {
        const {planType, id, resourceId, topCellValue, bottomCellValue, additionalCellValue} = cell.cellDataObj;
        const splitCellArr = getValuesFromSplitCellData(value);
        const valueToUpdate = {
          [topCellValue]: getTransformedNumber(splitCellArr[0]),
          [bottomCellValue]: getTransformedNumber(splitCellArr[1]),
          [additionalCellValue]: getTransformedNumber(splitCellArr[2])
        };
        updateSplitCellValue(
          planType,
          id,
          resourceId,
          valueToUpdate,
          payloadData
        );
      });
      callBackHandler({
        type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE,
        payload: payloadData
      });
    } else {
      setGridData({...gridData, resourceData: grid});
      callBackHandler({
        type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE,
        payload: formatGridPayloadToAPIPayloadForSalesNGnA(forecastingState?.forecastingData, gridData.resourceData, selectedTab)
      });
    }
    setIsGridUpdate((prevState) => ({...prevState , [selectedTab]: true}));
    handleGridUpdate(true);
  };

  const onSplitGridChanged = (value, planType, id, resourceId, valueToUpdate) => {
    const payloadData = _cloneDeep(formatGridPayloadToAPIPayloadForSalesNGnA(forecastingState?.forecastingData, gridData.resourceData, selectedTab));
    const updatedResource = payloadData[planType].find((item) => item.id == resourceId);
    const updatedCell = updatedResource?.periodDetailsList?.find((periodDetail) => periodDetail.periodId === id);
    updatedCell[valueToUpdate] = value;
    setIsGridUpdate((prevState) => ({...prevState , [selectedTab]: false}));
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE,
      payload: payloadData
    });
  };

  const handleUpdateForecastData = () => {
    const response = formatGridPayloadToAPIPayloadForSalesNGnA(forecastingState?.forecastingData, gridData.resourceData, selectedTab);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        payload: cleanPayloadForAPI(response),
        accountForecastCandidateId,
        isNotLoading: true,
        dryRun: true
      }
    });
  };

  const handleTableMaximize = () => {
    handleTableMaximizeEvent();
  };

  const gridHeight = useMemo(() => {
    return tableMaximize ? isCollapseSummary ? 'calc(66vh - 1px)' : 'calc(57vh)' : isCollapseSummary ? 'calc(53vh + 3px)' : 'calc(36vh - 5px)';
  }, [tableMaximize, isCollapseSummary]); 

  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      <div className={`d-flex justify-content-end align-items-center mb-2 ${styles['button-wrapper']}`}>
        {isGridUpdate[selectedTab] && (
          <div className="d-flex align-items-center">
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
      {gridData && (
        <PerfectScrollbar
          className={'custom-scrollbar'}
          style={{height: gridHeight}}
        >
          <ForecastDataSheetControlWrapper
            disablePerfectScrollBar
            grid={gridData.resourceData}
            handleQuickAction={handleQuickAction}
            handleRoleSelectionModal={onOpenRoleModal}
            header={gridData?.headerData}
            limit
            limitRange={MAX_NUMBER_LIMIT}
            onGridChanged={onGridChanged}
            onSplitGridChanged={onSplitGridChanged}
            openResourceModal={onOpenResourceModal}
            parentHeaderColSpan={'1'}
            secondaryHeaders={gridData?.secondaryHeader}
            type={TABLE_TYPES.RESOURCE}
            viewOnlyPermission={viewOnlyPermission}
          /> 
        </PerfectScrollbar>
      )}

      {isOpenRoleModal && (
        <RoleSelectionModal
          forecastType={TYPE.ACCOUNT_FORECASTING}
          forecastingData={forecastingData}
          handleClose={onCloseRoleModal}
          handleSubmit={handleSubmitRole}
          locationRevisions={metaDataState?.locationRevisions}
          metaDataState={metaDataState}
          modify={isRoleModify}
          open={isOpenRoleModal}
          roleToModify={roleToModify}
          viewMode={viewOnlyPermission}
        />
      )}
      {isOpenResourceModal && (
        <ResourceModal
          forecastPeriodSummaryData={forecastingData?.forecastPeriodSummary}
          forecastType={TYPE.ACCOUNT_FORECASTING}
          handleClose={onCloseResourceModal}
          handleDelete={handleResourceDelete}
          handleSubmit={handleResourceSubmit}
          modify={isResourceModify}
          onSearch={onSearchResource}
          onSelect={onResourceSelect}
          open={isOpenResourceModal}
          options={resourceOptions}
          resourceModalError={resourceModalError}
          selectedUser={selectedUser}
          viewMode={viewOnlyPermission}
        />)
      }

      <DialogModal
        className={styles['confirmation-modal']}
        description={
          <div className="confirmation-modal-text">
            <p className="mb-2" />
            {deleteResource ? RESOURCE.DELETE_RESOURCE_MESSAGE : deleteRole ? ROLE_SELECTION_LABELS.DELETE_ROLE_CONFIRM_DESC : 'Back'}
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

SalesTable.propTypes = {
  callBackHandler: PropTypes.func,
  cleanPayloadForAPI: PropTypes.func,
  forecastingState: PropTypes.object,
  handleGridUpdate: PropTypes.func,
  handleTableMaximizeEvent:PropTypes.func,
  isCollapseSummary: PropTypes.bool,
  metaDataState: PropTypes.object,
  selectedTab: PropTypes.string,
  tableMaximize: PropTypes.bool,
  viewOnlyPermission:PropTypes.bool
};

export default withStyles(styles)(SalesTable);
