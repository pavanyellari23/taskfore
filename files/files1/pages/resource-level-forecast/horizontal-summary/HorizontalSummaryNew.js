import React, { useState, useEffect } from 'react';
import  PropTypes from 'prop-types';
import DataGridControl from '@revin-utils/components/data-grid-control';
import { gridColumns, summaryGridData } from './helper';
import { gridHeaderRow } from '../resource-level-forecast-table/helper';
import styles from './HorizontalSummary.module.scss';

const HorizontalSummaryNew = ({resourceForecastData}) => {
  const [rows, setRows] = useState([]);
  const [columns, setColumns] = useState();

  useEffect(() => {
    if (resourceForecastData?.periodSummary?.length) {
      setColumns(gridColumns(resourceForecastData?.periodSummary?.length));
      updateRows();
    }
  }, [JSON.stringify(resourceForecastData?.periodSummary)]);

  const updateRows = () => {
    /*
    true(7th number param): show all columns got from API
    */
    const headerRow = gridHeaderRow(resourceForecastData.periodSummary,  [{label: ''}], '', '', '', '', true);
    const dataRows = summaryGridData(resourceForecastData);
    setRows([headerRow, ...dataRows]);
  };

  const handleChanges = newRows => {
    setRows(newRows);
  };

  return (
    <div className={`horizontal-summary default-scroll ${styles.wrapper}`}>
      <DataGridControl
        columns={columns}
        isCompactMode
        onCellsChanged={handleChanges}
        rows={rows}
        stickyLeftColumns={1}
        stickyTopRows={1}
      />
    </div>
  );
};

HorizontalSummaryNew.propTypes = {
  resourceForecastData: PropTypes.object
};

export default HorizontalSummaryNew;