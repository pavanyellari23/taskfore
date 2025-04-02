import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { TextField } from '@material-ui/core';
import { Plus } from 'react-feather';
import { RVIcon } from '@revin-utils/assets';
import { FORM_LABELS } from '@revin-utils/utils';
import { COMMENTS, FORECAST_DASHBOARD_CONSTANTS } from 'utils/constants';
import variableStyle from '@pnp-revin/utils/dist/assets/scss/variables.module.scss';
import styles from './ToggleTextBox.module.scss';

const { iconSmallOne } = variableStyle;

const ToggleTextBox = ({ setCommentData, savedNotes, isEditable, commentsUpdatedBy }) => {
  const [content, setContent] = useState('');
  const [isTextboxVisible, setTextboxVisible] = useState(false);
  const [isErrorMsg, setIsErrorMsg] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (savedNotes?.trim()?.length) {
      setContent(savedNotes);
    }
  },[savedNotes]);

  const handleBlur = event => {
    setCommentData(event.target.value);
    setTextboxVisible(false);
    if (isErrorMsg === FORECAST_DASHBOARD_CONSTANTS.NOTES_MAXIMUM_LENGTH_ERROR_MSG && event.target.value?.length <= 255) {
      setIsErrorMsg('');
    }
  };

  const handleTextboxChange = e => {
    const inputValue = e.target.value;
    setContent(inputValue);
    const regex = /^[^a-zA-Z0-9]+$/;
    if (inputValue?.match(regex)) {
      setIsErrorMsg(FORECAST_DASHBOARD_CONSTANTS.NOTES_ERROR_MSG);
      setContent('');
    } else if (inputValue.length > 255) {
      setIsErrorMsg(FORECAST_DASHBOARD_CONSTANTS.NOTES_MAXIMUM_LENGTH_ERROR_MSG);
      setContent(inputValue?.slice(0, 255));
    }
    else {
      setIsErrorMsg('');
    }
  };

  const handleIconClick = e => {
    e.stopPropagation();
    setTextboxVisible(true);
  };

  return (
    <div className={`toggle-text-box-global ${styles.wrapper}`}>
      {!isTextboxVisible && (
        <div
          className={`d-flex align-items-center justify-content-between ${styles['comment-label']}`}
        >
          {content?.length ? `${COMMENTS} (${commentsUpdatedBy})` : `${COMMENTS}`}
          {isEditable && 
            <div className={styles['icon-wrapper']}>
              {content?.length ? (
                <RVIcon
                  icon="pencil"
                  onClick={handleIconClick}
                  size={iconSmallOne}
                />
              ) : (
                <Plus
                  className="plus-icon"
                  onClick={handleIconClick}
                />
              )}
            </div>
          }
        </div>
      )}
      {isEditable && isTextboxVisible && (
        <TextField
          autoFocus
          disabled={!isEditable}
          error={isErrorMsg?.length}
          fullWidth
          helperText={isErrorMsg.length ? isErrorMsg : ''}
          inputRef={inputRef}
          label={COMMENTS}
          minRows={4}
          multiline
          onBlur={handleBlur}
          onChange={handleTextboxChange}
          value={content}
          variant={FORM_LABELS.OUTLINED}
        />
      )}
      {!isTextboxVisible && content && (
        <p className={`${isEditable ? styles['submitted-text'] : styles['noneditable-content']}`}>{content}</p>
      )}
    </div>
  );
};

ToggleTextBox.propTypes = {
  commentsUpdatedBy: PropTypes.string,
  isEditable: PropTypes.bool,
  savedNotes: PropTypes.string,
  setCommentData: PropTypes.func
};

export default ToggleTextBox;
