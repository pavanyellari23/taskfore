import React from 'react';
import PropTypes from 'prop-types';
import { TABLE_TYPES } from '@revin-utils/utils';
import Resource from './types/Resource';
import PricingSummary from './types/PricingSummary';
import './SheetRenderer.module.scss';

const SheetRenderer = ({
  children,
  expandYearID,
  filter,
  handleRoleSelectionModal,
  headerClick,
  headerData,
  openResourceModal,
  postMonthHeader,
  preMonthHeader,
  handleFilter,
  isReadOnly=false,
  switchView,
  selectedGrid,
  isGridUpdate,
  tableCount,
  type,
  viewOnlyPermission,
  disablePerfectScrollBar,
  ...rest
}) => {
  const renderComp = (type) => {
    switch (type) {
      case TABLE_TYPES.RESOURCE:
        return (
          <>
            <Resource
              disablePerfectScrollBar={disablePerfectScrollBar}
              expandYearID={expandYearID}
              filter={filter}
              handleFilter={handleFilter}
              handleRoleSelectionModal={handleRoleSelectionModal}
              headerClick={headerClick}
              headerData={headerData}
              isGridUpdate={isGridUpdate}
              isReadOnly={isReadOnly}
              openResourceModal={openResourceModal}
              postMonthHeader={postMonthHeader}
              preMonthHeader={preMonthHeader}
              selectedGrid={selectedGrid}
              switchView={switchView}
              tableCount={tableCount}
              viewOnlyPermission={viewOnlyPermission}
              {...rest}
            >
              {children}
            </Resource>
          </>
        );
      case TABLE_TYPES.PRICING_SUMMARY:
        return (
          <>
            <PricingSummary
              headerData={headerData}
              {...rest}
            >
              {children}
            </PricingSummary>
          </>
        );
    }
  };

  return <>{renderComp(type)}</>;
};

SheetRenderer.propTypes = {
  children: PropTypes.oneOfType([PropTypes.element, PropTypes.array]),
  disablePerfectScrollBar: PropTypes.bool,
  expandYearID: PropTypes.object,
  filter: PropTypes.string,
  handleClickAssetOpen: PropTypes.func,
  handleFilter: PropTypes.func,
  handleRoleSelectionModal: PropTypes.func,
  headerClick: PropTypes.func,
  headerData: PropTypes.array,
  isGridUpdate: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  onGridChanged: PropTypes.func,
  openResourceModal: PropTypes.func,
  postMonthHeader: PropTypes.array,
  preMonthHeader: PropTypes.array,
  secondaryHeader: PropTypes.array,
  selectedGrid: PropTypes.string,
  showHeaderButton: PropTypes.bool,
  switchView: PropTypes.bool,
  tabLabels: PropTypes.object,
  tableCount: PropTypes.number,
  type: PropTypes.string,
  viewOnlyPermission: PropTypes.bool
};

export default SheetRenderer;