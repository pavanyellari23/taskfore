import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { RVIcon } from '@revin-utils/assets';
import { NOTIFICATION_TYPES } from '@revin-utils/utils';
import { DASHBOARD_TAB } from 'utils/constants';
import styles from './Dashboard.module.scss';

const { iconMediumTwo } = variableStyle;

const Dashboard = () => {
  return (
    <div className={styles.wrapper}>
      <CustomAlertBar
        alertType={NOTIFICATION_TYPES.INFO}
      >
        <div className="d-flex align-items-center">
          <RVIcon
            icon={NOTIFICATION_TYPES.WARNING}
            size={iconMediumTwo}
          />
          {DASHBOARD_TAB.FORECAST_INFO_MSG}
        </div>
      </CustomAlertBar>
      <iframe
        src={DASHBOARD_TAB.PROD_URL}
        title={DASHBOARD_TAB.TITLE}
      />
    </div>
  );
};

export default withStyles(styles)(Dashboard);