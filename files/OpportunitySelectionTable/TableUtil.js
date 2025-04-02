import React from 'react';
import moment from 'moment-mini';
import SnapButton from '@pnp-snap/snap-button';
import SaveIcon from '@material-ui/icons/Save';
import _uniqueId from 'lodash/uniqueId';
import _isUndefined from 'lodash/isUndefined';
import XCircle from 'react-feather/dist/icons/x-circle';
import CustomCheckbox from '@revin-utils/components/custom-checkbox';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import { preciseNumberFormatter, FORM_LABELS } from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { RVIcon } from '@revin-utils/assets';
import newDealIcon from 'assets/images/new-deal-icon.svg';
import completeIcon from 'assets/images/complete-icon.svg';
import EditDropdown from 'components/common/OpportunitySelectionTable/EditDropDown';
import ForecastTab from 'components/common/ChooseForecastingTable/ForecastTab';
import ProbablityOverrideField from 'components/common/ProbablityOverrideField';
import ForecastMiniTrends from 'components/common/forecast-mini-trends';
import MiniDropdown from 'components/common/mini-dropdown';
import { AvatarGroup } from 'components/common';
import { miniGraphMapper } from 'utils/forecastingCommonFunctions';
import { getISTTime } from 'utils/commonFunctions';
import { billingTypeDropDown, removeSpecialCharacters } from 'utils/helper';
import { ELEMENT_ID } from 'utils/test-ids';
import { LOAD_MORE, DASH, AD_HOC, DATE_FORMAT, FORECAST, FORECAST_DASHBOARD_CONSTANTS, FORECAST_TYPE, FORECAST_VIEW, FORECAST_VIEW_EDIT, OPPORTUNITY_NEW_DEAL, OPPORTUNITY_COMPLETED, OPP_TYPE, PROJECT_LABEL, RESOURCE_LABEL, RESOURCE_LEVEL_FORECAST, VIEW, PROJECT_SOURCE_NAME, DRAFT_PROJECT_TOOLTIP, FORECAST_BILLING_TYPE, TIME_AND_EXPENSE_DISPLAY_LABEL, MINI_DROPDOWN_POSITION, PROJECT_FORECASTING_TYPE, BILLING_DROPDOWN } from 'utils/constants';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import styles from './OpportunitySelectionTable.module.scss';

// TODO: Will need in phase level
const { iconSmallTwo } = variableStyle;
{/* <RVIcon 
            className="more-icon"
            icon="more"
            size={iconSmallTwo}
          /> */}

export const buildAvatarArray = (data) => {
  return data?.projectManagerDetailsDTOList?.map((mitem) => ({
    firstName: mitem?.projectManagerName,
    src: mitem?.projectManagerAvatar,
    id: mitem?.projectManagerId
  }));
};

export const DUMMY_ROW_MODIFY_SELECTION = {
  opportunity: (
    <div className={styles['heading-dummy']} />
  ),
  source: <div className={styles['heading-dummy']} />,
  salesStage: <div className={styles['heading-dummy']} />,
  forecast: <div className={styles['heading-dummy']} />,
  tcv: <div className={styles['heading-dummy']} />,
  startDate: <div className={styles['heading-dummy']} />,
  endDate: <div className={styles['heading-dummy']} />,
  projectManager: <div className={styles['heading-dummy']} />,
  override: <div className={styles['heading-dummy']} />,
  checkbox: <div className={styles['heading-dummy']} />,
  edit: ''
};

