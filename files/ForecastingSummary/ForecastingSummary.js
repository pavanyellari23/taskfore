import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import Proptypes from 'prop-types';
import { Forward } from '@material-ui/icons';
import withStyles from '@material-ui/core/styles/withStyles';
import SnapButton from '@pnp-snap/snap-button';
import excelImg from '@pnp-revin/utils/dist/assets/images/excel-icon.png';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import GridRow from '@revin-utils/components/grid-row';
import { ArrowLeft, ArrowRight } from 'react-feather';
import { Col, Container } from 'react-grid-system';
import { Slide } from '@material-ui/core';
import { FORM_LABELS, preciseNumberFormatter, getSessionItem, LOCAL_STORAGE_ITEM, setSessionItem} from '@revin-utils/utils';
import { BACK, DONE, FORECASTING_SUMMARY, FORECASTING_SELECTION_ROUTE, PROJECT_FORECASTING_BREADCRUMBS, PROJECT_SUMMARY_CONSTANTS, RESOURCE_FORECASTING, USD ,ACCOUNT_LEVEL_CONSTANTS, ROUTES, SESSION_STORAGE_KEYS, RESOURCE_PROJECT_LEVEL_SUMMARY, ACCOUNT_DROPDOWN, VIEW_ONLY_ACCESS_ROLES, COR_INVESTMENT_INCLUDED, TRANSITION, ENTITY_TYPE, PROJECT, GROUP } from 'utils/constants';
import ForecastAccount from 'components/common/ForecastAccount';
import CenterModule from 'components/common/ForecastingSummary/CenterModule';;
import ExpandCard from 'components/common/ExpandCard';
import Footer from '@revin-utils/components/footer';
import ForecastContainer from 'components/pages/forecast-container/ForecastContainer';
import { ForecastingVerticalSummaryCard } from 'components/common/ForecastingVerticalSummaryCard';
import { MESSAGES } from 'utils/messages';
import { getCurrentFinancialYear, handleBreadcrumbClick } from 'utils/helper';
import { ELEMENT_ID } from 'utils/test-ids';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { ProjectForecastingActionType } from 'store/types/ProjectForecastingActionType';
import { ResourceForecastingActionType } from 'store/types/ResourceForecastingActionType';
import { AccountForecastingActionType } from 'store/types/AccountForecastingActionType';
import { ForecastDashBoardActionType } from 'store/types/ForecastDashBoardActionType';
import { getFinancialYearSummary } from 'store/actions/ForecastDashboard';
import GroupForecastTooltip from 'components/common/group-forecast-tooltip';
import accountStyles from './AccountForecastingSummary.module.scss';
import styles from './ForecastingSummary.module.scss';

