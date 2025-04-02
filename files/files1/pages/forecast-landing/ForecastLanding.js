import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useHistory, useParams } from 'react-router-dom';
import { withStyles } from '@material-ui/core/styles';
import EmptyScreen from '@revin-utils/components/empty-screen';
import Footer from '@revin-utils/components/footer';
import { getSessionItem, setSessionItem } from '@revin-utils/utils';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { deleteCustomGroupAction } from 'store/actions/Opportunities';
import { GROUP, DIALOG_MODAL_CONFIG, CHOOSE_FORECAST_EMPTY_SCREEN, CONTINUE, CONFIRMATION_MODAL_TITLE, CONFIRMATION_MODAL_CRM_INTERNAL_SOURCE_DESCRIPTION, CONFIRMATION_MODAL_AD_HOC_DESCRIPTION, FORECASTING_SELECTION_ROUTE, EMPTY_SCREEN_MESSAGE, SESSION_STORAGE_KEYS, TOAST_TYPES, EXCLUDE_OPPORTUNITY_SUCCESS_MSG, FORECAST_DASHBOARD_CONSTANTS, OPPORTUNITY_DASHBOARD_LIMIT, PROJECT_SOURCE_NAME,  BILLING_TYPE_ERROR, OPPORTUNITY_SOURCE, FORECAST_TYPE, CUSTOM_GROUP, MODAL_TYPE, VIEW_ONLY_ACCESS_ROLES } from 'utils/constants';
import { getAccountEntityCodeArray, getAccountIdArray, getProgramArray, getManagersPayload } from 'utils/helper';
import OpportunityLevelContainer from 'components/common/Opportunity-level-container';
import { OpportunitySelectionTable } from 'components/common/OpportunitySelectionTable';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import ConfirmationModal from 'components/common/ConfirmationModal/ConfirmationModal';
import ExcludeOpportunityModal from 'components/common/ExcludeOpportunityModal/ExcludeOpportunityModal';
import AddAdhocOpportunityModal from 'components/common/AddAdhocOpportunityModal';
import ForecastContainer from 'components/pages/forecast-container/ForecastContainer';
import ForecastingControls from 'components/common/forecasting-controls';
import AddOtherProjectModal from 'components/common/AddOtherProjectModal';
import FilterOpportunitiesModal from 'components/common/FilterOpportunities';
import CreateGroupModal from 'components/common/create-group-modal';
import DialogModal from '@revin-utils/components/dialog-modal';
import NoRecordFound from 'assets/images/no-record-found.svg';
import noDataFound from 'assets/images/src_assets_images_no-data.png';
import { GlobalActionType } from 'store/types/GlobalActionType';
import styles from './ForecastLanding.module.scss';

