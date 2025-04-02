import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import _cloneDeep from 'lodash/cloneDeep';
import { Col } from 'react-grid-system';
import _get from 'lodash/get';
import SnapModal from '@pnp-snap/snap-modal';
import SnapButton from '@pnp-snap/snap-button';
import SnapTextbox from '@pnp-snap/snap-textbox';
import SnapCounter from '@pnp-snap/snap-counter';
import SnapDropdown from '@pnp-snap/snap-drop-down';
import GridRow from '@revin-utils/components/grid-row';
import ConfirmationModal from '@revin-utils/components/confirmation-modal';
import CustomAlertBar from '@revin-utils/components/custom-alert-bar';
import CancelIcon from '@material-ui/icons/Cancel';
import Divider from '@material-ui/core/Divider';
import { RVIcon } from '@revin-utils/assets';
import { FORM_LABELS, NOTIFICATION_TYPES } from '@revin-utils/utils';
import { ELEMENT_ID } from 'utils/test-ids';
import { useFormik } from 'formik';
import PropTypes from 'prop-types';
import { getPeriods, getProjectPeriods, getMonthAndYearLabel } from 'utils/commonFunctions';
import { ROLE_SELECTION_LABELS, DROPDOWN_TYPE, BTN_LABELS, ROLE_ACTION, ICONS, TYPE, DASH } from 'utils/constants';
import { getClientRoleByGroup, formatInFormik, getOrgRoleByGroup, findOrgRoles, getLocationsByClientRole,
  mapCitiesForCustomIcon, calculateAppliedCost } from './helper';
import styles from './RoleSelectionModal.module.scss';

