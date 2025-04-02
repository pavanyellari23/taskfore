import React, { useEffect,useState } from 'react';
import { getSessionItem, setSessionItem } from '@revin-utils/utils';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';
import SnapButton from '@pnp-snap/snap-button';
import { Container } from 'react-grid-system';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import EmptyScreen from '@revin-utils/components/empty-screen';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import Footer from '@revin-utils/components/footer';
import CreateGroupModal from 'components/common/create-group-modal';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import CustomGroupedOpportunitiesTable from './CustomGroupedOpportunitiesTable';
import { BACK, CHOOSE_FORECAST_EMPTY_SCREEN, CURRENCY_STANDARD, MODIFY_GROUP, SEARCH_RESULTS, SESSION_STORAGE_KEYS, CHILD_ACCOUNTS_WITH_PARENT, OPPORTUNITY_SELECTION_TOOL_TIP, VIEW_ONLY_ACCESS_ROLES } from 'utils/constants';
import { MESSAGES } from 'utils/messages';
import noDataFound from 'assets/images/src_assets_images_no-data.png';
import { handleBreadcrumbClick, getAccountEntityCodeArray } from 'utils/helper';
import styles from './CustomGroupedOpportunities.module.scss';

const CustomGroupedOpportunities = (props) => {
  const { callBackHandler, customGroupedCandidates, opportunities, metaData } = props;
  const { customGroupID, accountForecastCandidateID } = useParams();
  const history = useHistory();
  const [isOpencustomGroupModal, setIsOpencustomGroupModal] = useState(false);
  const customGroupInfo = getSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION);
  const [pageNumber, setPageNumber] = useState(0);
  const [selectedGroupId, setSelectedGroupId] = useState(customGroupID);
  const [groupMembers, setGroupMembers] = useState([]);
  const entitlement = metaData?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
  const isViewOnlyUser = VIEW_ONLY_ACCESS_ROLES.includes(entitlement);

  useEffect(() => {
    if (!metaData?.accounts?.length) {
      callBackHandler({
        type: MetaDataActionType.GET_ACCOUNT_DROPDOWN,
        payload: {
          forecastEntitlement: {
            forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
          },
          accountFetchType: CHILD_ACCOUNTS_WITH_PARENT,
          parentAccountIds: [
            getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId
          ]
        }
      });
    }
  }, []);

  useEffect(() => {
    callBackHandler({
      type: OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES,
      payload: {
        groupId: customGroupID,
        pageNumber
      }
    });
  }, [pageNumber]);

  useEffect(() => {
    if (customGroupedCandidates?.groupMembers?.length) {
      setGroupMembers(customGroupedCandidates.groupMembers);
    }
  },[customGroupedCandidates?.groupMembers]);

  useEffect(() => {
    if (metaData?.accounts?.length && !metaData?.programs?.length) {
      const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
      callBackHandler({
        type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
        payload: {
          forecastEntitlement: {
            forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
          },
          isShowLoader: true,
          parentEntityCodes: getAccountEntityCodeArray(foreCastFilterConditions?.selectedAccounts, metaData?.accounts)
        }
      });
    }
  }, [metaData?.accounts]);

  useEffect(() => {
    if (opportunities?.forecast_candidates?.forecastCandidates?.length) {
      const selectedGp = opportunities?.forecast_candidates?.forecastCandidates.find(item => item.id === customGroupID);
      if (selectedGp?.groupInfo?.projectForecastCandidates) {
        callBackHandler({
          type: OpportunitiesActionType.SET_CUSTOM_GROUP_CANDIDATES,
          payload: {
            groupMembers: selectedGp?.groupInfo?.projectForecastCandidates
          }
        });
      }
    }
  },[opportunities?.forecast_candidates?.forecastCandidates]);

  useEffect(() => {
    if (opportunities.crud_flags?.isDeleted) {
      history.push(`/${accountForecastCandidateID}`);
    }
  },[opportunities.crud_flags?.isDeleted]);

  const handleCustomGroupModalClose = () => {
    setIsOpencustomGroupModal(false);
    setSelectedGroupId('');
    setGroupMembers([]);
  };

  const handleModifyGroupClick = () => {
    setIsOpencustomGroupModal(true);
    setSelectedGroupId(customGroupID);
    setGroupMembers(customGroupedCandidates?.groupMembers);
  };

  const handleBack = () => {
    setSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION, '');
    window.history.go(-1);
  };

  const handleOnClick = (event, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateID, history);
  };

  const handleLoadMore = () => {
    if (customGroupedCandidates?.groupMembers?.length < customGroupedCandidates?.totalCandidateCount) {
      setPageNumber((currentPage) => currentPage + 1);
    };
  };

  const handleCustomGroupUpdate = (selectedProjects, groupName, selectedCustomGroupId) => {
    const accountForecastCandidateId = selectedProjects[0]?.accountForecastCandidateId;
    const programId = selectedProjects[0]?.programId;
    const groupInfo = {
      groupName,
      projectForecastCandidateIds: selectedProjects?.map(item => item.id)
    };
    callBackHandler({
      type: OpportunitiesActionType.EDIT_CUSTOM_GROUP,
      payload: {
        requestPayload: {groupInfo, accountForecastCandidateId, programId},
        groupId: selectedCustomGroupId,
        isFromCustomGpPage: true
      }
    });
    handleCustomGroupModalClose();
  };

  return (
    <Container
      className={styles.wrapper}
      fluid
    >
      <div className="d-flex justify-content-between mb-2">
        <BreadcrumbNavigation
          breadcrumbSubTitle={[
            { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME , onClick: handleOnClick},
            { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_SELECTION, onClick: handleOnClick},
            { label: MESSAGES.RESOURCE_FORECASTING_GROUPED_OPPORTUNITIES }
          ]}
          breadcrumbTitle={
            <div className="d-flex mt-1 align-items-center">
              {customGroupInfo?.data?.groupInfo?.groupName}
              <InfoTooltip
                infoContent={OPPORTUNITY_SELECTION_TOOL_TIP}
                position={'bottom'}
              />
            </div>
          }
          titleReverse
        />
        <div className={`d-flex align-items-center ${styles['currency-wrap']}`}>
          <InfoTooltip
            icon={
              <div
                className={`d-flex align-items-center justify-content-center ${styles['dollar-icon']}`}
              >
                  $
              </div>
            }
            infoContent={''}
          />
          {CURRENCY_STANDARD}
        </div>
      </div>
      <div className="d-flex justify-content-end">
        {/* TODO: Commmenting may need in future */}
        {/* <OpportunitiesSearch
          label={OPPORTUNITY_SEARCH.LABEL_CHOOSE_FORECASTING} 
          setSearchText={handleSearchChange}
        /> */}
        { !isViewOnlyUser && !customGroupInfo?.forecasting && 
          <SnapButton
            className="tertiary-button"
            handleClick={handleModifyGroupClick}
            label={MODIFY_GROUP}
          />
        }
      </div>
      <div className={styles['table-label']}>
        {SEARCH_RESULTS(customGroupedCandidates?.groupMembers?.length , customGroupedCandidates?.totalCandidateCount)}
      </div>
      {
        customGroupedCandidates?.groupMembers?.length > 0 && 
      <CustomGroupedOpportunitiesTable
        customGroupedCandidates={customGroupedCandidates?.groupMembers}
        handleLoadMore={handleLoadMore}
        hasMoreData={customGroupedCandidates?.groupMembers?.length < customGroupedCandidates?.totalCandidateCount}
      />
      }
      {customGroupedCandidates?.groupMembers?.length === 0 &&
        <EmptyScreen
          center
          className={noDataFound ? styles['no-opportunity-card'] : styles['empty-screen']}
          image={noDataFound}
          subTitle={CHOOSE_FORECAST_EMPTY_SCREEN.SUBTITLE}
          title={CHOOSE_FORECAST_EMPTY_SCREEN.TITLE}
        />
      }
      <Footer
        handleFooterSecondaryButton={handleBack}
        hideSave
        primaryButton={false}
        secondaryLabel={BACK}
      />
      <CreateGroupModal
        callBackHandler={callBackHandler}
        customGroupMembers={groupMembers}
        customGroupProjectsList={opportunities.customGroupProjectsList}
        handleClose={handleCustomGroupModalClose}
        handleUpdate={handleCustomGroupUpdate}
        isFromCustomGpPage
        isModify
        metaData={metaData}
        open={isOpencustomGroupModal}
        opportunities={opportunities}
        selectedCustomGroupId={selectedGroupId}
      />
    </Container>
  
  );
};

CustomGroupedOpportunities.propTypes = {
  callBackHandler: PropTypes.func,
  customGroupedCandidates: PropTypes.array,
  metaData: PropTypes.object,
  opportunities: PropTypes.object
};

export default CustomGroupedOpportunities;