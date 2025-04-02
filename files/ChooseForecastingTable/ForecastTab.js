import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import CustomTab from '@revin-utils/components/custom-tab';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import { FORECAST_TAB, PROJECT_LEVEL_FORECAST, RESOURCE_LEVEL_FORECAST } from 'utils/constants';
import { forecastType } from 'utils/helper';

const ForecastTab = ({ handleForecastTab, forecastTab, opportunityId, deliveryType,billingType}) => {
  const [disabled,setDisabled] = useState(false);

  useEffect(() => {
    setDisabled(forecastType(deliveryType) === PROJECT_LEVEL_FORECAST);
    setDisabled(forecastType(billingType) === PROJECT_LEVEL_FORECAST);
  }, [deliveryType, billingType]);

  const onChange = (e, value) => {
    if (forecastType(deliveryType) === RESOURCE_LEVEL_FORECAST) {
      handleForecastTab(opportunityId, value);
    }
  };
  
  return (
    <ArrowWrapper
      data={opportunityId}
      handleChange={() => { }}
    >
      <CustomTab
        className="small-tab"
        disabled={disabled}
        onChange={onChange}
        tabList={FORECAST_TAB}
        value={forecastTab === RESOURCE_LEVEL_FORECAST ? 1 : 0}
      />
    </ArrowWrapper>
  );
};

ForecastTab.propTypes = {
  billingType : PropTypes.string,
  deliveryType : PropTypes.string,
  forecastTab: PropTypes.string,
  handleForecastTab: PropTypes.func,
  opportunityId: PropTypes.string
};

export default ForecastTab;
