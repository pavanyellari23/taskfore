import React from 'react';
import PropTypes from 'prop-types';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { Tune } from '@material-ui/icons';
import { FORM_LABELS } from '@revin-utils/utils';
import { OPPORTUNITY_SEARCH} from 'utils/constants';
import styles from './OpportunitiesSearch.module.scss';
 
const OpportunitiesSearch = ({ setSearchText, label}) => {
 
  const onSearchChange = (event) => {
    setSearchText(event.target.value?.trim());
  };
 
  return (
    <div className={styles.wrapper}>
      <SnapTextbox
        className="table-search"
        handleChange={onSearchChange}
        icon={<Tune />}
        label={label}
        name={OPPORTUNITY_SEARCH.NAME}
        rows={1}
        type={FORM_LABELS.OUTLINED}
      />

    </div>
 
  );
};
 
OpportunitiesSearch.propTypes = {
  label:PropTypes.string,
  setSearchText: PropTypes.func
};
 
export default OpportunitiesSearch;