const ForecastLanding = ({ callBackHandler, metaData, opportunities, forecastControlsState }) => {
  const history = useHistory();
  const { accountForecastCandidateId } = useParams();
  const [filteredOppRowData, setFilteredOppRowData] = useState([]);
  const [oppRowData, setOppRowData] = useState([]);
  const [excludeOppModalOpen, setexcludeOppmodalOpen] = useState(false);
  const [openConfrimationModal, setOpenConfirmationModal] = useState(false);
  const [oppIdToBeDeleted, setOpIdToBeDeleted] = useState('');
  const [oppIdToBeExluded, setOpIdToBeExcluded] = useState('');
  const [oppToBeEdited, setoppToBeEdited] = useState(null);
  const [openControlsModal, setOpenControlsModal] = useState(false);
  const [openAdhocModal, setOpenAdhocModal] = useState(false);
  const [existingExclusionReason, setExistingExclusionReason] = useState('');
  const [otherProjectModal, setOtherProjectModal] = useState(false);
  const [filterModal, setFilterModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(0);
  const [isSearchedActive, setIsSearchedActive] = useState(false);
  const [forecastLandingErrors,setForecastLandingErrors]= useState([]);
  const [isRestoreFilterData, setIsRestoreFilterData] = useState(false);
  const [isShowLoader, setIsShowLoader] = useState(false);
  const [oppDeleteMsg, setOppDeleteMsg] = useState(''); 
  const [isOpencustomGroupModal, setIsOpencustomGroupModal] = useState(false); 
  const [isGroupEdit, setIsGroupEdit] = useState(false);
  const [oppsToBeExcluded , setOppstoBeExcluded] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogModalConfig, setDialogModalConfig] = useState({});
  const [selectedCustomGroupId, setSelectedCustomGroupId] = useState('');
  const [billingOverrides, setBillingOverrides] = useState({});
  const parentAccountForecastStatus = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes.parentAccountForecastStatus;
  const entitlement = metaData?.entitlement || getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
  const isVHBFMUser = VIEW_ONLY_ACCESS_ROLES.includes(entitlement);

  const handleChangeHandler = (event) => {
    callBackHandler({
      type: OpportunitiesActionType.GET_AVAILABLE_PROJECT_LIST,
      payload: { searchTerm: event, accountForecastCandidateId }
    });
  };

  const handleOtherProjectModalClose = () => {
    setOtherProjectModal(false);
  };

  const setDialogClose = () => {
    setDialogOpen(false);
  };

  const handleBillingTypeOpen = () => {
    setDialogModalConfig(DIALOG_MODAL_CONFIG(setDialogClose, setDialogClose, MODAL_TYPE.EMPTY_BILLING_TYPE));
    setDialogOpen(true);
  };

  const deleteCustomGroupHandler = (id) => {
    callBackHandler(deleteCustomGroupAction({
      groupId: id 
    }));
    setDialogClose();
  };

  const handleCustomGroupOpen = (id) => {
    setDialogModalConfig(DIALOG_MODAL_CONFIG(setDialogClose, deleteCustomGroupHandler, MODAL_TYPE.DELETE_CUSTOM_GROUP, id));
    setDialogOpen(true);
  };

  const handleOtherProjectModalSubmit = (projectDetails) => {
    const payload = {
      ...projectDetails?.data,
      loading: true,
      accountForecastCandidateId: projectDetails?.accountForecastCandidateId || accountForecastCandidateId
    };
    callBackHandler({
      type: OpportunitiesActionType.ADD_AVAILABLE_PROJECT,
      payload
    });
    setOtherProjectModal(false);
  };

  const handleAdhocButtonClick = () => {
    setOpenAdhocModal(true);
  };

  const handleOtherProjectClick = () => {
    setOtherProjectModal(true);
  };

  const handleAdhocModalClose = () => {
    setOpenAdhocModal(false);
    setoppToBeEdited(null);
  };

  const openEdiAdhocOppModal = (opportunity) => {
    setOpenAdhocModal(true);
    setoppToBeEdited(opportunity);
  };

  const metaDataArray = [
    MetaDataActionType.GET_BILLING_TYPE,
    MetaDataActionType.GET_DELIVERY_TYPE,
    MetaDataActionType.GET_SERVICE_PORTFOLIO,
    MetaDataActionType.GET_SERVICE_LINE,
    MetaDataActionType.GET_PROVIDERS,
    MetaDataActionType.GET_CURRENCY_DATA,
    MetaDataActionType.GET_LOCATIONS
  ];

  useEffect(() => {
    if (opportunities?.routing_flags?.isBulkSuccess && !alert) {

      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountForecastCandidateId}`);
    }
  }, [opportunities?.routing_flags,alert]);

  useEffect(() => {
    metaDataArray.map((item) => {
      if (item === MetaDataActionType.GET_BILLING_TYPE) {
        if (!metaData.billingTypeData?.length) {
          callBackHandler({
            type: MetaDataActionType.GET_BILLING_TYPE
          });
        }
      }
      else if (item === MetaDataActionType.GET_DELIVERY_TYPE) {
        if (!metaData.deliveryTypeData?.length) {
          callBackHandler({
            type: MetaDataActionType.GET_DELIVERY_TYPE
          });
        }
      } else
        callBackHandler({
          type: item
        });
    });
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
    return () => {
      callBackHandler({
        type: OpportunitiesActionType.SET_FORECAST_CANDIDATES,
        payload: {
          forecastCandidates: [],
          totalCandidateCount: 0,
          forecastCandidatesSummaryOverview: {}
        }
      });
    };
  },[]);

  useEffect(() => {
    let forecastData = [];
    const forecastCandidates = isSearchedActive ? opportunities?.searched_forecast_candidates?.forecastCandidates : opportunities?.forecast_candidates?.forecastCandidates;
    if (forecastCandidates?.length) {
      forecastData = forecastCandidates;
      const checkedOppRowData = forecastData?.map((item) => {
        const data = oppsToBeExcluded?.filter((oItem) => oItem?.id === item?.id);
        const billingType = billingOverrides[item?.id]; 
        if(data?.length){
          if(!data[0]?.checked){
            return {
              ...item,
              checked: data[0]?.checked,
              exclusionReason: data[0]?.exclusionReason,
              includedInForecast: data[0]?.checked,
              probabilityOverride: data[0]?.probabilityOverride,
              ...(billingType && { billingType })
             
            };
          }else{
            delete item?.exclusionReason;
            return { ...item, checked: data[0]?.checked, includedInForecast: data[0]?.checked, probabilityOverride: data[0]?.probabilityOverride,  ...(billingType && { billingType })};
          }
        }
        else return { ...item, checked: item?.includedInForecast, ...(billingType && { billingType })};
      });
      setFilteredOppRowData(checkedOppRowData);
      setOppRowData(checkedOppRowData);
    } else {
      setFilteredOppRowData(forecastCandidates);
      setOppRowData(forecastCandidates);
    }
  }, [opportunities?.forecast_candidates?.forecastCandidates, opportunities?.searched_forecast_candidates?.forecastCandidates, isSearchedActive]);

  useEffect(() => {
    if (opportunities?.routing_flags?.isBulkSuccess) {
      setOppstoBeExcluded([]);
      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountForecastCandidateId}`);
    }
  }, [opportunities?.routing_flags]);

  useEffect(() => {
    callBackHandler({
      type: OpportunitiesActionType.GET_CHILD_ACCOUNTS,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
        },
        accountFetchType: 'CHILD_ACCOUNTS',
        parentAccountIds: [
          getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId
        ]
      }
    });
    setIsRestoreFilterData(false);
    setIsShowLoader(true);
  }, [getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id]);

  useEffect(() => {
    if (metaData?.accounts?.length && !isRestoreFilterData) {
      callBackHandler({
        type: MetaDataActionType.GET_PROJECT_MANAGERS,
        payload: getManagersPayload(metaData.accounts.filter(item => item.id !== 'All'))
      });
      const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
      const selectedAccounts = foreCastFilterConditions?.selectedAccounts?.length > 0 && !filterModal ? foreCastFilterConditions?.selectedAccounts : [metaData?.accounts[0]];
      callBackHandler({
        type: MetaDataActionType.GET_PROGRAM_DROPDOWN,
        payload: {
          forecastEntitlement: {
            forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
          },
          parentEntityCodes: getAccountEntityCodeArray(selectedAccounts, metaData?.accounts),
          isShowLoader: filterModal || isShowLoader
        }
      });
    }
  }, [JSON.stringify(metaData?.accounts)]);

  useEffect(() => {
    const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
    if (metaData?.programs?.length && !filterModal && !isRestoreFilterData) {
      const program = foreCastFilterConditions?.selectedPrograms?.length ? foreCastFilterConditions?.selectedPrograms : [metaData?.programs[0]];
      const accountIds = getAccountIdArray(foreCastFilterConditions?.selectedAccounts?.length ? foreCastFilterConditions?.selectedAccounts : [metaData?.accounts[0]], metaData.accounts);
      const accountForecastCandidateId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
      const parentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId;
      const programIds = getProgramArray(program, metaData.programs);
      const salesStages = foreCastFilterConditions?.salesStages?.length ? foreCastFilterConditions?.salesStages : metaData?.salesStageData;
      const projectSources = foreCastFilterConditions?.projectSources?.length ? foreCastFilterConditions?.projectSources : metaData?.projectSource;
      const billingTypesIds = foreCastFilterConditions?.billingTypesIds?.length ? foreCastFilterConditions?.billingTypesIds : [];
      const deliveryTypesIds = foreCastFilterConditions?.deliveryTypesIds?.length ? foreCastFilterConditions?.deliveryTypesIds : [];
      const projectManagerIds = foreCastFilterConditions?.projectManagerIds?.length ? foreCastFilterConditions?.projectManagerIds : [];
      const includeCompletedProjects = foreCastFilterConditions?.includeCompletedProjects ?? false;
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
        payload: {
          loading: true,
          getSelected: false,
          request: {
            accountIds,
            accountForecastCandidateId,
            parentAccountId,
            programIds,
            includeSignedContracts: true,
            includeGroups: true,
            salesStages: salesStages.map(item => item.id),
            projectSources: projectSources.map(item => item.id),
            billingTypesIds: billingTypesIds.map(item => item.id),
            deliveryTypesIds: deliveryTypesIds.map(item => item.id),
            projectManagerIds: projectManagerIds.map(item => item.id),
            includeCompletedProjects,
            forecastEntitlement: {
              forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
            }
          }
        }
      });
      if (!foreCastFilterConditions?.selectedPrograms?.length) {
        setSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS, {
          parentAccountId: accountForecastCandidateId,
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
  }, [JSON.stringify(metaData?.programs)]);

  useEffect(() => {
    if (opportunities?.crud_flags && Object.values(opportunities?.crud_flags)?.some((item) => item)) {
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
        payload: {
          loading: true,
          getSelected: false,
          request: { ...getForecastCandidatesPayload(), includedInForecast: null, includeGroups: true } 
        }
      });
    }
  },
  [opportunities?.crud_flags]);

  const getChildAccountsCallBack = (parentAccountId) => {
    callBackHandler({
      type: MetaDataActionType.GET_ACCOUNT_DROPDOWN,
      payload: {
        forecastEntitlement: {
          forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
        },
        accountFetchType: 'CHILD_ACCOUNTS_WITH_PARENT',
        parentAccountIds: [
          parentAccountId
        ]
      }
    });
  };

  const getForeCastCandidateList = (request) => {
    setPageNumber(0);
    callBackHandler({
      type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
      payload: {
        loading: true,
        getSelected: false,
        request: { ...request, includeGroups: true }
      }
    });
  };

  useEffect(() => {
    setOppRowData(prevData => {
      const updatedData = prevData?.map(item => {
        const correspondingFilteredItem = filteredOppRowData.find(filteredItem => filteredItem?.id === item.id);
        if (correspondingFilteredItem) {
          return {
            ...item,
            probabilityOverride: correspondingFilteredItem.probabilityOverride,
            exclusionReason: correspondingFilteredItem.exclusionReason,
            checked: correspondingFilteredItem?.checked,
            billingType: correspondingFilteredItem.billingType,
            billingTypeId:correspondingFilteredItem?.billingTypeId,
            billingTypeCode: correspondingFilteredItem?.billingTypeCode
          };
        }
        return item;
      });
      return updatedData;
    });
  }, [filteredOppRowData]);

  const handleOpenConfirmationModalClose = () => {
    setOpenConfirmationModal(false);
  };

  const openDeleteOppPopUp = (opportunityData) => {
    if (opportunityData?.type === GROUP) {
      // Delete Custom group.
      handleCustomGroupOpen(opportunityData?.id);
    } else {
      // Delete individual opportunity.
      setOpenConfirmationModal(true);
      if (opportunityData?.projectSourceName === PROJECT_SOURCE_NAME.CRM || opportunityData?.projectSourceName === PROJECT_SOURCE_NAME.INTERNAL) {
        setOppDeleteMsg(CONFIRMATION_MODAL_CRM_INTERNAL_SOURCE_DESCRIPTION);
      } else {
        setOppDeleteMsg(CONFIRMATION_MODAL_AD_HOC_DESCRIPTION);
      }
      setOpIdToBeDeleted(opportunityData);
    };
  };

  const handleOppDelete = () => {
    callBackHandler({
      type: OpportunitiesActionType.DELETE_OPPORTUNITY,
      payload: oppIdToBeDeleted
    });
    setOpenConfirmationModal(false);
  };

  const processetOppsToBeExcluded = (opportunityId, checked, exclusionReason, probabilityOverride) => {
    const opportunity = filteredOppRowData?.filter(item => item?.id === opportunityId);
    const present = oppsToBeExcluded?.some((item) => item?.id === opportunityId);
    if(oppsToBeExcluded?.length && present){
      const copyOppsToBeExcluded = oppsToBeExcluded?.map((item) => {
        if(item?.id === opportunityId){
          return {
            ...item,
            checked,
            exclusionReason,
            probabilityOverride: probabilityOverride ?? opportunity[0]?.probabilityOverride
          };
        }else return {...item};
      });
      setOppstoBeExcluded(copyOppsToBeExcluded);
    }else {
      setOppstoBeExcluded((prev) => [...prev , {id : opportunityId , checked , exclusionReason , probabilityOverride: probabilityOverride ?? opportunity[0]?.probabilityOverride}]);
    }
  };

  const handleMainCheckBox = (opp) => {
    const opportunityID = opp?.id;
    const opportunity = filteredOppRowData?.find((item) => item?.id === opportunityID);
    if (!opportunity?.billingType?.trim() && opportunity?.projectSourceName === PROJECT_SOURCE_NAME.CRM && !opportunity?.checked) {
      handleBillingTypeOpen(true);
    } else {
      let checkedAdhocOpp = [];
      if (opportunityID) {
        checkedAdhocOpp = filteredOppRowData?.map((item) => {
          if (opportunityID === item?.id) {
            return ({
              ...item,
              checked: item?.checked ? false : true
            });
          } else return item;
        });
        if (opportunity?.checked) {
          setexcludeOppmodalOpen(true);
          setExistingExclusionReason('');
          setOpIdToBeExcluded(opp);
        }else {
          processetOppsToBeExcluded(opportunityID , true , '', opportunity?.probabilityOverride);
        }
      } else {
        checkedAdhocOpp = filteredOppRowData?.map((item) => ({
          ...item,
          checked: true
        }));
      }
      setFilteredOppRowData(checkedAdhocOpp);
    }
  };

  const handleOppExcludeSubmit = (data) => {
    const excludedOppData = filteredOppRowData?.map((item) => {
      if (item?.id === oppIdToBeExluded?.id) {
        return ({
          ...item,
          exclusionReason: data.exclusionReason,
          includedInForecast: false,
          checked: false
        });
      } else return item;
    });
    const probabilityOverride = filteredOppRowData?.filter((item) => item?.id === oppIdToBeExluded?.id)[0]?.probabilityOverride;
    processetOppsToBeExcluded(oppIdToBeExluded?.id, false, data?.exclusionReason, probabilityOverride);
    data.setExclusionReason('');
    setExistingExclusionReason('');
    setexcludeOppmodalOpen(false);
    setFilteredOppRowData(excludedOppData);
    setOppRowData(excludedOppData);
    const oppName = oppIdToBeExluded?.groupInfo ? oppIdToBeExluded?.groupInfo?.groupName : oppIdToBeExluded?.projectName;
    callBackHandler({
      type: GlobalActionType.SHOW_TOAST_MESSAGE,
      payload: {
        open: true,
        mode: TOAST_TYPES.SUCCESS,
        subtitle: `${oppName} ${EXCLUDE_OPPORTUNITY_SUCCESS_MSG}`
      }
    });
  };

  const handleOppExcludeCancel = (setExclusionReason) => {
    const excludedOppData = filteredOppRowData?.map((item) => {
      if (item?.id === oppIdToBeExluded?.id) {
        return ({
          ...item,
          checked: !item?.exclusionReason
        });
      } else return item;
    });
    setExclusionReason('');
    setExistingExclusionReason('');
    setexcludeOppmodalOpen(false);
    setFilteredOppRowData(excludedOppData);
  };

  const handleMessageIcon = (oppId) => {
    oppRowData.forEach((item) => {
      if (item?.id === oppId) {
        setExistingExclusionReason(item?.exclusionReason ?? item?.reasonForExclusion);
      }
    });
    setexcludeOppmodalOpen(true);
  };


  const handleBulkUpdateForecastCandidates = (event) => {
    event?.stopPropagation();
    if(isVHBFMUser) return history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountForecastCandidateId}`);

    const localErrors = [...forecastLandingErrors];
    const hasValidBillingType = oppRowData?.some(item => 
      item.projectSourceName === OPPORTUNITY_SOURCE.INTERNAL && 
    (!item.billingType || !item.billingType.trim()) && item?.includedInForecast
    );

    if (hasValidBillingType) {
      localErrors.push(BILLING_TYPE_ERROR);
      setForecastLandingErrors(prev => [...new Set([...prev, BILLING_TYPE_ERROR])]);
      return;
    } 

    setForecastLandingErrors(prev => 
      prev?.filter(error => error?.code !== BILLING_TYPE_ERROR.code) || []
    );

    // Early return if there are local errors
    if (localErrors.length) return;

    if (oppRowData.length > 0 && parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS) {
      const bulkUpdateForecastCandidates = oppRowData?.map(item => {
        const data = oppsToBeExcluded.filter((oppitem) => oppitem?.id === item?.id);
        const billingTypeId = metaData?.billingTypeData?.find(data => data?.description === item?.billingType)?.id;
        const baseData = {
          id: item?.id,
          phasedForecast: false,
          probabilityOverride: data?.length ? data[0]?.probabilityOverride : item?.probabilityOverride,
          includedInForecast: data?.length ? data[0]?.checked : item?.includedInForecast,
          billingTypeId,
          billingType: item?.billingType,
          forecastLevelType: item?.forecastLevelType,
          projectCode: item?.projectCode,
          accountForecastCandidateId: item?.accountForecastCandidateId,
          forecastCycleId: item?.forecastCycleId,
          type: item?.type
        };

        return item?.checked || data[0]?.checked
          ? baseData 
          : { ...baseData, reasonForExclusion: data[0]?.exclusionReason || item?.exclusionReason || item?.reasonForExclusion};
      });

      callBackHandler({
        type: OpportunitiesActionType.BULK_UPDATE_FORECAST_CANDIDATES,
        payload: {
          accountForecastCandidateId: oppRowData[0]?.accountForecastCandidateId,
          opportunities: bulkUpdateForecastCandidates
        }
      });
    } else {
      history.push(`/${FORECASTING_SELECTION_ROUTE}/${accountForecastCandidateId}`);
    }
  };


  const handleControlsButtonClick = useCallback(() => {
    setOpenControlsModal(!openControlsModal);
  }, [openControlsModal]);

  const handleProbablityOverride = (oppId, newProbablityoverrideValue) => {
    setFilteredOppRowData(filteredOppRowData.map((item) => {
      if (item?.id === oppId) {
        processetOppsToBeExcluded(oppId, item?.checked , item?.exclusionReason , newProbablityoverrideValue);
        return ({
          ...item,
          probabilityOverride: parseInt(newProbablityoverrideValue)
        });
      } else return item;
    }));
  };

  const handleBillingTypeOverride=(oppId,newBillingTypeObject)=>{

    setFilteredOppRowData(filteredOppRowData?.map((item) => {
      if (item?.id === oppId) {
        setBillingOverrides((prevMap) => {
         
          const updatedMap = { ...prevMap, [oppId]: newBillingTypeObject?.value};
          return updatedMap;
        });
        const updatedBillingType = metaData?.billingTypeData?.find(data => data?.description === newBillingTypeObject?.value);
        return ({
          ...item,
          billingType: newBillingTypeObject?.value,
          billingTypeId: updatedBillingType?.id,
          billingTypeCode: updatedBillingType?.codeValue
        });
      } else return item;
    }));
  };

  const handleFilterBtnClick = () => {
    setFilterModal(true);
  };

  const handleFilterModalClose = () => {
    setFilterModal(false);
  };

  const handleCustomGroupBtnClick = () => {
    setIsOpencustomGroupModal(true);
  };

  const handleCustomGroupModalClose = () => {
    setIsOpencustomGroupModal(false);
    setIsGroupEdit(false);
    setSelectedCustomGroupId('');
  };

  useEffect(() => {
    if (pageNumber) {
      const requestObj = getForecastCandidatesPayload();
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES_APPEND,
        payload: {
          loading: false,
          getSelected: false,
          pageNumber,
          pageSize: OPPORTUNITY_DASHBOARD_LIMIT,
          request: requestObj,
          isSearchedActive
        }
      });
    }
  }, [pageNumber]);

  const handleLoadMore = () => {
    const { forecastCandidates, totalCandidateCount } = isSearchedActive ? opportunities?.searched_forecast_candidates : opportunities?.forecast_candidates;
    if (forecastCandidates?.length < totalCandidateCount) {
      setPageNumber((currentPage) => currentPage + 1);
    };
  };

  const handleSearchChange = (searchText) => {
    const requestObj = getForecastCandidatesPayload();
    const isSearched = searchText?.trim()?.length >= 3;
    if(searchText?.length >= 3 || (searchText?.length === 0 && isSearchedActive)){
      callBackHandler({
        type: OpportunitiesActionType.GET_FORECAST_CANDIDATES,
        payload: {
          loading: true,
          getSelected: false,
          isSearch: isSearched,
          request: isSearched ? { ...requestObj, searchTerm: searchText?.trim() } : requestObj
        }
      });
      setIsSearchedActive(isSearched);
      setPageNumber(0);
    }
  };

  const getForecastCandidatesPayload = () => {
    const foreCastFilterConditions = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_FILTER_CONDITIONS);
    const program = foreCastFilterConditions?.selectedPrograms;
    const accountIds = getAccountIdArray(foreCastFilterConditions?.selectedAccounts, metaData.accounts);
    const accountForecastCandidateId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.id;
    const parentAccountId = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId;
    const programIds = getProgramArray(program, metaData.programs);
    const payload = {
      accountIds,
      accountForecastCandidateId,
      parentAccountId,
      programIds,
      includeSignedContracts: true,
      includeGroups: true,
      salesStages: foreCastFilterConditions?.salesStages?.map(item => item.id),
      projectSources: foreCastFilterConditions?.projectSources?.map(item => item.id),
      billingTypesIds: foreCastFilterConditions?.billingTypesIds?.map(item => item.id),
      deliveryTypesIds: foreCastFilterConditions?.deliveryTypesIds?.map(item => item.id),
      includeCompletedProjects: foreCastFilterConditions?.includeCompletedProjects,
      projectManagerIds: foreCastFilterConditions?.projectManagerIds?.map(item => item.id),
      forecastEntitlement: {
        forecastEntitlementView: getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW)
      }
    };
    return payload;
  };

  const handleCustomGroupRoute = (customGroupData) => {
    setSessionItem(SESSION_STORAGE_KEYS.CUSTOM_GROUP_INFORMATION, { data: customGroupData , forecasting: false});
    history.push(`/${accountForecastCandidateId}/${CUSTOM_GROUP}/${customGroupData?.id}`);
  };

  const handleCustomGroupCreate = (selectedProjects, groupName) => {
    const accountForecastCandidateId = selectedProjects[0]?.accountForecastCandidateId;
    const programId = selectedProjects[0]?.programId;
    const groupInfo = {
      groupName,
      projectForecastCandidateIds: selectedProjects?.map(item => item.id)
    };
    callBackHandler({
      type: OpportunitiesActionType.ADD_CUSTOM_GROUP,
      payload: {
        groupInfo, accountForecastCandidateId, programId
      }
    });
    setIsOpencustomGroupModal(false);
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
        groupId: selectedCustomGroupId
      }
    });
    setIsOpencustomGroupModal(false);
  };

  const openCustomGroupEditModal = (selectedGroup) => {
    setIsOpencustomGroupModal(true);
    setIsGroupEdit(true);
    setSelectedCustomGroupId(selectedGroup?.id);
  };

  return (
    <ForecastContainer
      tabvalue={0}
    >
      <ConfirmationModal
        description={oppDeleteMsg}
        handleOpenConfirmationModalClose={handleOpenConfirmationModalClose}
        handleOppDelete={handleOppDelete}
        openConfrimationModal={openConfrimationModal}
        title={CONFIRMATION_MODAL_TITLE}
      />
      <ExcludeOpportunityModal
        excludeOppModalOpen={excludeOppModalOpen}
        existingExclusionReason={existingExclusionReason}
        handleOppExcludeCancel={handleOppExcludeCancel}
        handleOppExcludeSubmit={handleOppExcludeSubmit}
        setexcludeOppmodalOpen={setexcludeOppmodalOpen}
      />

      <AddAdhocOpportunityModal
        callBackHandler={callBackHandler}
        handleAdhocModalClose={handleAdhocModalClose}
        metaData={metaData}
        open={openAdhocModal}
        oppToBeEdited={oppToBeEdited}
        opportunities={opportunities}
        setOpenAdhocModal={setOpenAdhocModal}
      />

      {filterModal &&
        <FilterOpportunitiesModal
          callBackHandler={callBackHandler}
          chooseForecastScreen={false}
          getChildAccountsCallBack={getChildAccountsCallBack}
          getForeCastCandidateList={getForeCastCandidateList}
          handleClose={handleFilterModalClose}
          metaData={metaData}
          open={filterModal}
          setIsRestoreFilterData={setIsRestoreFilterData}
        />}

      <CreateGroupModal
        callBackHandler={callBackHandler}
        customGroupProjectsList={opportunities.customGroupProjectsList}
        handleClose={handleCustomGroupModalClose}
        handleCreate={handleCustomGroupCreate}
        handleUpdate={handleCustomGroupUpdate}
        isModify={isGroupEdit}
        metaData={metaData}
        open={isOpencustomGroupModal}
        opportunities={opportunities}
        selectedCustomGroupId={selectedCustomGroupId}
      />

      <OpportunityLevelContainer
        callBackHandler={callBackHandler}
        forecastCandidatesCount={isSearchedActive ? opportunities?.searched_forecast_candidates?.forecastCandidates?.length : opportunities?.forecast_candidates?.forecastCandidates?.length}
        forecastLandingErrors={forecastLandingErrors}
        handleAdhocButtonClick={handleAdhocButtonClick}
        handleControlsButtonClick={handleControlsButtonClick}
        handleCustomGroupBtnClick={handleCustomGroupBtnClick}
        handleFilterBtnClick={handleFilterBtnClick}
        handleOtherProjectClick={handleOtherProjectClick}
        handleSearchChange={handleSearchChange}
        isVHBFMUser={isVHBFMUser}
        metaData={metaData}
        parentAccountForecastStatus={parentAccountForecastStatus}
        setForecastLandingErrors={setForecastLandingErrors}
        totalCandidateCount={isSearchedActive ? opportunities?.searched_forecast_candidates?.totalCandidateCount : opportunities?.forecast_candidates?.totalCandidateCount}
      />
      {filteredOppRowData?.length ?
        <OpportunitySelectionTable 
          financialYear={opportunities?.forecast_candidates?.currentFinancialYear}
          handleBillingTypeOverride={handleBillingTypeOverride}
          handleCustomGroupRoute={handleCustomGroupRoute}
          handleLoadMore={handleLoadMore}
          handleMainCheckBox={handleMainCheckBox}
          handleMessageIcon={handleMessageIcon}
          handleProbablityOverride={handleProbablityOverride}
          hasMoreData={isSearchedActive ? opportunities?.searched_forecast_candidates?.forecastCandidates?.length < opportunities?.searched_forecast_candidates?.totalCandidateCount
            : opportunities?.forecast_candidates?.forecastCandidates?.length < opportunities?.forecast_candidates?.totalCandidateCount}
          isVHBFMUser={isVHBFMUser}
          metaData={metaData}
          openAdhocOppEditModal={openEdiAdhocOppModal}
          openCustomGroupEditModal={openCustomGroupEditModal}
          openDeleteOppPopUp={openDeleteOppPopUp}
          oppRowData={filteredOppRowData}
          parentAccountForecastStatus={parentAccountForecastStatus}
          setOppRowData={setFilteredOppRowData}
        /> :
        <EmptyScreen
          center
          className={noDataFound ? styles['no-opportunity-card'] : styles['empty-screen']}
          image={isSearchedActive ? NoRecordFound : noDataFound}
          subTitle={isSearchedActive ? EMPTY_SCREEN_MESSAGE.SUBTITLE : CHOOSE_FORECAST_EMPTY_SCREEN.SUBTITLE}
          title={isSearchedActive ? EMPTY_SCREEN_MESSAGE.TITLE : CHOOSE_FORECAST_EMPTY_SCREEN.TITLE}
        />
      }


      {openControlsModal && (
        <ForecastingControls
          callBackHandler={callBackHandler}
          forecastControlsState={forecastControlsState}
          handleClose={handleControlsButtonClick}
          metaData={metaData}
          open={openControlsModal}
          parentAccountId={getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.parentAccountId}
          type={FORECAST_TYPE.ACCOUNT_FORECASTING}
        />)}

      <AddOtherProjectModal
        callBackHandler={callBackHandler}
        handleChangeHandler={handleChangeHandler}
        handleClose={handleOtherProjectModalClose}
        handleSubmit={handleOtherProjectModalSubmit}
        open={otherProjectModal}
        otherProjectListError={opportunities?.otherProjectListError}
        projectList={opportunities?.otherProjectList}
      />

      <DialogModal
        className={styles['billing-missing']}
        description={
          <div className="confirmation-modal-text">
            <p className="my-4">{dialogModalConfig.description}</p>
          </div>
        }
        open={dialogOpen}
        {...dialogModalConfig}
      />

      <Footer
        handleClick={handleBulkUpdateForecastCandidates}
        primaryLabel={CONTINUE}
        secondaryButton={false}
      />
    </ForecastContainer>
  );
};

ForecastLanding.propTypes = {
  callBackHandler: PropTypes.func,
  forecastControlsState: PropTypes.object,
  metaData: PropTypes.object,
  opportunities: PropTypes.object
};

export default withStyles(styles)(ForecastLanding);
