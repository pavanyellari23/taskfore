import React from 'react';
import PropTypes from 'prop-types';
import { preciseNumberFormatter } from '@revin-utils/utils';
import { PROJECT_DETAILS } from 'utils/constants';
import styles from './GroupForecastTooltip.module.scss';

const GroupForecastTooltip = ({forecastingData}) => {
  return(
    <>
      <ul className={`list-style-none ${styles['project-info-lists']}`}>
        <li>
          <h4>
            {forecastingData?.projectName || forecastingData?.groupInfo?.groupName}
          </h4>
          <p>
            {PROJECT_DETAILS.GROUP_NAME}
          </p>
        </li>
        <li>
          <h4>
            {forecastingData?.totalContractValue ? preciseNumberFormatter(forecastingData?.totalContractValue) : '-'}
          </h4>
          <p>
            {PROJECT_DETAILS.PROJECT_TCV}
          </p>
        </li>
        <li>
          <h4>
            {forecastingData?.financialYearMRRTotal ? preciseNumberFormatter(forecastingData?.financialYearMRRTotal) : '-'}
          </h4>
          <p>
            {PROJECT_DETAILS.GROUP_MRR}
          </p>
        </li>
        <li>
          <h4>
            { forecastingData?.groupedProjectsInfo?.length || forecastingData?.groupInfo?.projectForecastCandidateIds?.length}
          </h4>
          <p>
            {PROJECT_DETAILS.NUMBER_OF_OPPORTUNITIES}
          </p>
        </li>
      </ul>
    </>
  );
};

GroupForecastTooltip.propTypes = {
  forecastingData: PropTypes.object
};

export default GroupForecastTooltip;