import React, { useState, useMemo, useEffect } from 'react';
import PropTypes from 'prop-types';
import Search from 'react-feather/dist/icons/search';
import PerfectScrollbar from 'react-perfect-scrollbar';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import SnapAutosuggest from '@pnp-snap/snap-autosuggest';
import SnapAvatar from '@pnp-snap/snap-avatar';
import SnapButton from '@pnp-snap/snap-button';
import SnapModal from '@pnp-snap/snap-modal';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { RVIcon } from '@revin-utils/assets';
import { FORM_LABELS, NOTIFICATION_TYPES, MODAL, useDebounce, TOOLTIP_POSITION } from '@revin-utils/utils';
import { mappedAddProjectInfo } from 'utils/helper';
import { ADD_OTHERS_PROJECT_MODAL, CANCEL, TIME_DELAY } from 'utils/constants';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import styles from './AddOtherProjectModal.module.scss';

const { iconMediumTwo } = variableStyle;

const AddOtherProjectModal = ({ open, handleClose, projectList, otherProjectListError, handleSubmit, handleChangeHandler, callBackHandler }) => {
  const [noOptionsText, setNoOptionsText] = useState(ADD_OTHERS_PROJECT_MODAL.SEARCH_PLACEHOLDER);
  const [selectedProject, setSelectedProject] = useState({});
  const [inputString, setInputString] = useState('');
  const [showAddButton, setShowAddButton] = useState(false);

  const options = useMemo(() => {
    if (projectList?.length) {
      const optionsList = (projectList || []).map(({ data }) => {
        const { projectCode = '', projectName = '' } = data;
        return {
          id: projectCode,
          content: `${projectName} ( ${projectCode} )`,
          label: `${projectName} ( ${projectCode} )`
        };
      });
      return optionsList;
    };
  }, [projectList]);

  useEffect(() => {
    if (otherProjectListError) {
      setNoOptionsText(otherProjectListError);
      setShowAddButton(false);
    };
  }, [otherProjectListError]);

  const resetAll = () => {
    setInputString('');
    setNoOptionsText(ADD_OTHERS_PROJECT_MODAL.SEARCH_PLACEHOLDER);
    setSelectedProject({});
    setShowAddButton(false);
    callBackHandler({
      type: OpportunitiesActionType.RESET_MODAL
    });
  };

  const onCloseHandler = () => {
    resetAll();
    handleClose();
  };

  const onSelect = (_, value) => {
    if (value) {
      const selectedProject = projectList?.find(({ data }) => data?.projectCode === value?.id);
      const mappedProjectInfo = mappedAddProjectInfo(selectedProject);
      setSelectedProject(mappedProjectInfo);
      setShowAddButton(!mappedProjectInfo?.error);
    } else {
      resetAll();
    }
  };

  const handleSubmitHandler = () => {
    const payloadData = projectList?.find(({ data }) => data?.projectCode === selectedProject?.projectCode);;
    handleSubmit(payloadData);
    resetAll();
  };

  useEffect(() => {
    if (inputString?.length > 2) {
      handleChangeHandler(inputString);
    }
  }, [inputString]);

  const debouncedOnchageHandler = useDebounce(
    (event) => setInputString(event.target.value?.trim()),
    TIME_DELAY.TIME_DELAY_1000
  );

  return (
    <>
      <SnapModal
        align={MODAL.MODAL_ALIGN}
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <div className="w-100 d-flex align-items-center justify-content-between">
            <SnapButton
              handleClick={onCloseHandler}
              label={CANCEL}
              name={CANCEL}
              type={FORM_LABELS.SUBMIT}
              variant={FORM_LABELS.OUTLINED}
            />
            {
              showAddButton &&
              <SnapButton
                handleClick={handleSubmitHandler}
                label={FORM_LABELS.ADD}
                name={FORM_LABELS.ADD}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            }
          </div>}
        fullWidth
        maxWidth={false}
        modalHeight={MODAL.MODAL_HEIGHT}
        modalTitle={ADD_OTHERS_PROJECT_MODAL.MODAL_TITLE}
        name={ADD_OTHERS_PROJECT_MODAL.MODAL_TITLE}
        onClose={onCloseHandler}
        open={open}
        scroll={MODAL.MODAL_SCROLL}
      >
        <PerfectScrollbar>

          {
            (selectedProject?.error) &&
            <CustomAlertBar alertType={NOTIFICATION_TYPES.ERROR}>
              <div className="d-flex align-items-center">
                <RVIcon
                  icon={NOTIFICATION_TYPES.WARNING}
                  size={iconMediumTwo}
                />
                {selectedProject?.error}
              </div>
            </CustomAlertBar>
          }

          <SnapAutosuggest
            handleChange={onSelect}
            handleTextChange={debouncedOnchageHandler}
            hideLabel
            icon={<Search />}
            itemPosition={TOOLTIP_POSITION.LEFT}
            noOptionsText={noOptionsText}
            options={options || []}
            placeholder={ADD_OTHERS_PROJECT_MODAL.SEARCH_LABEL}
          />

          {
            selectedProject?.isProjectInfoAvailable &&

            <div className={`mt-2 ${styles['project-info']}`}>
              <div className={styles.value}>
                <h4>{selectedProject?.projectName}</h4>
                <p>{ADD_OTHERS_PROJECT_MODAL.PROJECT_NAME_TEXT}</p>
              </div>

              <div className={styles['project-details']}>
                {selectedProject.details.map((detail, index) => (
                  <div
                    className={styles.value}
                    key={index}
                  >
                    <h4>{detail?.value}</h4>
                    <p>{detail?.label}</p>
                  </div>
                ))}
              </div>

              <div className={styles['project-dates']}>
                {selectedProject.dates.map((date, index) => (
                  <div
                    className={styles.value}
                    key={index}
                  >
                    <h4>{date?.value}</h4>
                    <p>{date?.label}</p>
                  </div>
                ))}
              </div>

              <div className={`mt-2 ${styles['project-managers-wrap']}`}>
                <p className={'mb-1'}>{ADD_OTHERS_PROJECT_MODAL.PROJECT_MANAGER}</p>
                <div className={styles['project-managers']}>
                  {selectedProject?.projectManagers?.map((manager, index) => (
                    <SnapAvatar
                      avatarSize={'small'}
                      firstName={manager?.firstName}
                      key={index}
                      lastName={manager?.lastName}
                      src={manager?.image}
                      textPosition={MODAL.MODAL_ALIGN}
                      variant={FORM_LABELS.CIRCLE}
                    />
                  ))}
                </div>
              </div>
            </div>
          }
        </PerfectScrollbar>
      </SnapModal>
    </>
  );
};

AddOtherProjectModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleChangeHandler: PropTypes.func,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  open: PropTypes.bool,
  otherProjectListError: PropTypes.any,
  projectList: PropTypes.array
};

export default AddOtherProjectModal;
