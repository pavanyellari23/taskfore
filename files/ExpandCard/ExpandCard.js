import React, { useState } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Collapse } from '@material-ui/core';
import { RVIcon } from '@revin-utils/assets';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import styles from './ExpandCard.module.scss';

const { iconSmallTwo } = variableStyle;

const ExpandCard = ({
  title,
  children,
  className,
  bordered,
  header,
  expanded,
  disableClick
}) => {
  const [checked, setChecked] = useState(disableClick ? true : expanded);
  
  const handleCollapse = () => {
    if (!disableClick) {
      setChecked(!checked);
    }
  };

  return (
    <div
      className={`${styles.wrapper} ${className} ${bordered &&
        styles.bordered}`}
    >
      {!disableClick && (
        <div
          className={`d-flex align-items-center header-global ${styles.header}`}
          onClick={handleCollapse}
        >
          <div
            className={`d-flex rounded-icon-global ${
              styles['rounded-icon']
            } ${checked && styles.open}`}
          >
            <RVIcon
              icon="more"
              size={iconSmallTwo}
            />
          </div>
          {header ? header : <h4>{title}</h4>}
        </div>
      )}
      <Collapse in={checked}>
        <div className="expand-body mb-2">{children}</div>
      </Collapse>
    </div>
  );
};

ExpandCard.propTypes = {
  bordered: PropTypes.string,
  children: PropTypes.any,
  className: PropTypes.string,
  disableClick: PropTypes.any,
  expanded: PropTypes.any,
  header: PropTypes.any,
  title : PropTypes.string
};

export default withStyles(styles)(ExpandCard);
