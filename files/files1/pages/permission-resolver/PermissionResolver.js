import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getEntitlements, getForecastCyclesAction, getParentAccountOptionsAction } from 'store/actions/MetaData';
import { RouteWithLayout } from 'components/route-with-layout';
import { FORECASTING_SELECTION_ROUTE, OPPORTUNITY_SELECTION_ACCESS_ROLES, VIEW_ONLY_ACCESS_ROLES } from 'utils/constants';

const PermissionResolver = ({ getParentAccountOptionsDispatcher, getEntitlementsAction, metaData, getForecastCyclesActionDispatcher, ...rest }) => {
  const history = useHistory();
  const location = window.location.href.split('/')[6];
  useEffect(() => {
    if(!metaData?.parentAccounts?.length && metaData?.entitlement && !VIEW_ONLY_ACCESS_ROLES.includes(metaData?.entitlement)){
      // Get parent account dropdown
      getParentAccountOptionsDispatcher({
        forecastEntitlement: {
          forecastEntitlementView : metaData?.entitlement
        }});
    }

    if(!metaData?.entitlement){
      getEntitlementsAction();
    }
  }, [metaData?.entitlement]);

  
  useEffect(() => {
    if(!metaData.forecastCycles){
      getForecastCyclesActionDispatcher();
    }
  }, [metaData.forecastCycles]);

  useEffect(() => {
    if(metaData?.parentAccounts?.length){

      if(OPPORTUNITY_SELECTION_ACCESS_ROLES.includes(metaData.entitlement) && location !== FORECASTING_SELECTION_ROUTE){
        history.push(`/${FORECASTING_SELECTION_ROUTE}/${metaData?.parentAccounts[0]?.attributes.id}`);
      }
    }
  }, [metaData?.parentAccounts, metaData.entitlement]);

  return (
    <RouteWithLayout {...rest} />
  );
};

const mapStateToProps = (state) => ({
  metaData: state.metaData
});

const mapDispatchToProps = (dispatch) => ({
  getEntitlementsAction: () => {
    dispatch(getEntitlements());
  },
  getForecastCyclesActionDispatcher: () => {
    dispatch(getForecastCyclesAction());
  },
  getParentAccountOptionsDispatcher: (payload) => {
    dispatch(getParentAccountOptionsAction(payload));
  }
});

PermissionResolver.propTypes = {
  getEntitlementsAction: PropTypes.func,
  getForecastCyclesActionDispatcher: PropTypes.func,
  getParentAccountOptionsDispatcher: PropTypes.func,
  metaData: PropTypes.object
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionResolver);