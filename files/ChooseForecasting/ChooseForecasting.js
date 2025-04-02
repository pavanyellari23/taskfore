import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { Collapse } from '@material-ui/core';
import withStyles from '@material-ui/core/styles/withStyles';
import { Maximize2, Minimize2 } from 'react-feather';
import SnapButton from '@pnp-snap/snap-button';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import { TABLE_TYPES, preciseNumberFormatter, getSessionItem, getPermissions, setSessionItem, FORM_LABELS, removeSessionItem } from '@revin-utils/utils';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import EmptyScreen from '@revin-utils/components/empty-screen';
import Footer from '@revin-utils/components/footer';
import DialogModal from '@revin-utils/components/dialog-modal';
import { RVIcon } from '@revin-utils/assets';
import { MODIFY_SELECTION, PROCEED, CHOOSE_FORECASTING_SUMMARY_STRINGS, CHOOSE_FORECAST_SUMMARY_TOOLTIP, RESOURCE_FORECASTING,
  USD, EMPTY_SCREEN_MESSAGE, FINANCIAL_YEAR, SESSION_STORAGE_KEYS, BREADCRUMB_FORECAST_SUMMARY_TITLE, PROJECT_FORECASTING_BREADCRUMBS,
  VIEW_SELECTION, VIEW_ONLY_ACCESS_ROLES, OPPORTUNITY_SEARCH, CHOOSE_FORECAST_EMPTY_SCREEN, OPPORTUNITY_SELECTION_ACCESS_ROLES,
  FORECAST_DASHBOARD_CONSTANTS, BTN_LABELS, OPPORTUNITY_DASHBOARD_LIMIT, PARENT_ACCOUNT_MANAGER, SEARCH_RESULTS, CURRENCY_USD, CURRENCY,
  DASH, CUSTOM_GROUP, ROUTES} from 'utils/constants';
import { getSubmissionMessage } from 'utils/commonFunctions';
import { handleBreadcrumbClick, getProgramArray, getAccountIdArray, getAccountEntityCodeArray, getManagersPayload } from 'utils/helper';
import { MESSAGES } from 'utils/messages';
import { buildHorizontalSplitCellSummary } from 'utils/forecastingCommonFunctions';
import { ChooseForecastingTable } from 'components/common/ChooseForecastingTable';
import ForecastContainer from 'components/pages/forecast-container/ForecastContainer';
import HorizontalSummary from 'components/common/horizontal-summary';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import SummaryValue from 'components/common/horizontal-summary/summary-value/SummaryValue';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import AccountDropdown from '../account-dropdown/AccountDropdown';
import FilterOpportunitiesModal from 'components/common/FilterOpportunities';
import { setChooseForecastCandidates, setOpportunityInfoById } from 'store/actions/Opportunities';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import NoRecordFound from 'assets/images/no-record-found.svg';
import noDataFound from 'assets/images/src_assets_images_no-data.png';
import sandTimer from 'assets/images/sand_timer.gif';
import styles from './ChooseForecasting.module.scss';

const { iconSmallTwo } = variableStyle;

