import React , { useEffect } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CLASS_NAMES, CELL_TYPES } from '@revin-utils/utils';
import CrossOverTooltip from 'components/common/crossover-tooltip';
import { ELEMENT_ID } from 'utils/test-ids';


const PricingSummary = ({ className, children, headerData, headerClick }) => {

  const initializePerfectScroll = () => {
    setTimeout(() => {
      const scrollbar = document.getElementById(ELEMENT_ID.PRICING_SUMMARY_SCROLL);
      scrollbar?.scrollTo(0, 1);
      scrollbar?.scrollTo(0, 0);
    }, 100);
  };

  useEffect(() => {
    initializePerfectScroll();
  }, []);

  return (
    <PerfectScrollbar
      className={'perfect-scrollbar-element pricing-summary-scroll'}
      id={ELEMENT_ID.PRICING_SUMMARY_SCROLL}
    >
      <div className="ref-wrapper">
        <table
          className={`${className} ${CLASS_NAMES.DATA_SHEET} ${CLASS_NAMES.CUSTOM_WRAPPER}`}
        >
          <thead className="table-view-thead">
            <tr className="row">
              {headerData?.map((col) => (
                <>
                  {col.type === CELL_TYPES.HEADER_TOGGLE && (
                    <th
                      className={`action-cell cell ${col?.dynamicClasses?.join(' ')}`}
                      key={col?.id}
                    />
                  )}
                  {col.type === CELL_TYPES.HEADER && (
                    <th
                      className={`action-cell cell ${col?.dynamicClasses?.join(' ')}`}
                      key={col?.id}
                    >
                      <div className="table-header-th">
                        <div>{col?.name}</div>
                        <div>{col?.subName}</div>
                      </div>
                    </th>
                  )}
                  {col.type === CELL_TYPES.MONTH && (
                    <th
                      className={`cell month ${col?.dynamicClasses?.join(' ')}`}
                      data-expanded={col?.expanded}
                      data-id={col?.id}
                      data-parent={col?.parent}
                      data-pid={col?.pID}
                      key={`${col?.id}-${col?.subName}`}
                      onClick={headerClick}
                    >
                      <span className="subset-header-wrap">
                        <span className="subset-header-row-two">{col?.name}</span>
                        <span className="subset-header-row-one tag-style">
                          {col?.subName}
                        </span>
                      </span>
                      <CrossOverTooltip subType={col?.subType}/>
                    </th>
                  )}
                </>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </PerfectScrollbar>
  );
};

PricingSummary.propTypes = {
  children: PropTypes.object,
  className: PropTypes.string,
  headerClick: PropTypes.func,
  headerData: PropTypes.array
};

export default PricingSummary;
