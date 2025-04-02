import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@material-ui/core';
import styles from './ManageCostCrmTable.module.scss';
import { TABLE_TYPES, CELL_VALUE_TYPES } from '@revin-utils/utils';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import {MAX_NUMBER_LIMIT, RESOURCE_FORECASTING} from 'utils/constants';
import {
  buildCrmPipCostPlanData
} from 'components/pages/project-forecasting/manage-cost-modal/helper';

const ManageCostCrmTable = ({
  projectForecastingState
}) => {
  const [responseData, setResponseData] = useState({});
  const tabLabels = [
    { label: RESOURCE_FORECASTING.FTE, id: CELL_VALUE_TYPES.FTE },
    { label: RESOURCE_FORECASTING.REVENUE_COST, id: CELL_VALUE_TYPES.REVENUE }
  ];

  useEffect(() => {
    setResponseData(buildCrmPipCostPlanData(projectForecastingState?.projectForecastingDataLocalObject));
  },[projectForecastingState?.projectForecastingDataLocalObject]);

  return (
    <Box className={`forecasting-table ${styles.wrapper}`}>
      <ForecastDataSheetControlWrapper
        grid={responseData.resourceData}
        header={responseData.headerData}
        isNonNegative={false}
        limit
        limitRange={MAX_NUMBER_LIMIT}
        secondaryHeaders={responseData.secondaryHeader}
        switchView
        tabLabels={tabLabels}
        type={TABLE_TYPES.RESOURCE}
      />
    </Box>
  );
};

ManageCostCrmTable.propTypes = {
  projectForecastingDataLocalObject: PropTypes.object,
  projectForecastingState: PropTypes.object
};

export default ManageCostCrmTable;
