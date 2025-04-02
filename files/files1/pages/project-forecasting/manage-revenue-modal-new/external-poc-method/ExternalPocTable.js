import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import _cloneDeep from 'lodash/cloneDeep';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { buildCRMGrid, gridUpdateMilestone } from './helper';
import { updateProjectForecastingWithAPI } from 'store/actions/ProjectForecasting';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { COST_REVENUE_TYPE, MAX_NUMBER_LIMIT, ORIGIN } from 'utils/constants';
import { initilizeAdjustmentRow } from 'components/pages/project-forecasting/helper';
import styles from './ExternalPocTable.module.scss';

const ExternalPocTable = ({callBackHandler, projectForecastingState}) => {
  const [gridData, setGridData] = useState();

  const callBack = (selectedTab) => {
    const projectForecastData = projectForecastingState?.projectForecastingDataLocalObject;
    const forecastingPeriodSummary = initilizeAdjustmentRow(projectForecastData?.forecastingPeriodSummary);
    const payload = {...projectForecastData, forecastingPeriodSummary, ...selectedTab};
    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: projectForecastData?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      actionOrigin: ORIGIN.FIXED_BID_MODAL,
      payload
    }));
  };

  useEffect(() => {
    if(projectForecastingState.projectForecastingDataLocalObject){
      setGridData(buildCRMGrid(projectForecastingState.projectForecastingDataLocalObject));
    }
  }, [projectForecastingState.projectForecastingDataLocalObject]);
  
  useEffect(() => {
    callBack({projectRevenueComputationMethod: COST_REVENUE_TYPE.EXTERNAL_POC, projectCostComputationMethod: COST_REVENUE_TYPE.EXTERNAL_POC});
  }, []);

  const onGridChanged = (gridObj) => {

    const payloadData = _cloneDeep(projectForecastingState?.projectForecastingDataLocalObject);
    gridUpdateMilestone(gridObj, payloadData);
    
    callBackHandler({
      type: ProjectForecastingActionType.UPDATE_PROJECT_FORECASTING,
      payload: {
        projectForecastingDataLocalObject: payloadData
      }
    });
  };

  return (
    <Box className={`forecasting-table mt-3 ${styles.wrapper}`}>
      <ForecastDataSheetControlWrapper
        grid={gridData?.resourceSummary}
        header={gridData?.headerData}
        limitRange={MAX_NUMBER_LIMIT}
        onGridChanged={onGridChanged}
        type="pricing-summery"
      />
    </Box>
  );
};

ExternalPocTable.propTypes = {
  callBackHandler: PropTypes.func,
  projectForecastingState: PropTypes.object
};

export default ExternalPocTable;