const ChooseForecasting = ({ accountForecastCandidateId, callBackHandler, opportunities, metaData, dashboardState }) => {
  const history = useHistory();
  const [summaryData, setSummaryData] = useState({});
  const [collapse, setCollapse] = useState(false);
  const [responseData, setResponseData] = useState({ 'headerData': [], 'resourceSummary': [] });
  const [financialYear, setFinancialYear] = useState('');
  const [viewOnlyPermission, setViewOnlyPermission] = useState(false);
  const [payloadForForecastCandidates, setPayloadForForecastCandidates] = useState({});
  const [tableMaximize, setTableMaximize] = useState(true);
  const [modifySubmissionModal, setModifySubmissionModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [isSearchedActive, setIsSearchedActive] = useState(false);
  const parentAccount = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
  const manageProjectPermission = getPermissions()?.MANAGE_PROJECT_REVENUE_FORECAST;
  const viewProjectPermission = getPermissions()?.VIEW_PROJECT_REVENUE_FORECAST;
  const entitlement = metaData?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
  const [filterModal, setFilterModal] = useState(false);
  const [isRestoreFilterData, setIsRestoreFilterData] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [isCollapseSummary, setIsCollapseSummary] = useState(true);
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  const locked = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked;
  const isVHBFMUser = VIEW_ONLY_ACCESS_ROLES.includes(entitlement);
  const isFromForecastSummary = getSessionItem(SESSION_STORAGE_KEYS.IS_REDIRECTED_FROM_FORECAST_SUMMARY)?.isFromForecastSummary;

  useEffect(() => {
    if (isFromForecastSummary) {
      const oppList = opportunities?.forecast_candidates_data?.forecastCandidates;
      const filteredCandidate = oppList?.filter((item) => item?.id === getSessionItem(SESSION_STORAGE_KEYS.IS_REDIRECTED_FROM_FORECAST_SUMMARY)?.projectForecastCandidateId);
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA,
        payload: {
          request: { ...getForecastCandidatesPayload() }
        }
      });
      callBackHandler({
        type: OpportunitiesActionType.GET_OPPORTUNITY_INFO_BY_ID,
        payload: {
          projectForecastCandidateId: filteredCandidate[0]?.id,
          includeTrends: true,
          includeKPIs: true
        }
      });
    }
  }, [isFromForecastSummary]);

  useEffect(() => {
    if (!metaData.billingTypeData?.length) {
      callBackHandler({
        type: MetaDataActionType.GET_BILLING_TYPE
      });
    }
    if (!metaData.deliveryTypeData?.length) {
      callBackHandler({
        type: MetaDataActionType.GET_DELIVERY_TYPE
      });
    }
    if (!metaData.salesStageData?.length) {
      callBackHandler({
        type: MetaDataActionType.GET_SALES_STAGE
      });
    }
    if (!metaData.projectSource?.length) {
      callBackHandler({
        type: MetaDataActionType.GET_PROJECT_SOURCE
      });
    }
  }, []);

  useEffect(() => {
    setIsRestoreFilterData(false);
    setIsShowLoader(true);
  }, [getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id]);

  useEffect(() => {
    if (metaData?.accounts?.length && !isRestoreFilterData) {
      const tempAccounts = metaData?.accounts.filter(item => item.id !== 'All');
      callBackHandler({
        type: MetaDataActionType.GET_PROJECT_MANAGERS,
        payload: getManagersPayload(tempAccounts)
      });
      const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
      const selectedAccounts = foreCastFilterConditions?.selectedAccounts?.length > 0 && !filterModal ? foreCastFilterConditions?.selectedAccounts : tempAccounts;
      const showLoader = true;
      programCallBack(getAccountEntityCodeArray(selectedAccounts, metaData?.accounts), showLoader);
    }
  }, [JSON.stringify(metaData?.accounts)]);

  useEffect(() => {
    if (opportunities?.opportunityInfoById) {
      const updatedForecastCandidates =  opportunities?.forecast_candidates_data?.forecastCandidates?.map(opportunity => 
        opportunity.id === opportunities.opportunityInfoById?.id
          ? opportunities.opportunityInfoById
          : opportunity
      );
      callBackHandler(setChooseForecastCandidates({...opportunities?.forecast_candidates_data, forecastCandidates: updatedForecastCandidates}));
    }
    callBackHandler(setOpportunityInfoById(null));
  },[opportunities?.opportunityInfoById]);

  const programCallBack = (entityCode, showLoader) => {
    callBackHandler({
      type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        },
        isShowLoader: filterModal || isShowLoader || getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS)?.parentAccountId === '' || showLoader,
        parentEntityCodes: entityCode
      }
    });
  };

  const getChildAccountsCallBack = (parentAccountId) => {
    callBackHandler({
      type: MetaDataActionType.GET_ACCOUNT_DROPDOWN,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        },
        accountFetchType: 'CHILD_ACCOUNTS_WITH_PARENT',
        parentAccountIds: [
          parentAccountId
        ]
      }
    });
  };

  useEffect(() => {
    if ((!manageProjectPermission && !!viewProjectPermission) || locked) {
      setViewOnlyPermission(true);
    } else if (parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) {
      setViewOnlyPermission(true);
    } else {
      setViewOnlyPermission(false);
    }
  }, [manageProjectPermission, viewProjectPermission, parentAccount?.parentAccountForecastStatus]);

  useEffect(() => {
    const parentAccount = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN);
    const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
    if (parentAccount?.id && metaData?.entitlement && metaData?.programs?.length && metaData?.projectSource?.length && metaData.salesStageData?.length && !filterModal && !isRestoreFilterData && !isFromForecastSummary) {
      const programData = getProgramArray(foreCastFilterConditions?.selectedPrograms?.length ? foreCastFilterConditions?.selectedPrograms : [metaData?.programs[0]], metaData.programs);
      const accountData = getAccountIdArray(foreCastFilterConditions?.selectedAccounts?.length ? foreCastFilterConditions?.selectedAccounts : [metaData?.accounts[0]], metaData.accounts);
      const request = {
        parentAccountId: parentAccount?.attributes.parentAccountId,
        accountIds: accountData,
        accountForecastCandidateId: parentAccount?.id,
        includeSignedContracts: true,
        programIds: programData,
        salesStages: foreCastFilterConditions?.salesStages?.length ? foreCastFilterConditions?.salesStages?.map(item => item.id) : metaData?.salesStageData?.map(item => item.id),
        projectSources: foreCastFilterConditions?.projectSources?.length ? foreCastFilterConditions?.projectSources?.map(item => item.id) : metaData?.projectSource?.map(item => item.id),
        billingTypesIds: foreCastFilterConditions?.billingTypesIds?.length ? foreCastFilterConditions?.billingTypesIds?.map(item => item.id) : [],
        deliveryTypesIds: foreCastFilterConditions?.deliveryTypesIds?.length ? foreCastFilterConditions?.deliveryTypesIds?.map(item => item.id) : [],
        includeCompletedProjects: foreCastFilterConditions?.includeCompletedProjects ?? false,
        includeSummaryInformation: true,
        projectManagerIds: foreCastFilterConditions?.projectManagerIds?.length ? foreCastFilterConditions?.projectManagerIds?.map(item => item.id) : [],
        forecastEntitlement: {
          forecastEntitlementView: metaData?.entitlement
        }
      };
      if (programData?.length) {
        getForeCastCandidateList(request);
        if (!foreCastFilterConditions?.selectedPrograms?.length) {
          setSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS, {
            parentAccountId: parentAccount?.id,
            selectedAccounts: [metaData?.accounts[0]],
            selectedPrograms: [metaData?.programs[0]],
            billingTypesIds: [],
            deliveryTypesIds: [],
            projectManagerIds: [],
            salesStages: metaData?.salesStageData,
            projectSources: metaData?.projectSource,
            includeCompletedProjects: false
          });
        }
      }
    } 
    if (isFromForecastSummary){
      removeSessionItem(SESSION_STORAGE_KEYS.IS_REDIRECTED_FROM_FORECAST_SUMMARY);
    }
  }, [JSON.stringify(metaData?.programs), JSON.stringify(metaData?.projectSource), JSON.stringify(metaData?.salesStageData)]);

  useEffect(() => {
    const forecastCandidatesSummaryOverview = opportunities?.forecast_candidates_summary_data;
    setSummaryData(forecastCandidatesSummaryOverview);
    forecastCandidatesSummaryOverview['summary'] = {
      directExpense: forecastCandidatesSummaryOverview?.directExpense,
      directExpensePercentage: forecastCandidatesSummaryOverview?.directExpensePercentage,
      grossMargin: forecastCandidatesSummaryOverview?.grossMargin,
      grossMarginPercentage: forecastCandidatesSummaryOverview?.grossMarginPercentage,
      resourceCost: forecastCandidatesSummaryOverview?.resourceCost,
      totalRevenue: forecastCandidatesSummaryOverview?.totalRevenue
    };
  }, [opportunities?.forecast_candidates_summary_data]);

  useEffect(() => {
    const { forecastCandidates } = opportunities?.forecast_candidates_data;
    const forecastCandidatesSummaryOverview = opportunities?.forecast_candidates_summary_data;
    if (forecastCandidates?.length && forecastCandidatesSummaryOverview && forecastCandidatesSummaryOverview?.forecastCandidatesFinancialYearSummary?.financialYear && forecastCandidatesSummaryOverview?.forecastingPeriodSummary) {
      setFinancialYear(forecastCandidatesSummaryOverview?.forecastCandidatesFinancialYearSummary?.financialYear?.toString().slice(-2));
      setResponseData(buildHorizontalSplitCellSummary(forecastCandidatesSummaryOverview));
    }
  }, [opportunities?.forecast_candidates_data, opportunities?.forecast_candidates_summary_data]);

  const getForeCastCandidateList = (request) => {
    setPageNumber(0);
    callBackHandler({
      type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
      payload: {
        loading: true,
        getSelected: true,
        request: { ...request, includedInForecast: true }
      }
    });
    callBackHandler({
      type: OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA,
      payload: {
        request: { ...request, includedInForecast: true }
      }
    });
    setPayloadForForecastCandidates({
      loading: true,
      getSelected: true,
      request: { ...request, includedInForecast: true }
    });
  };

  const handleFooterSecondaryButtonClick = () => {
    history.push(`/${accountForecastCandidateId}`);
  };

  const handleFooterTertiaryButtonClick = () => {
    history.push(ROUTES.FORECAST_DASHBOARD);
  };

  const handleExpand = () => {
    setCollapse(!collapse);
  };

  const handlePrimaryBtnClick = () => {
    if (PARENT_ACCOUNT_MANAGER.includes(entitlement) && parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) {
      setModifySubmissionModal(true);
    } else {
      history.push(`/account-forecasting/${accountForecastCandidateId}`);
    }
  };

  const footerSecBtnLabel = useMemo(() => {
    return (isVHBFMUser || (parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) ||
    locked) ? VIEW_SELECTION : MODIFY_SELECTION;
  }, [parentAccount?.parentAccountForecastStatus, isVHBFMUser]);

  const handleOnClick = (event, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateId, history);
  };

  const breadcrumbLabels = () => {
    if (isVHBFMUser) {
      return [
        { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
        { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_FORECASTING }
      ];
    }
    if (OPPORTUNITY_SELECTION_ACCESS_ROLES.includes(metaData?.entitlement)) {
      return [
        { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_OPP_SELECTION, onClick: handleOnClick },
        { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_CHOOSE_FORECASTING }
      ];
    }
    return [
      { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_OPP_SELECTION, onClick: handleOnClick },
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_CHOOSE_FORECASTING }
    ];
  };

  const handleTableMaximize = () => {
    setTableMaximize(!tableMaximize);
  };

  const footerPrimaryBtnLabel = useMemo(() => {
    return PARENT_ACCOUNT_MANAGER.includes(entitlement) && parentAccount?.parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS ?
      FORECAST_DASHBOARD_CONSTANTS.MODIFY_SUBMISSION : PROCEED;
  }, [parentAccount?.parentAccountForecastStatus, entitlement]);

  const handleModifySubmissionCancel = () => {
    setModifySubmissionModal(false);
  };

  const handleModifySubmissionConfirm = () => {
    setModifySubmissionModal(false);
    callBackHandler({
      type: ForecastDashBoardActionType.FORECAST_SUBMISSION,
      payload: {
        accountForecastCandidateId: parentAccount?.id,
        parentAccountId: parentAccount?.parentAccountId,
        page: FORECAST_DASHBOARD_CONSTANTS.HISTORICAL_CARDS_PAGE_NO,
        pageSize: FORECAST_DASHBOARD_CONSTANTS.VIEW_ALL_HISTORICAL_CARDS_LIMIT,
        successMsgTitle: FORECAST_DASHBOARD_CONSTANTS.FORECAST_MODIFY_SUBMISSION,
        status: FORECAST_DASHBOARD_CONSTANTS.FORECAST_REOPEN
      }
    });
  };

  const handleFilterModalClose = () => {
    setFilterModal(false);
  };

  const handleFilterBtnClick = () => {
    setFilterModal(true);
  };

  useEffect(() => {
    if (pageNumber) {
      const requestObj = getForecastCandidatesPayload();
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND,
        payload: {
          loading: false,
          getSelected: true,
          pageNumber,
          pageSize: OPPORTUNITY_DASHBOARD_LIMIT,
          request: requestObj
        }
      });
    };
  }, [pageNumber]);

  const handleLoadMore = () => {
    const { forecastCandidates, totalCandidateCount } = opportunities?.forecast_candidates_data;
    if (forecastCandidates?.length < totalCandidateCount) {
      const currentPageNo = (Math.ceil(opportunities?.forecast_candidates_data?.forecastCandidates?.length / OPPORTUNITY_DASHBOARD_LIMIT)) - 1;
      setPageNumber(currentPageNo + 1);
    };
  };

  const handleSearchChange = (searchText) => {
    const requestObj = getForecastCandidatesPayload();
    const isSearched = searchText?.trim()?.length >= 3;
    const request = isSearched ? { ...requestObj, searchTerm: searchText?.trim() } : requestObj;
    if(searchText?.length >= 3 || (searchText?.length === 0 && isSearchedActive)){
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
        payload: {
          loading: true,
          getSelected: true,
          request
        }
      });
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_SUMMARY_DATA,
        payload: {
          request
        }
      });
      setIsSearchedActive(isSearched);
      setPageNumber(0);
      setPayloadForForecastCandidates({
        loading: true,
        getSelected: true,
        request
      });
    }
  };

  const getForecastCandidatesPayload = () => {
    const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
    const program = foreCastFilterConditions?.selectedPrograms;
    const accountIds = getAccountIdArray(foreCastFilterConditions?.selectedAccounts, metaData.accounts);
    const accountForecastCandidateId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
    const parentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId;
    const programIds = getProgramArray(program, metaData.programs);
    const { salesStages, projectSources, billingTypesIds, deliveryTypesIds, includeCompletedProjects, projectManagerIds } = foreCastFilterConditions;
    const payload = {
      accountIds,
      accountForecastCandidateId,
      parentAccountId,
      programIds,
      includeSignedContracts: true,
      includeSummaryInformation: true,
      includedInForecast: true,
      salesStages: salesStages?.map(item => item.id),
      projectSources: projectSources?.map(item => item.id),
      billingTypesIds: billingTypesIds?.map(item => item.id),
      deliveryTypesIds: deliveryTypesIds?.map(item => item.id),
      includeCompletedProjects,
      projectManagerIds: projectManagerIds?.map(item => item.id),
      forecastEntitlement: {
        forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
      }
    };
    return payload;
  };

  const collapseSummary = (isCollapse) => {
    setIsCollapseSummary(isCollapse);
  };

  const handleCustomGroupRoute = (customGroupData) => {
    setSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION, { data: customGroupData , forecasting: true});
    history.push(`/${accountForecastCandidateId}/${CUSTOM_GROUP}/${customGroupData?.id}`);
  };

  return (
    <ForecastContainer>
      <div className={styles.wrapper}>
        <div className={`d-flex justify-content-between ${tableMaximize && styles['collapsed-wrapper']}`}>
          {!tableMaximize &&
            <BreadcrumbNavigation
              breadcrumbSubTitle={breadcrumbLabels()}
              breadcrumbTitle={
                <div className="d-flex">
                  {BREADCRUMB_FORECAST_SUMMARY_TITLE}
                </div>
              }
              className="mb-2"
              titleReverse
            />
          }
        </div>
        <div className="d-flex justify-content-between align-items-start">
          <OpportunitiesSearch
            label={OPPORTUNITY_SEARCH.LABEL_CHOOSE_FORECASTING}
            setSearchText={handleSearchChange}
          />
          <div className="d-flex gap-2 align-items-center mb-2">
            <AccountDropdown
              callBackHandler={callBackHandler}
              chooseForecastScreen
              dashboardState={dashboardState}
              metaData={metaData}
              showChildAccount={false}
              showProgram={false}
            />
            <SnapButton
              handleClick={handleFilterBtnClick}
              icon={
                <RVIcon
                  icon="filter"
                  size={iconSmallTwo}
                />
              }
              isIcon
              name="opportunity-filter-button"
              type={FORM_LABELS.PRIMARY}
              variant={FORM_LABELS.CONTAINED}
            />

            <SnapButton
              className={`${styles['expand-button']} ${tableMaximize && styles['expanded']}`}
              handleClick={handleTableMaximize}
              icon={
                <div className={`d-flex ${styles['icon-wrapper']}`}>
                  {tableMaximize ? (
                    <Minimize2 className={styles['icon-minimize']} />
                  ) : (
                    <Maximize2 className={styles['icon-maximize']} />
                  )}
                </div>
              }
              isIcon
              name="edit"
              type={FORM_LABELS.PRIMARY}
              variant={FORM_LABELS.CONTAINED}
            />
          </div>
        </div>
        {
          !!opportunities?.forecast_candidates_data?.forecastCandidates?.length && 
          <div className={`${styles['search-result']} ${tableMaximize && styles['expanded']}`}>
            {SEARCH_RESULTS(opportunities?.forecast_candidates_data?.forecastCandidates?.length, opportunities?.forecast_candidates_data?.totalCandidateCount)}
          </div>
        }
        {opportunities?.forecast_candidates_data?.forecastCandidates.length > 0 && (
          <div className={`flex-1 ${tableMaximize && styles['fixed-summary']} ${!tableMaximize && 'fixed-summary-global'}`}>
            <HorizontalSummary
              className={`
              ${styles['forecast-summary-global']}
              ${styles['forecast-summary']}
              ${collapse && styles['forecast-summary-opened']}
            `}
              collapseButton={!(tableMaximize && isCollapseSummary)}
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
                      <h4>{financialYear}</h4>
                    </div>
                    <div className={`d-flex data-wrapper-global ${styles['data-wrapper']}`}>
                      <SummaryValue
                        mainValue={summaryData?.forecastCandidatesFinancialYearSummary?.totalRevenue ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.totalRevenue) : DASH}
                        mainValueTitle={CHOOSE_FORECASTING_SUMMARY_STRINGS.TOTAL_REVENUE}
                      />
                      <SummaryValue
                        mainValue={summaryData?.forecastCandidatesFinancialYearSummary?.finalResourceCostOtherCostSum ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.finalResourceCostOtherCostSum) : DASH}
                        mainValueSecondary={summaryData?.forecastCandidatesFinancialYearSummary?.finalResourceCostOtherCostSumPercentage ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.finalResourceCostOtherCostSumPercentage, { isPercentage: true }) : null}
                        mainValueTitle={CHOOSE_FORECASTING_SUMMARY_STRINGS.RESOURCE_COST}
                      />
                      <SummaryValue
                        mainValue={summaryData?.forecastCandidatesFinancialYearSummary?.directExpense ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.directExpense) : DASH}
                        mainValueSecondary={summaryData?.forecastCandidatesFinancialYearSummary?.directExpensePercentage ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.directExpensePercentage, { isPercentage: true }) : null}
                        mainValueTitle={CHOOSE_FORECASTING_SUMMARY_STRINGS.DIRECT_EXPENSE}
                      />
                      <SummaryValue
                        mainValue={summaryData?.forecastCandidatesFinancialYearSummary?.grossMargin ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.grossMargin) : DASH}
                        mainValueSecondary={summaryData?.forecastCandidatesFinancialYearSummary?.grossMarginPercentage ? preciseNumberFormatter(summaryData.forecastCandidatesFinancialYearSummary.grossMarginPercentage, { isPercentage: true }) : null}
                        mainValueTitle={CHOOSE_FORECASTING_SUMMARY_STRINGS.GROSS_PROFIT_MARGIN}
                      />
                      <SummaryValue
                        mainValue={preciseNumberFormatter(summaryData?.totalProjects)}
                        mainValueTitle={CHOOSE_FORECASTING_SUMMARY_STRINGS.TOTAL_OPPS}
                      />
                    </div>
                  </div>
                  <Collapse
                    className={`collapse-area-global ${styles['collapse-area']}`}
                    in={collapse}
                  >
                    <div className={`forecasting-table ${styles['collapse-wrapper']}`}>
                      <ForecastDataSheetControlWrapper
                        grid={responseData.resourceSummary}
                        header={responseData.headerData}
                        tooltipContent={CHOOSE_FORECAST_SUMMARY_TOOLTIP}
                        type={TABLE_TYPES.RESOURCE}
                        viewOnlyPermission={viewOnlyPermission}
                      />
                    </div>
                  </Collapse>
                </>
              }
              yearIndicatorDisable
            />
          </div>
        )
        }
        {
          locked &&
          <CustomAlertBar>
            <div className="d-flex align-items-center position-relative">
              <img
                alt="empty screen"
                className="gif-img"
                src={sandTimer}
              />
              <span className="ml-3">
                {getSubmissionMessage({
                  startDateTime: forecastCycles?.startDateTime,
                  endDateTime: forecastCycles?.endDateTime
                })}
              </span>
            </div>
          </CustomAlertBar>
        }
        {opportunities?.forecast_candidates_data?.forecastCandidates?.length > 0 &&
        <ChooseForecastingTable
          callBackHandler={callBackHandler}
          financialYear={financialYear}
          handleCustomGroupRoute={handleCustomGroupRoute}
          handleLoadMore={handleLoadMore}
          hasMoreData={opportunities?.forecast_candidates_data?.forecastCandidates?.length < opportunities?.forecast_candidates_data?.totalCandidateCount}
          opportunities={opportunities}
          payloadForForecastCandidates={payloadForForecastCandidates}
          selectedForecastCandidates={opportunities?.forecast_candidates_data?.forecastCandidates}
          tableMaximize={tableMaximize}
          viewOnlyPermission={viewOnlyPermission}
        />
        }


        {opportunities?.forecast_candidates_data?.forecastCandidates?.length === 0 &&
        <EmptyScreen
          center
          className={noDataFound ? styles['no-opportunity-card'] : styles['empty-screen']}
          image={isSearchedActive ? NoRecordFound : noDataFound}
          subTitle={isSearchedActive ? EMPTY_SCREEN_MESSAGE.SUBTITLE : CHOOSE_FORECAST_EMPTY_SCREEN.SUBTITLE}
          title={isSearchedActive ? EMPTY_SCREEN_MESSAGE.TITLE : CHOOSE_FORECAST_EMPTY_SCREEN.TITLE}
        />
        }


        <Footer
          handleClick={handlePrimaryBtnClick}
          handleFooterSecondaryButton={handleFooterSecondaryButtonClick}
          handleFooterTertiaryButton={handleFooterTertiaryButtonClick}
          hideSave={!getPermissions()?.VIEW_PARENT_ACCOUNT_REVENUE_FORECAST}
          primaryLabel={footerPrimaryBtnLabel}
          secondaryLabel={footerSecBtnLabel}
          tertiaryButton={isVHBFMUser}
        />

        {filterModal && (
          <FilterOpportunitiesModal
            callBackHandler={callBackHandler}
            chooseForecastScreen
            getChildAccountsCallBack={getChildAccountsCallBack}
            getForeCastCandidateList={getForeCastCandidateList}
            handleClose={handleFilterModalClose}
            metaData={metaData}
            open={filterModal}
            setIsRestoreFilterData={setIsRestoreFilterData}
          />
        )}

        {modifySubmissionModal && (
          <DialogModal
            className="confirmation-modal"
            description={
              <div className="confirmation-modal-text">
                <p className="mx-4 my-4"> {FORECAST_DASHBOARD_CONSTANTS.MODIFY_SUBMISSION_MODAL_MSG} </p>
              </div>
            }
            handleClose
            handlePrimaryButton={handleModifySubmissionCancel}
            handleSecondaryButton={handleModifySubmissionConfirm}
            modalIcon="i"
            open={modifySubmissionModal}
            primaryButton
            primaryButtonLabel={BTN_LABELS.CANCEL}
            secondaryButton
            secondaryButtonLabel={BTN_LABELS.CONFIRM}
            title={FORECAST_DASHBOARD_CONSTANTS.CONFIRM_MODIFY_SUBMISSION_TITLE}
          />
        )}
      </div>
    </ForecastContainer>
  );
};

ChooseForecasting.propTypes = {
  accountForecastCandidateId: PropTypes.string,
  callBackHandler: PropTypes.func,
  dashboardState: PropTypes.object,
  metaData: PropTypes.object,
  opportunities: PropTypes.any
};

export default withStyles(styles)(ChooseForecasting);
