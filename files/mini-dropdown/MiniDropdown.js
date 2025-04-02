import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { ChevronDown } from 'react-feather';
import { MINI_DROPDOWN_POSITION } from 'utils/constants';
import styles from './MiniDropdown.module.scss';

const MiniDropdown = ({ items,opportunity,handleBillingTypeOverride, position }) => {
  const getInitialSelectedValue = () => {
    const selectedItem = items?.find(item => item?.selected);
    if (selectedItem) {
      return selectedItem;
    } else if (items?.length === 1) {
      return items[0];
    } else {
      return '';
    }
  };

  const [dropdownVisible, setDropdownVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState(getInitialSelectedValue);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setSelectedValue(getInitialSelectedValue());
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setDropdownVisible(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleDropdown = (event) => {
    event?.stopPropagation();
    if (items?.length > 1) {
      setDropdownVisible(!dropdownVisible);
    }
  };

  const handleItemClick = (event,item) => {
    event?.stopPropagation();
    setSelectedValue(item);
    handleBillingTypeOverride(opportunity?.id,item);
    setDropdownVisible(false);
  };

  const buttonClass = items?.length === 1 
    ? `${styles['dropdown-button']} ${styles['single-item']}`
    : `${styles['dropdown-button']} ${dropdownVisible ? styles.open : ''} ${!selectedValue ? styles['not-selected'] : ''}`;

  return (
    <div
      className={`${styles.wrapper} ${position === MINI_DROPDOWN_POSITION ? styles.top : ''}`}
      ref={wrapperRef}
    >
      <div
        className={buttonClass}
        onClick={toggleDropdown}
      >
        {selectedValue?.label || 'Select'}
        {items?.length > 1 && <ChevronDown className={`${styles.arrow}`} />}
      </div>
      {items?.length > 1 && (
        <div
          className={`${styles['dropdown-content']} ${dropdownVisible ? styles.show : ''
            }`}
        >
          {items
            ?.filter(item => item.label !== selectedValue.label)
            .map((item, index) => (
              <div
                className={styles['dropdown-item']}
                key={`${items?.label}-${index}`}
                onClick={(event) => handleItemClick(event, item)}
              >
                {item.label}
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

MiniDropdown.propTypes = {
  handleBillingTypeOverride:PropTypes.func,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value:PropTypes.string.isRequired,
      selected: PropTypes.bool
    })
  ).isRequired,
  opportunity:PropTypes.object,
  position: PropTypes.bool
};

export default MiniDropdown;
