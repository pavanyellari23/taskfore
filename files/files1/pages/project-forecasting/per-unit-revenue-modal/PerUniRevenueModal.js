import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import RadioButton from '@revin-utils/components/radio-button';
import { FORM_LABELS } from '@revin-utils/utils';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import SnapButton from '@pnp-snap/snap-button';
import SnapModal from '@pnp-snap/snap-modal';
import EmptyScreen  from '@revin-utils/components/empty-screen';
import  noFile from 'assets/images/no-file.svg';
import { AD_HOC, BTN_LABELS, COLUMN_TYPE, COST_REVENUE_TYPE, DROPDOWN_TYPE, NO_FILE_SCREEN_CONSTANTS, ORIGIN, PROJECT_FORECASTING, RECALCULATE, REVENUE_ALERT_LIST, UNIT_TYPES } from 'utils/constants';
import DataSheetTableWrapper from './data-sheet-table-wrapper';
import { ELEMENT_ID } from 'utils/test-ids';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import DynamicTable from '../../../common/dynamic-table/DynamicTable';
import { buildCrmTableData, buildExternalPerUnitTable, buildPerUnitList, buildPerUnitTableData, generateDynamicTableData, validatePerUnitLimits, validatePerUnitTableData } from './helper';
import { formatForecastingPeriodSummary } from 'utils/forecastingCommonFunctions';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { initilizeAdjustmentRow } from 'components/pages/project-forecasting/helper';
import styles from './PerUnitRevenueModal.module.scss';

