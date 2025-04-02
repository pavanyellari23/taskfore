import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import SnapButton from '@pnp-snap/snap-button';
import {
  CLASS_NAMES,
  CELL_TYPES,
  FORM_LABELS,
  formatCurrency
} from '@revin-utils/utils';
import {  RESOURCE_GRID } from 'utils/constants';
import CrossOverTooltip from 'components/common/crossover-tooltip';
import ToggleFilter from 'components/common/toggle-filter';
import InfoTooltip from '@revin-utils/components/info-tooltip';

const Resource = ({
  children,
  className,
  handleFilter,
  headerClick,
  headerData,
  openResourceModal,
  postMonthHeader,
  preMonthHeader,
  secondaryGridRow,
  tabLabels,
  handleRoleSelectionModal,
  selectedGrid,
  viewOnlyPermission,
  disablePerfectScrollBar
}) => {
  const wrapperRef = useRef(null);
  const tableRef = useRef(null);


  const tableContent = ( 
    <div
      className="ref-wrapper"
      ref={wrapperRef}
    >
      <table
        className={`${className} ${CLASS_NAMES.DATA_SHEET} ${CLASS_NAMES.CUSTOM_WRAPPER}`}
        ref={tableRef}
      >
        <thead className="table-view-thead">
          <tr className="row">
            {headerData?.map((col) => (
              <>
                {col.type === CELL_TYPES.HEADER_TOGGLE && (
                  <th
                    className="action-cell cell"
                    key={col.id}
                  >
                    <ToggleFilter
                      handleFilter={handleFilter}
                      selectedGrid={selectedGrid}
                      tabLabels={tabLabels}
                    />
                  </th>
                )}
                {(col.type === CELL_TYPES.HEADER || col.type === 'header-label') && (
                  <th
                    className={`action-cell cell ${col.type === 'header-label' ? 'header-label' : ''}`}
                    key={col.id}
                  >
                    <div className="table-header-th">
                      <div>{col.name}</div>
                      <div>{col.subName}</div>
                    </div>
                  </th>
                )}
                {!col.parent && !col.type && (
                  <th
                    className={`cell ${col.parent ? 'parent' : ''}`}
                    data-expanded={col.expanded}
                    data-id={col.id}
                    data-parent={col.parent}
                    data-pid={col.pID}
                    key={`${col.id}-${col.subName}`}
                    onClick={headerClick}
                  >
                    <span className="subset-header-wrap">
                      <span className="subset-header-row-two">{col.name}</span>
                      <span className="subset-header-row-one tag-style">
                        {col.subName}
                      </span>
                    </span>

                    <CrossOverTooltip subType={col?.subType}/>
                  </th>
               
                )}
              </>
            ))}
          </tr>

          <tr className={'header-secondary'}>
            {preMonthHeader?.map((col) => (
              <>
                {col.type === CELL_TYPES.HEADER_SECONDARY &&
            col.subType === CELL_TYPES.ROLE ? (
                    <th
                      className={`action-cell cell ${
                  col.subType === CELL_TYPES.RATE ? CELL_TYPES.RATE : ''
                }`}
                      key={col.id}
                    >
                      {!viewOnlyPermission && <>
                        <SnapButton
                          className="primary-invert"
                          color="primary"
                          handleClick={handleRoleSelectionModal}
                          label={col.name || RESOURCE_GRID.ADD_ROLE}
                          variant={FORM_LABELS.OUTLINED}
                        />
                        <SnapButton
                          className="ml-1 primary-invert"
                          color="primary"
                          handleClick={openResourceModal}
                          label={RESOURCE_GRID.ADD_RESOURCE}
                          variant={FORM_LABELS.OUTLINED}
                        />
                      </>}
                    </th>
                  ) : (
                    <th
                      className={`action-cell cell ${
                  col.subType === CELL_TYPES.RATE ? CELL_TYPES.RATE : ''
                } ${ col.subType === 'header-label' ? 'header-label' : '' } ${col.isPastPeriod ? 'past-data' : ''}`}
                      key={col.id}
                    >
                      {col.name}
                      {col?.infoTooltipContent && 
                        <InfoTooltip
                          infoContent={col.infoTooltipContent}
                        />
                      }
                    </th>
                  )}
              </>
            ))}

            {secondaryGridRow?.map((data) => (
              <>
                <th
                  className="action-cell cell"
                  key={data.value}
                >
                  {formatCurrency(data.value)}
                </th>
              </>
            ))}

            {postMonthHeader?.map((col) => (
              <th
                className="action-cell cell"
                key={col.id}
              >
                {isNaN(col.name)?col.name:formatCurrency(col.name) }
              </th>
            ))}
          </tr>
        </thead>
        <div className="blank-space" />
        <tbody>{children}</tbody>
      </table>
    </div>
  );
  return disablePerfectScrollBar ? (
    tableContent
  ) : (
    <PerfectScrollbar className="perfect-scrollbar-element">
      {tableContent}
    </PerfectScrollbar>
  );
};

Resource.propTypes = {
  callBackHandler: PropTypes.func,
  children: PropTypes.element,
  className: PropTypes.string,
  disablePerfectScrollBar: PropTypes.bool,
  filter: PropTypes.string,
  handleFilter: PropTypes.func,
  handleQuickRoleAdd: PropTypes.func,
  handleQuickRoleMaxWidthAndTableCount: PropTypes.func,
  handleRoleSelectionModal: PropTypes.func,
  handleRowClick: PropTypes.func,
  headerClick: PropTypes.func,
  headerData: PropTypes.object,
  isGridUpdate: PropTypes.bool,
  isReadOnly: PropTypes.bool,
  metaDataState: PropTypes.object,
  openResourceModal: PropTypes.func,
  postMonthHeader: PropTypes.array,
  preMonthHeader: PropTypes.array,
  resources: PropTypes.array,
  secondaryGridRow: PropTypes.array,
  selectedGrid: PropTypes.string,
  tabLabels: PropTypes.array,
  viewOnlyPermission: PropTypes.bool
};

export default Resource;
