import React, { useEffect, useState } from 'react';
import { TABLE_TYPES} from '@revin-utils/utils';
import ArrowLeft from 'react-feather/dist/icons/arrow-left';
import PropTypes from 'prop-types';
import ForecastDataSheetControlWrapper from 'components/common/forecasting-table/ForecastDataSheetControlWrapper';
import { getForecastCycleDuration } from 'utils/forecastingCommonFunctions';
import { buildUtilisationGrid, generateMonths } from '../helper';
import { CONTROLS_LABEL } from 'utils/constants';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './ModifyUtilisation.module.scss';

const ModifyUtilisation = ({ closeUtilisationsModal, modifiedUtilisationsEvent, utilisations }) => {
  const [utilisationsData, setUtilisationsData] = useState([]);
  const [utilisationHeaders , setUtilisationHeaders] = useState([]);

  useEffect(() => {
    const dur = getForecastCycleDuration();
    const headers = generateMonths(dur.forecastDurationStartDate, dur.forecastDurationEndDate);
    setUtilisationHeaders(headers);
    const data = buildUtilisationGrid(utilisations, headers);
    setUtilisationsData(data);
  }, [utilisations]);

  const onGridChanged = (data) => {
    setUtilisationsData(data);
    modifiedUtilisationsEvent(data);
  };
  
  return (
    <div className={`forecasting-table ${styles.wrapper}`}>
      <div
        className={`d-flex align-items-center mb-3 ${styles.title}`}
        id={ELEMENT_ID.UTILISATION_ARROW_LEFT}
        onClick={closeUtilisationsModal}
      >
        <ArrowLeft /> {CONTROLS_LABEL.UTILISATION_BACK_LINK}
      </div>
      {!!utilisationsData.length && (
        <ForecastDataSheetControlWrapper
          grid={utilisationsData}
          header={utilisationHeaders}
          id={ELEMENT_ID.MODIFY_UTILISATION}
          onGridChanged={onGridChanged}
          type={TABLE_TYPES.PRICING_SUMMARY}
        />)}
    </div>
  );
};

ModifyUtilisation.propTypes = {
  closeUtilisationsModal: PropTypes.func,
  modifiedUtilisationsEvent: PropTypes.func,
  utilisations: PropTypes.array
};

export default ModifyUtilisation;
