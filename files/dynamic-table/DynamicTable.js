import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { ELEMENT_ID } from 'utils/test-ids';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Trash2 from 'react-feather/dist/icons/trash-2';
import { COLUMN_TYPE } from 'utils/constants';
import TextboxControlCell from './TextboxControlCell';
import styles from './DynamicTable.module.scss';

const DynamicTable = ({
  className,
  colType,
  grid,
  headers,
  onAddRow,
  onCellChange,
  onDeleteRow,
  rowsLimit=10,
  showAddOption,
  showDeleteOption
}) => {
  const [data, setData] = useState(grid);

  useEffect(() => {
    setData(grid);
  }, [grid]);

  const addRow = () => {
    const newRow = headers?.map(() => '');
    if (data?.length < rowsLimit) {
      setData(prevData => [...prevData, newRow]);
      onAddRow && onAddRow([...data, newRow]);
    }
  };

  const deleteRow = index => {
    const updatedData = [...data];
    const deleted = updatedData.splice(index, 1);
    setData(updatedData);
    onDeleteRow({index, deleted, updatedData});
  };

  const columnWidth = headers?.length > 0 ? (100 / headers?.length).toFixed(2) + '%' : 'auto';

  const handleChange = (event) => {
    const {value, rowIndex, colIndex} = event;
    const updatedData = [...data];
    updatedData[rowIndex][colIndex] = value;
    setData(updatedData);
    onCellChange({value, rowIndex, colIndex, updatedData});
  };

  return (
    <div className={`forecasting-table ${styles.wrapper} ${className}`}>
      <PerfectScrollbar>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers?.map((header, index) => (
                <th
                  key={`${index}${header}`}
                  style={{ width: columnWidth }}
                >
                  {header}
                </th>
              ))}
              {showDeleteOption && <th />}
            </tr>
          </thead>
          <tbody>
            {data.map((rowData, rowIndex) => (
              <tr key={`${rowIndex}${rowData[rowIndex]}`}>
                {rowData.map((colData, colIndex) => (
                  <td key={`${colIndex}${colData}`}>
                    {colType === COLUMN_TYPE.TEXTBOX &&
                    colIndex === headers?.length - 1 ? (
                        <div className="d-flex align-items-center">
                          <TextboxControlCell
                            colIndex={colIndex}
                            data={colData}
                            handleCellChange={handleChange}
                            id={`${colIndex}${ELEMENT_ID.DYNAMIC_INPUT1}`}
                            rowIndex={rowIndex}
                          />
                        </div>
                      ) : colType === COLUMN_TYPE.TEXTBOX ? (
                        <TextboxControlCell
                          colIndex={colIndex}
                          data={colData}
                          handleCellChange={handleChange}
                          id={`${colIndex}${ELEMENT_ID.DYNAMIC_INPUT2}`}
                          rowIndex={rowIndex}
                        />
                      ) : (
                        colData
                      )}
                  </td>
                ))}
          
                <td>
                  {showDeleteOption && data.length > 1 && (
                    <Trash2
                      id={`${rowIndex}${ELEMENT_ID.DYNAMIC_DELETE_ROW}`}
                      onClick={() => deleteRow(rowIndex)}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PerfectScrollbar>
      {showAddOption && (
        <div className={styles.footer}>
          <p
            className={`primary-link ${styles['primary-link']}`}
            onClick={addRow}
          >
            Add More
          </p>
        </div>
      )}
    </div>
  );
};

DynamicTable.propTypes = {
  className: PropTypes.string,
  colType: PropTypes.string,
  grid: PropTypes.array,
  headers: PropTypes.array,
  onAddRow: PropTypes.func,
  onCellChange: PropTypes.func,
  onDeleteRow: PropTypes.func,
  rowsLimit: PropTypes.number,
  showAddOption: PropTypes.bool,
  showDeleteOption: PropTypes.bool
};


export default DynamicTable;