const PerUnitRevenueModal = ({
  callBackHandler, 
  handleClose, 
  handleCancel,
  open, 
  projectForecastingState
}) => {
  const {projectForecastingDataLocalObject } = projectForecastingState;
  const { forecastPerUnitList } = projectForecastingDataLocalObject;
  const [isCrm, setIsCrm] = useState(true);
  const [isPerUnit, setIsPerUnit] = useState(false);
  const [isExternalPu, setExternalPu] = useState(false);
  const [externalPuTableData, setExternalPuTableData] = useState({});
  const [isIncremental, setIsIncremental] = useState(true);
  const [incrementalTable, setIncrementalTable] = useState(false);
  const [showUpdateButton, setShowUpdateButton] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState('');
  const [perUnitTableData, setPerUnitTableData] = useState({});
  const [crmTableData, setCrmTableData] = useState({});
  const [dynamicTableData, setDynamicTableData] = useState([]);
  const [alertList, setAlertList] = useState([]);
  const headers = [
    PROJECT_FORECASTING.LOWER_LIMIT,
    PROJECT_FORECASTING.UPPER_LIMIT,
    PROJECT_FORECASTING.RATE_UNIT
  ];

  document.addEventListener("DOMContentLoaded", function () {
    const gridContainer = document.querySelector(".data-grid-container");
  
    let lastScrollLeft = gridContainer.scrollLeft;
  
    // Save Scroll Position
    gridContainer.addEventListener("scroll", () => {
      lastScrollLeft = gridContainer.scrollLeft;
    });
  
    // Restore Scroll Position on Cell Focus
    gridContainer.addEventListener("focusin", () => {
      gridContainer.scrollLeft = lastScrollLeft;
    });
  });
  

  const initialDynamicData = [['', '', '']];

  useEffect(() => {
    const { projectRevenueComputationMethod } = projectForecastingDataLocalObject || {};    
    if (projectRevenueComputationMethod === COST_REVENUE_TYPE.PER_UNIT) {
      fetchPerUnitDataCallBackHandler();
    }else if(projectRevenueComputationMethod ===  COST_REVENUE_TYPE.EXTERNAL_PER_UNIT) {
      fetchExternalPerUnitDataCallBackHandler();
    }else {
      fetchCrmPipDataCallBackHandler();
    }
  }, []);

  useEffect(() => {
    const { projectRevenueComputationMethod } = projectForecastingDataLocalObject || {};    
    if (projectRevenueComputationMethod === COST_REVENUE_TYPE.PER_UNIT) {
      setIsPerUnit(true);
      setExternalPu(false);
      setIsCrm(false);
      const forecastedUnit = forecastPerUnitList?.[0]?.perUnitType;
      if (forecastedUnit) {
        unitSelection(forecastedUnit);
      } 
    } else if(projectRevenueComputationMethod === COST_REVENUE_TYPE.EXTERNAL_PER_UNIT){
      setIsPerUnit(false);
      setExternalPu(true);
      setIsCrm(false);
      const data= buildExternalPerUnitTable(projectForecastingDataLocalObject);
      setExternalPuTableData(data);
    } 
    else {
      setIsCrm(true);
      setIsPerUnit(false);
      setExternalPu(false);
      const data = buildCrmTableData(projectForecastingDataLocalObject);
      setCrmTableData(data);
    }
  }, [projectForecastingDataLocalObject]);

  const fetchCrmPipDataCallBackHandler = (isBtnClicked) => {
    const forecastingPeriodSummary = isBtnClicked ? initilizeAdjustmentRow(projectForecastingDataLocalObject?.forecastingPeriodSummary) : projectForecastingDataLocalObject?.forecastingPeriodSummary;  
    const payload = {...projectForecastingDataLocalObject, projectRevenueComputationMethod: COST_REVENUE_TYPE.CRM_PIP, forecastingPeriodSummary};
    handleCallBack(payload);
  };

  const fetchPerUnitDataCallBackHandler = (isBtnClicked) => {
    const forecastingPeriodSummary = isBtnClicked ? initilizeAdjustmentRow(projectForecastingDataLocalObject?.forecastingPeriodSummary) : projectForecastingDataLocalObject?.forecastingPeriodSummary;  
    const forecastPerUnitList = projectForecastingDataLocalObject?.forecastPerUnitList || [];
    const payload = {...projectForecastingDataLocalObject, projectRevenueComputationMethod: COST_REVENUE_TYPE.PER_UNIT, forecastPerUnitList, forecastingPeriodSummary};
    handleCallBack(payload);
  };

  const fetchExternalPerUnitDataCallBackHandler = (isBtnClicked) => {
    let modifiedForecastingPeriodSummary = projectForecastingDataLocalObject.forecastingPeriodSummary;
    if (projectForecastingDataLocalObject?.projectRevenueComputationMethod !== COST_REVENUE_TYPE.EXTERNAL_PER_UNIT) {
      modifiedForecastingPeriodSummary = modifiedForecastingPeriodSummary.map(({ resourceRevenue, ...rest }) => rest);
    }
    const forecastingPeriodSummary = isBtnClicked ? initilizeAdjustmentRow(modifiedForecastingPeriodSummary) : modifiedForecastingPeriodSummary;  
    const payload = {
      ...projectForecastingDataLocalObject,
      forecastingPeriodSummary,
      projectRevenueComputationMethod: COST_REVENUE_TYPE.EXTERNAL_PER_UNIT
    };
    handleCallBack(payload);
  };

  const checkComputationMethod = () => {
    let data;
    let incremental;
    if (!forecastPerUnitList || !forecastPerUnitList?.length) {
      incremental = true;
      data = initialDynamicData;
    } else {
      incremental = forecastPerUnitList?.[0]?.incremental;
      data = generateDynamicTableData(forecastPerUnitList);
    }
    setIsIncremental(incremental);
    setDynamicTableData(data);
  };

  const handleCRMPIPClick = () => {
    setIsPerUnit(false);
    setIncrementalTable(false);
    setExternalPu(false);
    setIsCrm(true);
    setSelectedUnit('');
    setShowUpdateButton(false);
    fetchCrmPipDataCallBackHandler(true);
  };

  const handlePerUnitClick = () => {
    setIsCrm(false);
    setExternalPu(false);
    setIsPerUnit(true);
    setShowUpdateButton(false);
    fetchPerUnitDataCallBackHandler(true);
  };

  const handleExternalPuClick = () => {
    setIsCrm(false);
    setIsPerUnit(false);
    setIncrementalTable(false);
    setExternalPu(true);
    setShowUpdateButton(false);
    setSelectedUnit('');
    fetchExternalPerUnitDataCallBackHandler(true);
  };

  const handleIncremental = () => {
    setIsIncremental(true);
    setShowUpdateButton(true);
  };

  const handleNonIncremental = () => {
    setIsIncremental(false);
    setShowUpdateButton(true);
  };

  const handleSelectUnit = (event) => {
    unitSelection(event.target.value);
  };

  const unitSelection = (value) => {
    setIncrementalTable(true);
    setSelectedUnit(value);
    checkComputationMethod();
    const unit = UNIT_TYPES.find(({id}) => id === value);
    setPerUnitTableData(buildPerUnitTableData(projectForecastingDataLocalObject, unit));
  };

  const handleAddRow = (data) => {
    setShowUpdateButton(true);
    setDynamicTableData(data);
  };

  const onCellChange = (data) => {
    setDynamicTableData(data?.updatedData);
    setShowUpdateButton(true);
  };

  const onDeleteRow = (data) => {
    setShowUpdateButton(true);
    setDynamicTableData(data?.updatedData);
  };

  const onPerUnitGridChanged = (data) => {
    setPerUnitTableData({...perUnitTableData, resourceSummary: data});
    setShowUpdateButton(true);
  };

  const onExternalPerUnitGridChanged = (data) => {
    setExternalPuTableData({...externalPuTableData, resourceSummary: data});
    setShowUpdateButton(true);
  };
  const validateDynamicTableData = (data) => {
    const errors = validatePerUnitLimits(data);
    const returnData = validatePerUnitTableData(data, perUnitTableData?.resourceSummary[0]);
    const alerts = REVENUE_ALERT_LIST.filter((item) =>
      errors.some((error) => error === item.id)
    );
    if (returnData && !returnData.isValid) { 
      alerts.push(returnData.errorMessage);
    }
    setAlertList(alerts);
    return !!alerts?.length;
  };

  const handleRecalculateClick = () => {
    if(isExternalPu){
      externalPerUnitCallBackHandler();
    }else{
      const error = validateDynamicTableData(dynamicTableData);
      if (!error) {
        perUnitCallBackHandler();
      }
    }
  };

  const handleContinue = () => {
    if(projectForecastingState?.modalError){
      return;
    }
    if (isPerUnit) {
      const error = validateDynamicTableData(dynamicTableData);
      if (!error) {
        perUnitCallBackHandler(PROJECT_FORECASTING.isContinueClicked);
        handleClose();
      } 
    }else if(isExternalPu){
      externalPerUnitCallBackHandler(PROJECT_FORECASTING.isContinueClicked);
      handleClose();
    } else {
      crmPipCallBackHandler(PROJECT_FORECASTING.isContinueClicked);
      handleClose();
    }
  };

  const perUnitCallBackHandler = (isContinueClicked) => {
    const forecastPerUnitList = buildPerUnitList(dynamicTableData, projectForecastingDataLocalObject?.projectForecastCandidateId, selectedUnit, isIncremental);
    const forecastingPeriodSummary = formatForecastingPeriodSummary(projectForecastingDataLocalObject?.forecastingPeriodSummary, perUnitTableData?.resourceSummary);
    const payload = {...projectForecastingDataLocalObject, forecastingPeriodSummary, forecastPerUnitList, incremental: isIncremental, projectRevenueComputationMethod: COST_REVENUE_TYPE.PER_UNIT};
    handleCallBack(payload, isContinueClicked);
  };

  const externalPerUnitCallBackHandler=(isContinueClicked) =>{
    formatForecastingPeriodSummary(projectForecastingDataLocalObject?.forecastingPeriodSummary, externalPuTableData?.resourceSummary);
    const payload = {...projectForecastingDataLocalObject, projectRevenueComputationMethod: COST_REVENUE_TYPE.EXTERNAL_PER_UNIT};
    handleCallBack(payload, isContinueClicked);
  };

  const crmPipCallBackHandler = (isContinueClicked) => {
    const forecastingPeriodSummary = formatForecastingPeriodSummary(projectForecastingDataLocalObject?.forecastingPeriodSummary, crmTableData?.resourceSummary);
    const payload = {...projectForecastingDataLocalObject, forecastingPeriodSummary, projectRevenueComputationMethod: COST_REVENUE_TYPE.CRM_PIP};
    handleCallBack(payload, isContinueClicked);
  };

  const handleCallBack = (payload, isContinueClicked) => {
    callBackHandler({
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING, 
      payload: {
        dryRun: true,
        isNotLoading: true,
        projectForecastCandidateId: projectForecastingDataLocalObject?.projectForecastCandidateId,
        payload,
        actionOrigin: ORIGIN.PER_UNIT_REVENUE,
        isContinueClicked
      }
    });
  };

  return (
    <>
      <SnapModal
        align="center"
        className={`main-modal ${styles.wrapper} ${isPerUnit ? styles['expanded'] : ''} `}
        disableBackdropClick
        dividers
        footerActions={
          <div className={`d-flex justify-content-between w-100 ${styles['footer-wrapper']}`}>
            <div className={`d-flex justify-content-between ${styles['footer-split-action']}`}>
              <SnapButton
                handleClick={handleCancel}
                id={ELEMENT_ID.REVENUE_CANCEL}
                label={BTN_LABELS.CANCEL}
                name={BTN_LABELS.CANCEL}
                type={BTN_LABELS.SUBMIT}
                variant={FORM_LABELS.OUTLINED}
              />
              
            </div>
            <div className={`w-100 d-flex justify-content-end ${styles['footer-common-action']}`}>
              <SnapButton
                disabled={projectForecastingState?.modalError}
                handleClick={handleContinue}
                id={ELEMENT_ID.REVENUE_CONTINUE}
                label={FORM_LABELS.CONTINUE}
                name={FORM_LABELS.CONTINUE}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          </div>
        }
        fullScreen
        fullWidth
        modalHeight="auto"
        modalTitle={PROJECT_FORECASTING.REVENUE_TITLE}
        name={PROJECT_FORECASTING.REVENUE_TITLE}
        onClose={handleClose}
        open={open}
        scroll="paper"
        transitionDirection="up"
      >
        <div className={`d-flex h-100 ${styles['body-wrapper']}`}>
          {isPerUnit && (
            <div className={`px-4 py-3 ${styles['side-column']}`}>
              <div className="mt-3">
                <SnapDropdown
                  data={UNIT_TYPES}
                  handleChange={handleSelectUnit}
                  id={ELEMENT_ID.REVENUE_SELECT_UNIT}
                  label={PROJECT_FORECASTING.SELECT_UNIT}
                  name={PROJECT_FORECASTING.SELECT_UNIT}
                  type={DROPDOWN_TYPE.DROPDOWN}
                  value={selectedUnit}
                />
                {incrementalTable && (
                  <>
                    <div className="d-flex mt-3">
                      <RadioButton
                        checked={isIncremental}
                        className="mr-2"
                        id={ELEMENT_ID.REVENUE_INCREMENTAL}
                        label={PROJECT_FORECASTING.INCREMENTAL}
                        name={PROJECT_FORECASTING.INCREMENTAL}
                        onChange={handleIncremental}
                      />
                      <RadioButton
                        checked={!isIncremental}
                        id={ELEMENT_ID.REVENUE_NON_INCREMENTAL}
                        label={PROJECT_FORECASTING.NON_INCREMENTAL}
                        name={PROJECT_FORECASTING.NON_INCREMENTAL}
                        onChange={handleNonIncremental}
                      />
                    </div>
                    <DynamicTable
                      className={`mt-2 ${styles['incremental-table']}`}
                      colType={COLUMN_TYPE.TEXTBOX}
                      grid={dynamicTableData}
                      headers={headers}
                      id={ELEMENT_ID.REVENUE_DYNAMIC_TABLE}
                      onAddRow={handleAddRow}
                      onCellChange={onCellChange}
                      onDeleteRow={onDeleteRow}
                      rowsLimit={10}
                      showAddOption
                      showDeleteOption
                    />
                  </>
                )}
              </div>
           
            </div>
          )}
          <div className={`px-4 py-3 w-100 ${styles['main-column']}`}>
            <div>  
              <div className="d-flex justify-content-between">
                <div className="d-flex gap-2">
                  <RadioButton
                    checked={isCrm}
                    className="mr-2"
                    id={ELEMENT_ID.REVENUE_CRM_PIP}
                    label={PROJECT_FORECASTING.CRM_PIP_LABEL}
                    name={PROJECT_FORECASTING.CRM_PIP_LABEL}
                    onChange={handleCRMPIPClick}
                  />
                  <RadioButton
                    checked={isExternalPu}
                    id={ELEMENT_ID.REVENUE_EXTERNAL_PER_UNIT}
                    label={PROJECT_FORECASTING.EXTERNAL_PU_LABEL}
                    name={PROJECT_FORECASTING.EXTERNAL_PU_LABEL}
                    onChange={handleExternalPuClick}
                  />
                  <RadioButton
                    checked={isPerUnit}
                    id={ELEMENT_ID.REVENUE_PER_UNIT}
                    label={PROJECT_FORECASTING.PLAN_PU_LABEL}
                    name={PROJECT_FORECASTING.PLAN_PU_LABEL}
                    onChange={handlePerUnitClick}
                  />
                </div>
            
                {(isPerUnit || isExternalPu) && showUpdateButton && (
                  <div className="d-flex align-items-center">
                    <InfoTooltip infoContent={RECALCULATE.info} />
                    <SnapButton
                      className="tertiary-button"
                      handleClick={handleRecalculateClick}
                      id={ELEMENT_ID.REVENUE_RECALCULATE}
                      label={RECALCULATE.LABEL}
                      name={RECALCULATE.LABEL}
                      type={FORM_LABELS.SUBMIT}
                      variant={FORM_LABELS.CONTAINED}
                    />
                  </div>
                )}
              </div>
              {projectForecastingState?.modalError && <DynamicAlertList alertList={projectForecastingState?.modalError} />}
            </div>

            {isCrm &&(
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
              ) : (
                <div id={ELEMENT_ID.REVENUE_CRM_TABLE}>
                  <h2 className={styles['table-title']}>{PROJECT_FORECASTING.CRM_TABLE_TITLE}</h2>
                  <DataSheetTableWrapper
                    className={'forecasting-table manage-revenue-crm-table'}
                    tableData={crmTableData}
                  />
                </div>
              )
            ) }

            {
              isExternalPu && (
                <>
                  <p className={styles['table-title']}>{PROJECT_FORECASTING.EXTERNAL_PER_UNIT_TABLE_TITLE}</p>
                  <DataSheetTableWrapper
                    className={'forecasting-table manage-revenue-per-unit-table'}
                    onGridChanged={onExternalPerUnitGridChanged}
                    tableData={externalPuTableData}
                  />
                </>

              )
            }
            {
              isPerUnit &&
              (
                <>
                  <h2 className={styles['table-title']}>{PROJECT_FORECASTING.PER_UNIT_TABLE_TITLE}</h2>
                  {incrementalTable && (
                    <div id={ELEMENT_ID.REVENUE_PER_UNIT_TABLE}>
                      {!!alertList.length && (
                        <DynamicAlertList alertList={alertList} />
                      )}
                      
                      <DataSheetTableWrapper
                        className={'forecasting-table manage-revenue-per-unit-table'}
                        onGridChanged={onPerUnitGridChanged}
                        tableData={perUnitTableData}
                      />
                    </div>
                  )}
                </>
              )}
          </div>
        </div>
      </SnapModal>
    </>
  );
};

PerUnitRevenueModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleCancel:PropTypes.func,
  handleClose: PropTypes.func,
  open: PropTypes.bool,
  projectForecastingState: PropTypes.object
};

export default PerUnitRevenueModal;
