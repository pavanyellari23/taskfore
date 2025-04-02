import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'react-feather';
import Divider from '@material-ui/core/Divider';
import moment from 'moment-mini';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  SnapModal,
  SnapButton,
  SnapTextbox,
  SnapAutosuggest
} from '@pnp-blox/snap';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import { RVIcon } from '@revin-utils/assets';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import CustomAccordion from '@revin-utils/components/custom-accordion';
import { useDebounce, TOOLTIP_POSITION, getSessionItem, preciseNumberFormatter, NOTIFICATION_TYPES, FORM_LABELS, MODAL } from '@revin-utils/utils';
import ConfirmationModal from '@revin-utils/components/confirmation-modal';
import { getAccountIdArray, getProgramArray } from 'utils/helper';
import { BTN_LABELS, CANCEL, TIME_DELAY, SESSION_STORAGE_KEYS, CUSTOM_GROUP_MODAL, OPPORTUNITY_SELECTION_ACCESS_ROLES, DIALOG_MODAL_CONFIG, MODAL_TYPE, CONFIRMATION_MODAL_TITLE, PARENT_ACCOUNT_MANAGER, DATE_FORMAT, DASH } from 'utils/constants';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { deleteCustomGroupAction } from 'store/actions/Opportunities';
import { AvatarGroup } from 'components/common';
import styles from './CreateGroupModal.module.scss';

const { iconMediumTwo, iconSmallTwo } = variableStyle;

