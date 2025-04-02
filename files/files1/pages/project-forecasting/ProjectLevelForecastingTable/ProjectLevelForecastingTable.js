import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import _cloneDeep from 'lodash/cloneDeep';
import { withStyles } from '@material-ui/core/styles';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { TABLE_TYPES, getValuesFromSplitCellData, getTransformedNumber } from '@revin-utils/utils';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { buildProjectForecastData, gridUpdate } from './helper';
import { splitCellUpdate, updateSplitCellValue } from 'utils/forecastingCommonFunctions';
import { MAX_NUMBER_LIMIT } from 'utils/constants';
import styles from './ProjectLevelForecastingTable.module.scss';

const ProjectLevelForecastingTable = ({
  callBackHandler,
  forecastControlsState,
  forecastingData,
  handleRowBtnClick,
  thresholdValue,
  handleEditTableCellHead,
  viewOnlyPermission,
  setTooltip,
  gridUpdateEvent
}) => {

  const [projectResponse, setProjectResponse] = useState({});

  useEffect(() => {
    if(forecastControlsState?.modifiedControls?.projectControls?.length > 0){
      gridUpdateEvent(true);
    }else{
      gridUpdateEvent(false);
    }
  }, [JSON.stringify(forecastControlsState?.modifiedControls?.projectControls)]);

  useEffect(() => {
    if(forecastingData){
      setProjectResponse(buildProjectForecastData(forecastingData,thresholdValue, viewOnlyPermission));
    }else{
      setProjectResponse({});
    }
  }, [forecastingData,thresholdValue]);

  const onGridChanged = (gridObj, changes) => {
    setTooltip(false);
    setProjectResponse({...projectResponse, 'resourceData': gridObj});
    const payloadData = _cloneDeep(forecastingData);
    const splitCellEvent = typeof(changes[0].value) === 'object';
    const errorCell = changes[0]?.cell?.headerItem?.showErrorCell;
    if (splitCellEvent && !errorCell) {
      changes.forEach(({cell,value}) => {
        const {planType, id, resourceId, topCellValue, bottomCellValue} = cell.cellDataObj;
        const splitCellArr = getValuesFromSplitCellData(value);
        const valueToUpdate = {
          [topCellValue]: getTransformedNumber(splitCellArr[0]),
          [bottomCellValue]: getTransformedNumber(splitCellArr[1])
        };
        updateSplitCellValue(
          planType,
          id,
          resourceId,
          valueToUpdate,
          payloadData
        );
      });
    } else {
      //update the payload, to update the state variable
      gridUpdate(gridObj, payloadData);
    }
   
    gridUpdateEvent(true);
    callBackHandler({
      type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
      payload: {
        projectForecastingDataLocalObject: payloadData
      }
    });
  };

  const onSplitGridChanged = (value, planType, id, resourceId, valueToUpdate) => {
    const payloadData = _cloneDeep(forecastingData);
    //split cell update
    splitCellUpdate(value, planType, id, resourceId, valueToUpdate, payloadData);
    gridUpdateEvent(true);
    callBackHandler({
      type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
      payload: {
        projectForecastingDataLocalObject: payloadData
      }
    });
  };

  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      <ForecastDataSheetControlWrapper
        allowNegativeValue
        disablePerfectScrollBar
        grid={projectResponse?.resourceData}
        handleEditTableCellHead={handleEditTableCellHead}
        handleRowBtnClick={handleRowBtnClick}
        header={projectResponse?.headerData}
        headerLength={projectResponse?.headerData?.length}
        isFloatNumber
        isNonNegative={false}
        limit
        limitRange={MAX_NUMBER_LIMIT}
        onGridChanged={onGridChanged}
        onSplitGridChanged={onSplitGridChanged}
        parentHeaderColSpan={1}
        secondaryHeaders={projectResponse?.secondaryHeader}
        type={TABLE_TYPES.RESOURCE}
        viewOnlyPermission={viewOnlyPermission}
      /> 
    </div>
  );
};

ProjectLevelForecastingTable.propTypes = {
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  forecastingData: PropTypes.object,
  gridUpdateEvent: PropTypes.func,
  handleEditTableCellHead: PropTypes.func,
  handleRowBtnClick: PropTypes.func,
  setTooltip: PropTypes.func,
  thresholdValue: PropTypes.number,
  viewOnlyPermission: PropTypes.bool
};

export default withStyles(styles)(ProjectLevelForecastingTable);

