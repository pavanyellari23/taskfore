import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import CustomTab from '@revin-utils/components/custom-tab';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import { TOGGLE_FILTER_HOVER } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './ToggleFilter.module.scss';

const ToggleFilter = ({ handleFilter, tabLabels, selectedGrid }) => {

  const tabIndex = tabLabels.findIndex((tabObj) => tabObj.label == selectedGrid);
  const [activeTab, setActiveTab] = useState(tabIndex);

  const handleChartTab = (event, newActiveTab) => {
    setActiveTab(newActiveTab);
    handleFilter(tabLabels[newActiveTab].label);
  };

  return (
    <Box
      className={styles.wrapper}
      id={ELEMENT_ID.TOGGLE_FILTER_WRAPPER}
    >
      <CustomTab
        className="small-tab"
        onChange={handleChartTab}
        tabList={tabLabels}
        value={activeTab}
      />
      <InfoTooltip
        infoContent={
          TOGGLE_FILTER_HOVER
        }
      />
    </Box>
  );
};

ToggleFilter.propTypes = {
  filter: PropTypes.string,
  handleFilter: PropTypes.func,
  selectedGrid: PropTypes.string,
  tabLabels: PropTypes.array
};

export default ToggleFilter;
