import React from 'react';
import moment from 'moment-mini';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import MiniDropdown from 'components/common/mini-dropdown';
import { AvatarGroup } from 'components/common';
import { preciseNumberFormatter } from '@revin-utils/utils';
import { DASH, DATE_FORMAT, LOAD_MORE, OPP_TYPE, OPPORTUNITY_COMPLETED, OPPORTUNITY_NEW_DEAL, PROJECT_SOURCE_NAME } from 'utils/constants';
import newDealIcon from 'assets/images/new-deal-icon.svg';
import completeIcon from 'assets/images/complete-icon.svg';
import { buildAvatarArray } from 'components/common/OpportunitySelectionTable/TableUtil';
import styles from './CustomGroupedOpportunitiesTable.module.scss';

export const HEAD_CELLS = [
  {
    id: 'opportunity',
    label: <div className="cell-header">Opportunity Name & ID</div>
  },
  {
    id: 'source',
    label: <div className="cell-header">Source</div>
  },
  {
    id: 'deliveryType',
    label: <div className="cell-header">Delivery type</div>
  },
  {
    id: 'billingType',
    label: <div className="cell-header">Billing type</div>
  },
  {
    id: 'salesStage',
    label: <div className="cell-header">Sales stage</div>
  },
  {
    id: 'mrr',
    label: <div className="cell-header">{`Unweighted MRR (FY${new Date().getFullYear().toString().substr(-2)})`}</div>
  },
  {
    id: 'tcv',
    label: <div className="cell-header">TCV</div>
  },
  {
    id: 'startDate',
    label: <div className="cell-header">Start date</div>
  },
  {
    id: 'endDate',
    label: <div className="cell-header">End date</div>
  },
  {
    id: 'projectManager',
    label: <div className="cell-header">Project manager</div>
  }
];

export const buildRowData = (customGroupedCandidates, handleLoadMore , hasMoreData) => {

  const blank_row = {
    opportunity: <div className={styles['heading-dummy']} />,
    source: <div className={styles['heading-dummy']} />,
    deliveryType: <div className={styles['heading-dummy']} />,
    billingType: <div className={styles['heading-dummy']} />,
    salesStage: <div className={styles['heading-dummy']} />,
    mrr: <div className={styles['heading-dummy']} />,
    tcv: <div className={styles['heading-dummy']} />,
    startDate: <div className={styles['heading-dummy']} />,
    endDate: <div className={styles['heading-dummy']} />,
    projectManager: <div className={styles['heading-dummy']} />
  };

  const rowData = customGroupedCandidates.map((item, index) => {
    return ({
      opportunity: (
        <div
          className={
            customGroupedCandidates?.length === 1 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']} ${styles['border-radius-bottom-left']} ${styles['border-0']} ` 
              : index === 0 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-left']}` :
                index !== customGroupedCandidates?.length - 1 ? `d-flex ${styles['clickable-heading']} ${styles['border']}` :
              `d-flex ${styles['clickable-heading']} ${styles['border-radius-bottom-left']} ${styles['border-0']}`
          }
        >
          <div>
            <h4 className="d-flex align-items-center">
              <span
                className="text-ellipsis"
                title={item?.projectName}
              >
                {item?.projectName}
              </span>
              &nbsp;
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
      deliveryType:<div className={styles['clickable-heading']}>{item?.deliveryType?.trim() || DASH}</div>,
      billingType: (
        <div className={styles['clickable-heading']}>
          <MiniDropdown 
            items={[{label : item?.billingType}]} 
          />
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
        <div
          className={
            customGroupedCandidates?.length === 1 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-right']} ${styles['border-radius-bottom-right']} ${styles['border-0']} ` 
              : index === 0 ? `d-flex ${styles['clickable-heading']} ${styles['border-radius-top-right']}` :
                index !== customGroupedCandidates?.length - 1 ? `d-flex ${styles['clickable-heading']} ${styles['border']}` :
              `d-flex ${styles['clickable-heading']} ${styles['border-radius-bottom-right']} ${styles['border-0']}`
          }
        >
          {buildAvatarArray(item) &&
              <AvatarGroup
                avatarData={buildAvatarArray(item)}
                maxAvatarsToShow="3"
              />
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
      type: undefined
    });
  });

  if(hasMoreData){
    rowData.push(getLoadMoreLinkRow(handleLoadMore));
  }

  return [blank_row, ...rowData];
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