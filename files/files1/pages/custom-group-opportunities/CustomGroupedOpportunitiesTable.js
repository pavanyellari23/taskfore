import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SnapTable from '@pnp-snap/snap-table';
import { buildRowData, HEAD_CELLS } from './helper';
import styles from './CustomGroupedOpportunitiesTable.module.scss';

const CustomGroupedOpportunitiesTable = (props) => {
  const [rowData , setRowData] = useState([]);

  useEffect(() => {
    setRowData(buildRowData(props?.customGroupedCandidates, props?.handleLoadMore , props?.hasMoreData));
  }, [props?.customGroupedCandidates]);

  return(
    <div className={styles.wrapper}>
      { rowData?.length > 0 && 
      <SnapTable
        className=""
        handleChangeSelection={function noRefCheck() { }}
        handleHeaderClick={function noRefCheck() { }}
        headCells={HEAD_CELLS}
        rows={rowData}
      />
      }
    </div>
  );
};

CustomGroupedOpportunitiesTable.propTypes = {
  customGroupedCandidates: PropTypes.array,
  handleLoadMore: PropTypes.func,
  hasMoreData: PropTypes.bool
};

export default CustomGroupedOpportunitiesTable;