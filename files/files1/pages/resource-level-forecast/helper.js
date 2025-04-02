import _omit from 'lodash/omit';
import { SKIP_PROPERTIES, RESOURCE_FORECASTING, ROLE_ACTION, TOAST_MESSAGES_SUFFIX, ROLE_SELECTION_LABELS, RESOURCE, GRID_CONSTANTS } from 'utils/constants';

export const getPreparedResourcePayloadData = (resource, resourceToModify) => {
  const restResourceData =  _omit(resource, [SKIP_PROPERTIES.ID, SKIP_PROPERTIES.BASE_LOCATION, SKIP_PROPERTIES.LOCATION_ID]);
  const { gradeCode, availableFte, locationCode, designation, email, periodFrom, periodTo,
    firstName, lastName, employeeId, userId, sourceId, status, employeeType, employmentType, ...rest } = restResourceData;

  const message = `${RESOURCE.RESOURCE_TEXT} ${resource?.firstName?.toUpperCase()} ${resource?.lastName?.toUpperCase()} (${resource?.employeeId}) ${resourceToModify ? TOAST_MESSAGES_SUFFIX.EDIT : TOAST_MESSAGES_SUFFIX.ADD}`;
  const metaData = getMetaData(RESOURCE_FORECASTING.RESOURCE_LABEL, resourceToModify ? ROLE_ACTION.EDIT : ROLE_ACTION.ADD);
  let payload = {};

  payload = {
    ...metaData,
    currentAllocationFTE: availableFte,
    band: gradeCode,
    startPeriodId: periodFrom,
    endPeriodId: periodTo,
    locationId: locationCode,
    orgRoleId: designation,
    employmentType,
    resourceData: { firstName, lastName, employeeId, email, userId, status, employeeType: employeeType || employmentType },
    ...rest
  };

  payload = resourceToModify ? { ...payload, sourceId } : { ...payload, resourceData: _omit(payload?.resourceData, [SKIP_PROPERTIES.EMPLOYMENT_TYPE]) };

  return {
    data: [payload],
    metadata: ['PERIOD_SUMMARY', 'FY_SUMMARY'],
    message
  };
};

export const getPreparedDeleteResourcePayloadData = ({ id, sourceId, lastName, firstName, employeeId }) => {
  const metaData = getMetaData(RESOURCE_FORECASTING.RESOURCE_LABEL, ROLE_ACTION.DELETE);
  const message = `${RESOURCE.RESOURCE_TEXT} ${firstName?.toUpperCase()} ${lastName?.toUpperCase()} (${employeeId}) ${TOAST_MESSAGES_SUFFIX.DELETE}`;
  return {
    data: [{ ...metaData, sourceId: sourceId || id }],
    message
  };
};

export const getPreparedRolePaylodData = (role, actionType) => {
  const { roleForm, extraFields } = role;
  const message = `${ROLE_SELECTION_LABELS.ROLE_TEXT} ${extraFields?.roleDescription?.toUpperCase()} ${TOAST_MESSAGES_SUFFIX[actionType]}`;
  const metaData = getMetaData(RESOURCE_FORECASTING.ROLE_LABEL, actionType);
  let payload = {};

  if (actionType === ROLE_ACTION.DELETE) {
    payload = {
      ...metaData,
      sourceId: extraFields?.id
    };
  } else {
    payload = {
      ...metaData,
      ...roleForm,
      band: extraFields?.band,
      roleDescription: extraFields?.roleDescription,
      roleType: 'role',
      revisedBillRate: roleForm?.billRate
    };

    payload = actionType === ROLE_ACTION.EDIT ? { ...payload, sourceId: extraFields?.id } : payload;
  };

  return {
    data: [payload],
    metadata: [GRID_CONSTANTS.META_TYPE.PERIOD_SUMMARY, GRID_CONSTANTS.META_TYPE.FY_SUMMARY],
    message
  };
};

const getMetaData = (type, actionType) => {
  return {
    payloadType: type,
    payloadSubType: actionType === ROLE_ACTION.ADD ? ROLE_ACTION.CREATE
      : actionType === ROLE_ACTION.EDIT ? ROLE_ACTION.EDIT : ROLE_ACTION.DELETE,
    timestamp: Date.now()
  };
};