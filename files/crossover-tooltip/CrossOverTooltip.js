import React, { useState} from 'react';
import PropTypes from 'prop-types';
import HelperTooltip from '@revin-utils/components/helper-tooltip';
import { CROSSOVER_MONTH_SUBTYPE, CROSSOVER_MONTH_TOOLTIP,TOOLTIP_STORAGE_KEY } from 'utils/constants';
import { useOutsideClick } from '../hooks/useOutsideClick';

const CrossOverTooltip = ({ subType }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const handleTooltipOpen = () => {
    setTooltipOpen(true);
    sessionStorage.removeItem(TOOLTIP_STORAGE_KEY);
  };

  const handleTooltipClose = () => {
    setTooltipOpen(false);
    sessionStorage.setItem(TOOLTIP_STORAGE_KEY, 'true'); 
  };

  const tooltipRef = useOutsideClick(handleTooltipClose);

  return (
    <>
      {subType === CROSSOVER_MONTH_SUBTYPE && (
        <HelperTooltip
          arrow
          className="helper-tooltip text-left"
          open={tooltipOpen}
          placement="bottom"
          tooltipActions={<p onClick={handleTooltipClose}>Close</p>}
          tooltipContent={<p>{CROSSOVER_MONTH_TOOLTIP}</p>}
        >
          <div
            className="header-strip"
            onMouseEnter={handleTooltipOpen}
            ref={tooltipRef}
          />
        </HelperTooltip>
      )}
    </>
  );
};

CrossOverTooltip.propTypes = {
  subType: PropTypes.string
};
export default CrossOverTooltip;
