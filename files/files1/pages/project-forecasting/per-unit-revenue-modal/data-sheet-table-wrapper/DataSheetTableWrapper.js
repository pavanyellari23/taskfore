import React, { useEffect, useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { TABLE_TYPES } from '@revin-utils/utils';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import styles from './DataSheetTableWrapper.module.scss';
import { MAX_NUMBER_LIMIT } from 'utils/constants';

const DataSheetTableWrapper = ({ className, onGridChanged, tableData }) => {
  const [grid, setGrid] = useState([]);
  const [header, setHeader] = useState([]);
  const gridContainerRef = useRef(null);
  const scrollPosition = useRef({ left: 0, top: 0 });
  const isUpdating = useRef(false);
  const rafId = useRef(null);

  useEffect(() => {
    if (tableData?.headerData?.length) setHeader(tableData.headerData);
    if (tableData?.resourceSummary?.length) setGrid(tableData.resourceSummary);
  }, [tableData]);

  const handleScroll = useCallback((e) => {
    if (!isUpdating.current) {
      scrollPosition.current = {
        left: e.target.scrollLeft,
        top: e.target.scrollTop
      };
    }
  }, []);

  const handleGridChange = useCallback((updatedData) => {
    // Cancel any pending scroll restoration
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
    }

    // Store current scroll position
    if (gridContainerRef.current) {
      scrollPosition.current = {
        left: gridContainerRef.current.scrollLeft,
        top: gridContainerRef.current.scrollTop
      };
    }

    isUpdating.current = true;
    setGrid(updatedData);
    
    if (onGridChanged) {
      onGridChanged(updatedData);
    }

    // Restore scroll position in multiple phases for reliability
    const restoreScroll = () => {
      if (gridContainerRef.current && scrollPosition.current) {
        gridContainerRef.current.scrollLeft = scrollPosition.current.left;
        gridContainerRef.current.scrollTop = scrollPosition.current.top;
      }
      isUpdating.current = false;
    };

    // Try immediate restoration
    rafId.current = requestAnimationFrame(() => {
      restoreScroll();
      // Fallback with slightly longer delay if needed
      setTimeout(restoreScroll, 50);
    });
  }, [onGridChanged]);

  useEffect(() => {
    const container = gridContainerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => {
        container.removeEventListener('scroll', handleScroll);
        if (rafId.current) {
          cancelAnimationFrame(rafId.current);
        }
      };
    }
  }, [handleScroll]);

  return (
    <Box
      ref={gridContainerRef}
      className={`${className} ${styles.wrapper}`}
    >
      <ForecastDataSheetControlWrapper
        grid={grid}
        header={header}
        limit
        limitRange={MAX_NUMBER_LIMIT}
        onGridChanged={handleGridChange}
        switchView
        type={TABLE_TYPES.RESOURCE}
      />
    </Box>
  );
};

DataSheetTableWrapper.propTypes = {
  className: PropTypes.string,
  onGridChanged: PropTypes.func,
  tableData: PropTypes.object
};

export default DataSheetTableWrapper;