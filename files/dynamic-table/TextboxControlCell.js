import React, { useState } from 'react';
import PropTypes from 'prop-types';
import SnapTextbox from '@pnp-snap/snap-textbox';
import { FORM_LABELS } from '@revin-utils/utils';
import { MAX_NUMBER_LIMIT } from 'utils/constants';

const RESTRICTED_CHARACTERS = ['-'];

const TextboxControlCell = ({
  data,
  handleCellChange,
  id,
  rowIndex,
  colIndex
}) => {
  const [value, setValue] = useState(data);

  const handleChange = (event) => {
    const { value } = event.target;
    const v = checkIsNumber(value);
    setValue(v);
  };

  const handleBlur = (event) => {
    const value = event.target.value;
    handleCellChange({value, rowIndex, colIndex});
  };

  const handleKeyDown = (event) => {
    if (RESTRICTED_CHARACTERS.includes(event.key)) {
      event.preventDefault();
    }
  };

  const checkIsNumber = (v) => {
    let v1 = '';
    let v2 = '';
    let v3 = '';
    let v4 = '';
    if (!v.includes('.')) {
      v1 = v.replace(/\D+/g, '');
      return v1;
    } else {
      v1 = v;
      v2 = v1.split('.')[0];
      v3 = v1.split('.')[1];
      if (v3 !== undefined) {
        v4 = v3.replace(/\D+/g, '');
      }
      return v2+'.'+v4;
    }
  };

  return (
    <SnapTextbox
      className="small-textbox-without-label"
      decimalPoints={2}
      handleBlur={handleBlur}
      handleChange={handleChange}
      id={id}
      isFloatNumber
      maxNumberLimit={MAX_NUMBER_LIMIT}
      params={{ onKeyDown: handleKeyDown }}
      rows={1}
      type={FORM_LABELS.OUTLINED}
      value={value}
    />
  );
};

TextboxControlCell.propTypes = {
  colIndex: PropTypes.number,
  data: PropTypes.number,
  handleCellChange: PropTypes.func,
  id: PropTypes.string,
  rowIndex: PropTypes.number
};

export default TextboxControlCell;
