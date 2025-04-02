import React, { useState, useEffect, useMemo } from 'react';
import moment from 'moment-mini';
import { useParams, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import SnapTab from '@pnp-snap/snap-tab';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse } from '@material-ui/core';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import DialogModal from '@revin-utils/components/dialog-modal';
import { TABLE_TYPES, FORM_LABELS, preciseNumberFormatter, getPermissions, getSessionItem } from '@revin-utils/utils';
import DynamicAlertList from 'components/common/dynamic-alert-list';
import HorizontalSummary from 'components/common/horizontal-summary';
import Footer from '@revin-utils/components/footer';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import ForecastContainer from 'components/pages/forecast-container/ForecastContainer';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import SummaryValue from 'components/common/horizontal-summary/summary-value/SummaryValue';
import RolledUpTable from 'components/pages/account-level-forecasting/components/rolled-up-table/RolledUpTable';
import SalesTable from './components/sales-and-gna-table/SalesTable';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { buildHorizontalSplitCellSummary } from 'utils/forecastingCommonFunctions';
import { getCurrentFinancialYear, handleBreadcrumbClick } from 'utils/helper';
import { MESSAGES } from 'utils/messages';
import {
  ACCOUNT_LEVEL_FORECASTING_TAB_VALUES, RESOURCE_FORECASTING,
  INVESTMENT_MODAL, RESOURCE, BACK, BTN_LABELS, ACCOUNT_LEVEL_CONSTANTS, FINANCIAL_YEAR, FORECASTING_SUMMARY, DATE_FORMAT, MAX_NUMBER_LIMIT, ROUTES,
  VIEW_ONLY_ACCESS_ROLES,
  SESSION_STORAGE_KEYS,
  FORECAST_DASHBOARD_CONSTANTS,
  COR_INVESTMENT_INCLUDED,
  ACTIVE_DELIVERY_TYPE,
  CURRENCY_USD,
  CURRENCY,
  USD
} from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import { GlobalActionType } from 'store/types/GlobalActionType';
import styles from './AccountLevelForecasting.module.scss';

