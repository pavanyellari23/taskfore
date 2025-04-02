import { call } from 'redux-saga/effects';
import { setApiEndpoint } from '@revin-utils/utils';
import { BASE_URL } from 'utils/environment';

export default function* initSaga() {
  yield call(setApiEndpoint, BASE_URL);
}