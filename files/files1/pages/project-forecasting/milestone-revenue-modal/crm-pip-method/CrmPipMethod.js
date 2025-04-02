import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import SnapButton from '@pnp-snap/snap-button';
import { TABLE_TYPES, FORM_LABELS } from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import {buildPocCrmPipGrid} from './helper';
import { updateProjectForecastingWithAPI } from 'store/actions/ProjectForecasting';
import { formatGridPayloadToAPIPayload } from 'utils/forecastingCommonFunctions';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { RECALCULATE, ORIGIN, MAX_NUMBER_LIMIT } from 'utils/constants';
import DynamicAlertList from 'components/common/dynamic-alert-list/DynamicAlertList';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import styles from './CrmPipMethod.module.scss';

const CrmPipMethod = ({callBackHandler, forecastError, forecastingState, idtUpdate, setRevenueModalPayload, costUpdate, setShowAlertErrorMessage}) => {
  const [responseData, setResponseData] = useState();
  const [isGridUpdate, setIsGridUpdate] = useState(false);

  useEffect(() => {
    const gridFormatData = buildPocCrmPipGrid(forecastingState);
    setResponseData(gridFormatData);
    setShowAlertErrorMessage(gridFormatData.resourceData[2].find((item) => item.showErrorCell));
  }, [forecastingState]);

  const onGridChanged = (grid) => {
    const resData = {...responseData, resourceData: grid};
    setResponseData(resData);
    setIsGridUpdate(true);
    const forecastPoCDetails = formatGridPayloadToAPIPayload(forecastingState?.forecastPoCDetails?.deliveryCompletionPercentagePeriodDetails, resData.resourceData, ['deliveryCompletionPercentage']);
    const forecastingPeriodSummary = formatGridPayloadToAPIPayload(forecastingState?.forecastingPeriodSummary, resData.resourceData, ['resourceCostAdjustments']);
    setRevenueModalPayload({...forecastingState, forecastingPeriodSummary, forecastPoCDetails : {...forecastingState?.forecastPoCDetails,  deliveryCompletionPercentagePeriodDetails:forecastPoCDetails}});
  };

  const handleRecalculate = () => {

    const forecastPoCDetails = formatGridPayloadToAPIPayload(forecastingState?.forecastPoCDetails?.deliveryCompletionPercentagePeriodDetails, responseData.resourceData, ['deliveryCompletionPercentage']);
    const forecastingPeriodSummary = formatGridPayloadToAPIPayload(forecastingState?.forecastingPeriodSummary, responseData.resourceData, ['resourceCostAdjustments']);
    const payload = {...forecastingState, forecastingPeriodSummary, forecastPoCDetails : {...forecastingState?.forecastPoCDetails, ...costUpdate, deliveryCompletionPercentagePeriodDetails:forecastPoCDetails}};

    callBackHandler(updateProjectForecastingWithAPI({
      dryRun: true,
      isNotLoading: true,
      projectForecastCandidateId: forecastingState?.projectForecastCandidateId,
      type: ProjectForecastingActionType.SET_UPDATE_PROJECT_FORECASTING,
      payload,
      actionOrigin: ORIGIN.FORECAST_GRID_ORIGIN
    }));
  };

  return (
    <Box className={`forecasting-table my-2 ${styles.wrapper}`}>
      {forecastError && <DynamicAlertList alertList={forecastError}/>}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h3 className={styles.heading}>Project Resources</h3>
        <div className="d-flex align-items-center">
          {(isGridUpdate || idtUpdate) && (
            <>
              <InfoTooltip
                infoContent={RECALCULATE.info}
              />
              <SnapButton
                className="tertiary-button"
                handleClick={handleRecalculate}
                label={RECALCULATE.LABEL}
                name={RECALCULATE.LABEL}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </>
          )}
        </div>
      </div>
      {responseData?.resourceData && (
        <ForecastDataSheetControlWrapper
          grid={responseData.resourceData}
          header={responseData.headerData}
          isFloatNumber
          isNonNegative={false}
          limit
          limitRange={MAX_NUMBER_LIMIT}
          onGridChanged={onGridChanged}
          type={TABLE_TYPES.PRICING_SUMMARY}
        /> 
      )}
      
    </Box>
  );};

CrmPipMethod.propTypes = {
  callBackHandler: PropTypes.func,
  costUpdate: PropTypes.object,
  forecastError: PropTypes.object,
  forecastingState: PropTypes.object,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  idtUpdate: PropTypes.bool,
  open: PropTypes.bool,
  setRevenueModalPayload: PropTypes.func,
  setShowAlertErrorMessage: PropTypes.func
};

export default CrmPipMethod;