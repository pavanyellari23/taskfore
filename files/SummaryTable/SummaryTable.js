import React from 'react';
import PropTypes from 'prop-types';
import { TABLE_TYPES } from '@revin-utils/utils';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import styles from './SummaryTable.module.scss';

const SummaryTable = ({summaryTableHeader, summaryTableRowData}) => {
  return (
    <div className={`forecasting-table my-4 ${styles.wrapper}`}>
      <ForecastDataSheetControlWrapper 
        grid={summaryTableRowData}
        header={summaryTableHeader}
        type={TABLE_TYPES.PRICING_SUMMARY}
      />
    </div>
  );
};

SummaryTable.propTypes = {
  summaryTableHeader: PropTypes.array,
  summaryTableRowData: PropTypes.array
};

export default SummaryTable;
