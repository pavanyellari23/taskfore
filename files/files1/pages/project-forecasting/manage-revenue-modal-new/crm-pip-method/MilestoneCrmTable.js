import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import { buildCRMGrid } from './helper';
import { ORIGIN } from 'utils/constants';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { updateProjectForecastingWithAPI } from 'store/actions/ProjectForecasting';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { initilizeAdjustmentRow } from 'components/pages/project-forecasting/helper';
import styles from './MilestoneCrmTable.module.scss';

const MilestoneCrmTable = ({callBackHandler, projectForecastingState}) => {
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
    if(projectForecastingState?.projectForecastingDataLocalObject?.projectRevenueComputationMethod != 'CRM_PIP'){
      callBack({projectRevenueComputationMethod: 'CRM_PIP', projectCostComputationMethod: 'CRM_PIP'});
    }
  }, []);

  useEffect(() => {
    if(projectForecastingState?.projectForecastingDataLocalObject?.projectRevenueComputationMethod){
      setGridData(buildCRMGrid(projectForecastingState.projectForecastingDataLocalObject));
    }
  }, [projectForecastingState?.projectForecastingDataLocalObject]);

  return (
    <Box className={`forecasting-table mt-3 ${styles.wrapper}`}>
      <ForecastDataSheetControlWrapper
        grid={gridData?.resourceSummary}
        header={gridData?.headerData}
        type="pricing-summery"
      />
    </Box>
  );
};

MilestoneCrmTable.propTypes = {
  callBackHandler: PropTypes.func,
  projectForecastingState: PropTypes.object
};

export default MilestoneCrmTable;
