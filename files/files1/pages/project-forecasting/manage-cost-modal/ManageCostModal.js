import React, { useState, useEffect,useMemo } from 'react';
import PropTypes from 'prop-types';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import RadioButton from '@revin-utils/components/radio-button';
import { FORM_LABELS } from '@revin-utils/utils';
import EmptyScreen from '@revin-utils/components/empty-screen';
import CustomTab from '@revin-utils/components/custom-tab';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import  noFile from 'assets/images/no-file.svg';
import { updateProjectForecastingWithAPI, getUsers, getUser, resetAddResourceModal} from 'store/actions/ProjectForecasting';
import { CANCEL, PROJECT_FORECASTING,RESOURCE, TOAST_MESSAGES_SUFFIX, ROLE_SELECTION_LABELS, ORIGIN, ALERT_CONFIGURATION,EMPTY_SCREEN_MESSAGE_NO_DATA, TOGGLE_FILTER_HOVER, GRID_CONSTANTS, AD_HOC, NO_FILE_SCREEN_CONSTANTS} from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import { ManageCostCrmTable } from './components';
import addRole from 'assets/images/add-role.png';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import {prepareAddResourcePayload, preparePayloadForRole} from 'components/pages/resource-level-forecasting/helper';
import DynamicAlertList from 'components/common/dynamic-alert-list/DynamicAlertList';
import { getOptionsListForUsers, validateDuplicateResource } from 'utils/forecastingCommonFunctions';
import ManageResourceCostAllocationTable from './components/manage-cost-resource-allocation-table';
import ResourceModal from 'components/common/resource-modal/ResourceModal';
import RoleSelectionModal from 'components/common/role-selection/RoleSelectionModal';
import { initilizeAdjustmentRow } from 'components/pages/project-forecasting/helper';
import styles from './ManageCostModal.module.scss';