export const buildRowData = (opportunities, deleteOpportunity, openAdhocOppEditModal, handleMainCheckBox, handleMessageIcon, handleProbablityOverride,handleBillingTypeOverride, parentAccountForecastStatus,metaData, handleLoadMore, hasMoreData, handleCustomGroupRoute, openCustomGroupEditModal, isVHBFMUser) => {
  const opportunityRowData = [];

  const customGroups = opportunities?.filter(item => item?.type === 'GROUP');

  const CUSTOM_GROUP_ROWS = customGroups?.map((item, index) => {
    
    const isExcluded = item?.exclusionReason || item?.reasonForExclusion;
    const isSubmitted = parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;

    return ({
      opportunity: (
        <div
          className={
            customGroups?.length === 1 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-top-left']} ${styles['border-radius-bottom-left']} ${styles['border-0']} ` 
              : index === 0 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-top-left']}` :
                index !== customGroups?.length - 1 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border']}` :
          `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-bottom-left']} ${styles['border-0']}`
          }
        >
          {item?.draftAvailable && (
            <div className={'save-draft'}>
              <InfoTooltip
                className={`main-tooltip ${styles['draft-tooltip']}`}
                icon={<SaveIcon className="draft-icon"/>}
                infoContent={DRAFT_PROJECT_TOOLTIP}
                position={'right'}
              />
            </div>
          )}
          <ArrowWrapper
            data={item}
            handleChange={handleCustomGroupRoute}
          >
            <div>
              <h4 className="d-flex align-items-center">
                <span
                  className="text-ellipsis"
                  title={item?.groupInfo?.groupName}
                >{item?.groupInfo?.groupName} </span>
                &nbsp;
                {/* &nbsp; {item?.groupInfo?.projectForecastCandidateIds?.length && `${item?.groupInfo?.projectForecastCandidateIds?.length}`} */}
                {/* <CustomChip type="borderless-solid" title="NEW DEAL" /> */}
                {item?.groupInfo?.projectForecastCandidateIds?.length > 0 && 
                  <div className={styles['list-more']}>{item?.groupInfo?.projectForecastCandidateIds?.length}</div>
                }&nbsp;
                {item?.opportunityType === OPP_TYPE.PARENT &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_NEW_DEAL}
                    src={newDealIcon}
                  />
                }
                infoContent={OPPORTUNITY_NEW_DEAL}
              />
                }
                {item?.labels?.includes(OPP_TYPE.COMPLETED_PROJECT) &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_COMPLETED}
                    src={completeIcon}
                  />
                }
                infoContent={OPPORTUNITY_COMPLETED}
              />
                }
              </h4>
            </div>
          </ArrowWrapper>
        </div>
      ),
      source: (<div className={styles['clickable-heading']} />),
      engagementType: <div className={styles['clickable-heading']} />,
      billingType:(
        <div className={`${styles['clickable-heading']} ${styles['group-heading']}`}>
          {
            (!item?.billingType?.trim() && item?.projectSourceName === PROJECT_SOURCE_NAME.CRM) ?
              DASH
              :
              <MiniDropdown 
                items={[{label : item?.billingType === PROJECT_FORECASTING_TYPE.TIM_EXP ? BILLING_DROPDOWN.TIME_AND_EXPENSE : item?.billingType}]} 
              />
          }
        </div>
      ),
      salesStage: <div className={styles['clickable-heading']} />,
      mrr: (
        <div className={`${styles['clickable-heading']} ${styles['group-heading']}`}>{`${preciseNumberFormatter(item?.financialYearMRRTotal ?? 0)}`}</div>
      ),
      tcv: <div className={`${styles['clickable-heading']} ${styles['group-heading']}`}>{`${preciseNumberFormatter(item?.totalContractValue ?? 0)}`}</div>,
      startDate: (
        <div className={`${styles['clickable-heading']} ${styles['group-heading']}`}>
          {(item?.projectStartDate?.length || item?.primaryInfo?.estimatedStartDate?.length) ? moment(item?.projectStartDate ?? item?.primaryInfo?.estimatedStartDate).format(DATE_FORMAT.FORMAT_9) : DASH}
        </div>
      ),
      endDate: (
        <div className={`${styles['clickable-heading']} ${styles['group-heading']}`}>
          {(item?.projectEndDate?.length || item?.primaryInfo?.estimatedEndDate?.length) ? moment(item?.projectEndDate ?? item?.primaryInfo?.estimatedEndDate).format(DATE_FORMAT.FORMAT_9): DASH}
        </div>
      ),
      projectManager: (
        <div className={styles['clickable-heading']}>
          {buildAvatarArray(item) &&
            <AvatarGroup
              avatarData={buildAvatarArray(item)}
              maxAvatarsToShow="3"
            />
          }
        </div>
      ),
      override: (
        <div
          className={styles['clickable-heading']}
          key={item?.id}
        >
          {isVHBFMUser || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) ?
            (item?.probabilityOverride ?? 0) : (
              <ProbablityOverrideField
                handleProbablityOverride={handleProbablityOverride}
                oppData={item}
              />)
          }
        </div>
      ),
      checkbox:
      (
        <div
          className={`d-flex align-items-center ${styles['clickable-heading']} ${styles['checkbox-wrapper']}`}
        >
          {
            (!isSubmitted || !isExcluded) &&    
          <ArrowWrapper
            data={item}
            handleChange={!isVHBFMUser && parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS && handleMainCheckBox}
          >
            <CustomCheckbox
              checked={item?.checked}
              disabled={isSubmitted}
              id={`${ELEMENT_ID.CHECKBOX}${item?.id}`}
              isSelected={isSubmitted}
              name={`${ELEMENT_ID.CHECKBOX}${item?.id}`}
              size="large"
            />
          </ArrowWrapper>
          }

          {!item?.checked && item && (item?.exclusionReason || item?.reasonForExclusion) &&
          <>   {isSubmitted &&   <XCircle className={styles['cross-icon']} /> } 
            <ArrowWrapper
              data={item?.id}
              handleChange={!isVHBFMUser && parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS && handleMessageIcon}
            >
              <div className={`d-flex ${styles['msg-wrapper']}`}>
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
            </ArrowWrapper>
          </>
          }
        </div>
      ),
      edit:
      (
        <div
          className={`${styles.dropdown} ${styles['clickable-heading']}`}
        >
          {!isVHBFMUser && (
            <EditDropdown 
              className={`${styles['border-radius-top-right']}`}
              deleteOpportunity={deleteOpportunity}
              hideModify
              openCustomGroupEditModal={openCustomGroupEditModal}
              opportunityData={item}
            />
          )}
        </div>
      ),
      cellToClick: undefined,
      childData: [],
      date: undefined,
      defaultChildShow: undefined,
      id: 1,
      isGroup: true,
      moreData: undefined,
      name: undefined,
      onHandleCellClick: undefined,
      parentName: undefined,
      status: undefined,
      type: undefined
  
    });});

  const standaloneOpps = opportunities?.filter(item => item?.type !== 'GROUP');
  standaloneOpps?.forEach((item, index) => {
    const isExcluded = item?.exclusionReason || item?.reasonForExclusion;
    const isSubmitted = parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS;
    const projectName = removeSpecialCharacters(`${item?.projectName ?? item?.primaryInfo?.projectName}`);

    const itemRowData = {
      opportunity: (
        <div
          className={
            opportunities?.length === 1 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']} ${styles['border-radius-bottom-left']} ${styles['border-0']} ` 
              : index === 0 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']}` :
                index !== opportunities?.length - 1 ? `d-flex ${styles['clickable-heading']} ${styles['border']}` :
          `d-flex ${styles['clickable-heading']} ${styles['border-radius-bottom-left']} ${styles['border-0']}`
          }
        >
        
          <div>
            <h4 className="d-flex align-item-center">
              <span
                className="text-ellipsis"
                title={projectName}
              >{projectName}</span>
              {item?.opportunityType === OPP_TYPE.PARENT &&
                <InfoTooltip
                  icon={
                    <img
                      alt={OPPORTUNITY_NEW_DEAL}
                      src={newDealIcon}
                    />
                  }
                  infoContent={OPPORTUNITY_NEW_DEAL}
                />
              }
              {item?.labels?.includes(OPP_TYPE.COMPLETED_PROJECT) &&
                <InfoTooltip
                  icon={
                    <img
                      alt={OPPORTUNITY_COMPLETED}
                      src={completeIcon}
                    />
                  }
                  infoContent={OPPORTUNITY_COMPLETED}
                />
              }
            </h4>
            <p className={styles['sub-label']}>{
              item?.projectSourceName === PROJECT_SOURCE_NAME.INTERNAL || item?.projectSourceName === PROJECT_SOURCE_NAME.ADHOC
                ? `${item?.projectCode}`
                : `${item?.projectCode ? `${item?.projectCode} | ${item?.crmProbability} %` : ''}`
            }
            </p>
          </div>
        </div>
      ),
      source: <div className={styles['clickable-heading']}>{item?.projectSourceName ?? ''}</div>,
      engagementType: <div className={styles['clickable-heading']}>{item?.deliveryType?.trim() || DASH}</div>,
      billingType:(
        <div className={styles['clickable-heading']}>
          {
            (!item?.billingType?.trim() && item?.projectSourceName === PROJECT_SOURCE_NAME.CRM) ?
              DASH
              :
              <MiniDropdown 
                handleBillingTypeOverride={handleBillingTypeOverride}
                items={billingTypeDropDown(item?.deliveryType,item?.billingType,item?.projectSourceName,metaData )} 
                opportunity={item}
                position={getDropDownPosition(index, opportunities?.length, hasMoreData)}
              />
          }
        </div>
      ),
      salesStage: <div className={styles['clickable-heading']}>{item?.opportunityStage ?? item?.stage}</div>,
      mrr: (
        <div className={styles['clickable-heading']}>{item?.financialYearMRRTotal ? preciseNumberFormatter(item?.financialYearMRRTotal) : DASH}</div>
      ),
      tcv: <div className={styles['clickable-heading']}>{`${preciseNumberFormatter(item?.totalContractValue ?? 0)}`}</div>,
      startDate: (
        <div className={styles['clickable-heading']}>
          {(item?.projectStartDate?.length || item?.primaryInfo?.estimatedStartDate?.length) ? moment(item?.projectStartDate ?? item?.primaryInfo?.estimatedStartDate).format(DATE_FORMAT.FORMAT_9) : DASH}
        </div>
      ),
      endDate: (
        <div className={styles['clickable-heading']}>
          {(item?.projectEndDate?.length || item?.primaryInfo?.estimatedEndDate?.length) ? moment(item?.projectEndDate ?? item?.primaryInfo?.estimatedEndDate).format(DATE_FORMAT.FORMAT_9): DASH}
        </div>
      ),
      projectManager: (
        <div className={styles['clickable-heading']}>
          {buildAvatarArray(item) &&
            <AvatarGroup
              avatarData={buildAvatarArray(item)}
              maxAvatarsToShow="3"
            />
          }
        </div>
      ),
      override: (
        <div
          className={styles['clickable-heading']}
          key={item?.id}
        >
          {isVHBFMUser || (parentAccountForecastStatus === FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) ?
            (item?.probabilityOverride ?? 0) : (
              <ProbablityOverrideField
                handleProbablityOverride={handleProbablityOverride}
                oppData={item}
              />)
          }
        </div>
      ),
      // TODO: Commenting out will need in future: Custom Groups
      // phase: (
      //   item?.opportunityType !== AD_HOC ?
      //     <div className={styles['clickable-heading']}>
      //       <SnapToggleSwitch
      //         className="toggle-switch"
      //         id={item?.opportunityId}
      //         name={item?.opportunityId}
      //         optionLabels={CAP_RATE_CARD_TOGGLE_SWITCH_LABEL.Label}
      //         small
      //       />
      //     </div> : <div className={styles['clickable-heading']}/>
      // ),
      checkbox: (
        <div
          className={`d-flex align-items-center ${styles['clickable-heading']} ${styles['checkbox-wrapper']}`}
        >
          {
            (!isSubmitted || !isExcluded) &&    
          <ArrowWrapper
            data={item}
            handleChange={!isVHBFMUser && parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS  && handleMainCheckBox}
          >
            <CustomCheckbox
              checked={item?.checked}
              disabled={isSubmitted}
              id={`${ELEMENT_ID.CHECKBOX}${item?.opportunityId}`}
              isSelected={isSubmitted}
              name={`${ELEMENT_ID.CHECKBOX}${item?.opportunityId}`}
              size="large"
            />
          </ArrowWrapper>
          }

          {!item?.checked && item && (item?.exclusionReason || item?.reasonForExclusion) &&
          <>   {isSubmitted &&   <XCircle className={styles['cross-icon']} /> } 
            <ArrowWrapper
              data={item?.id}
              handleChange={!isVHBFMUser && parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS && handleMessageIcon}
            >
              <div className={`d-flex ${styles['msg-wrapper']}`}>
                <svg
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M0 0h24v24H0z"
                    fill="none"
                  />
                  <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
                </svg>
              </div>
            </ArrowWrapper>
          </>
          }
        </div>
      ),
      cellToClick: undefined,
      childData: [],
      date: undefined,
      defaultChildShow: undefined,
      id: 1,
      isGroup: true,
      moreData: undefined,
      name: undefined,
      onHandleCellClick: undefined,
      parentName: undefined,
      status: undefined,
      type: undefined,
      edit:
        <div
          className={`${styles.dropdown} ${styles['clickable-heading']} ${!index && styles['border-radius-top-right']}`}
        >
          {(!isVHBFMUser && (parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) &&
          ((item?.opportunityType === AD_HOC) || item?.labels?.includes(OPP_TYPE.CUSTOM_CANDIDATE))) &&
            <EditDropdown
              deleteOpportunity={deleteOpportunity}
              hideEdit={!item?.labels?.includes(OPP_TYPE.CUSTOM_CANDIDATE)}
              openAdhocOppEditModal={openAdhocOppEditModal}
              opportunityData={item}
            />
          }
        </div>
    };
    opportunityRowData.push(itemRowData);

  });

  if(hasMoreData) {
    opportunityRowData.push(getLoadMoreLinkRow(handleLoadMore));
  }

  if(CUSTOM_GROUP_ROWS?.length){
    return [DUMMY_ROW_MODIFY_SELECTION, ...CUSTOM_GROUP_ROWS, DUMMY_ROW_MODIFY_SELECTION, ... opportunityRowData];
  }else{
    return [DUMMY_ROW_MODIFY_SELECTION, ... opportunityRowData];
  }
  
};

