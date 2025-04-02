import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { FORM_LABELS } from '@revin-utils/utils';

const RESTRICTED_CHARACTERS = ['-'];

const ForecastControlsCell = ({
  error,
  handleCellChange,
  id,
  isEdit,
  newValue,
  newValueKey,
  oldValue,
  overriddenStatus = false,
  rowId
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(overriddenStatus ? newValue : oldValue);
  }, [overriddenStatus, newValue, oldValue]);

  const handleChange = (event) => {
    const { value } = event.target;
    setValue(value);
  };

  const handleBlur = (event) => {
    const inputValue = event.target.value;
    const parsedInput = inputValue ? parseFloat(inputValue) : 0;
    handleCellChange(rowId, newValueKey, parsedInput);
  };

  const handleKeyDown = (event) => {
    if (RESTRICTED_CHARACTERS.includes(event.key)) {
      event.preventDefault();
    }
  };

  return isEdit ? (
    <SnapTextbox
      className="small-textbox-without-label"
      decimalPoints={2}
      error={error}
      handleBlur={handleBlur}
      handleChange={handleChange}
      id={`${id}Input${rowId}`}
      isNonNegativeNumber
      params={{ onKeyDown: handleKeyDown }}
      rows={1}
      type={FORM_LABELS.OUTLINED}
      value={value === undefined || value === null ? '0': `${value}`}
    />
  ) : 
    (`${value}`);
};

ForecastControlsCell.propTypes = {
  error: PropTypes.object,
  handleCellChange: PropTypes.func,
  id: PropTypes.string,
  isEdit: PropTypes.bool,
  newValue: PropTypes.number,
  newValueKey: PropTypes.string,
  oldValue: PropTypes.number,
  overriddenStatus: PropTypes.bool,
  rowId: PropTypes.string
};

export default ForecastControlsCell;
