import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SnapTable from '@pnp-snap/snap-table';
import SnapCheckbox from '@pnp-snap/snap-checkbox';
import DialogModal from '@revin-utils/components/dialog-modal';
import { buildChooseForecastingTableRowData } from '../OpportunitySelectionTable/TableUtil';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { getForecastingTableHeader } from 'utils/forecastingCommonFunctions';
import { CANCEL, CHANGE_FORECAST_WARNING, CONFIRM, CONFIRMATION_MODAL_TITLE, NO_LABEL_TEXT, RESOURCE_LEVEL_FORECAST } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './ChooseForecastingTable.module.scss';

const ChooseForecastingTable = ({ selectedForecastCandidates, callBackHandler, viewOnlyPermission, payloadForForecastCandidates, financialYear, tableMaximize, handleLoadMore, hasMoreData, opportunities, handleCustomGroupRoute }) => {
  const history = useHistory();
  const [oppIdforForecastChange, setoppIdforForecastChange] = useState();
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    setRowData(buildChooseForecastingTableRowData(handleForecastTab, selectedForecastCandidates, styles, handleNavigation, viewOnlyPermission, handleLoadMore, hasMoreData, handleCustomGroupRoute));
  }, [JSON.stringify(selectedForecastCandidates), viewOnlyPermission]);

  const handleNavigation = (data) => {
    history.push(data);
  };

  const handleForecastTab = (oppId, clickedTab) => {
    const filteredCandidate = selectedForecastCandidates.filter((item) => item?.id === oppId);
    const forecastTypeId = filteredCandidate[0]?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? 1 : 0;
    if (forecastTypeId !== clickedTab) {
      setoppIdforForecastChange(oppId);
      setConfirmationOpen(true);
    }
  };

  const handleClose = () => {
    setConfirmationOpen(false);
  };

  const handleConfirmationClick = () => {
    callBackHandler({
      type: OpportunitiesActionType.CHANGE_FORECASTING_TYPE,
      payload: {
        payloadForForecastChange: {
          selectedForecastCandidates: opportunities?.forecast_candidates_data,
          oppIdforForecastChange
        },
        payloadForForecastCandidatesCall: payloadForForecastCandidates
      }
    });
    setConfirmationOpen(false);
  };

  return (
    <div className={`${styles.wrapper} flex-1 overflow-auto ${styles['choose-forecast-table']} default-scroll`}>
      {selectedForecastCandidates?.length > 0 &&
          <SnapTable
            checkbox={<SnapCheckbox variant={NO_LABEL_TEXT} />}
            headCells={getForecastingTableHeader(financialYear)}
            hover
            id={ELEMENT_ID.SNAP_TABLE}
            name={ELEMENT_ID.SNAP_TABLE}
            rows={rowData}
          />
      }
      <DialogModal
        className="confirmation-modal"
        description={
          <div className="confirmation-modal-text">
            <p className="mb-2" />
            <strong>
              {CHANGE_FORECAST_WARNING}
            </strong>
          </div>
        }
        handlePrimaryButton={handleClose}
        handleSecondaryButton={handleConfirmationClick}
        open={confirmationOpen}
        primaryButton
        primaryButtonLabel={CANCEL}
        secondaryButton
        secondaryButtonLabel={CONFIRM}
        title={CONFIRMATION_MODAL_TITLE}
      />
    </div>
  );
};

ChooseForecastingTable.propTypes = {
  callBackHandler: PropTypes.func,
  financialYear: PropTypes.string,
  handleCustomGroupRoute: PropTypes.func,
  handleLoadMore: PropTypes.func,
  hasMoreData: PropTypes.bool,
  opportunities: PropTypes.any,
  payloadForForecastCandidates: PropTypes.object,
  selectedForecastCandidates: PropTypes.array,
  setSelectedForecastCandidates: PropTypes.func,
  tableMaximize: PropTypes.bool,
  viewOnlyPermission: PropTypes.bool
};

export default ChooseForecastingTable;
