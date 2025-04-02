import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { ELEMENT_ID } from 'utils/test-ids';

const ProbablityOverrideField = ({ handleProbablityOverride, oppData }) => {
  const [overRide, setOverRide] = useState(oppData?.probabilityOverride ?? 0);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = (event) => {
    const value = event.target.value.replace('%', '');
    const numericValue = parseFloat(value);
    if (isNaN(numericValue) || numericValue < 0 || numericValue > 100) {
      setOverRide('');
    } else {
      setOverRide(numericValue);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const finalValue = isNaN(overRide) || overRide === '' ? oppData?.probabilityOverride ?? 0 : overRide;
    setOverRide(finalValue);
    handleProbablityOverride(oppData?.id, finalValue);
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleEventPropagation = (event) => {
    event.stopPropagation();
  };

  return (
    <SnapTextbox
      className="small-textbox-without-label"
      handleBlur={handleBlur}
      handleChange={handleChange}
      handleClick={handleEventPropagation}
      handleFocus={handleFocus}
      id={`${ELEMENT_ID.PROBABLITY_OVERRIDE}${oppData?.attributes?.opportunityId}`}
      name={`${ELEMENT_ID.PROBABLITY_OVERRIDE}${oppData?.attributes?.opportunityId}name`}
      rows={1}
      type="outlined"
      value={isFocused ? overRide : `${isNaN(overRide) || overRide === '' ? oppData?.probabilityOverride ?? 0 : overRide}%`}
    />
  );
};

ProbablityOverrideField.propTypes = {
  handleProbablityOverride: PropTypes.func.isRequired,
  oppData: PropTypes.object.isRequired
};

export default ProbablityOverrideField;
