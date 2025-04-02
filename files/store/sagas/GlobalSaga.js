import { put } from 'redux-saga/effects';
import { ERROR_CODES } from '@revin-utils/utils';
import { showErrorToasts } from '../../../src/store/actions/Global';

export default function* handleApiErrorMessages(errorResponse) {
  if (errorResponse?.status === ERROR_CODES.STATUS_400) {
    yield put(showErrorToasts(errorResponse?.data?.error?.errors));
  }
}