export const buildChooseForecastingTableRowData = (handleForecastTab, selectedForecastCandidates, styles, handleNavigation, viewOnlyPermission, handleLoadMore, hasMoreData, handleCustomGroupRoute) => {

  const customGroups = selectedForecastCandidates?.filter(item => item?.type === 'GROUP');

  const CUSTOM_GROUPS = customGroups.map((item, index) => ({
    opportunity: (
      <div
        className={
          customGroups?.length === 1 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-top-left']} ${styles['border-radius-bottom-left']} ${styles['border-0']} ` 
            : index === 0 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-top-left']}` :
              index !== customGroups?.length - 1 ? `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border']}` :
          `d-flex ${styles['group-heading']} ${styles['clickable-heading']} ${styles['border-radius-bottom-left']} ${styles['border-0']}`
        }
      >
        {item?.draftAvailable && (
          <div className={'save-draft'}>
            <InfoTooltip
              className={`main-tooltip ${styles['draft-tooltip']}`}
              icon={<SaveIcon className="draft-icon"/>}
              infoContent={DRAFT_PROJECT_TOOLTIP}
              position={'right'}
            />
          </div>
        )}
        <ArrowWrapper
          data={item}
          handleChange={handleCustomGroupRoute}
        >
          <div>
            <h4 className="d-flex align-items-center">
              <span
                className="text-ellipsis"
                title={item?.groupInfo?.groupName}
              >{item?.groupInfo?.groupName}</span>
              &nbsp;
              {item?.groupInfo?.projectForecastCandidateIds?.length > 0 && 
              <div className={styles['list-more']}>{item?.groupInfo?.projectForecastCandidateIds?.length}</div>
              }&nbsp;
              {item?.opportunityType === OPP_TYPE.PARENT &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_NEW_DEAL}
                    src={newDealIcon}
                  />
                }
                infoContent={OPPORTUNITY_NEW_DEAL}
              />
              }
              {item?.labels?.includes(OPP_TYPE.COMPLETED_PROJECT) &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_COMPLETED}
                    src={completeIcon}
                  />
                }
                infoContent={OPPORTUNITY_COMPLETED}
              />
              }
            </h4>
          </div>
        </ArrowWrapper>
      </div>
    ),
    salesStage: (
      <div className={styles['clickable-heading']}>
        {item?.deliveryType || DASH} | {item?.billingType === PROJECT_FORECASTING_TYPE.TIM_EXP ? BILLING_DROPDOWN.TIME_AND_EXPENSE : item?.billingType || DASH}
      </div>
    ),
    forecast: (
      viewOnlyPermission ?
        <div className={styles['clickable-heading']}>
          {item?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? RESOURCE_LABEL : PROJECT_LABEL}
        </div> :
        <div
          className={styles['clickable-heading']}
          key={item?.opportunityId}
        >
          <ForecastTab
            billingType={item?.billingType}
            deliveryType={item?.deliveryType}
            forecastLevelType={item?.forecastLevelType}
            forecastTab={item?.forecastLevelType}
            handleForecastTab={handleForecastTab}
            opportunityId={item?.id}
          />
        </div>
    ),
    mrr: <div className={styles['clickable-heading']}>{item?.financialYearMRRTotal ? preciseNumberFormatter(item?.financialYearMRRTotal) : '-'}</div>,
    weightedMRR: <div className={styles['clickable-heading']}>{`${item?.financialYearWeightedMRRTotal ? preciseNumberFormatter(item?.financialYearWeightedMRRTotal) : 0} (${item?.probabilityOverride}%)`}</div>,
    forecastRev: (
      <div className={styles['clickable-heading']}>{preciseNumberFormatter(item?.financialYearTotalRevenue) ?? '-'}</div>
    ),
    gpm: (
      <div className={styles['clickable-heading']}>{preciseNumberFormatter(item?.grossProfitMargin)}{(!_isUndefined(item?.grossProfitMarginPercentage) ? ' | ' + item?.grossProfitMarginPercentage + '%' : '') || '-'}</div>
    ),

    monthlyTrends: (
      <div className={styles['clickable-heading']}>
        {item?.projectMonthlyTrendsSummaryDTOList?.length ?
          <ForecastMiniTrends
            tooltipPosition={index > selectedForecastCandidates?.length - 3 ? { y: -60 } : null}
            trendsData={miniGraphMapper(item?.projectMonthlyTrendsSummaryDTOList)}
            yAxisRightId={_uniqueId()}
          />
          : '-'}
      </div>
    ),
    quarterlyTrends: (
      <div className={styles['clickable-heading']}>
        {item?.projectQuarterlyTrendsSummaryDTOList ?
          <ForecastMiniTrends
            tooltipPosition={index > selectedForecastCandidates?.length - 3 ? { y: -60 } : null}
            trendsData={miniGraphMapper(item?.projectQuarterlyTrendsSummaryDTOList, true)}
            yAxisRightId={_uniqueId()}
          /> : '-'}
      </div>
    ),
    update: (
      <div className={`flex-column justify-content-center align-items-start ${styles['clickable-heading']}`}>
        {(item?.updatedByName && item?.updatedOnDate && item?.updatedOnTime) ?
          <>
            {item?.updatedByName ?? ''}
            <p>
              {`${item?.updatedOnDate ?? ''} | ${getISTTime(item?.updatedOnDate, item?.updatedOnTime)}`}
            </p>
          </>
          : '-'
        }
      </div>
    ),
    checkbox: (
      <ArrowWrapper
        data={`/${item?.accountForecastCandidateId}/${item?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? FORECAST_TYPE.RESOURCE_FORECASTING : FORECAST_TYPE.PROJECT_FORECASTING}/${item?.id}`}
        handleChange={handleNavigation}
      >
        {
          (viewOnlyPermission || FORECAST_VIEW.includes(item?.projectForecastStatus)) ?
            <div className={styles['clickable-heading']}>
              <SnapButton
                className="link-button"
                label={VIEW}
                name={VIEW}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div> :
            FORECAST_VIEW_EDIT.includes(item?.projectForecastStatus) ?
              <div className={`d-flex justify-content-center ${styles['clickable-heading']}`}>
                <RVIcon
                  icon="pencil"
                  size={iconSmallTwo}
                />
              </div>
              :
              <div className={styles['clickable-heading']}>
                <SnapButton
                  className="primary-invert"
                  label={FORECAST}
                />
              </div>
        }
      </ArrowWrapper>
    ),
    date: undefined,
    defaultChildShow: undefined,
    id: 8,
    isGroup: true,
    moreData: undefined,
    name: undefined,
    onHandleCellClick: undefined,
    parentName: undefined,
    status: undefined,
    type: undefined,
    childData: []
  }));

  const standaloneOpps = selectedForecastCandidates?.filter(item => item?.type !== 'GROUP');
  const ChooseForecastingTableRowData = standaloneOpps?.map((item, index) => ({
    opportunity: (
      <div
        className={
          selectedForecastCandidates?.length === 1 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']} ${styles['border-radius-bottom-left']} ${styles['border-0']} ` 
            : index === 0 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']}` :
              index !== selectedForecastCandidates?.length - 1 ? `d-flex ${styles['clickable-heading']} ${styles['border']}` :
          `d-flex ${styles['clickable-heading']} ${styles['border-radius-bottom-left']} ${styles['border-0']}`
        }
      >
        {item?.draftAvailable && (
          <div className={'save-draft'}>
            <InfoTooltip
              className={`main-tooltip ${styles['draft-tooltip']}`}
              icon={<SaveIcon className="draft-icon"/>}
              infoContent={DRAFT_PROJECT_TOOLTIP}
              position={'right'}
            />
          </div>
        )}
        <div>
          <h4 className="d-flex align-items-center">
            <span
              className="text-ellipsis"
              title={removeSpecialCharacters(item?.projectName)}
            >
              {removeSpecialCharacters(item?.projectName)}
            </span>
            {item?.opportunityType === OPP_TYPE.PARENT &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_NEW_DEAL}
                    src={newDealIcon}
                  />
                }
                infoContent={OPPORTUNITY_NEW_DEAL}
              />
            }
            {item?.labels?.includes(OPP_TYPE.COMPLETED_PROJECT) &&
              <InfoTooltip
                icon={
                  <img
                    alt={OPPORTUNITY_COMPLETED}
                    src={completeIcon}
                  />
                }
                infoContent={OPPORTUNITY_COMPLETED}
              />
            }
          </h4>
          <p className={styles['sub-label']}>{item?.projectCode ? `${item?.projectCode} | ${item?.crmProbability} %` : ''}</p>
        </div>
      </div>
    ),
    salesStage: (
      <div className={styles['clickable-heading']}>
        {item?.deliveryType || DASH} | {(item?.billingType === FORECAST_BILLING_TYPE.TIME_AND_EXPENSE ? TIME_AND_EXPENSE_DISPLAY_LABEL : item?.billingType) || DASH}
      </div>
    ),
    forecast: (
      viewOnlyPermission ?
        <div className={styles['clickable-heading']}>
          {item?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? RESOURCE_LABEL : PROJECT_LABEL}
        </div> :
        <div
          className={styles['clickable-heading']}
          key={item?.opportunityId}
        >
          <ForecastTab
            billingType={item?.billingType}
            deliveryType={item?.deliveryType}
            forecastLevelType={item?.forecastLevelType}
            forecastTab={item?.forecastLevelType}
            handleForecastTab={handleForecastTab}
            opportunityId={item?.id}
          />
        </div>
    ),
    // TODO: Replace the hardcoded values post receiving API data
    mrr: <div className={styles['clickable-heading']}>{item?.financialYearMRRTotal ? preciseNumberFormatter(item?.financialYearMRRTotal) : '-'}</div>,
    weightedMRR: <div className={styles['clickable-heading']}>{`${item?.financialYearWeightedMRRTotal ? preciseNumberFormatter(item?.financialYearWeightedMRRTotal) : 0} (${item?.probabilityOverride}%)`}</div>,
    forecastRev: (
      <div className={styles['clickable-heading']}>{item?.financialYearTotalRevenue ? preciseNumberFormatter(item?.financialYearTotalRevenue) : '-'}</div>
    ),
    gpm: (
      <div className={styles['clickable-heading']}>{preciseNumberFormatter(item?.grossProfitMargin)}{(!_isUndefined(item?.grossProfitMarginPercentage) ? ' | ' + preciseNumberFormatter(item?.grossProfitMarginPercentage, {isSinglePrecision: true}) + '%' : '') || '-'}</div>
    ),

    monthlyTrends: (
      <div className={styles['clickable-heading']}>
        {item?.projectMonthlyTrendsSummaryDTOList?.length ?
          <ForecastMiniTrends
            tooltipPosition={index > selectedForecastCandidates?.length - 3 ? { y: -60 } : null}
            trendsData={miniGraphMapper(item?.projectMonthlyTrendsSummaryDTOList)}
            yAxisRightId={_uniqueId()}
          />
          : '-'}
      </div>
    ),
    quarterlyTrends: (
      <div className={styles['clickable-heading']}>
        {item?.projectQuarterlyTrendsSummaryDTOList ?
          <ForecastMiniTrends
            tooltipPosition={index > selectedForecastCandidates?.length - 3 ? { y: -60 } : null}
            trendsData={miniGraphMapper(item?.projectQuarterlyTrendsSummaryDTOList, true)}
            yAxisRightId={_uniqueId()}
          /> : '-'}
      </div>
    ),
    update: (
      <div className={`flex-column justify-content-center align-items-start ${styles['clickable-heading']}`}>
        {(item?.updatedByName && item?.updatedOnDate && item?.updatedOnTime) ?
          <>
            <div
              className={`${styles['user-name']} text-ellipsis`}
              title={item?.updatedByName ?? ''}
            >{item?.updatedByName ?? ''}</div>
            <p>
              {`${item?.updatedOnDate ?? ''} | ${getISTTime(item?.updatedOnDate, item?.updatedOnTime)}`}
            </p>
          </>
          : '-'
        }
      </div>
    ),
    checkbox: (
      <ArrowWrapper
        data={`/${item?.accountForecastCandidateId}/${item?.forecastLevelType === RESOURCE_LEVEL_FORECAST ? FORECAST_TYPE.RESOURCE_FORECASTING : FORECAST_TYPE.PROJECT_FORECASTING}/${item?.id}`}
        handleChange={handleNavigation}
      >
        {
          (viewOnlyPermission || FORECAST_VIEW.includes(item?.projectForecastStatus)) ?
            <div className={styles['clickable-heading']}>
              <SnapButton
                className="link-button"
                label={VIEW}
                name={VIEW}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div> :
            FORECAST_VIEW_EDIT.includes(item?.projectForecastStatus) ?
              <div className={`d-flex justify-content-center ${styles['clickable-heading']}`}>
                <RVIcon
                  className={styles['edit-icon']}
                  icon="pencil"
                  size={iconSmallTwo}
                />
              </div>
              :
              <div className={styles['clickable-heading']}>
                <SnapButton
                  className="primary-invert"
                  label={FORECAST}
                />
              </div>
        }
      </ArrowWrapper>
    ),
    cellToClick: undefined,
    childData: [],
    date: undefined,
    defaultChildShow: undefined,
    id: 8,
    isGroup: true,
    moreData: undefined,
    name: undefined,
    onHandleCellClick: undefined,
    parentName: undefined,
    status: undefined,
    type: undefined
  }));

  if(hasMoreData) {
    ChooseForecastingTableRowData.push(getLoadMoreLinkRow(handleLoadMore));
  }

  if(CUSTOM_GROUPS?.length){
    return [DUMMY_ROW_MODIFY_SELECTION, ...CUSTOM_GROUPS, DUMMY_ROW_MODIFY_SELECTION, ...ChooseForecastingTableRowData];
  }else{
    return [DUMMY_ROW_MODIFY_SELECTION, ...ChooseForecastingTableRowData];
  }

};

const getLoadMoreLinkRow = (handleLoadMore) => {
  return {
    opportunity: <div className="load-more-wrap">
      <div 
        className="more"
        onClick={handleLoadMore}
      >
        {LOAD_MORE}
      </div>
    </div>
  };
};

const getDropDownPosition = (index, oppLength, hasMoreData) => {
  if ((index === oppLength - 1 && oppLength > 3) || (index === oppLength - 2 && !hasMoreData && oppLength > 4)) return MINI_DROPDOWN_POSITION;
  else return '';
};