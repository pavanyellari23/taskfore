import React, { useState } from 'react';
import  PropTypes from 'prop-types';
import { ExpandMore } from '@material-ui/icons';
import { preciseNumberFormatter } from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
import styles from './SynopticSummary.module.scss';

const SynopticSummary = ({ values, valueGap, finYear, expandedView }) => {

  const [expand, setExpand] = useState(false);
  
  const handleExpand = () => {
    setExpand(!expand);
  };
  
  const getFormattedFinYear = finYear => {
    if (finYear?.length === 4) {
      return finYear.slice(2);
    }
    return finYear;
  };
  
  return (
    <div className={styles.wrapper}>
      <div className={`d-flex align-items-center ${styles['inner-wrapper']} ${expand && styles['expanded-wrapper']}`}>
        {finYear && (
          <div className={styles['fin-year']}>
            FY
            <p>{getFormattedFinYear(finYear)}</p>
          </div>
        )}
        <div className={`d-flex gap-${valueGap} ${styles['value-wrapper']}`}>
          {values.map((item, index) => (
            
            <div
              className={styles.item}
              key={index}
            >
              <>
                {typeof item.value === 'number' ? (
                  <>
                    <h2>{preciseNumberFormatter(item?.value)}</h2>
                    <p className={styles.label}>{item?.label}</p>
                  </>
                ) : (
                  <>
                    <h2 className="d-flex align-items-center">
                      {preciseNumberFormatter(item?.value?.[0])}{' '}
                      {item?.value?.[1]?.type === 'percentage' ? (
                        <span className={styles['percentage-separator']}>
                          {' '}
                          {item?.value[1]?.content} <small>%</small>{' '}
                        </span>
                      ) : item?.value?.[1].type === 'tooltip' ? (
                        <InfoTooltip infoContent={item?.value[1]?.content} />
                      ) : (
                        ''
                      )}
                    </h2>
                    <p className={styles.label}>{item?.label}</p>
                  </>
                )}
              </>
            </div>
          ))}
        </div>
        {expandedView &&
          <div
            className={`d-flex align-items-center ${styles['collapse-wrapper']}`}
          >
            <div className={styles['currency-label']}>
              $ USD
              <p>Currency</p>
            </div>
            <div
              className={`d-flex align-items-center justify-content-center ${styles['expand-button']} ${expand && styles['collapse-button']}`}
              onClick={handleExpand}
            >
              <ExpandMore />
            </div>
          </div>
        }
      </div>
      <div className={`${expand && styles.open} ${styles['expanded-view']}`}>
        {expandedView}
      </div>
    </div>
  );
};

SynopticSummary.propTypes = {
  expandedView: PropTypes.bool,
  finYear: PropTypes.any,
  valueGap: PropTypes.string,
  values : PropTypes.array
};

export default SynopticSummary;
