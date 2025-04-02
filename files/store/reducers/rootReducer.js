import { combineReducers } from 'redux';
import GlobalReducer from './GlobalReducer';
import MetaDataReducer from './MetaDataReducer';
import OpportunitiesReducer from './OpportunitiesReducer';
import ResourceForecastingReducer from './ResourceForecastingReducer';
import ProjectForecastingReducer from './ProjectForecastingReducer';
import ForecastControlsReducer from './ForecastControlsReducer';
import AccountForecastingReducer from './AccountForecastingReducer';
import ForecastDashboardReducer from './ForecastDashboardReducer';
import ResourceForecastReducer from './ResourceForecastReducer';

const rootReducer = combineReducers({
  global: GlobalReducer,
  metaData: MetaDataReducer,
  opportunities: OpportunitiesReducer,
  resourceForecasting: ResourceForecastingReducer,
  projectForecasting: ProjectForecastingReducer,
  forecastControls: ForecastControlsReducer,
  accountForecasting: AccountForecastingReducer,
  forecastDashboard: ForecastDashboardReducer,
  resourceForecastState: ResourceForecastReducer
});

export default rootReducer;
