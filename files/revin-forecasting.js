import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import {
  get,
  getSessionItem,
  resolveResponse,
  updateObjectInSession,
  SESSION_STORAGE_ITEM,
  removeLoader,
  placeLoader,
  clearBootstrapDataOnPageReload
} from '@revin-utils/utils';
import { COPPER_SERVICE_URL } from 'utils/environment';
import App from './App';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: App,
  errorBoundary() {
    // Customize the root error boundary for your microfrontend here.
    return <App isError/>;
  }
});

const loadBootstrapApis = async () => {
  placeLoader();
  await clearBootstrapDataOnPageReload();
  const bootStrapData = getSessionItem(
    SESSION_STORAGE_ITEM.BOOTSTRAP_DATA
  );
  const featureFlagPromise = bootStrapData?.featureFlag
    ? new Promise((resolve) => {resolve(bootStrapData?.featureFlag);})
    : get(`${COPPER_SERVICE_URL}users/me/features`);

  return Promise.allSettled([
    featureFlagPromise
  ]);
};


// @todo : removed opportunity related code, as of now, we need to put some calls in bootstrap file.
export const bootstrap = () => {
  return loadBootstrapApis().then((response) => {
    const [featureFlagPromise] = response;
    const data = {
      featureFlag: resolveResponse(featureFlagPromise.value)?.data?.data || resolveResponse(featureFlagPromise)
    };
    updateObjectInSession(SESSION_STORAGE_ITEM.BOOTSTRAP_DATA, data);
    removeLoader();
  }).catch(()=>{
    throw new Error();
  });
};

export const { mount, unmount } = lifecycles;
