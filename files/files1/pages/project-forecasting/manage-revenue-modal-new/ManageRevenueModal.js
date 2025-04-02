import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { FORM_LABELS } from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import RadioButton from '@revin-utils/components/radio-button';
import SnapButton from '@pnp-snap/snap-button';
import SnapModal from '@pnp-snap/snap-modal';
import { AD_HOC, BTN_LABELS, COST_REVENUE_TYPE, NO_FILE_SCREEN_CONSTANTS, ORIGIN, PROJECT_FORECASTING, RECALCULATE } from 'utils/constants';
import { updateProjectForecastingWithAPI } from 'store/actions/ProjectForecasting';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import EmptyScreen  from '@revin-utils/components/empty-screen';
import  noFile from 'assets/images/no-file.svg';
import DynamicAlertList from 'components/common/dynamic-alert-list/DynamicAlertList';
import MilestoneCrmTable from './crm-pip-method/MilestoneCrmTable';
import ExternalPocTable from './external-poc-method/ExternalPocTable';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './ManageRevenueModal.module.scss';

const ManageRevenueModal = ({ callBackHandler, open, projectForecastingState, setMilestoneRevenueModal, handleCloseModal }) => {
  const [crm, setCrm] = useState(false);
  const [externalPu, setExternalPu] = useState(false);
  const { modalError } = projectForecastingState;

  useEffect(() => {
    if(projectForecastingState.projectForecastingDataLocalObject?.projectRevenueComputationMethod === COST_REVENUE_TYPE.EXTERNAL_POC){
      setExternalPu(true);
      setCrm(false);
    }else{
      setCrm(true);
      setExternalPu(false);
    }
  }, [projectForecastingState.projectForecastingDataLocalObject?.projectRevenueComputationMethod]);

  const handleCrmPipClick = () => {
    setCrm(true);
    setExternalPu(false);
  };

  const handleExternalPu = () => {
    setCrm(false);
    setExternalPu(true);
  };

  const handleSubmitModal = () => {
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingState.projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload: projectForecastingState.projectForecastingDataLocalObject,
      actionOrigin: ORIGIN.FIXED_BID_MODAL,
      isContinueClicked: true
    }));

    setMilestoneRevenueModal(false);
  };

  const handleRecalculate = () => {
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastingState.projectForecastingDataLocalObject?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload: projectForecastingState.projectForecastingDataLocalObject,
      actionOrigin: ORIGIN.FIXED_BID_MODAL
    }));
  };

  return (
    <>
      <SnapModal
        align="center"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <div className="d-flex justify-content-between w-100">
            <div className={`d-flex justify-content-between ${styles['footer-split-action']}`}>
              <SnapButton
                handleClick={handleCloseModal}
                label={BTN_LABELS.CANCEL}
                name={BTN_LABELS.CANCEL}
                type="submit"
                variant="outlined"
              />
            </div>
            <div className={`w-100 d-flex justify-content-end ${styles['footer-common-action']}`}>
              <SnapButton
                disabled={modalError}
                handleClick={handleSubmitModal}
                label={BTN_LABELS.CONTINUE}
                name={BTN_LABELS.CONTINUE}
                type="submit"
              />
            </div>
          </div>
        }
        fullScreen
        fullWidth
        modalHeight="auto"
        modalTitle={PROJECT_FORECASTING.TITLE}
        onClose={handleCloseModal}
        open={open}
        scroll="paper"
        transitionDirection="up"
      >
        <div className={`d-flex h-100 ${styles['body-wrapper']}`}>
          <div className={`px-4 py-3 w-100 ${styles['main-column']}`}>
            <div className="d-flex gap-2">
              <RadioButton
                checked={crm}
                id={ELEMENT_ID.CRM_PIP_RADIO_BUTTON}
                label={PROJECT_FORECASTING.CRM_PIP_LABEL}
                name="radioGroup1"
                onChange={handleCrmPipClick}
              />
              <RadioButton
                checked={externalPu}
                id={ELEMENT_ID.EXTERNAL_POC_RADIO_BUTTON}
                label={COST_REVENUE_TYPE.EXTERNAL_POC_KEY}
                name="radioGroup1"
                onChange={handleExternalPu}
              />
            </div>
            {modalError && <DynamicAlertList alertList={modalError} />}

            {crm && (
              projectForecastingState.projectForecastingDataLocalObject?.opportunityType === AD_HOC ? (
                <EmptyScreen
                  className={styles['empty-screen']}
                  image={noFile}
                  subTitle ={
                    <>
                      <p>
                        {NO_FILE_SCREEN_CONSTANTS.SCREEN_SUBTITLE}
                      </p>
                      <p>{NO_FILE_SCREEN_CONSTANTS.SCREEN_SECONDARY_TITLE}</p>
                    </>
                  }
                  title={NO_FILE_SCREEN_CONSTANTS.SCREEN_TITLE}
                />
              ):(
                <>
                  <p className={styles['table-title']}>{PROJECT_FORECASTING.CRM_TABLE_TITLE}</p>
                  <MilestoneCrmTable
                    callBackHandler={callBackHandler}
                    projectForecastingState={projectForecastingState}
                  />
                </>
              )
            )}
            {externalPu && (
              <>
                <div style={{display: 'flex', justifyContent: 'space-between'}}>
                  <p className={styles['table-title']}>{PROJECT_FORECASTING.EXTERNAL_POC_TITLE}</p>
                  <div className="d-flex align-items-center">
                    <InfoTooltip
                      infoContent={RECALCULATE.info}
                    />
                    <SnapButton
                      className="tertiary-button"
                      handleClick={handleRecalculate}
                      label={RECALCULATE.LABEL}
                      name={RECALCULATE.LABEL}
                      type={FORM_LABELS.SUBMIT}
                      variant={FORM_LABELS.CONTAINED}
                    />
                  </div> 
                </div>
                <ExternalPocTable
                  callBackHandler={callBackHandler}
                  projectForecastingState={projectForecastingState}
                />
              </>
            )}
          </div>
        </div>
      </SnapModal>
    </>
  );
};

ManageRevenueModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleSubmit: PropTypes.func,
  open: PropTypes.bool,
  projectForecastingState: PropTypes.object,
  setMilestoneRevenueModal: PropTypes.func
};

export default ManageRevenueModal;
