import React, { Suspense, lazy } from 'react';
import { Switch, HashRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import Loader from '@revin-utils/components/loader';
import MainLayout from '@revin-utils/layouts/main';
import { RouteWithLayout } from 'components/route-with-layout';
import NotFound from '@revin-utils/components/not-found';
import ErrorScreen from '@revin-utils/components/error-screen';
import ForecastLandingContainer from 'components/pages/forecast-landing/ForecastLandingContainer';
import ProjectForecastingContainer from 'components/pages/project-forecasting/ProjectLevelForecastingContainer';
import { ForecastingSummaryContainer } from 'components/pages/forecasting-summary';
import AccountLevelForecastingContainer from 'components/pages/account-level-forecasting/AccountLevelForecastingContainer';
import PermissionResolver from 'components/pages/permission-resolver/PermissionResolver';
import DashboardContainer from 'components/pages/dashboard-container/DashboardContainer';
import ForecastDashboardContainer from 'components/pages/forecast-dashboard/ForecastDashboardContainer';
import { ErrorComponent } from 'components/common';
import { FORECASTING_SELECTION_ROUTE, FORECASTING_SUMMARY, ROUTES } from 'utils/constants';
import ResourceLevelForecastContainer from 'components/pages/resource-level-forecast/ResourceLevelForecastContainer';
import CustomGroupOpportunitiesContainer from 'components/pages/custom-group-opportunities';

const ForecastSelectionContainer = lazy(() =>
  import('components/pages/forecasting-selection/ForecastSelectionContainer')
);

const Routes = (props) => {

  if(props?.isError){
    window.location.href = '/web/#/forecasting/error';
  }

  return (
    <HashRouter basename="forecasting/">
      <Suspense fallback={<Loader />}>
        <Switch>
          <RouteWithLayout
            component={ErrorComponent}
            exact
            layout={MainLayout}
            path="/error"
            {...props}
          />
          <RouteWithLayout
            component={CustomGroupOpportunitiesContainer}
            exact
            layout={MainLayout}
            path="/:accountForecastCandidateID/custom-group/:customGroupID"
            {...props}
          />
          <RouteWithLayout
            component={DashboardContainer}
            exact
            layout={MainLayout}
            path="/dashboard"
            {...props}
          />
          <PermissionResolver
            component={ForecastDashboardContainer}
            exact
            layout={MainLayout}
            path={ROUTES.FORECAST_DASHBOARD}
            {...props}
          />
          <PermissionResolver
            component={ForecastDashboardContainer}
            exact
            layout={MainLayout}
            path={ROUTES.FORECAST_DASHBOARD_VIEW_ALL_FORECAST}
            {...props}
          />
          <PermissionResolver
            component={ForecastLandingContainer}
            exact
            layout={MainLayout}
            path="/:accountForecastCandidateId"
            {...props}
          />
          <RouteWithLayout
            component={ResourceLevelForecastContainer}
            exact
            layout={MainLayout}
            path="/:accountForecastCandidateId/resource-forecasting/:projectForecastCandidateId"
            {...props}
          />
          <RouteWithLayout
            component={ProjectForecastingContainer}
            exact
            layout={MainLayout}
            path="/:accountForecastCandidateId/project-forecasting/:projectForecastCandidateId"
            {...props}
          />
          <RouteWithLayout
            component={AccountLevelForecastingContainer}
            exact
            layout={MainLayout}
            path="/account-forecasting/:accountForecastCandidateId"
            {...props}
          />
          {
            Object.values(FORECASTING_SUMMARY).map((item, index) => 
              <RouteWithLayout
                component={ForecastingSummaryContainer}
                exact
                layout={MainLayout}
                path={item === FORECASTING_SUMMARY.ACCOUNT ? `/:accountForecastCandidateId/${item}/` : `/:accountForecastCandidateId/${item}/:projectForecastCandidateId`}
                {...props}
                key={index}
              />
            )
          }
          <PermissionResolver
            component={ForecastSelectionContainer}
            exact
            layout={MainLayout}
            path={`/${FORECASTING_SELECTION_ROUTE}/:accountForecastCandidateId/`}
            {...props}
          />
          <RouteWithLayout
            component={NotFound}
            layout={MainLayout}
            path="/"
          />
          <RouteWithLayout
            component={ErrorScreen}
            layout={MainLayout}
            path="/"
          />
        </Switch>
      </Suspense>
    </HashRouter>
  );
};

Routes.propTypes = {
  isError: PropTypes.bool
};
  
export default Routes;