const CreateGroupModal = ({ open, handleClose, handleCreate, isModify, callBackHandler, metaData, customGroupProjectsList, selectedCustomGroupId, opportunities, handleUpdate, customGroupMembers, isFromCustomGpPage }) => {

  const [groupName, setGroupName] = useState('');
  const [errors, setErrors] = useState({
    groupName: false,
    projectId: false
  });
  const [isCreateBtnDisabled, setIsCreateBtnDisabled] = useState(false);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [projectsList, setProjectsList] = useState([]);
  const [projectInputVal, setProjectInputVal] = useState('');
  const [noOptionsText, setNoOptionsText] = useState(CUSTOM_GROUP_MODAL.SEARCH_NO_OPTIONS_TEXT);
  const [accordianOpen, setAccordianOpen] = useState([]);
  const [errorMsgs, setErrorMsgs] = useState([]);
  const [showDismissMsg, setShowDismissMsg] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [showUpdateBtn, setIsShowUpdateBtn] = useState(false);
  const [showPMAccessMsg, setShowPMAccessMsg] = useState(false);
  const [managerPermissionItem, setManagerPermissionItem] = useState(null);
  const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState(true);
  const [projectInputDisplayValue, setProjectInputDisplayValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (customGroupProjectsList?.length > 0) {
      const tempList = customGroupProjectsList.map((item) => {
        return {
          id: item.data.accountForecastCandidateId,
          content: `${item.data.projectName} ( ${item.data.projectCode} )`,
          label: `${item.data.projectName} ( ${item.data.projectCode} )`,
          error: item.error,
          data: item.data
        };
      });
      setProjectsList(tempList);
    } else {
      setProjectsList([]);
    }
  }, [customGroupProjectsList]);

  useEffect(() => {
    if (opportunities?.customGroupProjectsListError) {
      setNoOptionsText(opportunities.customGroupProjectsListError);
    }
  },[opportunities?.customGroupProjectsListError]);

  useEffect(() => {
    if (selectedCustomGroupId && !isFromCustomGpPage) {
      callBackHandler({
        type: OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES,
        payload: {
          groupId: selectedCustomGroupId,
          pageNumber: 0
        }
      });
    }
    setProjectsList([]);
    const customGroupInfo = getSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION);
    if (customGroupInfo && isFromCustomGpPage && selectedCustomGroupId) {
      setGroupName(customGroupInfo.data?.groupInfo?.groupName ?? '');
    } else if (opportunities?.forecast_candidates?.forecastCandidates) {
      setGroupName(opportunities?.forecast_candidates?.forecastCandidates?.find(item => item.id === selectedCustomGroupId)?.groupInfo?.groupName);
    }
  }, [selectedCustomGroupId]);

  useEffect(() => {
    if (opportunities?.custom_grouped_candidates?.groupMembers?.length && !isFromCustomGpPage && selectedCustomGroupId) {
      setSelectedProjects(opportunities.custom_grouped_candidates.groupMembers.map(item => ({
        ...item,
        isNonEditable: true
      })));
    } else if (customGroupMembers?.length) {
      setSelectedProjects(customGroupMembers.map(item => ({
        ...item,
        isNonEditable: true
      })));
    }
  }, [opportunities?.custom_grouped_candidates?.groupMembers, customGroupMembers]);

  useEffect(() => {
    if (projectInputVal?.length > 2) {
      handleProjectInputChange(projectInputVal);
    }
  }, [projectInputVal]);

  useEffect(() => {
    if (errorMsgs?.length || !selectedProjects?.length || !groupName?.length || errors.groupName) {
      setIsCreateBtnDisabled(true);
    } else {
      setIsCreateBtnDisabled(false);
    }
  }, [errorMsgs, groupName, selectedProjects, errors.groupName]);

  useEffect(() => {
    if (isModify) {
      setIsShowUpdateBtn(true);
      setIsUpdateBtnDisabled(true);
    };
  }, [isModify]);

  useEffect(() => {
    if (errorMsgs?.length || !groupName?.length || errors.groupName) {
      setIsUpdateBtnDisabled(true);
    }
  },[errorMsgs, groupName, errors.groupName]);

  const handleProjectInputChange = (projectInputVal) => {
    const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
    const salesStages = foreCastFilterConditions?.salesStages?.length ? foreCastFilterConditions?.salesStages?.map(item => item.id) : [];
    const projectSources = foreCastFilterConditions?.projectSources?.length ? foreCastFilterConditions?.projectSources?.map(item => item.id) : [];
    const deliveryTypesIds = foreCastFilterConditions?.deliveryTypesIds?.length ? foreCastFilterConditions?.deliveryTypesIds?.map(item => item.id) : [];
    const tempPayload = {
      accountForecastCandidateId: getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id,
      searchTerm: projectInputVal,
      parentAccountId: getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId,
      includeSignedContracts: true,
      includeSummaryInformation: false,
      includeGroups: false,
      salesStages,
      projectSources,
      deliveryTypesIds,
      includeCompletedProjects: true,
      forecastEntitlement: {
        forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
      }
    };
    const program = foreCastFilterConditions?.selectedPrograms;
    tempPayload.accountIds = getAccountIdArray(foreCastFilterConditions?.selectedAccounts, metaData.accounts);
    tempPayload.programIds = getProgramArray(program, metaData.programs);
    tempPayload.billingTypesIds = foreCastFilterConditions?.billingTypesIds?.length ? foreCastFilterConditions?.billingTypesIds?.map(item => item.id) : [];
    tempPayload.projectManagerIds = foreCastFilterConditions?.projectManagerIds?.length ? foreCastFilterConditions?.projectManagerIds?.map(item => item.id) : [];
    callBackHandler({
      type: OpportunitiesActionType.GET_CUSTOM_GROUP_PROJECTS_LIST,
      payload: tempPayload
    });
  };

  const handleGroupNameChange = (event) => {
    const inputVal = event.target.value;
    if (inputVal?.length > 30) {
      setErrors((prevState) => ({
        ...prevState,
        groupName: true
      }));
      setIsCreateBtnDisabled(true);
    } else {
      setErrors((prevState) => ({
        ...prevState,
        groupName: false
      }));
      setIsCreateBtnDisabled(false);
      inputVal?.length !== 0 && setIsUpdateBtnDisabled(false);
    }
    setGroupName(event.target.value);
  };

  const onProjectIdSelect = (e, selectedItem) => {
    if (selectedItem?.error?.errors?.length) {
      const tempErrList = [];
      selectedItem.error.errors.forEach((err) => {
        tempErrList.push(err.detail);
      });
      setErrorMsgs(tempErrList);
      setProjectInputDisplayValue(`${selectedItem.data.projectName} ${selectedItem.data.projectCode}`);
    } else if (!!selectedItem && selectedProjects.length > 0) {
      const forecastEntitlementView = getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
      setProjectInputDisplayValue(`${selectedItem.data.projectName} ${selectedItem.data.projectCode}`);
      if (selectedItem?.data?.billingType?.toLowerCase() !== selectedProjects[0]?.billingType?.toLowerCase()) {
        setErrorMsgs([CUSTOM_GROUP_MODAL.BILLING_TYPE_ERROR]);
      } else if ((forecastEntitlementView === OPPORTUNITY_SELECTION_ACCESS_ROLES[1] || forecastEntitlementView === OPPORTUNITY_SELECTION_ACCESS_ROLES[2]) && checkIfProjectMangersNotEqual(selectedItem, selectedProjects)) {
        setErrorMsgs([CUSTOM_GROUP_MODAL.PROJECT_MANAGER_MISMATCH_ERROR]);
      } else if (selectedItem?.data?.accountId !== selectedProjects[0]?.accountId) {
        setErrorMsgs([CUSTOM_GROUP_MODAL.ACCOUNT_MISMATCH_ERROR]);
      } else if (selectedItem?.data?.programId !== selectedProjects[0]?.programId) {
        setErrorMsgs([CUSTOM_GROUP_MODAL.PROGRAM_MISMATCH_ERROR]);
      } else if ((forecastEntitlementView === OPPORTUNITY_SELECTION_ACCESS_ROLES[0] || forecastEntitlementView === OPPORTUNITY_SELECTION_ACCESS_ROLES[3] || forecastEntitlementView === OPPORTUNITY_SELECTION_ACCESS_ROLES[4] || PARENT_ACCOUNT_MANAGER.includes(forecastEntitlementView)) && checkIfProjectMangersNotEqual(selectedItem, selectedProjects)) {
        setShowPMAccessMsg(true);
        setManagerPermissionItem(selectedItem);
      } else if (selectedProjects.find(item => item.id === selectedItem.data?.id)) {
        setErrorMsgs([CUSTOM_GROUP_MODAL.ITEM_ADDED_ERROR_MSG]);
      } else {
        setErrorMsgs('');
        !!selectedItem && setSelectedProjects([...selectedProjects, selectedItem.data]);
        if (isModify) {
          setIsUpdateBtnDisabled(false);
        }
        setProjectInputDisplayValue('');
        triggerInputBlur();
      }
    } else {
      setErrorMsgs('');
      !!selectedItem && setSelectedProjects([...selectedProjects, selectedItem.data]);
      setProjectInputDisplayValue('');
      if (isModify) {
        setIsUpdateBtnDisabled(false);
      }
      triggerInputBlur();
    }
  };

  const triggerInputBlur = () => {
    if (inputRef.current) {
      const inputElement = inputRef.current.querySelector('input');
      if (inputElement) {
        inputElement.blur();
      }
    }
  };

  const checkIfProjectMangersNotEqual = (selectedItem, selectedProjects) => {
    if (selectedItem?.data?.projectManagerDetailsDTOList?.length !== selectedProjects[0]?.projectManagerDetailsDTOList?.length) {
      return true;
    }
    for (const item of selectedItem.data?.projectManagerDetailsDTOList || []) {
      const isFound = selectedProjects[0]?.projectManagerDetailsDTOList?.find(i => i.projectManagerId === item.projectManagerId);
      if (!isFound) return true;
    }
    return false;
  };

  const debouncedOnchageHandler = useDebounce(
    (event) => setProjectInputVal(event.target.value?.trim()),
    TIME_DELAY.TIME_DELAY_1000
  );


  const buildAvatarArray = (data) => {
    return data?.projectManagerDetailsDTOList?.map((mitem) => ({
      firstName: mitem?.projectManagerName,
      src: mitem?.projectManagerAvatar,
      id: mitem?.projectManagerId
    }));
  };

  const handleAccordianOpen = (event, id) => {
    event.preventDefault();
    setAccordianOpen((prevState) => ({
      ...prevState,
      [id]: true
    }));
  };

  const closeIconClick = (item) => {
    setSelectedProjects(selectedProjects?.filter(project => project.id !== item.id));
  };

  const getYear = () => {
    return opportunities?.forecast_candidates?.currentFinancialYear ? String(opportunities?.forecast_candidates?.currentFinancialYear).slice(-2) : '';
  };

  const accordianComponent = (item, closeIconClick) => {
    return (
      (<div
        className={styles['accordion-wrapper']}
        key={item.id}
      >
        <CustomAccordion
          accordKey={'accordion-one'}
          bodyContent={
            <>
              <div className={`text-ellipsis ${styles['card-wrap']}`}>
                <div className={styles['title-wrap']}>
                  <div
                    className={`text-ellipsis ${styles.title}`}
                    title="7,532,365"
                  >{preciseNumberFormatter(item?.financialYearMRRTotal)}</div>
                  <div className={styles['sub-title']}>{`${CUSTOM_GROUP_MODAL.UNWEIGHTED_MRR_LABEL} (FY${getYear()})`}</div>
                </div>
                <div className={styles['title-wrap']}>
                  <div className={styles.title}>{preciseNumberFormatter(item?.totalContractValue ?? 0)}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.TCV_LABEL}</div>
                </div>
                <div className={styles['title-wrap']}>
                  <div className={styles.title}>{`${item?.probabilityOverride ?? 0}%`}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.PROBABILITY_LABEL}</div>
                </div>
              </div>
              <div className={`text-ellipsis ${styles['card-wrap']}`}>
                <div className={styles['title-wrap']}>
                  <div
                    className={`text-ellipsis ${styles.title}`}
                    title={item.deliveryType}
                  >{item.deliveryType}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.DELIVERY_TYPE_LABEL}</div>
                </div>
                <div className={styles['title-wrap']}>
                  <div className={styles.title}>{item.billingType}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.BILLING_TYPE_LABEL}</div>
                </div>
                <div className="d-flex">
                  {buildAvatarArray(item) &&
                    <AvatarGroup
                      avatarData={buildAvatarArray(item)}
                      maxAvatarsToShow="3"
                    />
                  }
                </div>
              </div>
              <div className={`text-ellipsis ${styles['card-wrap']}`}>
                <div className={styles['title-wrap']}>
                  <div
                    className={`text-ellipsis ${styles.title}`}
                    title={item.opportunityStage}
                  >{item.opportunityStage}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.SALES_STAGE_LABEL}</div>
                </div>
              </div>
            </>
          }
          handleAccordianChange={(e) => handleAccordianOpen(e, item.id)}
          headContent={
            <div className="d-flex align-items-center w-100">
              <div className={`text-ellipsis ${styles['card-wrap']}`}>
                <div className={styles['title-wrap']}>
                  <div
                    className={`text-ellipsis ${styles.title}`}
                    title={item.projectName}
                  >{item.projectName}</div>
                  <div className={styles['sub-title']}>{item.projectCode}</div>
                </div>
                <div className={styles['title-wrap']}>
                  <div className={styles.title}>{item?.projectStartDate ? moment(item?.projectStartDate).format(DATE_FORMAT.FORMAT_9) : DASH}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.START_DATE}</div>
                </div>
                <div className={styles['title-wrap']}>
                  <div className={styles.title}>{item.projectEndDate ? moment(item.projectEndDate).format(DATE_FORMAT.FORMAT_9): DASH}</div>
                  <div className={styles['sub-title']}>{CUSTOM_GROUP_MODAL.END_DATE}</div>
                </div>
              </div>
              {!item.isNonEditable && <X
                className={styles['close-btn']}
                onClick={() => closeIconClick(item)}
              />}
            </div>
          }
          icon={
            <RVIcon
              icon="more"
              size={iconSmallTwo}

            />
          }
          isAccordianOpen={accordianOpen.id}
          isIconEnabled
        />
      </div>)
    );
  };

  const handleGroupCreate = () => {
    handleCreate(selectedProjects, groupName);
    handleCloseClick();
  };

  const handleConfirmDelete = () => {
    setDeleteModal(true);
  };

  const toggleDeleteModal = () => {
    setDeleteModal(prevProps => !prevProps);
  };

  const handleConfirmDeleteCustomGroup = () => {
    callBackHandler(deleteCustomGroupAction({
      groupId: selectedCustomGroupId
    }));
    toggleDeleteModal();
    handleClose();
  };

  const dismissClick = () => {
    setShowDismissMsg(false);
  };

  const handleCloseClick = () => {
    setGroupName('');
    setSelectedProjects([]);
    setProjectsList([]);
    setErrorMsgs([]);
    handleClose();
    setNoOptionsText(CUSTOM_GROUP_MODAL.SEARCH_NO_OPTIONS_TEXT);
    setTimeout(() => {
      setShowDismissMsg(true);
    }, 500);
  };

  const handleUpdateClick = () => {
    handleUpdate(selectedProjects, groupName, selectedCustomGroupId);
    handleCloseClick();
  };

  const toggleManagerPermissionModal = () => {
    setShowPMAccessMsg(prevProps => !prevProps);
  };

  const handleConfirmManagerPermission = () => {
    setErrorMsgs('');
    !!managerPermissionItem && setSelectedProjects([...selectedProjects, managerPermissionItem.data]);
    if (isModify) {
      setIsUpdateBtnDisabled(false);
    }
    toggleManagerPermissionModal();
    setManagerPermissionItem(null);
  };

  const showAlertBar = (message, onDismiss) => (
    <CustomAlertBar alertType={NOTIFICATION_TYPES.ERROR}>
      <div className="d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <RVIcon
            icon="warning"
            size={iconMediumTwo}
          />
          {message}
        </div>
        {onDismiss && (
          <div
            className="primary-link"
            onClick={onDismiss}
          >
            {CUSTOM_GROUP_MODAL.DISMISS}
          </div>
        )}
      </div>
    </CustomAlertBar>
  );

  const handleBlur = () => {
    errorMsgs?.length === 0 && setProjectInputDisplayValue(''); 
  };

  return (
    <SnapModal
      align="right"
      className={`main-modal ${styles.wrapper}`}
      disableBackdropClick
      dividers
      footerActions={
        <div className="w-100 d-flex align-items-center justify-content-between">
          <SnapButton
            handleClick={handleCloseClick}
            label={BTN_LABELS.CANCEL}
            name={BTN_LABELS.CANCEL}
            type={BTN_LABELS.SUBMIT}
            variant={FORM_LABELS.OUTLINED}
          />
          {isModify ? (
            <div className={styles['group-modal-btns-wrap']}>
              <SnapButton
                className="error-button"
                handleClick={handleConfirmDelete}
                label={BTN_LABELS.UNGROUP}
                name={BTN_LABELS.UNGROUP}
                type={BTN_LABELS.SUBMIT}
                variant={FORM_LABELS.OUTLINED}
              />
              {showUpdateBtn &&
                  <SnapButton
                    disabled={isUpdateBtnDisabled}
                    handleClick={handleUpdateClick}
                    label={BTN_LABELS.UPDATE}
                    name={BTN_LABELS.UPDATE}
                    type={BTN_LABELS.SUBMIT}
                    variant={FORM_LABELS.CONTAINED}
                  />
              }
            </div>
          ) : (
            <SnapButton
              disabled={isCreateBtnDisabled}
              handleClick={handleGroupCreate}
              label={BTN_LABELS.CREATE}
              name={BTN_LABELS.CREATE}
              type={BTN_LABELS.SUBMIT}
              variant={FORM_LABELS.CONTAINED}
            />
          )}
        </div>
      }
      fullWidth
      maxWidth={false}
      modalHeight={MODAL.MODAL_HEIGHT}
      modalTitle={isModify ? CUSTOM_GROUP_MODAL.MODIFY_GROUP : CUSTOM_GROUP_MODAL.CREATE_GROUP}
      name={CUSTOM_GROUP_MODAL.CREATE_GROUP}
      onClose={handleCloseClick}
      open={open}
      scroll={MODAL.MODAL_SCROLL}
    >
      <PerfectScrollbar>
        {showDismissMsg && showAlertBar(CUSTOM_GROUP_MODAL.DELETE_INFO_MSG, dismissClick)}
        {errors.groupName && showAlertBar(CUSTOM_GROUP_MODAL.GROUP_NAME_ERROR)}
        {!!errorMsgs.length && (
          <CustomAlertBar
            alertType="error"
            className={styles['alert-bar-error']}
          >
            {errorMsgs.map((error, index) => (
              <div
                className="d-flex align-items-center justify-content-between"
                key={index}
              >
                <div className="d-flex align-items-center">
                  <RVIcon
                    icon="warning"
                    size={iconMediumTwo}
                  />
                  {error}
                </div>
              </div>
            ))}
          </CustomAlertBar>
        )}

        <SnapTextbox
          className="mb-2"
          error={errors.groupName}
          handleChange={handleGroupNameChange}
          label={CUSTOM_GROUP_MODAL.GROUP_NAME}
          rows={1}
          type={FORM_LABELS.OUTLINED}
          value={groupName}
        />
        <SnapAutosuggest
          className="mb-2"
          error={errorMsgs?.length > 0}
          handleChange={onProjectIdSelect}
          handleTextChange={debouncedOnchageHandler}
          hideLabel
          icon={<Search />}
          inputRef={inputRef}
          inputValue={projectInputDisplayValue}
          itemPosition={TOOLTIP_POSITION.LEFT}
          name={CUSTOM_GROUP_MODAL.SEARCH_TEXT}
          noOptionsText={noOptionsText}
          onBlur={handleBlur}
          onInputChange={(event, newInputValue) => {
            const selectedOption = projectsList?.find(project => project?.label === newInputValue);
            if (selectedOption?.data?.id && selectedProjects.some(project => project.id === selectedOption.data.id) && errorMsgs?.length === 0) {
              setProjectInputDisplayValue('');
            } else {
              setProjectInputDisplayValue(newInputValue);
            }
          }}
          options={projectsList}
          placeholder={CUSTOM_GROUP_MODAL.SEARCH_TEXT}
        />
        {selectedProjects?.length > 0 ?
          <div className={styles.heading}>{CUSTOM_GROUP_MODAL.ADDED_CANDIDATES}</div> : null}
        {selectedProjects?.map((item) =>
          (accordianComponent(item, closeIconClick))
        )}
      </PerfectScrollbar>

      {deleteModal &&
          <ConfirmationModal className={styles['custom-group-modal']}>
            <div className={styles['confirmation-message']}>
              <span className={styles['rounded-icon']}>
                <RVIcon
                  icon="info"
                />
              </span>
              <div className={styles['confirmation-title']}>{CUSTOM_GROUP_MODAL.DELETE_MODAL_TITLE}</div>
              <p className={styles['confirmation-desc']}>{DIALOG_MODAL_CONFIG(null, null, MODAL_TYPE.DELETE_CUSTOM_GROUP)?.description}</p>
              <Divider
                className="my-4"
                variant="fullWidth"
              />
              <div className="mt-5">
                <SnapButton
                  className="mx-1"
                  handleClick={toggleDeleteModal}
                  label={CANCEL}
                  name={CANCEL}
                  type={FORM_LABELS.SUBMIT_ALT}
                  variant={FORM_LABELS.OUTLINED}
                />
                <SnapButton
                  className="mx-1"
                  handleClick={handleConfirmDeleteCustomGroup}
                  label={BTN_LABELS.CONFIRM}
                  name={BTN_LABELS.CONFIRM}
                  type={FORM_LABELS.SUBMIT_ALT}
                  variant={FORM_LABELS.CONTAINED}
                />
              </div>
            </div>
          </ConfirmationModal>
      }

      {showPMAccessMsg &&
          <ConfirmationModal className={styles['custom-group-modal']}>
            <div className={styles['confirmation-message']}>
              <span className={styles['rounded-icon']}>
                <RVIcon
                  icon="info"
                />
              </span>
              <div className={styles['confirmation-title']}>{CONFIRMATION_MODAL_TITLE}</div>
              <p className={styles['confirmation-desc']}>{CUSTOM_GROUP_MODAL.CUTSOM_GROUP_MANAGER_PERMISSION_MSG}</p>
              <Divider
                className="my-4"
                variant="fullWidth"
              />
              <div className="mt-5">
                <SnapButton
                  className="mx-1"
                  handleClick={toggleManagerPermissionModal}
                  label={CANCEL}
                  name={CANCEL}
                  type={FORM_LABELS.SUBMIT_ALT}
                  variant={FORM_LABELS.OUTLINED}
                />
                <SnapButton
                  className="mx-1"
                  handleClick={handleConfirmManagerPermission}
                  label={BTN_LABELS.CONFIRM}
                  name={BTN_LABELS.CONFIRM}
                  type={FORM_LABELS.SUBMIT_ALT}
                  variant={FORM_LABELS.CONTAINED}
                />
              </div>
            </div>
          </ConfirmationModal>
      }
    </SnapModal>
  );
};

CreateGroupModal.propTypes = {
  callBackHandler: PropTypes.func,
  customGroupMembers: PropTypes.array,
  customGroupProjectsList: PropTypes.array,
  handleClose: PropTypes.any,
  handleCreate: PropTypes.func,
  handleUpdate: PropTypes.func,
  isFromCustomGpPage: PropTypes.bool,
  isModify: PropTypes.bool,
  metaData: PropTypes.object,
  open: PropTypes.any,
  opportunities: PropTypes.any,
  selectedCustomGroupId: PropTypes.any
};

export default CreateGroupModal;