const AccountLevelForecasting = ({
  forecastSaved,
  forecastingState,
  callBackHandler,
  metaDataState
}) => {

  const history = useHistory();
  const [subTabValue, setSubTabValue] = useState(0);
  const [collapse, setCollapse] = useState(false);
  const [footerConfirmationOpen, setConfirmationOpen] = useState(false);
  const [isGridUpdate, setIsGridUpdate] = useState(false);
  const [labelData, setLabelData] = useState([]);
  const [year, setYear] = useState(null);
  const { accountForecastCandidateId } = useParams();
  const [viewOnlyPermission, setViewOnlyPermission] = useState(false);
  const [responseData, setResponseData] = useState({ 'headerData': [], 'resourceSummary': [] });
  const [tableMaximize, setTableMaximize] = useState(true);
  const [isCollapseSummary, setIsCollapseSummary] = useState(false);
  const {parentAccountForecastStatus, locked} = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
  const managePermission = getPermissions()?.MANAGE_PARENT_ACCOUNT_REVENUE_FORECAST;
  const viewPermission = getPermissions()?.VIEW_PARENT_ACCOUNT_REVENUE_FORECAST;
  const entitlement = metaDataState?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);

  useEffect(() => {
    if (forecastSaved) {
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.ACCOUNT}/`);
    }
  }, [forecastSaved]);

  const cleanPayloadForAPI = (forecastingData) => {
    const arraysTobeCleaned = ['rolePlan', 'otherGnaExp', 'otherSalesExp'];
    arraysTobeCleaned.forEach((item) =>
      forecastingData[item] = forecastingData?.[item]?.filter(item => !item?.rowToBeRemoved)
    );
    return forecastingData;
  };

  useEffect(() => {
    // Future change: !managePermission && !viewPermission - Show No permission screen
    const viewOnly = (!managePermission && !viewPermission) || (!managePermission && viewPermission) || (managePermission && parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) || locked;
    setViewOnlyPermission(viewOnly);
  }, [managePermission, viewPermission, parentAccountForecastStatus, locked]);

  useEffect(() => {
    callBackHandler({
      type: AccountForecastingActionType.GET_INVESTMENT_CATEGORIES,
      payload: {
        'codeTypes': [
          INVESTMENT_MODAL.INVESTMENT_CATEGORY_LABEL
        ],
        'codeStatuses':[ACTIVE_DELIVERY_TYPE]
      }
    });

    callBackHandler({
      type: AccountForecastingActionType.GET_ACCOUNT_FORECASTING_DATA,
      payload: {
        accountForecastCandidateId,
        isNotLoading: true,
        dryRun: true
      }
    });
  }, []);

  useEffect(() => {
    const financialYear = getCurrentFinancialYear(forecastingState?.forecastingData?.accountFinancialYearSummary);
    setLabelData(financialYear);
    if (forecastingState?.forecastingData?.parentAccountId) {
      setResponseData(buildHorizontalSplitCellSummary(forecastingState?.forecastingData, true));
      initialRoleDataCallbackHandler();
    }
  }, [forecastingState?.forecastingData]);

  useEffect(() => {
    if (labelData && labelData?.year) {
      const lastTwoDigitsOfYear = labelData.year.toString().slice(-2);
      setYear(lastTwoDigitsOfYear);
    }
  }, [labelData]);

  const initialRoleDataCallbackHandler = () => {
    const parentAccountId = forecastingState?.forecastingData?.parentAccountId;
    callBackHandler({
      type: MetaDataActionType.GET_INITIAL_ROLE_DATA,
      payload: {
        effectiveDate: moment().format(DATE_FORMAT.FORMAT_8),
        clientRolePayload: {
          param: 'client-roles',
          resource: {
            filter: `[client-roles]={accountId --eq '${parentAccountId}'}`
          }
        },
        accountId: parentAccountId
      }
    });
  };

  {/* TODO: Commenting as of now we have enhancement related to KPI. */ }
  const handleExpand = () => {
    setCollapse(!collapse);
  };

  const handleTabClick = (event, newValue) => {
    setSubTabValue(newValue);
  };

  const handleContinue = () => {
    if(locked){
      history.push(`/${accountForecastCandidateId}/${FORECASTING_SUMMARY.ACCOUNT}/`);
    }else if (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) {
      callBackHandler({
        type: GlobalActionType.TOGGLE_FORECAST_SAVED,
        payload: true
      });
    } else {
      callBackHandler({
        type: AccountForecastingActionType.UPDATE_ACCOUNT_FORECASTING_WITH_API,
        payload: {
          payload: cleanPayloadForAPI(forecastingState?.forecastingData),
          accountForecastCandidateId,
          isNotLoading: true,
          dryRun: false
        }
      });
    }
  };

  const handleBackButtonClick = () => {
    setConfirmationOpen(!footerConfirmationOpen);
  };

  const handleConfirmClick = () => {
    history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    handleBackButtonClick();
  };

  const handleGridUpdate = () => {
    setIsGridUpdate(true);
  };

  const handleBackButtonGridClick = () => {
    if (isGridUpdate) {
      setConfirmationOpen(!footerConfirmationOpen);
    } else {
      history.push(`${ROUTES.FORECAST_SELECTION}/${accountForecastCandidateId}`);
    }
  };
  const handleOnClick = (event, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateId, history);
  };

  const footerPrimaryBtnLabel = useMemo(() => {
    return (VIEW_ONLY_ACCESS_ROLES.includes(entitlement) || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS)) || locked ? BTN_LABELS.CONTINUE : RESOURCE.SAVE_CONTINUE;
  }, [entitlement, parentAccountForecastStatus, locked]);

  const handleTableMaximizeEvent = () => {
    setTableMaximize(!tableMaximize);
  };

  const collapseSummary = (v) => {
    setIsCollapseSummary(v);
  };

  return (
    <div className={`account-level-forecast ${styles.wrapper}`}>
      <ForecastContainer
        tabvalue={1}
      >
        {!tableMaximize && (
          <BreadcrumbNavigation
            breadcrumbSubTitle={[
              { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
              { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_ACCOUNT_LEVEL }
            ]}
            breadcrumbTitle={
              <div className="d-flex">
                <span>{ACCOUNT_LEVEL_CONSTANTS.ACCOUNT_LABEL}</span>
                <span className="link ml-1"> {forecastingState?.forecastingData?.accountName}</span>
              </div>
            }
            titleReverse
          />
        )}
        <div className={`flex-1 ${tableMaximize && styles['fixed-summary']}`}>
          <HorizontalSummary
            className={`
              ${styles['forecast-summary-global']}
              ${styles['forecast-summary']}
            `}
            collapseButton={!tableMaximize}
            collapseSummary={collapseSummary}
            expandMore={
              <div
                className={`d-flex align-items-center sub-label-global ${styles['sub-label']}`}
                onClick={handleExpand}
              >
                <div className="expand-icon-wrapper">
                  <span
                    className={`
                      d-flex align-items-center justify-content-center mr-1 expand-icon-global
                      ${styles['expand-icon']}
                      ${collapse && styles.rotated}
                      `}
                  >
                    <ExpandMore />
                  </span>
                </div>
                <div className="sub-label-text-wrapper">
                  {!tableMaximize ? `${RESOURCE_FORECASTING.CURRENCY} (${USD})` : <><h2>{`$ ${CURRENCY_USD}`}</h2>
                    <p>{CURRENCY}</p></>}
                </div>
              </div>
            }
            expandedSummary={
              <>
                <div className="d-flex align-items-center mt-1">
                  <div className={styles.fy}>
                    <h4>{FINANCIAL_YEAR.FY}</h4>
                    <h4>{year}</h4>
                  </div>
                  <div className={`d-flex ${styles['data-wrapper']}`}>
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.totalRevenue)
                      }
                      mainValueTitle={RESOURCE_FORECASTING.RESOURCE_TOTAL_REVENUE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.finalResourceCostOtherCostSum)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.finalResourceCostOtherCostPercentage, { isPercentage: true })
                      }
                      mainValueTitle={ACCOUNT_LEVEL_CONSTANTS.RESOURCE_COST_TITLE}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.investmentDE)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.investmentDEPercentage, { isPercentage: true })
                      }
                      mainValueTitle={ACCOUNT_LEVEL_CONSTANTS.DIRECT_EXPENSE_LABEL}
                      secondarySmallLabel={
                        <InfoTooltip
                          infoContent={COR_INVESTMENT_INCLUDED}
                        />
                      }
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.grossMargin)

                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.grossMarginPercentage, { isPercentage: true })

                      }
                      mainValueTitle={ACCOUNT_LEVEL_CONSTANTS.GROSS_MARGIN}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.sgnaCost)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.sgnaPercentage, { isPercentage: true })
                      }
                      mainValueTitle={ACCOUNT_LEVEL_CONSTANTS.SGA_LABEL}
                    />
                    <SummaryValue
                      mainValue={
                        preciseNumberFormatter(labelData?.netEbitda)
                      }
                      mainValueSecondary={
                        preciseNumberFormatter(labelData?.netEbitdaPercentage, { isPercentage: true })
                      }
                      mainValueTitle={ACCOUNT_LEVEL_CONSTANTS.NET_EDIDTA_LABEL}
                      secondarySmallLabel={
                        <InfoTooltip
                          infoContent="Overheads included"
                        />
                      }
                    />
                  </div>
                </div>
                <Collapse
                  className={`collapse-area-global ${styles['collapse-area']}`}
                  in={collapse}
                >
                  <div className={`forecasting-table ${styles['collapse-wrapper']}`}>
                    {/* { GridData && HeaderData &&  */}
                    <ForecastDataSheetControlWrapper
                      grid={responseData.resourceSummary}
                      header={responseData.headerData}
                      limit
                      limitRange={MAX_NUMBER_LIMIT}
                      switchView
                      type={TABLE_TYPES.RESOURCE}
                      viewOnlyPermission={viewOnlyPermission}
                    />
                    {/* } */}
                  </div>
                </Collapse>
              </>
            }
          />
        </div>

        {
          !!forecastingState?.accountForecastError?.length && (
            <DynamicAlertList
              alertList={forecastingState?.accountForecastError}
              className={tableMaximize && 'sm-alert-bar'}
              collapse
              isExpandable
            />
          )
        }

        <SnapTab
          handleChange={handleTabClick}
          id={ELEMENT_ID.FORECAST_CONTAINER_ID}
          name="forecastTab"
          tabitems={ACCOUNT_LEVEL_FORECASTING_TAB_VALUES}
          value={subTabValue}
        />
        {
          subTabValue === 0 &&
          <RolledUpTable
            callBackHandler={callBackHandler}
            forecastingState={forecastingState}
            handleGridUpdate={handleGridUpdate}
            handleTableMaximizeEvent={handleTableMaximizeEvent}
            isCollapseSummary={isCollapseSummary}
            selectedTab={ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[subTabValue]}
            tableMaximize={tableMaximize}
            viewOnlyPermission={viewOnlyPermission}
          />
        }
        {
          (subTabValue === 1 || subTabValue === 2) &&
          <SalesTable
            callBackHandler={callBackHandler}
            cleanPayloadForAPI={cleanPayloadForAPI}
            forecastingState={forecastingState}
            handleGridUpdate={handleGridUpdate}
            handleTableMaximizeEvent={handleTableMaximizeEvent}
            isCollapseSummary={isCollapseSummary}
            metaDataState={metaDataState}
            selectedTab={ACCOUNT_LEVEL_FORECASTING_TAB_VALUES[subTabValue]}
            tableMaximize={tableMaximize}
            viewOnlyPermission={viewOnlyPermission}
          />
        }
        <DialogModal
          className={styles['confirmation-modal']}
          description={
            <div className="confirmation-modal-text">
              <p className="mb-2" />
              {RESOURCE_FORECASTING.BACK_BUTTON_MODAL}
            </div>
          }
          handlePrimaryButton={handleBackButtonClick}
          handleSecondaryButton={handleConfirmClick}
          modalIcon="i"
          open={footerConfirmationOpen}
          primaryButton
          primaryButtonLabel={FORM_LABELS.CANCEL}
          secondaryButton
          secondaryButtonLabel={BTN_LABELS.CONFIRM}
          title={FORM_LABELS.ARE_YOU_SURE}
        />
        <Footer
          handleClick={handleContinue}
          handleFooterSecondaryButton={handleBackButtonGridClick}
          primaryLabel={footerPrimaryBtnLabel}
          secondaryLabel={BACK}
        />

      </ForecastContainer>
    </div>
  );
};

AccountLevelForecasting.propTypes = {
  callBackHandler: PropTypes.func,
  forecastSaved: PropTypes.bool,
  forecastingState: PropTypes.object,
  metaDataState: PropTypes.object,
  tableMaximize: PropTypes.bool
};

export default AccountLevelForecasting;