import React, { useEffect , useState } from 'react';
import { useFormik } from 'formik';
import isNumber  from 'lodash/isNumber';
import PropTypes from 'prop-types';
import { Col } from 'react-grid-system';
import CancelIcon from '@material-ui/icons/Cancel';
import PerfectScrollbar from 'react-perfect-scrollbar';
import PlusCircleIcon from 'react-feather/dist/icons/plus-circle';
import Trash2Icon from 'react-feather/dist/icons/trash-2';
import moment from 'moment-mini';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import SnapCalendar from '@pnp-snap/snap-calendar';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import GridRow from '@revin-utils/components/grid-row';
import ArrowWrapper from '@revin-utils/components/arrow-wrapper';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import { FORM_LABELS, get, NOTIFICATION_TYPES, getSessionItem } from '@revin-utils/utils';
import { buildAddOppportunityPayload, dateValidation, getFilteredDropDownData, getManagersPayload, getAccountEntityCodeArray, removeSpecialCharacters } from 'utils/helper';
import { OPPORTUNITY_SERVICE_URL } from 'utils/environment';
import { ADHOC_OPP_MODAL_TITLE, BILLING_TYPE, BUSINESS_PORTFOLIO, CANCEL, CONTINUE, DATE_FORMAT, DELIVERY_TYPE, DESCRIPTION_LABEL, EDIT_OPP_MODAL_TITLE, EST_CLOSURE_DATE, EST_COST, EST_END_DATE, EST_REVENUE, EST_START_DATE, NEED_SOLUTION, PRIMARY_PROVIDER, PRIMARY_SERVICE_LINE, PROJECT_NAME, USD,SERVICE_ALLOCATION_THRESHOLD, PROJECT_MANAGERS, BTN_LABELS, PROGRAM, CURRENCY_USD, ACCOUNT_LABEL, COMPONENT_TYPE, SESSION_STORAGE_KEYS } from 'utils/constants';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { ELEMENT_ID } from 'utils/test-ids';
import styles from './AddAdhocOpportunity.module.scss';

