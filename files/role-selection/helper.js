import _groupBy from 'lodash/groupBy';
import _map from 'lodash/map';
import _cloneDeep from 'lodash/cloneDeep';
import { buildDropDownOption, CURRENCIES, getConvertedCurrency} from '@revin-utils/utils';
import { NA } from 'utils/constants';
import { getPeriodDates, toTitleCase } from 'utils/commonFunctions';

export const formatInFormik = (data) => {
  return {
    roleForm : {
      roleGroupId: data?.roleGroupId || '',
      clientRoleId: data?.clientRoleId || '',
      orgRoleId: data?.orgRoleId || '',
      currentAllocationFTE: data?.currentAllocationFTE || 0,
      locationType: data?.locationType || '',
      locationId: data?.locationId || '',
      startPeriodId: data?.startPeriodId || '',
      endPeriodId: data?.endPeriodId || '',
      inflation: 0,
      costRate: data?.costRate || 0,
      billRate: data?.billRate || 0
    },
    extraFields : {
      location: data?.location || '',
      orgRoleDesc: data?.orgRoleDesc || '',
      roleDescription: data?.roleDescription || data?.orgRoleId || '',
      band: data?.band || '',
      id: data?.id || '',
      slNo:data?.slNo || '',
      locationValue: `${data?.countryCode || NA} - ${data?.locationValue || NA} ${data?.locationType ? toTitleCase(`(${data?.locationType?.toLowerCase()})`) : ''}`
    }
  };
};

export const getInitialPeriodState = (periodSummary, startDate, endDate) => {
  const startPeriod = periodSummary?.[0].periodId;
  const endPeriod = periodSummary?.[periodSummary?.length - 1].periodId;
  const periods = getPeriodDates( startPeriod, endPeriod, startDate, endDate );
  return periods;
};

export const getClientRoleByGroup = (clientRoles) => {
  const newRoles = buildDropDownOption(
    _cloneDeep(clientRoles),
    'attributes.description',
    'attributes.value'
  );
  return _groupBy(newRoles, 'attributes.roleGroupId');
};

export const getOrgRoleByGroup = (roles) => {
  return _groupBy(roles, 'attributes.roleGroupId');
};

export const getLocationTypes = (locations) => {
  const groups = _groupBy(locations, 'attributes.locationType');
  const types = _map(groups, (value, key) => ({
    label: key,
    id: key
  }));
  return { groups, types };
};

export const findOrgRoles = (groups, client) => {
  const orgList = [];
  if (client && groups?.length) {
    groups?.forEach((group) => {
      if (client.attributes.mappedRoles?.includes(group.id)) {
        orgList.push({
          ...group,
          id: group.attributes.value
        });
      }
    });
  }
  return orgList;
};

export const getLocationsByClientRole = (
  clientRoleId,
  rateRevisions,
  locations
) => {
  let newLocations = [];

  if (clientRoleId && rateRevisions && locations) {
    const locationIds = [];
    rateRevisions.forEach((revision) => {
      if (clientRoleId === revision.clientRoleId) {
        locationIds.push(revision.locationId);
      }
    });
    newLocations = locations.filter((location) =>
      locationIds.includes(location.attributes.code)
    );
  }

  return getLocationTypes(newLocations);
};

export const mapCitiesForCustomIcon = (locations, attribute, innerAttr) => {
  if (innerAttr) {
    return locations.map(location => {
      let newAttr = location[innerAttr];
      newAttr = {
        ...newAttr,
        showCustomIcon: !!getBooleanFromString(newAttr[attribute])
      };
      location[innerAttr] = newAttr;
      return location;
    });
  }
  else {
    return locations.map(location => ({
      ...location,
      showCustomIcon: !!getBooleanFromString(location[attribute])
    }));
  }
};

export const getBooleanFromString = (value) => {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value.toLowerCase() === 'true' ? true : false;
  }
};

export const calculateAppliedCost = (
  defaultCurrencyCode,
  locationId,
  clientRoleId,
  orgRoleId,
  metaDataState
) => {
  let billRate = getRateRevision(metaDataState.rateRevisions, {
    clientRoleId,
    locationId
  });
  let costRate = getCostRevision(metaDataState.costRevisions, {
    roleId: orgRoleId,
    locationId
  });

  billRate = convertCurrency(defaultCurrencyCode, metaDataState, billRate);
  costRate = convertCurrency(defaultCurrencyCode, metaDataState, costRate);

  return {
    billRate,
    costRate
  };
};


const getRateRevision = (rateRevisions, request) => {
  const rate = rateRevisions?.find(
    (revision) =>
      request.clientRoleId === revision.clientRoleId &&
      request.locationId === revision.locationId
  )?.rate;
  return rate || 0;
};

const getCostRevision = (costRevisions, request) => {
  const rate = costRevisions?.find(
    (cost) =>
      request.locationId === cost.locationId && request.roleId === cost.roleId
  )?.cost;
  return rate || 0;
};

const convertCurrency = (defaultCurrencyCode = CURRENCIES.USD, metaDataState, value) => {
  // The bill rate and cost rate will always be in USD from service.
  if ( defaultCurrencyCode !== CURRENCIES.USD ) {
    return getConvertedCurrency(
      metaDataState.currencyData?.list,
      metaDataState.currencyData?.revisions,
      CURRENCIES.USD,
      defaultCurrencyCode,
      value
    )?.value;
  }

  return value;
};
