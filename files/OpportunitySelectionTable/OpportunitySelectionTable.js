import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import SnapTable from '@pnp-snap/snap-table';
import SnapCheckbox from '@pnp-snap/snap-checkbox';
import { NO_LABEL_TEXT} from 'utils/constants';
import { buildRowData } from './TableUtil';
import { ELEMENT_ID } from 'utils/test-ids';
import { opportunityTableHeader } from 'utils/forecastingCommonFunctions';
import styles from './OpportunitySelectionTable.module.scss';

const OpportunitySelectionTable = ({ handleMainCheckBox, handleMessageIcon, openAdhocOppEditModal, openDeleteOppPopUp, oppRowData, handleProbablityOverride,handleBillingTypeOverride, parentAccountForecastStatus, financialYear ,metaData, handleLoadMore, hasMoreData, handleCustomGroupRoute, openCustomGroupEditModal, isVHBFMUser }) => {
  const [tableRowData, setTableRowData] = useState([]);
  const [tableHeaderData, setTableHeaderData] = useState([]);

  useEffect(() => {
    const adhocOpportunities = buildRowData(oppRowData, openDeleteOppPopUp, openAdhocOppEditModal, handleMainCheckBox, handleMessageIcon, handleProbablityOverride,handleBillingTypeOverride, parentAccountForecastStatus,metaData, handleLoadMore, hasMoreData, handleCustomGroupRoute, openCustomGroupEditModal, isVHBFMUser);
    const fyYear = String(financialYear).slice(-2);
    setTableHeaderData(opportunityTableHeader(fyYear));
    setTableRowData(adhocOpportunities);
  }, [oppRowData, isVHBFMUser]);

  return (
    <div className={styles.wrapper}>
      {
        oppRowData?.length > 0 &&
        <>
          <SnapTable
            checkbox={<SnapCheckbox variant={NO_LABEL_TEXT} />}
            headCells={tableHeaderData}
            id={ELEMENT_ID.SELECTION_TABLE}
            name="snapTable"
            rows={tableRowData}
            selectedItems={[]}
          />
        </>
      }
    </div>
  );
};

OpportunitySelectionTable.propTypes = {
  accountId: PropTypes.string,
  financialYear: PropTypes.string,
  handleBillingTypeOverride: PropTypes.func,
  handleCustomGroupRoute: PropTypes.func,
  handleLoadMore: PropTypes.func,
  handleMainCheckBox: PropTypes.func,
  handleMessageIcon: PropTypes.func,
  handleProbablityOverride: PropTypes.func,
  hasMoreData: PropTypes.bool,
  headerCheckBox: PropTypes.func,
  isVHBFMUser: PropTypes.bool,
  metaData:PropTypes.object,
  openAdhocOppEditModal: PropTypes.func,
  openCustomGroupEditModal: PropTypes.func,
  openDeleteOppPopUp: PropTypes.func,
  oppRowData: PropTypes.object,
  parentAccountForecastStatus: PropTypes.string,
  setOppRowData: PropTypes.func
};

export default OpportunitySelectionTable;
