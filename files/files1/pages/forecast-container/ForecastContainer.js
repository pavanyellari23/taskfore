import React, {useState, useCallback, useEffect } from 'react';
import { useHistory,useLocation } from 'react-router-dom';
import MonetizationOnOutlinedIcon from '@material-ui/icons/MonetizationOnOutlined';
import { getPermissions, getSessionItem } from '@revin-utils/utils';
import PropTypes from 'prop-types';
import { Container } from 'react-grid-system';
import SnapTab from '@pnp-snap/snap-tab';
import { CURRENCY_STANDARD,FORECASTING_SELECTION_ROUTE, FORECAST_LEVEL_TAB, SESSION_STORAGE_KEYS } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from '../forecast-landing/ForecastLanding.module.scss';

const ForecastContainer = ({ children, tabvalue }) => {
  const [tabValue, setTabValue] = useState(tabvalue ?? 0);
  const [showTab, setShowTab] = useState(false);
  const [showCurrency, setShowCurrency] = useState(false);
  const history = useHistory();
  const location = useLocation();

  const handleTabClick = useCallback(( event, newValue ) => {
    const accountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
    setTabValue(newValue);
    if(newValue){
      history.push(`/account-forecasting/${accountId}`);
    }else{
      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountId}`);
    }
  }, [tabValue]);

  
  useEffect(() => {
    const accountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
    setShowCurrency(location.pathname === `/${accountId}`);
  },[getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id]);
  
  useEffect(() => {
    setShowTab(getPermissions()?.VIEW_PARENT_ACCOUNT_REVENUE_FORECAST);
  }, [getPermissions()?.VIEW_PARENT_ACCOUNT_REVENUE_FORECAST]);

  return (
    <Container
      className={`mb-5 ${styles.wrapper}`}
      fluid
    >
      {showTab && (
        <div className={styles['tab-container']}>
          <SnapTab
            className="forecast-opp-level-tab"
            handleChange={handleTabClick}
            id={ELEMENT_ID.FORECAST_CONTAINER_ID}
            name="forecastTab"
            tabitems={FORECAST_LEVEL_TAB}
            value={tabValue}
          />
          {showCurrency && (
            <div className={styles['currency-wrap']}>
              <MonetizationOnOutlinedIcon /> 
              {CURRENCY_STANDARD}
            </div>
          )}

        </div>
      )}
      {children}
    </Container>
  );
};

ForecastContainer.propTypes = {
  children: PropTypes.any,
  tabvalue: PropTypes.any
};

export default ForecastContainer;