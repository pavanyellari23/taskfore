import React, { useEffect, useState} from 'react';
import _orderBy from 'lodash/orderBy';
import _sortBy from 'lodash/sortBy';
import _find from 'lodash/find';
import DataGridControl from '@revin-utils/components/data-grid-control';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import CustomTab from '@revin-utils/components/custom-tab';
import { withStyles } from '@material-ui/core/styles';
import { useDebounce} from '@revin-utils/utils';
import SnapButton from '@pnp-snap/snap-button';
import { useParams } from 'react-router-dom';
import PropTypes from 'prop-types';
import { DATA_GRID_CONTROL_CELL, GRID_CONSTANTS, RESOURCE_FORECASTING, RESOURCE_GRID, ROLE_ACTION} from 'utils/constants';
import { updateResourceForecastAction } from 'store/actions/ResourceForecast';
import { gridHeaderRow, gridColumns, gridRowsData } from './helper';
import { getFilteredSearchData } from 'utils/commonFunctions';
import styles from './ResourceLevelForecastTable.module.scss';
import { getGridMonths } from 'utils/forecastingCommonFunctions';

const ResourceLevelForecastTable = ({
  callBackHandler,
  dataGridRowHeight,
  groupByLocations,
  resourceForecastState, 
  onResourceOrRoleClickHandler,
  onRoleActionClick,
  searchText,
  tableTabIndex,
  viewOnlyPermission,
  selectedHeaderTabEvent
}) => {
  const [resourceForecastData, setResourceForecastData] = useState(resourceForecastState.resourceForecastData);
  const [selectedTab, setSelectedTab] = useState(0);
  const [rows, setRows] = useState([]);
  const [updatedCells, setUpdatedCells] = useState([]);
  const [columns, setColumns] = useState();
  const [sortBy, setSortBy] = useState(null);
  const fteTabLabels = [
    { label: GRID_CONSTANTS.TITLE.FTE, key: GRID_CONSTANTS.KEY.FTE },
    { label: GRID_CONSTANTS.TITLE.BILLABLE_HOURS, key: GRID_CONSTANTS.KEY.BILLABLE_HOURS, payloadSubType: GRID_CONSTANTS.PAYLOAD_SUBTYPE.BILLABLE_HRS, colorKey:  GRID_CONSTANTS.KEY.BILLABLE_HOURS_COLOR}
  ];
  const revenueCostTabLabels = [
    { label: GRID_CONSTANTS.TITLE.REVENUE, key: GRID_CONSTANTS.KEY.REVENUE, headerKey: GRID_CONSTANTS.HEADER_KEY.TOTAL_REVENUE},
    { label: GRID_CONSTANTS.TITLE.COST, key: GRID_CONSTANTS.KEY.COST, headerKey: GRID_CONSTANTS.HEADER_KEY.FINAL_RESOURCE_COST_OTHER_COST_SUM }
  ];
  const gpmTabLabels = [
    { label: GRID_CONSTANTS.TITLE.GPM_$, key: GRID_CONSTANTS.KEY.GROSSMARGIN },
    { label: GRID_CONSTANTS.TITLE.GPM_PERCENT, key: GRID_CONSTANTS.KEY.GPM_PERCENTAGE, colorKey: GRID_CONSTANTS.KEY.GPM_PERCENTAGE_COLOR, headerKey: 'NA'}
  ];
  const [tabLabels, setTabLables] = useState(fteTabLabels);
  const [sortingColumn, setSortingColumn] = useState();
  const [filteredRoles, setFilteredRoles] = useState([]);
  const { projectForecastCandidateId } = useParams();
  const [collapsedRows , setCollapsedRows] = useState([]);
  const [groupedRows , setGroupedRows] = useState([]);

  useEffect(() => {
    if (resourceForecastData?.periodSummary?.length) {
      const summary = getGridMonths(resourceForecastData?.periodSummary);
      setColumns(gridColumns(summary?.length));
    }
  }, [resourceForecastData?.periodSummary]);
 
  useEffect(() => {
    if(resourceForecastState.resourceForecastData?.periodSummary){
      setResourceForecastData(resourceForecastState.resourceForecastData);
    }
  }, [resourceForecastState.resourceForecastData]);

  useEffect(() => {
    const tabs = tableTabIndex === 0 ? fteTabLabels : tableTabIndex === 1 ? revenueCostTabLabels : gpmTabLabels;
    setTabLables(tabs);
    setSelectedTab(0);
  }, [tableTabIndex]);

  useEffect(() => {
    const filtered = getFilteredSearchData(resourceForecastState?.resourceForecastData?.roles, searchText);
    setFilteredRoles(_sortBy(filtered, obj => obj?.resourceData?.firstName));
  }, [searchText, resourceForecastState?.resourceForecastData?.roles]);

  useEffect(() => {
    if (tabLabels?.length && resourceForecastData && Object.keys(resourceForecastData)?.length  ) {
      const tab = tabLabels[selectedTab];
      getRows(tab, filteredRoles);
      selectedHeaderTabEvent(tab?.key);
    }
    if(!groupByLocations){
      setCollapsedRows([]);
    }
  }, [tabLabels, selectedTab, resourceForecastData, filteredRoles, viewOnlyPermission, groupByLocations]);


  const filterRecord = (periodId) => {
    setSortingColumn(periodId);
    const keyToSort = tabLabels[selectedTab].key;
    let sortByKey;
    if (periodId === sortingColumn && sortBy === GRID_CONSTANTS.SORT_TYPE.DESC){
      sortByKey = GRID_CONSTANTS.SORT_TYPE.ASC;
    }else {
      sortByKey = (sortBy === GRID_CONSTANTS.SORT_TYPE.ASC && periodId === sortingColumn) ? null : GRID_CONSTANTS.SORT_TYPE.DESC;
    }

    setSortBy(sortByKey);
    if(sortByKey){
      setFilteredRoles(_orderBy(resourceForecastData.roles, [
        obj => _find(obj.foreCastingRolePlanPeriodDetails, { periodId })?.[keyToSort] || 0
      ], sortByKey));
    }else{
      setFilteredRoles(_sortBy(resourceForecastData.roles, obj => obj?.resourceData?.firstName));
    }
  };

  const handleExpandCollapse = (region) => {
    setCollapsedRows(oldValue => {
      if(oldValue?.includes(region)) return oldValue?.filter(value => value !== region);
      else return [...oldValue, region];
    });
  };

  const getRows = (tab, roles) => {
    const headerLabels = [
      {
        label: 
        <CustomTab
          className="small-tab"
          onChange={onHeaderTabClick}
          tabList={tabLabels}
          value={selectedTab}
        />
      },
      {label: (<>{GRID_CONSTANTS.BILL_RATE_HEADER} <br/>{GRID_CONSTANTS.HR}</>)},
      {label: (<>{GRID_CONSTANTS.COST_RATE_HEADER}<br/>{GRID_CONSTANTS.HR}</>)}
    ];
    const headerRow = gridHeaderRow(resourceForecastData?.periodSummary, headerLabels, '', filterRecord, sortingColumn, sortBy);

    const headerButtons = [
      {
        content: !viewOnlyPermission && (
          <div className="d-flex gap-1">
            <ArrowWrapper
              data={''}
              handleChange={() => onRoleClick()}
            >
              <SnapButton
                className="primary-invert"
                label={RESOURCE_GRID.ADD_ROLE}
              />
            </ArrowWrapper>
            <ArrowWrapper
              data={''}
              handleChange={() => onResourceClick()}
            >
              <SnapButton
                className="primary-invert"
                label={RESOURCE_GRID.ADD_RESOURCE}
              />
            </ArrowWrapper>
          </div>
        ) || ''},
      {content: ''},
      {content: ''}
    ];

    const rowsData = gridRowsData(handleExpandCollapse , groupByLocations , resourceForecastData, roles, tab, [GRID_CONSTANTS.KEY.BILL_RATE, GRID_CONSTANTS.KEY.COST_RATE], headerButtons, onRoleActionClick, viewOnlyPermission);
    setRows([headerRow, ...rowsData]);
  };

  const onHeaderTabClick = (event, tabIndex) => {
    setSelectedTab(tabIndex);
  };

  const onRoleClick = () => {
    onResourceOrRoleClickHandler(RESOURCE_FORECASTING.ROLE_LABEL);
  };

  const onResourceClick = () => {
    onResourceOrRoleClickHandler(RESOURCE_FORECASTING.RESOURCE_LABEL);
  };

  const handleChanges = (newRows, changes) => {
    if (changes?.length) {
      changes?.map(c => {
        const {payloadType, payloadSubType, id, key, value} = c?.newCell;
        if (c?.newCell.value !== c?.previousCell.value) {
          setRows(newRows);
          setUpdatedCells((v) => {
            const updated = {sourceId: id, key, value, payloadType, payloadSubType, timestamp: Date.now()};
            if (v.length) {
              const idx = v.findIndex(cell => cell.sourceId === updated.sourceId && cell.key === updated.key);
              if (idx !== -1) {
                v[idx] = updated;
              } else {
                v.push(updated);
              }
            } else {
              v.push(updated);
            }
            return [...v];
          });
        }
      });
    }
  };

  useEffect(() => {
    if (updatedCells?.length) {
      debounceHandler(updatedCells);
    }
  }, [updatedCells]);

  useEffect(() => {
    if(collapsedRows?.length){
      const regionLocations = rows?.filter(item => item?.cells[0]?.location);
      const otherRows = rows?.filter(item => !item?.cells[0]?.location)?.filter(item => item?.cells[0]?.label === '');
      const headerRows = rows?.filter(item => item?.label === DATA_GRID_CONTROL_CELL.TYPE.HEADER || item?.cells[0]?.label === DATA_GRID_CONTROL_CELL.TYPE.HEADER);
      const updatedGroupRow = [];
      if (collapsedRows?.length) {
        regionLocations?.forEach(item => {
          const groupRow = item?.cells;
          if (groupRow[0]?.parent && collapsedRows?.includes(groupRow[0]?.location)) {
            groupRow[0].className = groupRow[0].className + ' collapsed-row';
            updatedGroupRow.push({ rowId: item?.rowId , cells: groupRow , height: item?.height});
          } else if (!collapsedRows?.includes(groupRow[0]?.location)) {
            updatedGroupRow.push({ rowId: item?.rowId , cells: groupRow , height: item?.height});
          }
        });
        setGroupedRows([...headerRows ,...updatedGroupRow, ...otherRows]);
      }
    }
  },[collapsedRows]);
  
  const debounceHandler = useDebounce((data) => {
    setUpdatedCells([]);
    callBackHandler(updateResourceForecastAction({
      projectForecastCandidateId,
      metadata: [GRID_CONSTANTS.META_TYPE.PERIOD_SUMMARY, GRID_CONSTANTS.META_TYPE.FY_SUMMARY],
      data,
      actionType: ROLE_ACTION.UPDATE_GRID
    }));
  }, 1500);

  return (
    <div className={`resource-level-forecast-table ${styles.wrapper}`}>
      <DataGridControl
        columns={columns}
        gridRowHeight={dataGridRowHeight}
        isCompactMode
        onCellsChanged={handleChanges}
        rows={collapsedRows?.length ? groupedRows : rows}
        stickyTopRows={2}
      />
    </div>
  );
};

ResourceLevelForecastTable.propTypes = {
  callBackHandler: PropTypes.func,
  dataGridRowHeight: PropTypes.number,
  groupByLocations:PropTypes.bool,
  onResourceOrRoleClickHandler: PropTypes.func,
  onRoleActionClick: PropTypes.func,
  resourceForecastState: PropTypes.object,
  searchText: PropTypes.string,
  selectedHeaderTabEvent: PropTypes.object,
  tableTabIndex: PropTypes.number,
  viewOnlyPermission: PropTypes.bool
};

export default withStyles(styles)(ResourceLevelForecastTable);