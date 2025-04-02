import React, { useMemo } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import PlusCircleIcon from 'react-feather/dist/icons/plus-circle';
import MapPin from 'react-feather/dist/icons/map-pin';
import { Copy } from 'react-feather';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import SnapTooltip from '@pnp-snap/snap-tooltip';
import SnapButton from '@pnp-snap/snap-button';
import { FORM_LABELS, TOOLTIP_POSITION, getSessionItem, getPermissions } from '@revin-utils/utils';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import BreadcrumbNavigation from '@revin-utils/components/breadcrumb-navigation';
import { OpportunitiesSearch } from 'components/common/opportunities-search';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { getSubmissionMessage } from 'utils/commonFunctions';
import { SEARCH_RESULTS, OPP_TYPE, ADHOC_OPP_CREATION, BREADCRUMB_OPP_TITLE, FORECAST_DASHBOARD_CONSTANTS, OPPORTUNITY_SEARCH, SESSION_STORAGE_KEYS, OPPORTUNITY_SELECTION_TOOL_TIP  } from 'utils/constants';
import { handleBreadcrumbClick } from 'utils/helper';
import { MESSAGES } from 'utils/messages';
import sandTimer from 'assets/images/sand_timer.gif';
import styles from './OpportunityLevelContainer.module.scss';
import { RVIcon } from '@revin-utils/assets';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import AccountDropdown from 'components/common/account-dropdown/AccountDropdown';
import DynamicAlertList from 'components/common/dynamic-alert-list/DynamicAlertList';

const OpportunityLevelContainer = ({
  handleAdhocButtonClick, 
  handleOtherProjectClick,
  handleControlsButtonClick,
  handleSearchChange,
  parentAccountForecastStatus,
  forecastLandingErrors,
  setForecastLandingErrors,
  handleFilterBtnClick,
  callBackHandler,
  metaData,
  forecastCandidatesCount,
  totalCandidateCount,
  handleCustomGroupBtnClick, 
  isVHBFMUser 
}) => { 
  const { iconSmallTwo } = variableStyle;
  const { accountForecastCandidateId } = useParams();
  const history = useHistory();
  const forecastCycles = getSessionItem(SESSION_STORAGE_KEYS.FORECAST_CYCLES);
  const locked = getSessionItem(SESSION_STORAGE_KEYS.PARENT_ACCOUNT_DPDN)?.attributes?.locked;
  const managePermission = getPermissions()?.MANAGE_PARENT_ACCOUNT_REVENUE_FORECAST;

  const handleOnClick = (event, label) => {
    handleBreadcrumbClick(label, accountForecastCandidateId, history);
  };
  
  const resetForecastLandingErrors=() => {
    setForecastLandingErrors([]);
  };

  const showButton = useMemo(() => {
    return parentAccountForecastStatus !== FORECAST_DASHBOARD_CONSTANTS.SUBMIT_STATUS && !locked && !isVHBFMUser;
  }, [parentAccountForecastStatus, isVHBFMUser, locked]);

  return (
    <div className={styles.wrapper}>
      <BreadcrumbNavigation
        breadcrumbSubTitle={[
          { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_HOME, onClick: handleOnClick },
          { label: MESSAGES.RESOURCE_FORECASTING_SUMMARY_SELECTION }
        ]}
        breadcrumbTitle={
          <div className="d-flex align-items-center">
            {BREADCRUMB_OPP_TITLE}
            <InfoTooltip
              infoContent ={OPPORTUNITY_SELECTION_TOOL_TIP}
              position={'bottom'}
            />
          </div>
        }
        className="mb-2"
        titleReverse
      />
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
      {forecastLandingErrors?.length > 0&& <DynamicAlertList alertList={forecastLandingErrors} />}
      <div className="d-flex justify-content-between">
        <OpportunitiesSearch
          label={OPPORTUNITY_SEARCH.LABEL_CHOOSE_FORECASTING}
          setSearchText={handleSearchChange}
        />

        <div className={`d-flex align-items-center mb-2 ${styles['secondary-action']}`}>
          <AccountDropdown
            callBackHandler={callBackHandler}
            fromOpportunitiesContainer
            metaData={metaData}
            resetForecastLandingErrors={resetForecastLandingErrors}
            showChildAccount={false}
            showProgram={false}
          />

          {showButton && managePermission && (
            <SnapButton
              handleClick={handleControlsButtonClick}
              icon={<MapPin />}
              isIcon
              name="controls-button"
              type="primary"
              variant="contained"
            />)}

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
            type="primary"
            variant="contained"
          />

          {showButton && (
            <SnapTooltip
              className={`main-tooltip tooltip-small ${styles['create-group-tooltip']}`}
              content={'Create group'}
            >          
              <SnapButton
                handleClick={handleCustomGroupBtnClick}
                icon={<Copy />}
                isIcon
                name="Create group"
                type="primary"
                variant="contained"
              />
            </SnapTooltip>
          )}

          <SnapTooltip
            className={`main-tooltip ${styles['opportunity-button-tooltip']}`}
            content={
              <>
                <ul className="list-style-none">
                  <li
                    className="menu-item"
                    onClick={handleAdhocButtonClick}
                  >
                    {OPP_TYPE.ADHOC}
                  </li>
                  <li
                    className="menu-item"
                    onClick={handleOtherProjectClick}
                  >
                    {OPP_TYPE.OTHERS}
                  </li>
                </ul>
              </>
            }
            position={TOOLTIP_POSITION.BOTTOM}
          >
            {showButton && (
              <SnapButton
                className="tertiary-button"
                label={ADHOC_OPP_CREATION}
                leftIcon={<PlusCircleIcon />}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />)}
          </SnapTooltip>

        </div>
      </div>
      {
        !!(forecastCandidatesCount && totalCandidateCount) && 
          <div className={styles['search-result']}>
            {SEARCH_RESULTS(forecastCandidatesCount, totalCandidateCount)}
          </div>
      }
      {/* <OpportunitySelectionTable /> */}
    </div>
  );
};

OpportunityLevelContainer.propTypes = {
  callBackHandler: PropTypes.func,
  forecastCandidatesCount: PropTypes.number,
  forecastLandingErrors:PropTypes.array,
  handleAdhocButtonClick: PropTypes.func,
  handleControlsButtonClick: PropTypes.func,
  handleCustomGroupBtnClick: PropTypes.func,
  handleFilterBtnClick: PropTypes.func,
  handleOtherProjectClick: PropTypes.func,
  handleSearchChange: PropTypes.func,
  isVHBFMUser: PropTypes.bool,
  metaData: PropTypes.object,
  parentAccountForecastStatus: PropTypes.string,
  setForecastLandingErrors: PropTypes.func,
  totalCandidateCount: PropTypes.number
};

export default withStyles(styles)(OpportunityLevelContainer);