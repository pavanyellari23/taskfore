import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { TABLE_TYPES, FORM_LABELS } from '@revin-utils/utils';
import DialogModal from '@revin-utils/components/dialog-modal';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import SnapButton from '@pnp-snap/snap-button';
import { INVESTMENT_MODAL, RECALCULATE, ACCOUNT_LEVEL_FORECASTING_TAB_VALUES, MAX_NUMBER_LIMIT, RESOURCE, ACCOUNT_LEVEL_CONSTANTS, TOAST_MESSAGES_SUFFIX, BTN_LABELS} from 'utils/constants';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import InvestmentModal from 'components/common/investment-modal';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import { getPreparedInvestmentPayload, buildResourcePlanData, formatGridPayloadToAPIPayload, getUpdatedForecastPeriodDetails} from '../../helper'; 
import { Maximize2, Minimize2 } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import styles from './RolledUpTable.module.scss';

const RolledUpTable = ({ 
  forecastingState, 
  callBackHandler,
  handleGridUpdate,
  viewOnlyPermission,
  handleTableMaximizeEvent,
  isCollapseSummary,
  tableMaximize
}) => {
  const [isGridUpdate, setIsGridUpdate] = useState(false);
  const [open, setOpen] = useState(false);
  const [modify, setModify] = useState(false);
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [accountResponse, setAccountResponse] = useState({});
  const [editInvestData, setEditInvestData] = useState({});
  const { accountForecastCandidateId } = useParams(); 
  const [deleteInvestmentId, setDeleteInvestmentId] = useState(null);

  useEffect(() => {
    if(forecastingState?.forecastingData) {
      setAccountResponse(buildResourcePlanData(forecastingState?.forecastingData, ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[0], viewOnlyPermission));
    }
  }, [forecastingState?.forecastingData]);

  const openInvestmentModal = () => {
    setOpen(true);
  };

  const closeInvestmentModal = () => {
    setOpen(false);
    setModify(false);
    setConfirmationOpen(false);
    setDeleteInvestmentId(null);
    setEditInvestData({});
  };

  const handleSubmit = (values) => {
    let preparedInvestmentPayload = [];
    let message = '';
    const investments = forecastingState?.forecastingData?.investment;
    const preparedInvestment = getPreparedInvestmentPayload(values, accountForecastCandidateId);
    if (modify) {
      const investmentIndex = investments?.findIndex(investmentItem => {
        if(investmentItem?.slNo && editInvestData?.slNo)
          return investmentItem?.slNo === editInvestData?.slNo;
        else(investmentItem?.id && editInvestData?.id);
        return investmentItem?.id === editInvestData?.id;
      });
      const updatedForecastPeriodDetails = { ...investments[investmentIndex], periodDetailsList: getUpdatedForecastPeriodDetails(investments[investmentIndex], values)};
      const updatedInvestment = {...updatedForecastPeriodDetails, ...preparedInvestment};
      preparedInvestmentPayload = investments?.toSpliced(investmentIndex, 1, updatedInvestment);
      message = `Investment ${values.categoryData?.description?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX.EDIT}`;
    } else {
      preparedInvestmentPayload = [...investments, preparedInvestment];
      message = `New investment ${values.categoryData?.description?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX.ADD}`;
    }
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        payload: {
          ...forecastingState?.forecastingData,
          investment: preparedInvestmentPayload
        },
        accountForecastCandidateId,
        isNotLoading: true,
        dryRun: true,
        message
      }
    });
    closeInvestmentModal();
  };

  const onGridChanged = (gridObj) => {
    setAccountResponse({...accountResponse, resourceData: gridObj});
    setIsGridUpdate(true);
    handleGridUpdate(true);
    const payload = formatGridPayloadToAPIPayload(forecastingState?.forecastingData, gridObj);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE,
      payload
    });
  };
      
  const handleEditTableCellHead = () => {
    setModify(true);
    openInvestmentModal();
  };
      
  const handleUpdateForecastData = () => {
    const preparedPayload = formatGridPayloadToAPIPayload(forecastingState?.forecastingData, accountResponse.resourceData);

    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        payload: preparedPayload,
        accountForecastCandidateId,
        isNotLoading: true,
        dryRun: true
      }
    });

  };

  const handleQuickAction = ({action, headerItem}) => {
    const investmentId = headerItem?.item?.slNo || headerItem?.item?.id;
    if (RESOURCE.EDIT_ACTION === action) {
      handleEditTableCellHead();
      setEditInvestData(headerItem?.item);
    } else if (RESOURCE.DELETE_ACTION === action) {
      if (headerItem?.item?.origin !== INVESTMENT_MODAL.INSIDE_MODAL_DELETE) {
        setDeleteInvestmentId(investmentId);
        setConfirmationOpen(true);
      } else {
        deleteInvestmentHandler(investmentId);
      }
    };
  };

  const handleBackButtonClick = () => {
    setConfirmationOpen(false);
    setDeleteInvestmentId(null);
  };

  const handleConfirmClick = () =>{
    if (deleteInvestmentId) {
      deleteInvestmentHandler(deleteInvestmentId);
    }
  };

  const deleteInvestmentHandler = (deleteInvestmentId) => {
    const { investment, accountForecastCandidateId } = forecastingState?.forecastingData;
    const investmentIndexTobeDeleted = investment?.findIndex(investmentItem => investmentItem?.slNo === deleteInvestmentId || investmentItem?.id === deleteInvestmentId);
    const filteredInvestments = investment?.toSpliced(investmentIndexTobeDeleted, 1);
    callBackHandler({
      type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
      payload: {
        isNotLoading: true,
        accountForecastCandidateId,
        payload: { ...forecastingState?.forecastingData, investment : filteredInvestments },
        message: `Investment ${investment[investmentIndexTobeDeleted]?.categoryDescription?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX.DELETE}`
      }
    });
    closeInvestmentModal();
  };
  
  const handleTableMaximize = () => {
    handleTableMaximizeEvent();
  };

  const gridHeight = useMemo(() => {
    return tableMaximize ? isCollapseSummary ? 'calc(66vh - 1px)' : 'calc(57vh)' : isCollapseSummary ? 'calc(53vh + 3px)' : 'calc(36vh - 5px)';
  }, [tableMaximize, isCollapseSummary]); 

  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      <>
        <div className={`d-flex justify-content-end align-items-center mb-2 ${styles['button-wrapper']}`}>
          <div className="d-flex align-items-center" />
          {isGridUpdate && (
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
        {(!!accountResponse?.headerData?.length) && (
          <PerfectScrollbar
            className={'custom-scrollbar'}
            style={{height: gridHeight}}
          >
            <ForecastDataSheetControlWrapper
              disablePerfectScrollBar
              grid={accountResponse?.resourceData}
              handleEditTableCellHead={handleEditTableCellHead}
              handleQuickAction={handleQuickAction}
              handleRoleSelectionModal={openInvestmentModal}
              handleRowBtnClick={openInvestmentModal}
              header={accountResponse?.headerData}
              headerLength={accountResponse.headerData.length}
              limit
              limitRange={MAX_NUMBER_LIMIT}
              onGridChanged={onGridChanged}
              parentHeaderColSpan={1}
              secondaryHeaders={accountResponse?.secondaryHeader}
              type={TABLE_TYPES.RESOURCE}
              viewOnlyPermission={viewOnlyPermission}
            />
          </PerfectScrollbar>
        )}

        <InvestmentModal
          editInvestData={editInvestData}
          forecastingState={forecastingState}
          handleClose={closeInvestmentModal}
          handleDelete={handleQuickAction}
          handleSubmit={handleSubmit}
          investmentCategories={forecastingState?.investmentCategories}
          modify={modify}
          open={open}
        />

        <DialogModal
          className={styles['confirmation-modal']}
          description={
            <div className="confirmation-modal-text">
              <p className="mb-2" />
              {ACCOUNT_LEVEL_CONSTANTS.DELETE_INVESTMENT_MODAL_MSG}
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
      </>
    </div>
  );
};

RolledUpTable.propTypes = {
  callBackHandler: PropTypes.func,
  forecastingState: PropTypes.object,
  handleGridUpdate: PropTypes.func,
  handleTableMaximizeEvent:PropTypes.func,
  isCollapseSummary: PropTypes.bool,
  tableMaximize: PropTypes.bool,
  viewOnlyPermission:PropTypes.bool
};

export default withStyles(styles)(RolledUpTable);