const RoleSelectionModal = ({ handleClose, handleSubmit, metaDataState, modify, open, forecastingData, roleToModify, className, forecastType, viewMode}) => {
  const [filteredRoleGroups, setFilteredRoleGroups] = useState([]);
  const [clientRoles, setClientRoles] = useState([]);
  const [clientRoleGroup, setClientRoleGroup] = useState();
  const [orgRoles, setOrgRoles] = useState([]);
  const [orgRoleGroup, setOrgRoleGroup] = useState();
  const [locationGroups, setLocationGroups] = useState();
  const [locationTypes, setLocationTypes] = useState({});
  const [locations, setLocations] = useState([]);
  const [startPeriods, setStartPeriods] = useState([]);
  const [endPeriods, setEndPeriods] = useState([]);
  const [rolePeriodList, setRolePeriodList] = useState([]);
  const [confirmRoleDelete, setConfirmRoleDelete] = useState(false);
  const [showFTEErrorMessage, setShowFTEErrorMessage] = useState(null);
  const [startMonthYearLabel, setStartMonthYearLabel] = useState(null);
  const [endMonthYearLabel, setEndMonthYearLabel] = useState(null);
  const { roleModalError} = forecastingData;
  const data = modify ? roleToModify : {};

  const formik = useFormik({
    initialValues: formatInFormik(data)
  });

  useEffect(() => {
    const rolePeriods = forecastingData?.periodSummary?.length ? getProjectPeriods(forecastingData?.periodSummary) : getProjectPeriods(forecastingData?.forecastingPeriodSummary ?? forecastingData?.forecastPeriodSummary);
    if (rolePeriods?.length) {
      setPeriodOptions( rolePeriods, rolePeriods[0].id, rolePeriods[rolePeriods.length - 1].id );
      setRolePeriodList(rolePeriods);
    }
  }, [forecastingData?.periodSummary]);

  useEffect(() => {
    if (
      metaDataState?.rateRevisions?.length &&
      metaDataState?.clientRoles?.length &&
      metaDataState?.roleGroups?.length
    ) {
      const billRateAvailableClientIds = [
        ...new Set(metaDataState?.rateRevisions?.map((billRate) => billRate.clientRoleId))
      ];
      const billRateAvailableClientRoles = metaDataState?.clientRoles.filter(
        (clientRole) =>
          billRateAvailableClientIds.includes(clientRole.attributes.value) 
      );
      const billRateAvailableRoleGroupIds = [
        ...new Set(
          billRateAvailableClientRoles.map( (role) => role.attributes.roleGroupId )
        )
      ];
      const billRateAvailableRoleGroups = metaDataState?.roleGroups.filter(
        (roleGroup) => billRateAvailableRoleGroupIds.includes(roleGroup.id)
      );
      const billRateAvailableClientRoleGroups = getClientRoleByGroup(billRateAvailableClientRoles);
      setClientRoleGroup(billRateAvailableClientRoleGroups);
      setFilteredRoleGroups(billRateAvailableRoleGroups);
    }
  }, [
    metaDataState?.rateRevisions,
    metaDataState?.clientRoles,
    metaDataState?.roleGroups
  ]);

  useEffect(() => {
    if (metaDataState?.roles) {
      setOrgRoleGroup(getOrgRoleByGroup(metaDataState?.roles));
    }
  }, [metaDataState?.roles]);

  useEffect(() => {
    if (modify && metaDataState?.rateRevisions?.length && metaDataState?.locations?.length) {
      const locGroups = handleLocationTypes(formik.values.roleForm.clientRoleId);
      handleLocations(locGroups, formik.values.roleForm.locationType);
    }
    setStartMonthYearLabel(getMonthAndYearLabel(data?.startPeriodId));
    setEndMonthYearLabel(getMonthAndYearLabel(data?.endPeriodId));
  }, [modify, metaDataState?.rateRevisions, metaDataState?.locations]); 

  const onRoleGroupChange = (event) => {
    formik.resetForm();
    formik.setFieldValue('roleForm.roleGroupId', event.target.value);
    setClientRoles(clientRoleGroup[event.target.value]);
  };

  const onClientRoleChange = (event) => {
    const clientRoleId = event.target.value;
    formik.setFieldValue('roleForm.clientRoleId',  clientRoleId);
    formik.setFieldValue('roleForm.orgRoleId',  '');
    formik.setFieldValue('roleForm.locationType',  '');
    formik.setFieldValue('roleForm.locationId',  '');
    formik.setFieldValue('roleForm.billRate', 0);
    formik.setFieldValue('roleForm.costRate', 0);
    formik.setFieldValue('roleForm.inflation',  0);
    setOrgRole(clientRoleId, formik.values.roleForm.roleGroupId, null );
    handleLocationTypes(clientRoleId);
    setLocations([]);
  };

  const setOrgRole = useCallback((clientRoleId, roleGroupId, orgRoleId) => {
    const client = clientRoles.find( (client) => client.attributes.value === clientRoleId );
    const orgList = findOrgRoles(orgRoleGroup[roleGroupId], client);
    setOrgRoles(orgList);
    if (orgList?.length) {
      const found = orgList?.find(f => f.id === (orgRoleId || orgList[0].id));
      formik.setFieldValue('roleForm.orgRoleId', found?.id);
      formik.setFieldValue('extraFields.orgRoleDesc', found?.label);
      formik.setFieldValue('extraFields.roleDescription', found?.attributes?.description);
      formik.setFieldValue('extraFields.band', found?.attributes.band);
      handleCostCalculation({orgRoleId: found?.id, clientRoleId});
    }
  }, [clientRoles, orgRoleGroup]);

  const handleLocationTypes = useCallback((clientRoleId) => {
    const { groups, types } = getLocationsByClientRole( clientRoleId, metaDataState?.rateRevisions, metaDataState?.locations );
    setLocationTypes(types);
    setLocationGroups(groups);
    return groups;
  }, [metaDataState?.rateRevisions, metaDataState?.locations]);

  const onLocationTypeChange = (event) => {
    const locationType = event.target.value;
    formik.setFieldValue('roleForm.locationId', '');
    formik.setFieldValue('roleForm.locationType', locationType);
    formik.setFieldValue('extraFields.location', null);
    handleLocations(locationGroups, locationType);
    handleCostCalculation({locationId: null});
  };

  const handleLocations = (locGroups, locType) => {
    const locGroup = locGroups[locType];
    if (locGroup) {
      setLocations(mapCitiesForCustomIcon(locGroup, 'premium', 'attributes'));
    }
  };

  const onLocationChange = (event) => {
    const locationId = event.target.value;
    formik.setFieldValue('roleForm.locationId', locationId);
    if (locationId) {
      const location = locations.find((location) => location.id === locationId);
      formik.setFieldValue('extraFields.location', location);
      handleCostCalculation({locationId});
    }
  };

  const handleStartPeriodChange = (event) => {
    const period = event.target.value;
    formik.setFieldValue('roleForm.startPeriodId', period);
    formik.setFieldValue('roleForm.endPeriodId', '');
    const { periodEnd } = getPeriods( rolePeriodList, period, rolePeriodList[rolePeriodList.length - 1].id );
    setEndPeriods(periodEnd);
  };

  const handleEndPeriodChange = (event) => {
    const period = event.target.value;
    formik.setFieldValue('roleForm.endPeriodId', period);
  };

  const setPeriodOptions = (periodList, startPeriodId, endPeriodId) => {
    const { periodStart, periodEnd } = getPeriods( periodList, startPeriodId, endPeriodId );
    setStartPeriods(periodStart);
    setEndPeriods(periodEnd);
  };

  const hasError = (fieldName) => {
    return _get(formik?.touched, fieldName) && _get(formik?.errors, fieldName);
  };

  const handleCostCalculation = ({locationId, clientRoleId, orgRoleId}) => {
    const form = _cloneDeep(formik.values);
    const locId = locationId || form.roleForm.locationId;
    const cliRoleId = clientRoleId || form.roleForm.clientRoleId;
    const roleId = orgRoleId || form.roleForm.orgRoleId;
    if (form.roleForm.orgRoleId) {
      const costs = calculateAppliedCost(forecastingData?.currencyCode, locId, cliRoleId, roleId, metaDataState);
      formik.setFieldValue('roleForm.costRate', costs.costRate || 0);
      formik.setFieldValue('roleForm.billRate', costs.billRate || 0);
    }
  };

  const handleRoleDelete = () => {
    setConfirmRoleDelete(true);
  };

  const handleRoleConfirmModalCancel = () => {
    setConfirmRoleDelete(false);
  };

  const isAddBtnDisabled = useMemo(() => {
    return !(formik.values.roleForm.locationId && formik.values.roleForm.startPeriodId && formik.values.roleForm.endPeriodId && formik.values.roleForm.orgRoleId);
  }, [formik.values]);

  const handleConfirmDeleteRole = () => {
    handleSubmit({actionType: ROLE_ACTION.DELETE , values: formik.values});
  };

  const handleAddUpdateRole = () => {
    if (+formik.values?.roleForm?.currentAllocationFTE) {
      handleSubmit({actionType: modify ? ROLE_ACTION.EDIT : ROLE_ACTION.ADD, values: formik.values});
    } else {
      setShowFTEErrorMessage(true);
    }
  };

  const handleFteChange = (value) => {
    setShowFTEErrorMessage(false);
    formik.setFieldValue('roleForm.currentAllocationFTE', value);
  };

  const getErrorAlertBar = (errorMessage) => {
    return (
      <CustomAlertBar
        alertType={NOTIFICATION_TYPES.ERROR}
      >
        <div className="d-flex align-items-center">
          <CancelIcon />
          {errorMessage}
        </div>
      </CustomAlertBar>
    );
  };
  
  return (
    <>
      {open && 
        <SnapModal
          align="right"
          className={`main-modal ${styles.wrapper} ${className}`}
          disableBackdropClick
          dividers
          footerActions={
            <div className="w-100 d-flex align-items-center justify-content-between">
              <SnapButton
                handleClick={handleClose}
                id={ELEMENT_ID.ROLE_CANCEL}
                label={viewMode ? BTN_LABELS.Close : BTN_LABELS.CANCEL}
                name={BTN_LABELS.CANCEL}
                type={BTN_LABELS.SUBMIT}
                variant={FORM_LABELS.OUTLINED}
              />
              {
                !viewMode &&
              <div className="d-flex">
                {modify && (
                  <SnapButton
                    className="mr-1 error-button"
                    handleClick={handleRoleDelete}
                    id={ELEMENT_ID.ROLE_DELETE}
                    label={BTN_LABELS.DELETE}
                    name={BTN_LABELS.DELETE}
                    type={BTN_LABELS.SUBMIT}
                    variant={FORM_LABELS.OUTLINED}
                  />
                )}
                <SnapButton
                  disabled={isAddBtnDisabled}
                  handleClick={handleAddUpdateRole}
                  id={ELEMENT_ID.ROLE_ADD}
                  label={modify ? BTN_LABELS.CONTINUE : BTN_LABELS.ADD}
                  name={BTN_LABELS.ADD}
                  type={BTN_LABELS.SUBMIT}
                  variant={FORM_LABELS.CONTAINED}
                />
              </div>
              }

              {confirmRoleDelete &&
                <ConfirmationModal>
                  <div className={styles['confirmation-message']}>
                    <span className={styles['rounded-icon']}>
                      <RVIcon
                        icon={ICONS.INFO}
                      />
                    </span>
                    <div className={styles['confirmation-title']}>{ROLE_SELECTION_LABELS.dELETE_ROLE_CONFIRM_TITLE}</div>
                    <p className={styles['confirmation-desc']}>{ROLE_SELECTION_LABELS.DELETE_ROLE_CONFIRM_DESC}</p>
                    <Divider
                      className="my-4"
                      variant={FORM_LABELS.FULLWIDTH}
                    />
                    <div className="mt-5">
                      <SnapButton
                        className="mx-1"
                        handleClick={handleRoleConfirmModalCancel}
                        id={ELEMENT_ID.ROLE_DELETE_CANCEL}
                        label={BTN_LABELS.CANCEL}
                        name={BTN_LABELS.CANCEL}
                        type={BTN_LABELS.SUBMIT}
                        variant={FORM_LABELS.OUTLINED}
                      />
                      <SnapButton
                        className="mx-1"
                        handleClick={handleConfirmDeleteRole}
                        id={ELEMENT_ID.ROLE_DELETE_CONFIRM}
                        label={BTN_LABELS.CONFIRM}
                        name={BTN_LABELS.CONFIRM}
                        type={BTN_LABELS.SUBMIT}
                        variant={FORM_LABELS.CONTAINED}
                      />
                    </div>
                  </div>
                </ConfirmationModal>
              }
            </div>
          }
          fullWidth
          maxWidth={false}
          modalHeight="full"
          modalTitle={viewMode ? ROLE_SELECTION_LABELS.ROLE_DETAILS : modify ? ROLE_SELECTION_LABELS.MODIFY_ROLE : ROLE_SELECTION_LABELS.ADD_ROLES}
          name="Add roles"
          onClose={handleClose}
          open={open}
          scroll="paper"
        >
          <PerfectScrollbar>
            {(viewMode || modify) ? (
              <>
                <h5 className={`d-flex flex-column ${styles.designation}`} >
                  <span className={styles['org-role-label']}> {formik.values?.extraFields?.roleDescription} </span>
                  <small>{formik.values.extraFields?.locationValue}</small>
                </h5>
                {viewMode &&
                <div
                  className={`d-flex flex-column mt-2 ${styles.designation}`}
                >
                  <div className="d-flex align-items-center mb-05">{ROLE_SELECTION_LABELS.PERIOD}
                  </div>
                  <h4>{startMonthYearLabel} - {endMonthYearLabel}</h4>
                </div>
                }
              </>
            ) : (
              <div>
                {
                  !viewMode &&
                  <>
                    {roleModalError || showFTEErrorMessage && getErrorAlertBar(roleModalError || ROLE_SELECTION_LABELS.FTE_ALLOCATION_ERROR)}
                    <SnapDropdown
                      className="mb-2"
                      data={filteredRoleGroups}
                      handleChange={onRoleGroupChange}
                      id={ELEMENT_ID.ROLE_GROUP_ID}
                      label={ROLE_SELECTION_LABELS.SELECT_ROLE_GROUP}
                      name="roleForm.roleGroupId"
                      type={DROPDOWN_TYPE.DROPDOWN}
                      value={formik.values.roleForm.roleGroupId}
                    />

                    {formik.values.roleForm.roleGroupId && (
                      <SnapDropdown
                        className="mb-2"
                        data={clientRoles}
                        handleChange={onClientRoleChange}
                        id={ELEMENT_ID.CLIENT_ROLE}
                        label={ROLE_SELECTION_LABELS.SELECT_CLIENT_ROLE}
                        name="roleForm.clientRoleId"
                        type={DROPDOWN_TYPE.DROPDOWN}
                        value={formik.values?.roleForm.clientRoleId}
                      />
                    )}
                  </>
                }
              </div>
            )}
            {
              viewMode ?
                <div className={`mt-3 ${styles['role-info']}`}>
                  <div className={styles['role-details']}>
                    <div className={styles.value}>
                      <h4>{formik.values?.roleForm?.billRate || DASH}</h4>
                      <p>{ROLE_SELECTION_LABELS.BILL_RATE}</p>
                    </div>
                    <div className={styles.value}>
                      <h4>{formik.values?.roleForm?.costRate || DASH}</h4>
                      <p>{ROLE_SELECTION_LABELS.COST_RATE}</p>
                    </div>
                    <div className={styles.value}>
                      <h4>{`${formik.values?.roleForm?.inflation}%`|| DASH}</h4>
                      <p>{ROLE_SELECTION_LABELS.INFLATION}</p>
                    </div>
                  </div>
                </div>
                :
                <>
                  {formik.values.roleForm?.clientRoleId && formik.values.roleForm?.roleGroupId && (
                    <>
                      <Divider className="mt-3 mb-5" />
                      {!modify && <GridRow>
                        <Col xs={18}>
                          <SnapDropdown
                            className="mb-2 mr-4"
                            data={orgRoles}
                            handleChange={formik.handleChange}
                            id={ELEMENT_ID.UST_ROLE}
                            label={ROLE_SELECTION_LABELS.UST_ROLE}
                            name="roleForm.orgRoleId"
                            type={DROPDOWN_TYPE.DROPDOWN}
                            value={formik.values?.roleForm?.orgRoleId}
                          />
                        </Col>

                        <Col xs={6}>
                          <SnapCounter
                            handleChange={handleFteChange}
                            id={ELEMENT_ID.FTE}
                            initialValue={0}
                            isDecimal
                            name="roleForm.currentAllocationFTE"
                            stepCount={0.5}
                            value={formik.values?.roleForm?.currentAllocationFTE}
                          />
                        </Col>
                      </GridRow>}
                
                      <div className="d-flex">
                        <SnapDropdown
                          className="mb-2 mr-4"
                          data={locationTypes}
                          error={hasError('roleForm.locationType')}
                          handleChange={onLocationTypeChange}
                          id={ELEMENT_ID.LOCATION}
                          label={ROLE_SELECTION_LABELS.LOCATION}
                          name="roleForm.locationType"
                          type={DROPDOWN_TYPE.DROPDOWN}
                          value={formik.values?.roleForm?.locationType}
                        />

                        <SnapDropdown
                          className="mb-2"
                          data={locations}
                          error={hasError('roleForm.locationId')}
                          handleChange={onLocationChange}
                          id={ELEMENT_ID.CITY}
                          label={ROLE_SELECTION_LABELS.CITY}
                          name="roleForm.locationId"
                          type={DROPDOWN_TYPE.DROPDOWN}
                          value={formik.values?.roleForm?.locationId}
                        />
                      </div>
                
                      <div className="d-flex">
                        <SnapDropdown
                          className="mb-2 mr-4"
                          data={startPeriods}
                          error={hasError('roleForm.startPeriodId')}
                          handleChange={handleStartPeriodChange}
                          id={ELEMENT_ID.FROM}
                          label={ROLE_SELECTION_LABELS.FROM}
                          name="roleForm.startPeriodId"
                          type={DROPDOWN_TYPE.DROPDOWN}
                          value={formik.values?.roleForm?.startPeriodId}
                        />

                        <SnapDropdown
                          className="mb-2"
                          data={endPeriods}
                          error={hasError('roleForm.endPeriodId')}
                          handleChange={handleEndPeriodChange}
                          id={ELEMENT_ID.TO}
                          label={ROLE_SELECTION_LABELS.TO}
                          name="roleForm.endPeriodId"
                          type={DROPDOWN_TYPE.DROPDOWN}
                          value={formik.values?.roleForm?.endPeriodId}
                        />
                      </div>
                      {
                        forecastType !== TYPE.ACCOUNT_FORECASTING &&
                <GridRow>
                  <Col xs={12}>
                    <SnapTextbox
                      handleChange={formik.handleChange}
                      id={ELEMENT_ID.BILL_RATE}
                      label={ROLE_SELECTION_LABELS.BILL_RATE}
                      name="roleForm.billRate"
                      type={FORM_LABELS.OUTLINED}
                      value={formik.values?.roleForm?.billRate}
                    />
                  </Col>
                  <Col xs={12}>
                    <SnapTextbox
                      handleChange={formik.handleChange}
                      id={ELEMENT_ID.COST_RATE}
                      label={ROLE_SELECTION_LABELS.COST_RATE}
                      name="roleForm.costRate"
                      type={FORM_LABELS.OUTLINED}
                      value={formik.values?.roleForm?.costRate}
                    />
                  </Col>
                </GridRow>
                      }
                    </>
                  )}
                </>
            }
          </PerfectScrollbar>
        </SnapModal>
      }
    </>
  );
};

RoleSelectionModal.propTypes = {
  className: PropTypes.string,
  forecastType: PropTypes.string,
  forecastingData: PropTypes.object,
  handleClose: PropTypes.func,
  handleSubmit: PropTypes.func,
  metaDataState: PropTypes.object,
  modify: PropTypes.bool,
  open: PropTypes.bool,
  roleToModify: PropTypes.object,
  viewMode: PropTypes.bool
};

export default RoleSelectionModal;