import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect, batch } from 'react-redux';
import Loader from '@revin-utils/components/loader';
import { SESSION_STORAGE_ITEM, getSessionItem } from '@revin-utils/utils';
import { setCurrencyList, setCurrencyListRivisions, setFeatureFlag } from 'store/actions/MetaData';

const Bootstrap = ({ globalState, setBootstrapApis }) => {
  useEffect(() => {
    const response = getSessionItem(
      SESSION_STORAGE_ITEM.BOOTSTRAP_DATA
    );

    if (response) {
      setBootstrapApis(response);
    }
  }, []);

  return (
    <>
      {globalState.visibility && (
        <Loader backdropLoader={globalState.backdropLoader} />
      )}
    </>
  );
};

Bootstrap.propTypes = {
  globalState: PropTypes.object,
  setBootstrapApis: PropTypes.func
};

const mapStateToProps = (state) => ({
  globalState: state.global
});

const mapDispatchToProps = (dispatch) => {
  return {
    setBootstrapApis: (payload) =>
      batch(() => {
        dispatch(setCurrencyList(payload.currencyList));
        dispatch(setCurrencyListRivisions(payload.currencyRevisionList));
        dispatch(setFeatureFlag(payload.featureFlag));
      })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Bootstrap);
