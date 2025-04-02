import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import moment from 'moment-mini';
import withStyles from '@material-ui/core/styles/withStyles';
import SnapCard from '@pnp-snap/snap-card';
import SnapButton from '@pnp-snap/snap-button';
import GridRow from '@revin-utils/components/grid-row';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { FORM_LABELS, millionBillionFormatter, preciseNumberFormatter } from '@revin-utils/utils';
import { Col } from 'react-grid-system';
import ClockIcon from 'react-feather/dist/icons/clock';
import EmptyScreen from '@revin-utils/components/empty-screen';
import noDataFound from 'assets/images/src_assets_images_no-data.png';
import { IST_TEXT, DATE_FORMAT, FORECASTING_SUMMARY_LABEL, FORECAST_ACCOUNT_SUMMARY, FORECAST_DASHBOARD_CONSTANTS, FORECAST_SUMMARY, COR_INVESTMENT_INCLUDED } from 'utils/constants';
import { getISTTime } from 'utils/commonFunctions';
import { getFinancialYearSummary } from 'store/actions/ForecastDashboard';
import styles from './ForecastSummary.module.scss';

const ForecastSummary = ({
  callBackHandler,
  dashboardState,
  parentAccount,
  isVHOrBFM
}) => {

  const [forecastSubmitDate, setForecastSubmitDate] = useState('');

  useEffect(() => {
    if (parentAccount?.id && dashboardState?.financialYearSummary?.attributes?.accountForecastCandidateId != parentAccount?.id) {
      callBackHandler(getFinancialYearSummary({ accountForecastCandidateId: parentAccount?.id }));
    };
    const date = parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS ? parentAccount?.submittedOn : parentAccount?.updatedOn;
    const forecastSubmitDateArray = moment(date).format(DATE_FORMAT.FORMAT_8).split(' ');
    const STATUS_LABEL = parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS ? FORECAST_DASHBOARD_CONSTANTS.SUBMITTED_LABEL : FORECAST_DASHBOARD_CONSTANTS.UPDATED_LABEL;
    const forecastSubmitDate = `${isVHOrBFM ? STATUS_LABEL : ''} ${moment(date).format(DATE_FORMAT.FORMAT_1)} | ${getISTTime(forecastSubmitDateArray[0], forecastSubmitDateArray[1])} ${IST_TEXT}`;
    setForecastSubmitDate(forecastSubmitDate);
  }, [parentAccount, dashboardState?.financialYearSummary]);

  const {
    year,
    finalResourceCostOtherCostSum,
    grossMargin,
    grossMarginPercentage,
    investmentDE,
    investmentDEPercentage,
    totalRevenue,
    sgnaCost,
    sgnaPercentage,
    netEbitda,
    netEbitdaPercentage,
    finalResourceCostOtherCostPercentage
  } = dashboardState?.financialYearSummary?.attributes || {};

  const history = useHistory();

  const handleDetailedSummaryClick = () => {
    history.push(`/${parentAccount.id}/${FORECAST_ACCOUNT_SUMMARY.ACCOUNT_LEVEL_SUMMARY}/`);
  };

  
  return (
    <>
      <SnapCard
        className={`main-card ${styles.wrapper}`}
        content={
          dashboardState?.financialYearSummary ? (
            <>

              <GridRow
                className="mx-0 w-100"
                gutterLG={0}
                gutterMD={0}
                gutterSM={0}
                gutterXL={0}
                gutterXXL={0}
              >
                <Col
                  className="px-0"
                  xs={12}
                >
                  <div className={styles['numbers-wrapper']}>
                    <h3>{millionBillionFormatter(totalRevenue, { isSinglePrecision: true })}</h3>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.REVENUE}</p>
                  </div>
                </Col>
                <Col
                  className="px-0"
                  xs={12}
                >
                  <div className={styles['numbers-wrapper']}>
                    <h3>
                      {millionBillionFormatter(grossMargin, { isSinglePrecision: true })} <span className={styles.percentage}>{preciseNumberFormatter(grossMarginPercentage, { isPercentage: true })}</span>
                    </h3>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.GROSS_PROFIT_MARGIN}</p>
                  </div>
                </Col>
                <Col
                  className="px-0"
                  xs={24}
                >
                  <div className={styles['numbers-wrapper']}>
                    <h3>
                      {millionBillionFormatter(netEbitda, { isSinglePrecision: true })} <span className={styles.percentage}>{preciseNumberFormatter(netEbitdaPercentage, { isPercentage: true })}</span>
                    </h3>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.NET_EBIDTA}</p>
                  </div>
                </Col>
              </GridRow>
              <GridRow className={styles['border-wrapper']}>
                <Col
                  className="px-0"
                  xs={8}
                >
                  <div className={styles['numbers-wrapper']}>

                    <span className="icon-content-wrapper">
                      <h3>
                        {millionBillionFormatter(investmentDE, { isSinglePrecision: true })} <span className={styles.percentage}>{preciseNumberFormatter(investmentDEPercentage, { isPercentage: true })}</span>
                      </h3>
                      <InfoTooltip
                        infoContent={COR_INVESTMENT_INCLUDED}
                      />
                    </span>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.DIRECT_EXPENSE}</p>
                  </div>
                </Col>
                <Col
                  className="px-0"
                  xs={8}
                >
                  <div className={styles['numbers-wrapper']}>
                    <h3>
                      {millionBillionFormatter(finalResourceCostOtherCostSum, { isSinglePrecision: true })} <span className={styles.percentage}>{preciseNumberFormatter(finalResourceCostOtherCostPercentage, { isPercentage: true })}</span>
                    </h3>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.RESOURCE_COST}</p>
                  </div>
                </Col>
                <Col
                  className="px-0"
                  xs={8}
                >
                  <div className={styles['numbers-wrapper']}>
                    <h3>
                      {millionBillionFormatter(sgnaCost, { isSinglePrecision: true })} <span className={styles.percentage}>{preciseNumberFormatter(sgnaPercentage, { isPercentage: true })}</span>
                    </h3>
                    <p>{FORECAST_DASHBOARD_CONSTANTS.EXPENSE_SGA}</p>
                  </div>
                </Col>
              </GridRow>
              <GridRow className="mt-1">
                <Col
                  className="mb-1"
                  xs={24}
                >
                  <p className={styles['data-message']}>
                    {FORECASTING_SUMMARY_LABEL}
                  </p>
                </Col>
                <Col>
                  <SnapButton
                    handleClick={handleDetailedSummaryClick}
                    label="Detailed Summary"
                    variant={FORM_LABELS.OUTLINED}
                  />
                </Col>
                {
                  forecastSubmitDate &&
                  <Col className="d-flex align-items-center justify-content-end">
                    <div className={`d-flex align-items-center ${styles['time-stamp']}`}>
                      <ClockIcon /> {forecastSubmitDate}
                    </div>
                  </Col>
                }
              </GridRow>
            </>
          ) : (
            <EmptyScreen
              className={styles['empty-screen']}
              image={noDataFound}
              subTitle={FORECAST_SUMMARY.SUB_TITLE}
              title={FORECAST_SUMMARY.NO_DATA_FOUND}
            />
          )}
        title={dashboardState?.financialYearSummary && `${FORECAST_SUMMARY.FY_YEAR} ${year}`}
      />
    </>
  );
};

ForecastSummary.propTypes = {
  callBackHandler: PropTypes.func,
  dashboardState: PropTypes.object,
  isVHOrBFM: PropTypes.bool,
  parentAccount: PropTypes.object
};

export default withStyles(styles)(ForecastSummary);
