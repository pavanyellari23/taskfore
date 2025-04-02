import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import { TABLE_TYPES, CELL_VALUE_TYPES, FORM_LABELS, getSessionItem } from '@revin-utils/utils';
import EmptyScreen from '@revin-utils/components/empty-screen';
import NoRecordFound from 'assets/images/no-record-found.svg';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import SnapButton from '@pnp-snap/snap-button';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { RESOURCE_FORECASTING, RECALCULATE, EMPTY_SCREEN_MESSAGE, TYPE, OPPORTUNITY_SEARCH, SESSION_STORAGE_KEYS } from 'utils/constants';
import { getFilteredSearchData, getSubmissionMessage } from 'utils/commonFunctions';
import { splitCellUpdate } from 'utils/forecastingCommonFunctions';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { ResourceForecastingActionType } from 'store/types/ResourceForecastingActionType';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import {
  buildResourcePlanData
} from 'components/pages/resource-level-forecasting/resource-level-forecast-grid/helper';
import { Maximize2, Minimize2 } from 'react-feather';
import PerfectScrollbar from 'react-perfect-scrollbar';
import sandTimer from 'assets/images/sand_timer.gif';
import styles from './ResourceLevelForecastGrid.module.scss';

const ResourceLevelForecastGrid = ({
  disablePerfectScrollBar,
  handleRoleSelectionModal,
  handleQuickAction,
  openResourceModal,
  handleFilter,
  handleUpdateForecastData,
  setIsGridUpdate,
  selectedGrid,
  setPayLoadData,
  isGridUpdate,
  onGridChanged,
  gridDataApiResponse,
  forecastError,
  callBackHandler,
  viewOnlyPermission,
  handleTableMaximizeEvent,
  className,
  isCollapseSummary
}) => {
  const [responseData, setResponseData] = useState({});
  const [filteredData,setFilteredData] =useState(null);
  const [searchText, setSearchText] = useState('');
  const [tableMaximize, setTableMaximize] = useState(true);
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);

  const tabLabels = [
    { label: RESOURCE_FORECASTING.FTE, id: CELL_VALUE_TYPES.FTE },
    { label: RESOURCE_FORECASTING.REVENUE_COST, id: CELL_VALUE_TYPES.REVENUE }
  ];
 
  useEffect(() => {
    const filtered = getFilteredSearchData(gridDataApiResponse?.resourceForecastingData?.forecastingRoles, searchText);
    setFilteredData(filtered);
  }, [searchText, gridDataApiResponse?.resourceForecastingData?.forecastingRoles]);
  
  useEffect(() => {
    const showRevenueRow = false;
    if(gridDataApiResponse?.iserror === false){
      if (filteredData && searchText.length > 0) {
        setResponseData(buildResourcePlanData({...gridDataApiResponse.resourceForecastingData, forecastingRoles: filteredData}, selectedGrid, TYPE.RESOURCE_FORECASTING, showRevenueRow, viewOnlyPermission));
      } else {
        if (gridDataApiResponse?.resourceForecastingData) {
          setResponseData(buildResourcePlanData(gridDataApiResponse.resourceForecastingData, selectedGrid, TYPE.RESOURCE_FORECASTING, showRevenueRow, viewOnlyPermission));
        }
      }
    }
  }, [gridDataApiResponse?.resourceForecastingData, gridDataApiResponse?.resourceSummary, selectedGrid, filteredData, searchText]); 
  
  const onSplitGridChanged = (value, planType, id, resourceId, valueToUpdate) => {
    const payloadData = _cloneDeep(gridDataApiResponse);
    //split cell update
    splitCellUpdate(value, planType, id, resourceId, valueToUpdate, payloadData?.resourceForecastingData);
    setPayLoadData(payloadData.resourceForecastingData);
    setIsGridUpdate(true);
    callBackHandler({
      type: ResourceForecastingActionType.UPDATE_RESOURCE_FORECASTING,
      payload: payloadData
    });
  };

  const handleTableMaximize = () => {
    setTableMaximize(!tableMaximize);
    handleTableMaximizeEvent();
  };

  const gridHeight = tableMaximize ? `calc(76vh - ${(isCollapseSummary ? 16 : 70) + (forecastError?.length ? 37 : 0)}px)` :
  `calc(70vh - ${(isCollapseSummary ? 52 : 171) + (forecastError?.length ? 40 : 0)}px)`;

  return (
    <div className={`forecasting-table ${styles.wrapper} ${className}`}>
      {
        getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked &&
          <CustomAlertBar>
            <div className="d-flex align-items-center position-relative">
              <img
                alt="empty screen"
                className="gif-img"
                src={sandTimer}
              />
              <span className="ml-3">
                {getSubmissionMessage({
                  startDateTime: forecastCycles?.startDateTime,
                  endDateTime: forecastCycles?.endDateTime
                })}
              </span>
            </div>
          </CustomAlertBar>
      }
      {
        !!forecastError?.length && (
          <DynamicAlertList
            alertList={forecastError}
            className={tableMaximize && 'sm-alert-bar'}
            collapse
            isExpandable
          />
        )}
      <div
        className="d-flex justify-content-between align-items-center mb-1 mt-1"
        id="grid-search-wrapper"
      >
        <OpportunitiesSearch 
          label={OPPORTUNITY_SEARCH.LABEL}
          setSearchText = {setSearchText}
        />

        <div className="d-flex align-items-center">
          {isGridUpdate && (
            <div className="d-flex align-items-center">
              <InfoTooltip
                infoContent={RECALCULATE.info}
              />
              <SnapButton
                className="tertiary-button"
                handleClick={handleUpdateForecastData}
                label={RECALCULATE.LABEL}
                name={RECALCULATE.LABEL}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          )}
          <SnapButton
            className={`ml-2 ${styles['expand-button']} ${tableMaximize &&
                  styles['expanded']}`}
            handleClick={handleTableMaximize}
            icon={
              <div className={`d-flex ${styles['icon-wrapper']}`}>
                {tableMaximize ? (
                  <Minimize2 className={styles['icon-minimize']} />
                ) : (
                  <Maximize2 className={styles['icon-maximize']} />
                )}
              </div>
            }
            isIcon
            name="edit"
            type="primary"
            variant="contained"
          />
        </div>  
      </div>
      
      {(filteredData && filteredData.length > 0) || !searchText ? (
        <PerfectScrollbar
          className={'custom-scrollbar'}
          style={{height: gridHeight}}
        >
          <ForecastDataSheetControlWrapper
            disablePerfectScrollBar={disablePerfectScrollBar}
            grid={responseData.resourceData}
            handleFilter={handleFilter}
            handleQuickAction={handleQuickAction}
            handleRoleSelectionModal={handleRoleSelectionModal}
            header={responseData.headerData}
            onGridChanged={onGridChanged}
            onSplitGridChanged={onSplitGridChanged}
            openResourceModal={openResourceModal}
            parentHeaderColSpan={'1'}
            secondaryHeaders={responseData.secondaryHeader}
            selectedGrid={selectedGrid}
            tabLabels={tabLabels}
            type={TABLE_TYPES.RESOURCE}
            viewOnlyPermission={viewOnlyPermission}
          />
        </PerfectScrollbar>
      ) : (    
        <EmptyScreen
          center
          className={styles['no-opportunity-card']}
          image={NoRecordFound}
          subTitle={EMPTY_SCREEN_MESSAGE.SUBTITLE}
          title={EMPTY_SCREEN_MESSAGE.TITLE}
        /> 
      )}

    </div>
  );
};

ResourceLevelForecastGrid.propTypes = {
  callBackHandler: PropTypes.func,
  className: PropTypes.string,
  disablePerfectScrollBar: PropTypes.bool,
  forecastError: PropTypes.arrayOf(PropTypes.object),
  gridDataApiResponse: PropTypes.object,
  handleClickOpen: PropTypes.func,
  handleFilter: PropTypes.func,
  handleQuickAction: PropTypes.func,
  handleRoleSelectionModal: PropTypes.func,
  handleTableMaximizeEvent: PropTypes.func,
  handleUpdateForecastData: PropTypes.func,
  isCollapseSummary: PropTypes.bool,
  isGridUpdate: PropTypes.bool,
  onGridChanged: PropTypes.func,
  openResourceModal: PropTypes.func,
  searchText:PropTypes.string,
  selectedGrid: PropTypes.string,
  setIsGridUpdate: PropTypes.func,
  setPayLoadData: PropTypes.func,
  viewOnlyPermission: PropTypes.bool
};

export default ResourceLevelForecastGrid;
