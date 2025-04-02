import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import AccountLevelForecasting from 'components/pages/account-level-forecasting/AccountLevelForecasting';
import { editResourceAction, getAccountForecasting, getResourceUserAction, getResourceUsersAction, resetResourceModalErrorAction,
  resetRoleModalErrorAction, updateAccountForecastingWithAPI, getInvestmentCategories, updateAccountForecastingState, addUpdateResourceError } from 'store/actions/AccountForecasting';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { getInitialRoleDataAction } from 'store/actions/MetaData';
import { GlobalActionType } from 'store/types/GlobalActionType';
import { toggleForecastSaved } from 'store/actions/Global';

const AccountLevelForecastingContainer = ({
  accountForecastingState,
  forecastSaved,
  editResourceDispatcher,
  getAccountForecastingDispatcher,
  getInitialRoleDataDispatcher,
  getResourceUserDispatcher,
  getResourceUsersDispatcher,
  metaDataState,
  resetResourceModalErrorDispatcher,
  resetRoleModalErrorDispatcher,
  updateAccountForecastingWithAPIDispatcher,
  getInvestmentCategoriesAction,
  updateAccountForecastingStateAction,
  toggleForecastSavedAction,
  addUpdateResourceErrorAction
}) => {

  const callBackHandler = ({ type, payload }) => {
    switch (type) {
      case AccountForecastingActionType.ADD_UPDATE_RESOURCE_ERROR:
        addUpdateResourceErrorAction(payload);
        break;
      case AccountForecastingActionType.GET_ACCOUNT_FORECASTING_DATA:
        getAccountForecastingDispatcher(payload);
        break;
      case AccountForecastingActionType.GET_INVESTMENT_CATEGORIES:
        getInvestmentCategoriesAction(payload);
        break;
      case AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_STATE:
        updateAccountForecastingStateAction(payload);
        break;
      case MetaDataActionType.GET_INITIAL_ROLE_DATA:
        getInitialRoleDataDispatcher(payload);
        break;
      case AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API:
        updateAccountForecastingWithAPIDispatcher(payload);
        break;
      case AccountForecastingActionType.GET_RESOURCE_USERS:
        getResourceUsersDispatcher(payload);
        break;
      case AccountForecastingActionType.GET_RESOURCE_USER:
        getResourceUserDispatcher(payload);
        break;
      case AccountForecastingActionType.EDIT_RESOURCE:
        editResourceDispatcher(payload);
        break;
      case AccountForecastingActionType.RESET_RESOURCE_MODAL_ERROR:
        resetResourceModalErrorDispatcher(payload);
        break;
      case AccountForecastingActionType.RESET_ROLE_MODAL_ERROR:
        resetRoleModalErrorDispatcher(payload);
        break;
      case GlobalActionType.TOGGLE_FORECAST_SAVED:
        toggleForecastSavedAction(payload);
        break;
      default:
        break;  
    }
  };

  return(
    <AccountLevelForecasting 
      callBackHandler={callBackHandler}
      forecastSaved={forecastSaved}
      forecastingState={accountForecastingState}
      metaDataState={metaDataState}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    accountForecastingState: state.accountForecasting,
    forecastSaved: state.global.isForecastSaved,
    metaDataState: state.metaData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addUpdateResourceErrorAction: (payload) => {
      dispatch(addUpdateResourceError(payload));
    },
    getAccountForecastingDispatcher: (payload) => {
      dispatch(getAccountForecasting(payload));
    },
    getInvestmentCategoriesAction: (payload) => {
      dispatch(getInvestmentCategories(payload));
    },
    getInitialRoleDataDispatcher: (payload) => {
      dispatch(getInitialRoleDataAction(payload));
    },
    updateAccountForecastingWithAPIDispatcher: (payload) => {
      dispatch(updateAccountForecastingWithAPI(payload));
    },
    updateAccountForecastingStateAction: (payload) => {
      dispatch(updateAccountForecastingState(payload));
    },
    getResourceUsersDispatcher: (payload) => {
      dispatch(getResourceUsersAction(payload));
    },
    getResourceUserDispatcher: (payload) => {
      dispatch(getResourceUserAction(payload));
    },
    editResourceDispatcher: (payload) => {
      dispatch(editResourceAction(payload));
    },
    resetResourceModalErrorDispatcher: (payload) => {
      dispatch(resetResourceModalErrorAction(payload));
    },
    resetRoleModalErrorDispatcher: (payload) => {
      dispatch(resetRoleModalErrorAction(payload)); 
    },
    toggleForecastSavedAction: (payload) => {
      dispatch(toggleForecastSaved(payload));
    }
  };
};

AccountLevelForecastingContainer.propTypes = {
  accountForecastingState: PropTypes.object,
  addUpdateResourceErrorAction: PropTypes.func,
  editResourceDispatcher: PropTypes.func,
  forecastSaved: PropTypes.bool,
  getAccountForecastingAction: PropTypes.func,
  getAccountForecastingDispatcher: PropTypes.func,
  getInitialRoleDataDispatcher: PropTypes.func,
  getInvestmentCategoriesAction: PropTypes.func,
  getResourceUserDispatcher: PropTypes.func,
  getResourceUsersDispatcher: PropTypes.func,
  metaDataState: PropTypes.object,
  resetResourceModalErrorDispatcher: PropTypes.func,
  resetRoleModalErrorDispatcher: PropTypes.func,
  toggleForecastSavedAction: PropTypes.func,
  updateAccountForecastingAction: PropTypes.func,
  updateAccountForecastingStateAction: PropTypes.func,
  updateAccountForecastingWithAPIDispatcher: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(AccountLevelForecastingContainer));
  
