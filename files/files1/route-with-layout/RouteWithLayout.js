import React, { useState, useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import PropTypes from 'prop-types';
import { navigateToUrl } from 'single-spa';
import { connect } from 'react-redux';
import Box from '@material-ui/core/Box';
import Toast from '@revin-utils/components/toast';
import DialogModal from '@revin-utils/components/dialog-modal';
import {
  APP_NAME,
  TOAST_TIME_OUT,
  MODULE_ROUTES,
  FORM_LABELS,
  CRM_UPDATE_MODAL
} from '@revin-utils/utils';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  getNotificationsList,
  updateNotificationStatusBulk,
  clearBootStrapData
} from 'store/actions/MetaData';
import { clearErrorToasts, showToastMessage } from 'store/actions/Global';

const RouteWithLayout = ({
  askNavigationConfirmationOnLogoClick = false,
  clearBootStrapDataAction,
  clearErrorToastsAction,
  layout: Layout,
  component: Component,
  globalState,
  getNotificationsAction,
  updateNotificationStatusAction,
  metaDataState,
  singleSpa,
  showToastMessageAction,
  opportunityState,
  ...rest
}) => {
  const [toastState, setToastState] = useState(true);

  useEffect(() => {
    if (!globalState.errors?.length) {
      setToastState(true);
    }
  }, [globalState.errors]);

  const handleToastClose = () => {
    setToastState(false);
    clearErrorToastsAction();
  };

  const handleToastMessageClose = () => {
    showToastMessageAction({});
  };

  const navigateToOpportunityView = () => {
    clearBootStrapDataAction();
    navigateToUrl(`${MODULE_ROUTES.OPPORTUNITY}/view/${opportunityState?.opportunityDetail?.id}`);
  };

  return (
    <Route
      {...rest}
      render={(matchProps) => (
        <Layout
          appName={APP_NAME.FORECASTING}
          askNavigationConfirmationOnLogoClick={askNavigationConfirmationOnLogoClick}
          getNotifications={getNotificationsAction}
          history={matchProps.history}
          metaDataState={metaDataState}
          opportunityState={opportunityState}
          showToastMessage={showToastMessageAction}
          singleSpa={singleSpa}
          updateNotificationStatus={updateNotificationStatusAction}
        >
          {globalState.errors?.length > 0 && (
            <Toast
              autoHideDuration={TOAST_TIME_OUT.TIME_TWO}
              handleClose={handleToastClose}
              id={1}
              mode={'error'}
              open={toastState}
              posHorizontal="center"
              posVertical="top"
              toastContent={
                <div className="toast-content">
                  <SnapTooltip
                    className="main-tooltip tooltip-small"
                    content={
                      <PerfectScrollbar className="tooltip-scroll">
                        <ul className="tooltip-list-style">
                          {globalState.errors.map((item) => <li key={item}>{item}</li> )}
                        </ul>
                      </PerfectScrollbar>
                    }
                  >
                    <span className="link underline light-text">{globalState.multipleErrorMessageConfig?.linkText}</span>
                  </SnapTooltip>{globalState.multipleErrorMessageConfig?.errorSubText}
                </div>
              }
              // This can be used in future   
              // toastContent={
              //   <div className="toast-content">
              //     <p className="toast-title">Error</p>
              //     {globalState.errors?.map((error, index) => (
              //       <p
              //         className="toast-subtitle"
              //         key={`${error.code}-${index}`}
              //       >
              //         {error.detail}
              //       </p>
              //     ))}
              //   </div>
              // }
            />
          )}
          <Toast
            autoHideDuration={
              globalState.toastConfig?.duration || TOAST_TIME_OUT.TIME_TWO
            }
            handleClose={handleToastMessageClose}
            mode={globalState.toastConfig?.mode}
            open={globalState.toastConfig?.open}
            posHorizontal="center"
            posVertical="top"
            toastContent={
              <div className="toast-content">
                <p className="toast-title">{globalState.toastConfig?.title}</p>
                <p className="toast-subtitle">
                  {globalState.toastConfig?.subtitle}
                </p>
              </div>
            }
          />
          <Component {...matchProps} />
          <DialogModal
            description={
              <Box>
                <p className="mb-3 pt-2">
                  {CRM_UPDATE_MODAL.DESCRIPTION}
                </p>
              </Box>
            }
            handleSecondaryButton={navigateToOpportunityView}
            modalIcon="i"
            open={globalState.isOpportunityUpdated}
            secondaryButton
            secondaryButtonLabel={FORM_LABELS.CONTINUE}
            title={CRM_UPDATE_MODAL.TITLE}
          />
        </Layout>
      )}
    />
  );
};

const mapStateToProps = (state) => {
  return {
    opportunityState: state.opportunities,
    metaDataState: state.metaData,
    globalState: state.global
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    clearBootStrapDataAction: () => {
      dispatch(clearBootStrapData());
    },
    clearErrorToastsAction: () => {
      dispatch(clearErrorToasts());
    },
    getNotificationsAction: (payload) => {
      dispatch(getNotificationsList(payload));
    },
    updateNotificationStatusAction: (payload) => {
      dispatch(updateNotificationStatusBulk(payload));
    },
    showToastMessageAction: (payload) => {
      dispatch(showToastMessage(payload));
    }
  };
};

RouteWithLayout.propTypes = {
  askNavigationConfirmationOnLogoClick: PropTypes.bool,
  clearBootStrapDataAction: PropTypes.func,
  clearErrorToastsAction: PropTypes.func,
  component: PropTypes.any.isRequired,
  getNotificationsAction: PropTypes.func,
  globalState: PropTypes.object,
  layout: PropTypes.any.isRequired,
  metaDataState: PropTypes.object,
  opportunityState: PropTypes.object,
  showToastMessageAction: PropTypes.func,
  singleSpa: PropTypes.object,
  updateNotificationStatusAction: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(RouteWithLayout));
