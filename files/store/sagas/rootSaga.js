import { all, fork } from 'redux-saga/effects';
import initSaga from './InitSaga';
import MetaDataSaga from './MetaDataSaga';
import OpportunitiesSaga from './OpportunitiesSaga';
import ResourceForecastingSaga from './ResourceForecastingSaga';
import ProjectForecastingSaga from './ProjectForecastingSaga';
import ForecastControlsSaga from './ForecastControlsSaga';
import AccountForecastingSaga from './AccountForecastingSaga';
import ForecastDashboardSaga from './ForecastDashboardSaga';
import ResourceForecastSaga from './ResourceForecastSaga';

export default function* () {
  yield all([
    fork(initSaga),
    fork(OpportunitiesSaga),
    fork(MetaDataSaga),
    fork(ResourceForecastingSaga),
    fork(ProjectForecastingSaga),
    fork(ForecastControlsSaga),
    fork(AccountForecastingSaga),
    fork(ForecastDashboardSaga),
    fork(ResourceForecastSaga)
  ]);
}
