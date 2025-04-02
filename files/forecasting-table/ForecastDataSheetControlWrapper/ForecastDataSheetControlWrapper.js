import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import DataSheetControl from '@revin-utils/components/data-sheet-control';
import SheetRenderer from '../SheetRenderer';

const ForecastDataSheetControlWrapper = (props) => {
  const {
    callBackHandler,
    handleFilter,
    header,
    handleRoleSelectionModal,
    onGridChanged,
    splitCellUpdate,
    secondaryHeaders,
    tabLabels,
    type,
    openResourceModal,
    parentHeaderColSpan,
    handleRowBtnClick,
    selectedGrid,
    viewOnlyPermission,
    disablePerfectScrollBar
  } = props;
  const [headerData, setHeaderData] = useState([]);
  const [preMonthHeader, setPreMonthHeader] = useState([]);
  const [postMonthHeader, setPostMonthHeader] = useState([]);
  const [secondaryHeader, setSecondaryHeader] = useState([]);

  useEffect(() => {
    setHeaderData(header);
    setSecondaryHeader(secondaryHeaders);
    setPreMonthHeader(secondaryHeaders?.preMonthHeader);
    setPostMonthHeader(secondaryHeaders?.postMonthHeader);
  }, [JSON.stringify(header), JSON.stringify(secondaryHeaders)]);

  const renderSheet = (sheetProps) => {
    const { row, cells, ...rest } = sheetProps;
    return (
      <SheetRenderer
        callBackHandler={callBackHandler}
        cells={cells}
        disablePerfectScrollBar={disablePerfectScrollBar}
        handleFilter={handleFilter}
        handleRoleSelectionModal={handleRoleSelectionModal}
        handleRowBtnClick={handleRowBtnClick}
        headerData={headerData}
        onGridChanged={onGridChanged}
        openResourceModal={openResourceModal}
        parentHeaderColSpan={parentHeaderColSpan}
        postMonthHeader={postMonthHeader}
        preMonthHeader={preMonthHeader}
        row={row}
        secondaryHeader={secondaryHeader}
        selectedGrid={selectedGrid}
        splitCellUpdate={splitCellUpdate}
        tabLabels={tabLabels}
        type={type}
        viewOnlyPermission={viewOnlyPermission}
        {...rest}
      />
    );
  };

  return (
    <DataSheetControl
      {...props}
      renderSheet={renderSheet}
    />
  );
};

ForecastDataSheetControlWrapper.propTypes = {
  callBackHandler: PropTypes.func,
  disablePerfectScrollBar: PropTypes.bool,
  handleFilter: PropTypes.func,
  handleRoleSelectionModal: PropTypes.func,
  handleRowBtnClick: PropTypes.func,
  header: PropTypes.array,
  onGridChanged: PropTypes.func,
  openResourceModal: PropTypes.func,
  parentHeaderColSpan: PropTypes.number,
  secondaryHeaders: PropTypes.array,
  selectedGrid: PropTypes.string,
  splitCellUpdate: PropTypes.bool,
  tabLabels: PropTypes.object,
  type: PropTypes.string,
  viewOnlyPermission: PropTypes.bool
};

export default ForecastDataSheetControlWrapper;