const ForecastingSummary = ({ forecastSummary, monthlyTrends, quarterlyTrends, forecastingType, callBackHandler, downloadExcel, metaData, foreCastCommentsData }) => {
  const { projectForecastCandidateId, accountForecastCandidateId } = useParams();
  const history = useHistory();
  const [transition, setTransition] = useState(() => {
    const storedTransition = localStorage.getItem('transition');
    return storedTransition !== null ? JSON.parse(storedTransition) : true;
  });
  const [transitionDelay, setTransitionDelay] = useState(true);
  const [forecastLabel,setForecastLabel] = useState('');
  const [financialYear , setFinancialYear] = useState('');
  const [parentAccountData , setParentAccountData] = useState({});
  const [commentData, setCommentData] = useState('');
  const [savedCommentData, setSavedCommentData] = useState(null);
  const [commentsUpdatedBy, setCommentsUpdatedBy] = useState('');
  const entitlement = metaData?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);

  useEffect(() => {
    return () => {
      callBackHandler({
        type: ForecastDashBoardActionType.SET_FORECAST_COMMENTS,
        payload: {}
      });
    };
  },[]);

  useEffect(() => {
    if (foreCastCommentsData?.notes) {
      setSavedCommentData(foreCastCommentsData);
      foreCastCommentsData.updatedByName && setCommentsUpdatedBy(foreCastCommentsData.updatedByName);
    }
  },[foreCastCommentsData]);

  useEffect(() => {
    localStorage.setItem(TRANSITION, JSON.stringify(transition));
  }, [transition]);

  useEffect(() => {
    if (forecastingType === FORECASTING_SUMMARY.ACCOUNT || forecastingType === FORECASTING_SUMMARY.PROJECT || forecastingType === FORECASTING_SUMMARY.RESOURCE) {
      callBackHandler({
        type: ForecastDashBoardActionType.GET_FORECAST_COMMENTS,
        payload: {
          id: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? accountForecastCandidateId : projectForecastCandidateId, 
          forecastingType: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? ENTITY_TYPE.ACCOUNT : PROJECT, 
          forecastEntitlementView: entitlement
        }
      });
    }
  }, [forecastingType]);

  const handleTransition = () => { 
    setTransition(!transition);
    setTimeout(() => {
      setTransitionDelay(!transitionDelay);
    }, 100);
  };
 
  useEffect(() =>{
    const financialYear = (forecastingType === FORECASTING_SUMMARY.ACCOUNT) ? forecastSummary?.financialYearSummary : getCurrentFinancialYear(forecastSummary?.projectFinancialYearSummary);
    setFinancialYear(financialYear);
    if(forecastingType === FORECASTING_SUMMARY.RESOURCE){
      setForecastLabel(PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_RESOURCE_LEVEL);
    }
    else if(forecastingType === FORECASTING_SUMMARY.ACCOUNT){
      setForecastLabel(PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_ACCOUNT_LEVEL);
    }
    else{
      setForecastLabel(PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_PROJECT_LEVEL);
    }
    const parentAccountData = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes;
    setParentAccountData({
      selectedParentAccount : {
        parentAccountId: parentAccountData?.parentAccountId,
        parentAccountName: parentAccountData?.parentAccountName
      }});
  },[forecastingType, JSON.stringify(forecastSummary)]);

  const handleDone = () => {
    if (commentData.trim()?.length <= 255) {
      if (!savedCommentData) {
        callBackHandler({
          type: ForecastDashBoardActionType.SAVE_FORECAST_COMMENTS,
          payload: {
            id: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? accountForecastCandidateId : projectForecastCandidateId,
            notes: commentData,
            targetType: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? 'ACCOUNT' : 'PROJECT',
            forecastEntitlementView: entitlement
          }
        });
      } else {
        callBackHandler({
          type: ForecastDashBoardActionType.UPDATE_FORECAST_COMMENTS,
          payload: {
            notesId: foreCastCommentsData.id,
            notes: commentData,
            forecastEntitlementView: entitlement
          }
        });
      }
    }
    callBackHandler({
      type: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? AccountForecastingActionType.CLEAR_ACCOUNT_SUMMARY :
        forecastingType === FORECASTING_SUMMARY.RESOURCE ? ResourceForecastingActionType.CLEAR_RESOURCE_SUMMARY :
          ProjectForecastingActionType.CLEAR_PROJECT_SUMMARY
    });
    callBackHandler(getFinancialYearSummary({ accountForecastCandidateId: getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.id }));
    if (forecastingType === FORECASTING_SUMMARY.ACCOUNT) {
      history.push(`${ROUTES.FORECAST_DASHBOARD}`);
    } else {
      setSessionItem(SESSION_STORAGE_KEYS.IS_REDIRECTED_FROM_FORECAST_SUMMARY, {isFromForecastSummary : true, projectForecastCandidateId});
      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountForecastCandidateId}/`);
    }
  };

  const handleCancel = () => {
    history.goBack();
    callBackHandler({
      type: forecastingType === FORECASTING_SUMMARY.ACCOUNT ? AccountForecastingActionType.CLEAR_ACCOUNT_SUMMARY :
        forecastingType === FORECASTING_SUMMARY.RESOURCE ? ResourceForecastingActionType.CLEAR_RESOURCE_SUMMARY :
          ProjectForecastingActionType.CLEAR_PROJECT_SUMMARY
    });
  };

  const handleDownloadExcel = () => {
    downloadExcel({
      type: MetaDataActionType.DOWNLOAD_EXCEL,
      payload: forecastingType
    });
  };

  const handleOnClick = (event,label) => {
    handleBreadcrumbClick(label,accountForecastCandidateId,history,projectForecastCandidateId);
  };
  
  const handleForecastClick = () => {
    handleBreadcrumbClick(forecastLabel,accountForecastCandidateId,history,projectForecastCandidateId);
  };

  const breadcrumbSubTitles = () => {
    const titles = [{ label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick }];
    if (!VIEW_ONLY_ACCESS_ROLES.includes(entitlement)) {
      titles.push({ label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_SELECTION, onClick: handleOnClick  });
    }
    titles.push(
      { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_CHOOSE, onClick: handleOnClick },
      { label:  forecastLabel, onClick: handleForecastClick },
      { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_SUMMARY }
    );
    return titles;
  };

  const handleCommentChange = (notes) => {
    let loggedinUserName = localStorage.getItem(LOCAL_STORAGE_ITEM.USER);
    if (loggedinUserName) {
      loggedinUserName = JSON.parse(loggedinUserName);
      setCommentsUpdatedBy(`${loggedinUserName.firstName} ${loggedinUserName.lastName}`);
    }
    setCommentData(notes);
  };

  return (
    <ForecastContainer 
      tabvalue={forecastingType === FORECASTING_SUMMARY.ACCOUNT ? 1 : 0}
    >
      <Container
        className={styles.wrapper}
        fluid
      >
        { forecastSummary && 
      <>
        <div className="d-flex justify-content-between">
          {forecastLabel === PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_PROJECT_LEVEL || forecastLabel === PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_RESOURCE_LEVEL ?(
            <BreadcrumbNavigation
              breadcrumbSubTitle={breadcrumbSubTitles()}
              breadcrumbTitle={
                <div className="d-flex align-items-center gap-1">
                  {forecastSummary?.projectName}
                  {forecastSummary?.type !== GROUP && <span className="link">{forecastSummary?.projectCode}</span>}
                  {forecastSummary?.type === GROUP &&
                  <InfoTooltip
                    className={styles['project-info-tooltip']}
                    infoContent={          
                      <>
                        <GroupForecastTooltip forecastingData={forecastSummary}/>
                      </>
                    }
                  />
                  }
                </div>
                
              }
              className="mb-2"
              titleReverse
            />
          ):(

            <BreadcrumbNavigation
              breadcrumbSubTitle={[
                { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
                { label:  forecastLabel, onClick: handleForecastClick },
                { label: PROJECT_FORECASTING_BREADCRUMBS.BREADCRUMB_SUMMARY }
              ]}
              breadcrumbTitle={
                <div className="d-flex">
                  {ACCOUNT_DROPDOWN.ACCOUNT}
                  <span className="link">{forecastSummary?.parentAccountName}</span>
                </div>
              }
              className="mb-2"
              titleReverse
            />
          )}
          <div className={`d-flex mb-2 ${styles['action-buttons']}`}>
            {/* TODO : Commenting as of now, we need in future. */}
            <SnapButton
              className={styles['excel-button']}
              handleClick={handleDownloadExcel}
              icon={
                <div className={`d-flex ${styles['icon-wrapper']}`}>
                  <img
                    alt="download excel"
                    src={excelImg}
                  />
                  <Forward />
                </div>
              }
              id={ELEMENT_ID.EXCEL_IMG_BUTTON}
              isIcon
              name="edit"
              type="primary"
              variant={FORM_LABELS.CONTAINED}
            />
            <SnapButton
              className={`${styles['expand-button']} ${!transition &&
              styles['expanded']}`}
              handleClick={handleTransition}
              icon={
                <div className={`d-flex ${styles['icon-wrapper']}`}>
                  <ArrowLeft />
                  <ArrowRight />
                </div>
              }
              id={ELEMENT_ID.ARROW_LEFT_ARROW_RIGHT}
              isIcon
              name="edit"
              type="primary"
              variant={FORM_LABELS.CONTAINED}
            />
          </div>
        </div>
        <GridRow>
          {transition && (
            <Col xs={5}>
              <Slide
                direction="right"
                in={transition}
                mountOnEnter
                unmountOnExit
              >
                <div> 
                  <ForecastAccount
                    account={forecastSummary?.account?.accountName ?? forecastSummary?.accountName}
                    accountForecastCandidateId={accountForecastCandidateId}
                    callBackHandler={callBackHandler}
                    className={styles['forecast-account-calendar']}
                    commentsUpdatedBy={commentsUpdatedBy}
                    dashboardState={parentAccountData}
                    forecastingType={forecastingType}
                    isVHorBFM={VIEW_ONLY_ACCESS_ROLES.includes(entitlement)}
                    metaData={metaData}
                    opportunityDetails={{oppId: forecastSummary?.projectCode, oppName: forecastSummary?.projectName}}
                    savedCommentData={savedCommentData}
                    setCommentData={handleCommentChange}
                  />
                </div>
              </Slide>
            </Col>
          )}
          <Col xs={transition ? 14 : 24}>
            <CenterModule
              forecastData={forecastSummary}
              forecastingType={forecastingType}
              monthlyTrends={monthlyTrends} 
              quarterlyTrends={quarterlyTrends} 
              styles={forecastingType === FORECASTING_SUMMARY.ACCOUNT ? accountStyles : styles}
              transition={transition}
            />
          </Col>
          {transition && (
            <Col xs={5}>
              <Slide
                direction="left"
                in={transition}
                mountOnEnter
                unmountOnExit
              >
                <div>
                  <ForecastingVerticalSummaryCard
                    forecastingType={forecastingType}
                    subTitle={`${PROJECT_SUMMARY_CONSTANTS.CURRENCY_TEXT} (${forecastSummary?.currencyCode ?? USD})`}
                    title={`${PROJECT_SUMMARY_CONSTANTS.SUMMARY} (FY${financialYear?.year?.toString()?.slice(-2)})`}
                    values={[
                      { label: PROJECT_SUMMARY_CONSTANTS.GROSS_PFT_MARGIN , value: preciseNumberFormatter(financialYear?.grossMargin), percentage: preciseNumberFormatter(financialYear?.grossMarginPercentage,{isPercentage:true}) },
                      forecastingType === FORECASTING_SUMMARY.ACCOUNT && { label: ACCOUNT_LEVEL_CONSTANTS.NET_EDIDTA_LABEL , value: preciseNumberFormatter(financialYear?.netEbitda), percentage:preciseNumberFormatter(financialYear?.netEbitdaPercentage,{isPercentage:true}) }
                    ]}
                  />
                  <ExpandCard
                    className={`my-2 ${styles['grid-data']}`}
                    disableClick
                  >
                    <div className={styles['content-wrapper']}>
                      <div className={`d-flex ${styles.grid} `}>
                        <div className={styles.column}>
                          <h2>{ preciseNumberFormatter(financialYear?.totalRevenue)}</h2>
                          <p>{RESOURCE_PROJECT_LEVEL_SUMMARY[1][0]?.value}</p>
                        </div>
                        <div className={styles.column}>
                          <h2>{ preciseNumberFormatter(financialYear?.finalResourceCostOtherCostSum)}</h2>
                          <p>{RESOURCE_FORECASTING.RESOURCE_COST}</p>
                        </div>
                      </div>
                      <div className={`d-flex ${styles.grid} `}>
                        <div className={styles.column}>
                          <span className="icon-content-wrapper">
                            <h2>{ forecastingType === FORECASTING_SUMMARY.ACCOUNT ? preciseNumberFormatter(financialYear?.investmentDE) : preciseNumberFormatter(financialYear?.directExpense)}</h2>
                            { forecastingType === FORECASTING_SUMMARY.ACCOUNT && 
                            <InfoTooltip
                              infoContent={COR_INVESTMENT_INCLUDED}
                            />}
                          </span>
                          <p>{`${RESOURCE_FORECASTING.DIRECT_EXPENSE}s`}</p>
                        </div>
                        <div className={styles.column} />
                      </div>
                    </div>
                  </ExpandCard>
                </div>
              </Slide>
            </Col>
          )}
        </GridRow>
      </>}
      </Container>
      <Footer 
        handleClick={handleDone}
        handleFooterSecondaryButton={handleCancel}
        primaryLabel={DONE}
        secondaryLabel={BACK}
      />  
    </ForecastContainer>
  );
};

ForecastingSummary.propTypes = {
  callBackHandler: Proptypes.func,
  downloadExcel: Proptypes.func,
  foreCastCommentsData: Proptypes.object,
  forecastSummary: Proptypes.any,
  forecastingType: Proptypes.string,
  metaData: Proptypes.object,
  monthlyTrends:Proptypes.object,
  quarterlyTrends:Proptypes.object
};

export default withStyles(styles)(ForecastingSummary);
