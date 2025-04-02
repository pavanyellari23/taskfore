import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ForecastDashboardSummery from './components/forecast-dashboard-summary';
import { FORECASTING_SELECTION_ROUTE, OPPORTUNITY_SELECTION_ACCESS_ROLES } from 'utils/constants';

const ForecastDashboard = ({
  callBackHandler,
  dashboardState,
  metaData
}) => {
  const history = useHistory();

  useEffect(() => {
    if(OPPORTUNITY_SELECTION_ACCESS_ROLES.includes(metaData.entitlement) && location !== FORECASTING_SELECTION_ROUTE){
      history.push(`${FORECASTING_SELECTION_ROUTE}/${metaData?.parentAccounts[0]?.attributes.id}`);
    }
  }, []);

  return (
    <>
      {(!OPPORTUNITY_SELECTION_ACCESS_ROLES.includes(metaData.entitlement) && metaData.entitlement) && (
        <ForecastDashboardSummery
          callBackHandler={callBackHandler}
          dashboardState={dashboardState}
          metaData={metaData}
        />
      )};
    </>
    
  );
};

ForecastDashboard.propTypes = {
  callBackHandler: PropTypes.func,
  dashboardState: PropTypes.object,
  metaData: PropTypes.object
};

export default ForecastDashboard;