const AddAdhocOpportunityModal = ({open , handleAdhocModalClose, metaData, setOpenAdhocModal, oppToBeEdited, callBackHandler, opportunities}) => {

  const [disableContinueButton, setDisableContinueButton] = useState(false);
  const [addMore, setAddMore] = useState([
    { uid: `${ELEMENT_ID.PRIMARY_INFO_SERVICELINE}0` }
  ]);

  const [dates, setDates] = useState({
    estStartDate: '',
    estEndDate: '',
    estClosureDate: ''
  });

  const [projectManagers , setProjectManagers] = useState([]);
  const [programs,setPrograms]=useState([]);
  const [fetchedData , setFetchedData] = useState();
  const [defaultCurrencyCode , setDefaultCurrencyCode] = useState();
  const [services , setServices ] = useState([]);
  const [canAddnewPrimaryInfo , setcanAddNewPrimaryInfo] = useState(true);
  const [billingTypeData , setBillingTypeData] = useState([]); 
  const [serviceLines , setServiceLines] = useState([]);
  const [errorText , setErrorText] = useState('');
  const [usdData,setUsdData] = useState([]);
  const [nextDay,setNextDay] = useState('');
  const [projectMangeresList, setProjectManageresList] = useState([]);

  const [errorHandlers , setErrorHandlers] = useState({
    projectName: false,
    program:false,
    estStartDate: false,
    estClosureDate: false,
    estEndDate: false,
    needOrPotentialSolution:false,
    deliveryType: false,
    billingType: false,
    description: false,
    estRevenue: false,
    estCost: false,
    account: false
  });
  const formik = useFormik({
    initialValues:{
      projectName: removeSpecialCharacters(fetchedData?.attributes?.projectName ?? ''),
      program: fetchedData?.attributes?.programId ,
      needOrPotentialSolution:removeSpecialCharacters(fetchedData?.attributes?.needOrPotentialSolution, ['.']),
      deliveryType: fetchedData?.attributes?.deliveryType?.codeId ?? '',
      billingType: fetchedData?.attributes?.billingType?.codeId ?? '',
      description: removeSpecialCharacters(fetchedData?.attributes?.description, ['.']),
      estRevenue: fetchedData?.attributes?.estimatedRevenue || 0,
      estCost: fetchedData?.attributes?.estimatedCost || 0,
      estRevenueCurrency: fetchedData?.attributes?.currencyCode?.id ?? defaultCurrencyCode?.id,
      estCostCurrency: fetchedData?.attributes?.currencyCode?.id ?? defaultCurrencyCode?.id,
      services: services?? [],
      account: fetchedData?.attributes?.account?.accountId
    },
    enableReinitialize: true
  });

  useEffect(() => {
    if (formik.values.account) {
      const forecastEntitlementView = getSessionItem(SESSION_STORAGE_KEYS.ENTITLEMENT_VIEW);
      const entityCode = getAccountEntityCodeArray(metaData?.accounts?.filter((item) => item?.id === formik.values.account), metaData?.accounts);
      callBackHandler({
        type: OpportunitiesActionType.GET_MANAGERS_PROGRAM_DROPDOWN,
        payload: {
          managers: getManagersPayload(formik.values.account),
          programs: {
            forecastEntitlement: {
              forecastEntitlementView
            },
            parentEntityCodes: entityCode
          }
        }
      });
    }
  }, [formik.values.account]);

  useEffect(() => {
    setNextDay(moment().add(1,'day').startOf('day').toDate());
  },[]);

  useEffect (() =>{
    const currencyList = metaData?.currencyData?.list;
    if (Array.isArray(currencyList)) {
      setUsdData(currencyList.filter(currency => currency.currencyCode === CURRENCY_USD));
    }
  },[metaData?.currencyData?.list]);

  useEffect(() => {
    const billingTypeData = getFilteredDropDownData(metaData , 'deliveryTypeData', 'billingTypeData','BLLNG_TYP', formik.values.deliveryType);
    formik.setFieldValue('billingType', '');
    setBillingTypeData(billingTypeData);
  }, [formik.values.deliveryType]);

  useEffect(() => {
    if (opportunities?.programs && formik.values?.account?.length) {
      const filteredPrograms = opportunities.programs.filter(item => item.id !== 'All');
      setPrograms(filteredPrograms);
    } else {
      setPrograms([]);
    }
  }, [opportunities?.programs, formik.values.account]);

  useEffect(() => {
    if (opportunities?.managers && formik.values?.account?.length) {
      setProjectManageresList(opportunities.managers);
    } else {
      setProjectManageresList([]);
    }
  }, [opportunities?.managers, formik.values.account]);

  useEffect(() => {
    const defaultCurrency = metaData?.currencyData?.list?.filter((item) => item?.currencyCode === USD);
    defaultCurrency && setDefaultCurrencyCode(defaultCurrency[0]);
  }, [metaData?.currencyData]);

  useEffect(() => {
    if(oppToBeEdited){
      const oppData = fetchOpportunityData(oppToBeEdited?.opportunityId);
      oppData.then((response) => {
        setFetchedData(response);
        if(response?.attributes){
          setProjectManagers(response?.attributes?.projectManagerIds?.map(item => ({
            ...item,
            id: item.id,
            label: `${item.firstName} ${item.lastName}`,
            level: `${item.firstName} ${item.lastName}`
          })));
          setDates({
            estStartDate: response?.attributes?.estimatedStartDate ?? '',
            estEndDate: response?.attributes?.estimatedEndDate ?? '',
            estClosureDate: response?.attributes?.estimatedClosureDate ?? ''
          });
          setServices(response.attributes?.services.map((item) => ({
            servicePortfolio: item?.businessPortfolio?.codeId,
            serviceLine: item?.serviceLine?.codeId,
            primaryProvider: item?.primaryProvider?.codeId,
            allocation: item?.allocation
          })));
          setServiceLines(response.attributes?.services?.map((item) => 
            getFilteredDropDownData(metaData , 'servicePortfolioData', 'serviceLines', 'SRVC_LINE', item?.businessPortfolio?.codeId))
          );
          if(response.attributes?.services.length >= 1){
            const allocationArray = response.attributes?.services?.map((item) => item?.allocation);
            allocationTotal(allocationArray);
          }
          setAddMore(response.attributes?.services);
        }
      });
    }
  }, [oppToBeEdited]);

  useEffect(() => {
    const isValueNotEmpty = (value) => value !== '';
    const isServiceValid = ({ servicePortfolio, serviceLine, primaryProvider, allocation }) =>
      typeof servicePortfolio !== 'undefined' && servicePortfolio !== '' &&
      typeof serviceLine !== 'undefined' && serviceLine !== '' &&
      typeof primaryProvider !== 'undefined' && primaryProvider !== '' &&
      (typeof allocation !== 'undefined' && parseInt(allocation) >= 0 && parseInt(allocation) <= SERVICE_ALLOCATION_THRESHOLD);
    const areAllValuesNotEmpty = (values) => Object.values(values).every(isValueNotEmpty);
  
    const areAllDatesNotEmpty = (dates) => Object.values(dates).every(isValueNotEmpty);
  
    const isServiceArrayValid = (services) => {
      return services.length > 0 && services.every(isServiceValid);
    };
  
    const isAllocationSumValid = (services) => services.reduce((totalAllocation, { allocation }) => totalAllocation + parseInt(allocation), 0) === SERVICE_ALLOCATION_THRESHOLD;
  
    const areAddMoreItemsValid = (addMore, services) => addMore.length === services.length;
  
    const areServiceDetailsValid = (values) =>
      typeof values.description !== 'undefined' && values.description !== '' &&
      parseInt(values.estCost) !== 0 &&
      parseInt(values.estRevenue) !== 0 &&
      projectManagers.length > 0 ;

    const isFormValid = areAllValuesNotEmpty(formik.values) &&
                        areAllDatesNotEmpty(dates) &&
                        isServiceArrayValid(formik.values.services) &&
                        isAllocationSumValid(formik.values.services) &&
                        areAddMoreItemsValid(addMore, formik.values.services) &&
                        areServiceDetailsValid(formik.values) &&
                        !errorText.length;

    setDisableContinueButton(!isFormValid);
  }, [formik.values, dates, addMore, errorText,projectManagers]);

  const fetchOpportunityData = async(oppID) => {
    const response = await get(`${OPPORTUNITY_SERVICE_URL}opportunities/${oppID}/unwrap`);
    return response?.data?.data;
  };

  const addMoreRow = () => {
    setAddMore([
      ...addMore,
      { uid: `${ELEMENT_ID.PRIMARY_INFO_SERVICELINE}${addMore.length + 1}` }
    ]);
  };

  const allocationTotal = (allocationArray) => {
    const initialValue = 0;
    const sumArray = allocationArray.reduce((accumalator , currentValue) => accumalator + currentValue, initialValue);
    setcanAddNewPrimaryInfo(sumArray < SERVICE_ALLOCATION_THRESHOLD);
  };

  const removeRow = (rowIndex) => {
    if(formik.values.services?.length > 1){
      const data = formik.values.services.filter(
        (service, serviceIndex) => serviceIndex !== rowIndex
      );
      formik.setFieldValue('services', data);
      setAddMore([...addMore.filter((item, index) => index !== rowIndex)]);
      const allocationArray = data.map((item) => parseInt(item?.allocation));
      allocationTotal(allocationArray);
    }
  };

  const handleDateChange = (label,date) => {
    dateValidation(label, date , dates , setErrorText);
    setDates((prevState) => ({
      ...prevState,
      [`${label}`]: moment(date).format(DATE_FORMAT.FORMAT_3) + 'Z'
    }));
  };

  useEffect(() => {
    const { isCreated , isEdited } = opportunities?.crud_flags;
    if(isCreated || isEdited){
      setOpenAdhocModal(false);
      clearStateandFormikState('');
    }
  }, [opportunities?.crud_flags]);

  const handleAdhocModalSubmit = () => {
    callBackHandler({
      type: oppToBeEdited ? OpportunitiesActionType.EDIT_OPPORTUNITY : OpportunitiesActionType.ADD_OPPORTUNITY,
      payload: oppToBeEdited ? 
        { 
          id: oppToBeEdited?.opportunityId ,
          data: buildAddOppportunityPayload(formik.values , dates, projectManagers)
        } : buildAddOppportunityPayload(formik.values , dates, projectManagers)
    });
  };

  const handleInputError = (event) => {
    const field = event.target.name;
    setErrorHandlers((prevState) => ({
      ...prevState,
      [`${field}`]: formik?.values[`${field}`] === '' || formik?.values[`${field}`] === null ? true : false
    }));
  };

  const handleCanAddPrimaryInfo = (value , index) => {
    const services = [...formik.values.services];
    if((parseInt(value) > 0 || value === '') && parseInt(value) <= SERVICE_ALLOCATION_THRESHOLD){
      const initialValue = 0;
      services?.splice(index , 1);
      const sumArray = services.map((item) => {
        return isNumber(item?.allocation) ? parseInt(item?.allocation) : 0;
      });
      const sumWithInitial = sumArray.reduce((accumalator , currentValue) => accumalator + currentValue, initialValue);
      if(sumWithInitial + parseInt(value) <= SERVICE_ALLOCATION_THRESHOLD){
        formik.setFieldValue(`services.${index}.allocation`, parseInt(value));
        setcanAddNewPrimaryInfo(sumWithInitial + parseInt(value) < SERVICE_ALLOCATION_THRESHOLD ? true : false);
      }
    }else{
      formik.setFieldValue(`services.${index}.allocation`, '');
    }
  };

  const disablePlusIconPrimaryInfo = () => {
    if(
      formik.values.services.length > 0 &&
      formik.values.services.every((item) => Object.keys(item).length === 4) &&
      addMore.length === formik.values.services.length) {
      return formik.values.services.every((item) => !Object.values(item).every((value) => value !== ''));
    }else return true;
  };

  const handleInputs = (event) => {
    const inputName = event.target.name;
    const value = event?.target?.value;
    if ((inputName === 'projectName' && value?.length <= 30)) {
      formik.setFieldValue(inputName, removeSpecialCharacters(value));
    } else if (inputName === 'needOrPotentialSolution' || inputName === 'description') {
      formik.setFieldValue(inputName, removeSpecialCharacters(value, ['.']));
    } else if (inputName === 'estRevenue' || inputName === 'estCost') {
      const reg = new RegExp('^[0-9]+$');
      (reg.test(value) && value >= 0 || value === '') && formik.setFieldValue(inputName, value);
    }
  };

  const handleProjectManagers = (event , selected) => {
    setProjectManagers(selected);
  };

  const clearStateandFormikState = (type) => {
    formik.resetForm();
    setDates({
      estStartDate: '',
      estEndDate: '',
      estClosureDate: ''
    });
    setProjectManagers([]);
    setServices();
    setFetchedData();
    setcanAddNewPrimaryInfo(true);
    setServiceLines([]);
    setAddMore([{ uid: `${ELEMENT_ID.PRIMARY_INFO_SERVICELINE}0` }]);
    type === BTN_LABELS.Close && handleAdhocModalClose();
  };

  const handlePrimaryInfoChange = (event) => {
    const { name , value } = event.target;
    const getFilteredServiceLines = getFilteredDropDownData(metaData , 'servicePortfolioData', 'serviceLines', 'SRVC_LINE', value);
    if(!serviceLines?.length){
      setServiceLines([getFilteredServiceLines]);
    }else{
      const serviceLinesCopy = serviceLines;
      serviceLinesCopy[name.split('.')[1]] = getFilteredServiceLines;
      setServiceLines(serviceLinesCopy); 
    }
    const serviceLineIndex = name.split('.',2).join('.').length;
    const serviceLineAddition = name.slice(0,serviceLineIndex).concat('.serviceLine');
    formik.setFieldValue(name, value);
    formik.setFieldValue(serviceLineAddition, '');
  };
  
  return(
    <>
      <SnapModal
        align = "center"
        className={`main-modal ${styles.wrapper}`}
        disableBackdropClick
        dividers
        footerActions={
          <>
            <div className="w-100 d-flex align-items-center justify-content-between">
              <ArrowWrapper
                data={BTN_LABELS.Close}
                handleChange={clearStateandFormikState}
              >
                <SnapButton
                  handleClick={clearStateandFormikState}
                  label={CANCEL}
                  name={CANCEL}
                  type={FORM_LABELS.SUBMIT}
                  variant={FORM_LABELS.OUTLINED}
                />
              </ArrowWrapper>
              <SnapButton
                disabled={disableContinueButton}
                handleClick={handleAdhocModalSubmit}
                label={CONTINUE}
                name={CONTINUE}
                type={FORM_LABELS.SUBMIT}
                variant={FORM_LABELS.CONTAINED}
              />
            </div>
          </>
        }
        fullWidth
        maxWidth="lg"
        modalHeight="auto"
        modalTitle= {oppToBeEdited !== null ? EDIT_OPP_MODAL_TITLE : ADHOC_OPP_MODAL_TITLE}
        name="Project controls"
        onClose={handleAdhocModalClose}
        open={open}
        scroll="paper"
        transitionDirection="up"
      >
        <PerfectScrollbar className="px-4 pt-3 pb-5">
          { errorText && 
          <CustomAlertBar
            alertType={NOTIFICATION_TYPES.ERROR}
            className={styles['border-alert-bar']}
          >
            <div className="d-flex align-items-center">
              <CancelIcon />
              {errorText}
            </div>
          </CustomAlertBar>
          }
          <GridRow>
            <Col lg={12}>
              <SnapTextbox
                className="mb-2"
                error={errorHandlers.projectName}
                handleBlur={handleInputError}
                handleChange={handleInputs}
                label={PROJECT_NAME}
                name="projectName"
                type={FORM_LABELS.OUTLINED}
                value={formik.values.projectName || ''}
              />
            </Col>
            <Col lg={12}>
              <SnapDropdown
                className="mb-2"
                data={opportunities?.child_accounts}
                disabled={oppToBeEdited}
                error={errorHandlers.account}
                handleChange={formik.handleChange}
                label={ACCOUNT_LABEL}
                name="account"
                type={COMPONENT_TYPE.DROPDOWN}
                value={formik?.values?.account || ''}
              />
            </Col>
            <Col lg={12}>
              <SnapDropdown
                className="mb-2"
                data={programs}
                disabled={oppToBeEdited}
                error={errorHandlers.program}
                handleChange={formik.handleChange}
                label={PROGRAM}
                name="program"
                type={COMPONENT_TYPE.DROPDOWN}
                value={formik?.values?.program || ''}
              />
            </Col>
            <Col lg={12}>
              <SnapDropdown
                className="mb-2"
                data={projectMangeresList}
                handleChange={handleProjectManagers}
                id={ELEMENT_ID.PRIMARY_INFO_PROJECT_MANAGERS}
                label={PROJECT_MANAGERS}
                name="projectManagers"
                selectedValue={projectManagers}
                type="multiselect"
              />
            </Col>
            <Col lg={12}>
              <GridRow>
                <Col lg={12}>
                  <SnapCalendar
                    className="mb-2"
                    label={EST_START_DATE}
                    minDate={nextDay}
                    name="estStartDate"
                    selectedDate={
                      dates.estStartDate
                        ? new Date(dates.estStartDate)
                        : null
                    }
                    setDate={(date) => handleDateChange('estStartDate',date)}
                  />
                </Col>
                <Col lg={12}>
                  <SnapCalendar
                    className="mb-2 calendar-align-right"
                    label={EST_END_DATE}
                    name="estEndDate"
                    selectedDate={
                      dates.estEndDate
                        ? new Date(dates.estEndDate)
                        : null
                    }
                    setDate={(date) => handleDateChange('estEndDate', date)}
                  />
                </Col>
              </GridRow>
            </Col>
            <Col lg={12}>
              <GridRow>
                <Col lg={12}>
                  <SnapCalendar
                    className="mb-2"
                    label={EST_CLOSURE_DATE}
                    name="estClosureDate"
                    selectedDate={
                      dates.estClosureDate
                        ? new Date(dates.estClosureDate)
                        : null
                    }
                    setDate={(date) => handleDateChange('estClosureDate', date)}
                  />
                </Col>
              </GridRow>
            </Col>
            <Col lg={12}>
              <SnapTextbox
                className="mb-2"
                error={errorHandlers.needOrPotentialSolution}
                handleBlur={handleInputError}
                handleChange={handleInputs}
                label={NEED_SOLUTION}
                multiline
                name="needOrPotentialSolution"
                rows={4}
                type={FORM_LABELS.OUTLINED}
                value={formik.values.needOrPotentialSolution || ''}
              />
            </Col>
            <Col lg={12}>
              <SnapDropdown
                className="mb-2"
                data={metaData?.deliveryTypeData}
                disabled={oppToBeEdited}
                error={errorHandlers.deliveryType}
                handleChange={formik.handleChange}
                label={DELIVERY_TYPE}
                name="deliveryType"
                type={COMPONENT_TYPE.DROPDOWN}
                value={formik.values.deliveryType || ''}
              />
              <SnapDropdown
                className="mb-2"
                data={billingTypeData}
                disabled={oppToBeEdited}
                error={errorHandlers.billingType}
                handleChange={formik.handleChange}
                label={BILLING_TYPE}
                name="billingType"
                type={COMPONENT_TYPE.DROPDOWN}
                value={formik.values.billingType || ''}
              />
            </Col>
          </GridRow>
          <div className={styles['clone-text-fields']}>
            { addMore.map((item , index) => (
              <GridRow
                key={`${item.uid}${index}`}
              >
                <Col
                  className="mb-2"
                  xs={8}
                >
                  <SnapDropdown
                    data={metaData?.servicePortfolioData}
                    handleChange={handlePrimaryInfoChange}
                    label={BUSINESS_PORTFOLIO}
                    name={`services.${index}.servicePortfolio`}
                    type={COMPONENT_TYPE.DROPDOWN}
                    value={formik.values.services[index]?.servicePortfolio || ''}
                  />
                </Col>
                <Col
                  className="mb-2"
                  xs={8}
                >
                  <div className={styles['pair-components']}>
                    <SnapDropdown
                      data={serviceLines[index]}
                      handleChange={formik.handleChange}
                      label={PRIMARY_SERVICE_LINE}
                      name={`services.${index}.serviceLine`}
                      type={COMPONENT_TYPE.DROPDOWN}
                      value={formik.values.services[index]?.serviceLine|| ''
                      }
                    />
                    <SnapTextbox
                      error={errorHandlers.primaryServiceLinePercentage}
                      handleChange={(event) => handleCanAddPrimaryInfo(event.target.value , index)}
                      label="% *"
                      name={`services.${index}.allocation`}
                      rows={1}
                      type={FORM_LABELS.OUTLINED}
                      value={
                        formik.values.services[index]?.allocation || ''
                      }
                    />
                  </div>
                </Col>
                <Col
                  className="mb-2"
                  xs={8}
                >
                  <div className="d-flex align-items-center">
                    <SnapDropdown
                      className="w-75"
                      data={metaData?.providers}
                      error={errorHandlers.primaryProvider}
                      handleChange={formik.handleChange}
                      label={PRIMARY_PROVIDER}
                      name={`services.${index}.primaryProvider`}
                      type={COMPONENT_TYPE.DROPDOWN}
                      value={
                        formik.values.services[index]?.primaryProvider
                         ||
                        ''
                      }
                    />
                    {((index === 0 && addMore.length === 1) || index == addMore.length - 1) 
                        && canAddnewPrimaryInfo ?
                      <SnapButton
                        className={styles['loop-box-add']}
                        disabled={disablePlusIconPrimaryInfo()}
                        handleClick={addMoreRow}
                        icon={<PlusCircleIcon id={item.uid} />}
                        id={ELEMENT_ID.PRIMARY_INFO_ADD}
                        isIcon
                        type="button"
                        variant={FORM_LABELS.CONTAINED}
                      />
                      : (
                        <ArrowWrapper
                          data={index}
                          handleChange={removeRow}
                        >
                          <SnapButton
                            className={styles['loop-box-delete']}
                            disabled={formik.values.services.length === 1}
                            icon={<Trash2Icon className="card-delete" />}
                            id={ELEMENT_ID.PRIMARY_INFO_REMOVE}
                            isIcon
                            name={item.uid}
                            type="button"
                            variant={FORM_LABELS.CONTAINED}
                          />
                        </ArrowWrapper>
                      )}
                  </div>
                </Col>
              </GridRow>
            ))}
          </div>
          <GridRow>
            <Col lg={12}>
              <SnapTextbox
                className="mb-2"
                error={errorHandlers.description}
                handleBlur={handleInputError}
                handleChange={handleInputs}
                label={DESCRIPTION_LABEL}
                multiline
                name="description"
                rows={4}
                type={FORM_LABELS.OUTLINED}
                value={formik.values.description || ''}
              />
            </Col>
            <Col>
              <GridRow
                gutterLG={10}
                gutterXL={10}
                gutterXXL={10}
              >
                <Col lg={12}>
                  <div className={`${styles['second-pair-components']}`}>
                    <SnapTextbox
                      error={errorHandlers.estRevenue}
                      handleBlur={handleInputError}
                      handleChange={handleInputs}
                      label={EST_REVENUE}
                      name="estRevenue"
                      rows={1}
                      type={FORM_LABELS.OUTLINED}
                      value={formik.values.estRevenue || ''}
                    />
                    <SnapDropdown
                      data={usdData}
                      handleChange={formik.handleChange}
                      label=""
                      name="estRevenueCurrency"
                      type={COMPONENT_TYPE.DROPDOWN}
                      value={formik.values.estRevenueCurrency}
                    />
                  </div>
                </Col>
                <Col lg={12}>
                  <div className={`${styles['second-pair-components']}`}>
                    <SnapTextbox
                      error={errorHandlers.estCost}
                      handleBlur={handleInputError}
                      handleChange={handleInputs}
                      label={EST_COST}
                      name="estCost"
                      rows={1}
                      type={FORM_LABELS.OUTLINED}
                      value={formik.values.estCost || ''}
                    />
                    <SnapDropdown
                      data={usdData}
                      handleChange={formik.handleChange}
                      label=""
                      name="estCostCurrency"
                      type={COMPONENT_TYPE.DROPDOWN}
                      value={formik.values.estCostCurrency}
                    />
                  </div>
                </Col>
              </GridRow>
            </Col>
          </GridRow>
        </PerfectScrollbar>
      </SnapModal>
    </>
  );
};

AddAdhocOpportunityModal.propTypes = {
  callBackHandler: PropTypes.func,
  handleAdhocModalClose: PropTypes.func,
  handleAdhocModalSubmit: PropTypes.func,
  metaData: PropTypes.object,
  newAdhocOpportunity: PropTypes.object,
  open: PropTypes.any,
  oppToBeEdited: PropTypes.object,
  opportunities: PropTypes.object,
  setOpenAdhocModal: PropTypes.func
};

export default AddAdhocOpportunityModal;