const ManageCostModal = ({
  open, 
  handleClose, 
  handleCancel,
  metaDataState,
  projectForecastingState,
  callBackHandler
}) => {
  const HeaderTabLabels = [
    { label: GRID_CONSTANTS.TABS.FTE_BILLABLE_HRS},
    { label: GRID_CONSTANTS.TABS.COST }
  ];
  const [crmMethod, setCrmMethod] = useState(true);
  const [headerTabIndex,setHeaderTabIndex]=useState(0);
  const [allocationMethod, setAllocationMethod] = useState(false);
  const [forecastingState, setForecastingState] = useState({});
  const {modalError}=projectForecastingState;
  const [openRoleSelectionModal, setOpenRoleSelectionModal] = useState(false);
  const [modelOpen, setModelOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [isRoleModify, setIsRoleModify] = useState(false);
  const [roleToModify, setRoleToModify] = useState({});
  const { userList } = projectForecastingState;
 
  useEffect(() => {
    setForecastingState(projectForecastingState);
  }, [projectForecastingState]);

  useEffect(() => {
    if (projectForecastingState?.projectForecastingDataLocalObject?.projectCostComputationMethod === PROJECT_FORECASTING.USER_ALLOCATION) {
      handleAllocationMethodClick();
    } else {
      handleCrmMethodClick();
    }
  }, [open]);

  
  const handleCrmMethodClick = () => {
    open && callBack(PROJECT_FORECASTING.CRM_PIP);
    setCrmMethod(true);
    setAllocationMethod(false);
  };

  const onHeaderTabClick = (_, tabIndex) => {
    setHeaderTabIndex(tabIndex);
  };

  const handleAllocationMethodClick = () => {
    open && callBack(PROJECT_FORECASTING.USER_ALLOCATION);
    setCrmMethod(false);
    setAllocationMethod(true);
  };

  const handleContinueClick = () => {
    handleContinue(crmMethod);
  };

  const callBack = (selectedTab) => {
    const projectForecastingData = projectForecastingState?.projectForecastingDataLocalObject;
    const forecastingPeriodSummary = initilizeAdjustmentRow(projectForecastingData?.forecastingPeriodSummary);  
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingData?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload: {...projectForecastingData, projectCostComputationMethod: selectedTab, forecastingPeriodSummary},
      actionOrigin:ORIGIN.COST_MODAL
    }));
  };

  const onHandleSubmit = (resource) => {
    let resourceDetails = prepareAddResourcePayload(resource,projectForecastingState?.projectForecastingDataLocalObject, modify);
    resourceDetails = {...resourceDetails, projectCostComputationMethod: crmMethod ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    callBackHandler(
      updateProjectForecastingWithAPI({
        isNotLoading: true,
        projectForecastCandidateId: projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
        payload: resourceDetails,
        message: `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${modify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`,
        actionType: modify ? RESOURCE.EDIT_ACTION : RESOURCE.ADD_RESOURCE
      })
    );
    handleCloseModal();
  };

  const handleAddUpdateDeleteRole = (data) => {
    let preparedPayload = preparePayloadForRole(data.values,projectForecastingState?.projectForecastingDataLocalObject, data.actionType);
    preparedPayload = {...preparedPayload, projectCostComputationMethod: crmMethod ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION };
    callBackHandler(updateProjectForecastingWithAPI({
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
      payload: preparedPayload,
      message: `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${data.values?.extraFields?.roleDescription?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[data.actionType]}`,
      actionOrigin: ORIGIN.ROLE_MODAL_ORIGIN
    }));
    handleCloseRoleSelectionModal();
  };

  const onResourceSelect = (_, value) => {
    if (value?.id) {
      validateDuplicateResource(projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles, value?.id) ?
        callBackHandler({
          type: ProjectForecastingActionType.ADD_UPDATE_RESOURCE_ERROR,
          payload: ALERT_CONFIGURATION.DEFAULT_DUPLICATE_ERROR
        }): callBackHandler(getUser({ isNotLoading: true, userId: value?.id }));
    } else {
      callBackHandler(resetAddResourceModal());
    }
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
  
  const handleAddRole =() =>{
    setOpenRoleSelectionModal(true);
  };

  const handleCloseRoleSelectionModal = () => {
    setOpenRoleSelectionModal(false);
    setIsRoleModify(false);
    setRoleToModify(null);
  };

  const handleCloseModal = () => {
    setModelOpen(false);
    setModify(false);
    callBackHandler(resetAddResourceModal());
  };

  const handleSecondaryButton = () =>{
    setModelOpen(true);
  };

  const handleContinue = (isCrmSelected) => {
    if(modalError){
      return;
    }
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingState?.projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload: { ...projectForecastingState?.projectForecastingDataLocalObject, projectCostComputationMethod: isCrmSelected ? PROJECT_FORECASTING.CRM_PIP : PROJECT_FORECASTING.USER_ALLOCATION },
      actionOrigin: ORIGIN.COST_MODAL,
      isContinueClicked: true
    }));

    handleClose();
  };

  return (
    <>
      <SnapModal
        align="center"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <SnapButton
                handleClick={handleCancel}
                label={CANCEL}
                name={CANCEL}
                type={FORM_LABELS.SUBMIT_ALT}
                variant={FORM_LABELS.OUTLINED}
              />
              <SnapButton
                disabled={modalError}
                handleClick={handleContinueClick}
                label={FORM_LABELS.CONTINUE}
                name={FORM_LABELS.CONTINUE}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          </>
        }
        fullScreen
        fullWidth
        modalHeight="auto"
        modalTitle={projectForecastingState?.projectForecastingData?.projectCostComputationMethod=== PROJECT_FORECASTING.USER_ALLOCATION ? PROJECT_FORECASTING.MANAGE_COST_ALLOCATION_LABEL: PROJECT_FORECASTING.MANAGE_COST_LABEL}
        name={PROJECT_FORECASTING.MANAGE_COST_LABEL}
        onClose={handleClose}
        open={open}
        scroll="paper"
        transitionDirection="up"
      >
        <div className={`px-4 py-2 ${styles['action-wrapper']}`}>
          {projectForecastingState?.projectForecastingData?.projectCostComputationMethod !== PROJECT_FORECASTING.USER_ALLOCATION   &&
          <div className="d-flex">
            <RadioButton
              checked={crmMethod}
              className="mr-2"
              id={ELEMENT_ID.CRM_RADIO_BTN}
              label={PROJECT_FORECASTING.CRM_PIP_LABEL}
              name="radioGroup"
              onChange={handleCrmMethodClick}
            />
            <RadioButton
              checked={allocationMethod}
              id={ELEMENT_ID.ALLOCATION_RADIO_BTN}
              label={PROJECT_FORECASTING.ALLOCATION}
              name={PROJECT_FORECASTING.ALLOCATION}
              onChange={handleAllocationMethodClick}
            />
          </div>  
          }
          {projectForecastingState?.modalError && <DynamicAlertList alertList={projectForecastingState?.modalError} />}
          {crmMethod && <h2 className={styles['table-title']}>{PROJECT_FORECASTING.CRM_TABLE_TITLE}</h2>}     
        </div>
        {!crmMethod &&  (projectForecastingState?.projectForecastingDataLocalObject?.forecastingRoles?.length > 0) && 
        <div className="resource-allocation-tab-wrapper px-4 py-2 d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center justify-content-center">
            <CustomTab
              className="small-tab"
              onChange={onHeaderTabClick}
              tabList={HeaderTabLabels}
              value={headerTabIndex}
            />
            <InfoTooltip infoContent={TOGGLE_FILTER_HOVER}/>
          </div>
          <div className="d-flex align-items-center justify-content-end">
            { (
              <div className="d-flex gap-2">
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
          </div>
        

        </div>}
        <div className={`px-4 py-2 ${styles['table-wrapper']}`}>       
          {crmMethod ? (
            projectForecastingState.projectForecastingDataLocalObject?.opportunityType === AD_HOC ? (
              <EmptyScreen
                className={styles['empty-screen']}
                image={noFile}
                subTitle={
                  <>
                    <p>{NO_FILE_SCREEN_CONSTANTS.SCREEN_SUBTITLE}</p>
                    <p>{NO_FILE_SCREEN_CONSTANTS.SCREEN_SECONDARY_TITLE}</p>
                  </>
                }
                title={NO_FILE_SCREEN_CONSTANTS.SCREEN_TITLE}
              />
            ) : (
              <ManageCostCrmTable projectForecastingState={forecastingState} />
            )
          ) : forecastingState?.projectForecastingDataLocalObject?.forecastingRoles?.length ? (
            <ManageResourceCostAllocationTable
              callBackHandler={callBackHandler}
              headerTabIndex={headerTabIndex}
              isCrmSelected={crmMethod}
              metaDataState={metaDataState}
              projectForecastingState={forecastingState}
            />
          ) : (
            <EmptyScreen
              center
              className="empty-add-role-resource"
              image={addRole}
              moreAction={
                <div className="d-flex align-items-center justify-content-between mt-2">
                  <SnapButton
                    className="primary-invert mx-1"
                    handleClick={handleAddRole}
                    label={EMPTY_SCREEN_MESSAGE_NO_DATA.ROLE}
                    variant={EMPTY_SCREEN_MESSAGE_NO_DATA.VARIENT}
                  />
                  <SnapButton
                    className="primary-invert mx-1"
                    handleClick={handleSecondaryButton}
                    label={EMPTY_SCREEN_MESSAGE_NO_DATA.LABEL}
                    variant={EMPTY_SCREEN_MESSAGE_NO_DATA.VARIENT}
                  />
                </div>
              }
              subTitle={EMPTY_SCREEN_MESSAGE_NO_DATA.SUBTITLE}
              title={EMPTY_SCREEN_MESSAGE_NO_DATA.TITLE}
            />
          )}

          {modelOpen &&(
            <ResourceModal
              className={styles['modal-inside']}
              forecastPeriodSummaryData={projectForecastingState?.projectForecastingDataLocalObject?.forecastingPeriodSummary}
              forecastingData={projectForecastingState?.projectForecastingDataLocalObject}
              handleClose={handleCloseModal}
              handleSubmit={onHandleSubmit}
              modify={modify}
              onSearch={onSearch}
              onSelect={onResourceSelect}
              open={modelOpen}
              options={options}
              resourceModalError={projectForecastingState?.resourceModalError}
              selectedUser={projectForecastingState?.selectedUser}
            />
          )}
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
        </div>
      </SnapModal>
    </>
  );
};

ManageCostModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleCancel:PropTypes.func,
  handleClose: PropTypes.func,
  handleContinue: PropTypes.func,
  handleOpen:PropTypes.func,
  handleSubmit: PropTypes.func,
  metaDataState: PropTypes.object,
  open: PropTypes.bool,
  projectForecastingState: PropTypes.object,
  showRevenueRow: PropTypes.bool
};

export default ManageCostModal;  
