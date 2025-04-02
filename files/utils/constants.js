import React from 'react';
import { uniqueId } from 'lodash';
import moment from 'moment-mini';
import { CELL_TYPES, FORM_LABELS} from '@revin-utils/utils';
import InfoTooltip from '@revin-utils/components/info-tooltip';
export const DESCRIPTION = 'description';
export const CUSTOM_CHIP_TYPE = {
  ERROR_BORDERED: 'error-bordered',
  BORDER_CLOSE: 'borderless-close',
  BORDERED: 'bordered',
  OUTER_BORDERED: 'outer-bordered'
};

export const FORECAST_VIEW = [
  'SUBMITTED',
  'FORWARDED'
];

export const FORECAST_VIEW_EDIT = [
  'IN_PROGRESS',
  'CAPTURED'
];

export const FORECAST_SUMMARY = {
  SUB_TITLE : 'This account is newly onboarded, so forecasting has not yet been done.',
  NO_DATA_FOUND: 'No data found!',
  FY_YEAR: 'Forecast Summary : FY'
};

export const DASHBOARD_TAB = {
  TITLE: 'Forecast-dashboard',
  URL: 'https://app.powerbi.com/reportEmbed?reportId=5388ab5e-60e8-4460-ba66-d902064c2e21&autoAuth=true&ctid=a4431f4b-c207-4733-9530-34c08a9b2b8d',
  PROD_URL: 'https://app.powerbi.com/reportEmbed?reportId=778dc09b-3db6-4982-9578-0a6205558ac4&autoAuth=true&ctid=a4431f4b-c207-4733-9530-34c08a9b2b8d',
  FORECAST_INFO_MSG: 'Future data will appear in the dashboard once the forecast is submitted via Revin.'
};

export const FORECAST_ACCOUNT = {
  FORECAST_PERIOD: 'Forecast Period'
};

export const SUMMARY_TYPE = {
  PERIODSUMMARY: 'PERIODSUMMARY',
  FYSUMMARY: 'FYSUMMARY'
};

export const SESSION_STORAGE_KEYS = {
  VERTICAL_DPDN: 'VERTICAL_DPDN',
  PARENT_ACCOUNT_DPDN: 'PARENT_ACCOUNT_DPDN',
  ACCOUNT_DPDN: 'ACCOUNT_DPDN',
  PROGRAM_DPDN: 'PROGRAM_DPDN',
  ENTITLEMENT_VIEW: 'ENTITLEMENT_VIEW',
  ACCOUNTS: 'ACCOUNTS',
  FORECAST_FILTER_CONDITIONS: 'FORECAST_FILTER_CONDITIONS',
  FORECAST_CYCLES: 'FORECAST_CYCLES',
  CUSTOM_GROUP_INFORMATION: 'CUSTOM_GROUP_INFORMATION',
  IS_REDIRECTED_FROM_FORECAST_SUMMARY: 'IS_REDIRECTED_FROM_FORECAST_SUMMARY'
};

export const VIEW_ONLY_ACCESS_ROLES = [
  'VERTICAL_HEAD', 
  'BUSINESS_FINANCE_MANAGER',
  'BUSINESS_FINANCE_GENERAL'
];

export const OPPORTUNITY_SELECTION_ACCESS_ROLES = [
  'ACCOUNT_MANAGER',
  'PROGRAM_MANAGER',
  'PROJECT_MANAGER',
  'ADMIN_PMO',
  'FORECAST_PMO'
];

export const PARENT_ACCOUNT_MANAGER = [
  'PARENT_ACCOUNT_MANAGER',
  'FINANCIAL_FORECAST_ADMIN'
];

export const USER_PERMISSION = {
  VIEW_PARENT_ACCOUNT_FORECAST_HOMEPAGE: 'VIEW_PARENT_ACCOUNT_FORECAST_HOMEPAGE'
};

export const featureFlagInitial = {'revenue-forecasting' : true};

export const TYPE ={
  PROJECT_FORECASTING : 'projectForecasting',
  RESOURCE_FORECASTING : 'resourceForecasting',
  ACCOUNT_FORECASTING : 'accountForecasting'
};
export const USER_STATUS = {
  INACTIVE : 'INACTIVE'
};
export const ORIGIN = {
  ROLE_MODAL_ORIGIN: 'ROLE_MODAL',
  RESOURCE_MODAL_ORIGIN: 'RESOURCE_MODAL',
  FORECAST_GRID_ORIGIN: 'FORECAST_GRID',
  PER_UNIT_REVENUE: 'PER_UNIT_REVENUE',
  COST_MODAL:'COST_MODAL',
  FIXED_BID_MODAL:'FIXED_BID_MODAL'
};
export const RECALCULATE = {
  info : 'Click the “Recalculate” button to see the numbers updated in the summary and table.',
  LABEL: 'Recalculate'
};
export const RESOURCE_GRID = {
  ADD_ROLE: 'Add Role',
  ADD_RESOURCE: 'Add Resource'
};
export const TOGGLE_SWITCH_LABEL = {
  Label: ['YES', 'NO']
};
export const CELL_DATA_TYPE = {
  EDITABLE : 'EDITABLE',
  NON_EDITABLE: 'NON_EDITABLE',
  NON_EXIST: 'NON_EXIST'
};
export const COMPONENT_TYPE = {
  PRIMARY: 'primary',
  DROPDOWN: 'dropdown'
};
export const SNAP_COMPONENT_CONSTANTS = {
  TABLE_CONTENT: 'table-content',
  HELP_MODAL_SEARCH: 'help-modal-search',
  POINTER: 'pointer',
  HELP: 'Help',
  OPPORTUNITY_TABLE_NAME: 'opportunity-table'
};
export const PRICING_VERSIONS_STATUS = {
  INVALID: 'INVALID',
  SUBMITTED_FOR_APPROVAL: 'SUBMITTED_FOR_APPROVAL',
  VALID: 'VALID',
  APPROVED: 'APPROVED'
};
export const BACK_TO_OPPORTUNITIES = 'Back to opportunities';
export const PUBLISHED = 'PUBLISHED';
export const FILE_TYPES = {
  DOCX: 'docx',
  PDF: 'pdf'
};
export const DATE_FORMAT = {
  FORMAT_1: 'DD MMM YYYY',
  FORMAT_2: 'YYYY-MM-DD HH:mm:ss:SSS',
  FORMAT_3: 'YYYY-MM-DDT00:00:00.000',
  FORMAT_4: 'DD-MM-YYYY',
  FORMAT_5: 'DD MMM',
  FORMAT_6: 'YYYY',
  FORMAT_7: 'MM-DD-YYYY',
  FORMAT_8: 'YYYY-MM-DD HH:mm:ss',
  FORMAT_9: 'DD/MM/YYYY',
  FORMAT_10: 'MMM DD YYYY',
  FORMAT_11: 'dddd',
  FORMAT_12: 'h:mm A',
  FORMAT_13: 'D MMM YYYY',
  FORMAT_14: 'MM',
  FORMAT_15: 'MMM',
  FORMAT_16: 'MMMM',
  FORMAT_17: 'YYYYMM'
};
export const ATTCHMENT_FILE_MAX_SIZE = 10240000;
export const INVALID_FILE_SIZE = 10240000102400001;
export const ACTIVE_ENTITY = 'ACTIVE_ENTITY';
export const COST = 'Manage Cost';
export const REVENUE = 'Revenue';
export const REVENUE_CRM= 'Revenue (CRM)';
export const COST_CRM= 'Cost (CRM)';
export const RESOURCE_SEARCH_OFFSET = '0';
export const RESOURCE_SEARCH_LIMIT = '5';
export const RESOURCE_SEARCH_SORTBY = 'employeeId';
export const RESOURCE_SEARCH_SORTBY_EMAIL = 'email';
export const REQUIRED_FIELD_TEXT = 'is a required field.';
export const MANAGE_REVENUE ='Manage Revenue';
export const FTE = 'FTE';
export const GPM = 'GPM';

export const PROJECT_LEVEL_CONSTANTS ={
  REVENUE: 'Revenue',
  COST: 'Cost',
  PROBABILITY :'Probability',
  UNWEIGHTED_REVENUE: 'Unweighted Revenue',
  WEIGHTED_REVENUE: 'Weighted Revenue',
  UNWEIGHTED_COST: 'Unweighted Cost',
  WEIGHTED_COST: 'Weighted Cost',
  unweightedRevenueKey: 'unweightedRevenue',
  unweightedCostKey: 'unweightedCost'
};

export const RESOURCE = {
  UNAVAILABLE_RESOURCE: 'No user found',
  SEARCH_USER_BY_UID: 'Select resource by UID/email',
  RESOURCE_SEARCH_BY_NAME_UID: 'Search resource by UID/email',
  BILL_RATE: 'Bill Rate',
  REVISED_BILL_RATE: 'Revised Bill Rate',
  REVISION_MONTH: 'Revision Month',
  COST_RATE: 'Cost Rate',
  INFLATION: 'Inflation%*',
  INFLATION_LABEL: 'Inflation',
  ANNIVESARY_MONTH: 'Anniversary Month',
  DELETE: 'Delete',
  ADD: 'Add Resource',
  MODIFY: 'Modify Resource',
  BILLING_DETAILS: 'Billing Details',
  COST_DETAILS: 'Cost Details',
  PERIOD_FROM: 'From*',
  PERIOD_TO: 'To*',
  ALLOCATION: 'Allocation*',
  DELETE_RESOURCE_MESSAGE: (
    <strong>Are you sure, you want to delete the resource from forecasting?</strong>
  ),
  EDIT_ACTION: 'EDIT',
  DELETE_ACTION: 'DELETE',
  ADD_RESOURCE: 'ADD',
  DELETE_RESOURCE_BY_QUICK_ACTION: 'DELETE_RESOURCE_BY_QUICK_ACTION',
  ARE_YOU_SURE: 'Are you sure?',
  USER_TYPE_EXTERNAL: 'EXTERNAL',
  USER_TYPE_CUSTOM: 'CUSTOM',
  PEOPLE_ALLOCATION_INFO: 'As per latest allocation information from PeopleSoft.',
  VIEW_MODE_ALLOCATION_INFO: 'Displays the time periods this resource will be assigned to work.',
  ALLOCATION_VALIDATION_ERROR: 'Allocation must be greater than 0.1 and less than or equal to 1',
  SAVE_CONTINUE: 'Save And Continue',
  RESOURCE_TEXT: 'Resource',
  PERIOD: 'Period',
  RESOURCE_DETAILS: 'Resource Details'
};

export const FORECASTING_DATA = {
  REVENUE:'Revenue',
  COST: 'Cost',
  COST_BUTTON_TEXT: 'Select Cost Method',
  REVENUE_BUTTON_TEXT: 'Select Revenue Method',
  REVENUE_AND_COST_BUTTON_TEXT: 'Select Revenue And Cost Method',
  ADJUSTMENT: 'Adjustments'
};

export const ERROR_CODE={
  FORECAST_GRID_ERROR_CODE:'6009-1046',
  DUPLICATE_ERROR_CODE:'6009-1020'
};

export const FORECAST_LEVEL_TAB = ['Opportunity Level', 'Account Level'];

export const CAP_RATE_CARD_TOGGLE_SWITCH_LABEL = {
  Label: ['ON', 'OFF']
};

export const OPTIONLIST = [
  {
    id: '1',
    label: 'Option 1'
  },
  {
    id: '2',
    label: 'Option 2'
  },
  {
    id: '3',
    label: 'Option 3'
  }
];

export const DLVRY_TYP = 'DLVRY_TYP';
export const SRVC_PRTFL = 'SRVC_PRTFL';
export const SRVC_LINE = 'SRVC_LINE';
export const PROVIDER = 'PROVIDER';
export const BLLNG_TYP = 'BLLNG_TYP';
export const TOAST_TYPES = { SUCCESS: 'success', ERROR: 'error' };
export const TOAST_MESSAGES_SUFFIX = { 
  ADD: 'is added successfully',
  EDIT: 'is updated successfully',
  DELETE: 'is deleted successfully',
  CREATED: 'is created successfully'
};

export const ROLE_SELECTION_LABELS = {
  ADD_ROLE: 'Add role',
  ADD_ROLES: 'Add Roles',
  MODIFY_ROLE: 'Modify Role',
  SELECT_ROLE_GROUP: 'Select Role Group',
  SELECT_CLIENT_ROLE: 'Select Client Role',
  UST_ROLE: 'UST Role *',
  LOCATION: 'Location *',
  CITY: 'City *',
  FROM: 'From*',
  TO: 'To*',
  ADD: 'Add',
  EDIT: 'Edit',
  BILL_RATE: 'Bill Rate',
  COST_RATE: 'Cost Rate',
  DELETE_ROLE_CONFIRM_TITLE: 'Are you sure?',
  DELETE_ROLE_CONFIRM_DESC: 'Are you sure, you want to delete the role from forecasting?',
  ROLE_TEXT: 'Role',
  FTE_ALLOCATION_ERROR: 'Enter FTE value for the role.',
  ROLE_DETAILS: 'Role Details',
  INFLATION: 'inflation (%)',
  PERIOD: 'Period'
};

export const ROLE_ACTION = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
  CREATE: 'CREATE',
  UPDATE_GRID: 'update-grid'
};

export const BTN_LABELS = {
  CANCEL: 'Cancel',
  ADD: 'Add',
  CONTINUE: 'Continue',
  DELETE: 'Delete',
  CONFIRM: 'Confirm',
  SUBMIT: 'Submit',
  SAVE: 'Save',
  UPDATE: 'Update',
  Close: 'Close',
  RESET: 'Reset',
  BACK: 'Back',
  SAVE_DRAFT: 'Save as draft',
  RESET_EXIT: 'Reset and exit',
  PROCEED:'Proceed',
  OK_GOT_IT: 'Ok, got it',
  CREATE: 'Create',
  UNGROUP: 'Ungroup'
};

export const DROPDOWN_TYPE = {
  MULTI_SELECT: 'multiselect',
  DROPDOWN: 'dropdown',
  AUTOCOMPLETE:'autocomplete'
};

export const PROJECT_FORECASTING_TYPE = {
  MILESTONE_BASED : 'Milestone Based',
  PER_UNIT: 'Per Unit',
  //first type (no need to show revenue modal for following type)
  FLAT_FEE_MONTHLY: 'Flat Fee Monthly',
  TIM_EXP: 'Time and Expense'
};

export const RESOURCE_FORECASTING = {
  CURRENCY: 'Currency is set as United States Dollar',
  FTE: 'FTE / Utilisation',
  REVENUE_COST: 'Revenue / Cost',
  RESOURCE_REVENUE: 'Resource revenue',
  OTHERS: 'Others',
  DIRECT_EXPENSE: 'Direct Expense',
  BILL: 'BILL',
  RATE_HR: 'RATE/Hr',
  BASE: 'COST',
  Total: 'TOTAL',
  Total_Resources : 'Total Resources',
  GROSS_PROFIT_MARGIN: 'Gross Profit Margin',
  RESOURCE_COST_TITLE: 'Resource Cost',
  RESOURCE_TOTAL_REVENUE: 'Total Revenue',
  RESOURCE_SGA_PERCENTAGE:'SG&A %',
  RESOURCE : 'Resources',
  ROLE : 'Roles',
  BACK_BUTTON_MODAL: (
    <strong>
    You have unsaved changes in this page. Going back will discard all modifications. 
      <br/> Are you sure you want to leave?
    </strong>
  ),
  FTE_TYPE: 'FTE',
  REV_TYPE: 'REV',
  UTLSN_TYPE: 'UTLSN',
  COST_TYPE: 'COST',
  RESOURCE_COST: 'Resource Cost',
  RESOURCE_REV: 'Resource rev',
  DIRECT_EXPENSE_KEY : 'directExpenses',
  PERCENTAGE_KEY: 'percentage',
  RESOURCE_LABEL : 'RESOURCE',
  ROLE_LABEL : 'ROLE',
  RESET_CONFIRM_MSG: (<>All changes made to the project including project configurations will be reset. <br/> Are you sure you want to proceed?</>),
  RESET_SUCCESS_MSG: 'You have reset successfully to the last saved values.',
  BACK_BTN_CONFIRM_MSG: (<strong>
    You are trying to go back from what you are currently doing. <br/>
    Are you sure you want to reset? All changes made since the last save will be lost.
  </strong>),
  DISMISS: 'Dismiss',
  FORECAST_DISMISS: 'Data as per the last forecast version displayed.'
};

export const PROJECT_FORECASTING = {
  INFLATION: 'INFLATION',
  HIRING_MONTH: 'HIRING MONTH',
  COST_TYPE: 'COST',
  COST_HR: 'RATE/Hr',
  COST_LABEL: 'Cost',
  CRM_PIP_LABEL: 'CRM/PIP',
  ALLOCATION: 'Allocation',
  MANAGE_COST_LABEL: 'Manage Cost',
  TITLE: 'Manage Revenue and Cost',
  REVENUE_TITLE:'Manage Revenue',
  PER_UNIT_LABEL: 'Per Unit',
  SELECT_UNIT: 'Select Unit',
  INCREMENTAL: 'Incremental',
  NON_INCREMENTAL: 'Non-Incremental',
  TABLE_TITLE: 'Table title',
  LOWER_LIMIT: 'Lower limit',
  UPPER_LIMIT: 'Upper limit',
  RATE_UNIT: 'Rate /unit',
  CRM_PIP: 'CRM_PIP',
  USER_ALLOCATION: 'USER_ALLOCATION',
  REVENUE_CRM_PIP: 'Revenue based on CRM or PIP',
  RESOURCE_COST: 'Resource Cost',
  FINAL_REVENUE: 'Final Revenue',
  FINAL_RESOURCE_COST: 'Final Resource Cost',
  REVENUE_$: 'Revenue ($)',
  AVG_RATE_$: 'Avg Rate ($)',
  POC_BASED: 'POC Based',
  ITD_REVENUE: 'ITD Revenue',
  ITD_COST: 'ITD Cost',
  PROJECT_TOTAL_COST: 'Project Total Cost',
  FORECAST_TCV: 'TCV',
  PROJECT_CONTROLS: 'Project Controls',
  INFO_MESSAGE : 'To compute the revenue based on Percentage of Completion method, enter all the project cost details below.',
  WEIGHTED_UNWEIGHTED_SUBHEADER: 'Weighted and Unweighted',
  UNWTD: 'UNWTD',
  WTD: 'WTD',
  POC_BASED_TYPE:'POC_BASED',
  MANAGE_COST_ALLOCATION_LABEL:'Manage cost (Allocation)',
  CRM_TABLE_TITLE: 'Select to fetch from CRM or PIP. PIP data used if available; otherwise, projections from CRM.',
  EXTERNAL_PER_UNIT_TABLE_TITLE: 'Enter numbers directly if you already maintain a Per Unit tracker for this project',
  EXTERNAL_POC_TITLE: 'Enter numbers directly if you already maintain a percentage of completion tracker for this project.',
  PER_UNIT_TABLE_TITLE:'Plan and compute your revenue and expenses using per unit approach',
  PLAN_PU_LABEL:'Plan PU',
  EXTERNAL_PU_LABEL: 'External PU',
  FINAL_COST: 'Final Cost',
  TOTAL_REVENUE: 'Total Revenue',
  TOTAL_COST:'Total Cost',
  isContinueClicked: 'isContinueClicked'
};

export const COST_REVENUE_TYPE = {
  POC_BASED : 'POC_BASED',
  CRM_PIP: 'CRM_PIP',
  PER_UNIT: 'PER_UNIT',
  EXTERNAL_PER_UNIT: 'EXTERNAL_PER_UNIT',
  USER_ALLOCATION: 'USER_ALLOCATION',
  TIME_AND_EXPENSE : 'TIME_AND_EXPENSE',
  EXTERNAL_POC: 'EXTERNAL_POC',
  EXTERNAL_POC_KEY: 'External POC'
};

export const RESOURCE_FIELDS = {
  FIRST_NAME: 'firstName',
  LAST_NAME: 'lastName',
  DESIGNATION: 'designation',
  GRADE_CODE: 'gradeCode',
  EMPLOYEE_ID: 'employeeId',
  BILL_RATE: 'billRate',
  REVISED_BILL_RATE: 'revisedBillRate',
  REVISED_MONTH: 'revisionMonth',
  COST_RATE: 'costRate',
  INFLATION: 'inflation',
  ANNIVERSARY_MONTH: 'anniversaryMonth',
  PERIOD_FROM: 'periodFrom',
  PERIOD_TO: 'periodTo',
  AVAILABLE_FTE: 'availableFte'
};
export const DONE = 'Done';
export const CONTINUE = 'Continue';
export const PROCEED = 'Proceed';
export const CANCEL = 'Cancel';
export const MODIFY_SELECTION = 'Modify Selection';
export const VIEW_SELECTION = 'View Selection';
export const CONFIRM = 'Confirm';
export const ADHOC_OPP_CREATION= ' Opportunity';
export const BREADCRUMB_OPP_SUB_TITLE= <>
Home &gt; <span>Opportunities selection</span>
</>;
export const BREADCRUMB_OPP_TITLE= 'Opportunities';
export const BREADCRUMB_FORECAST_SUMMARY_TITLE= 'Forecast Summary';
export const CHOOSE_FORECAST_TITLE = 'Choose Forecasting';
export const opportunityTableHeader = () => {
  return([
    { 
      id: 'opportunity',
      label: <div className="cell-header">Opportunity name & ID</div>
    },
    {
      id:'billingType',
      label:<div className="cell-header">Billing type</div>
    },
    {
      id: 'source',
      label: <div className="cell-header">Source</div>
    },
    {
      id: 'salesStage',
      label: <div className="cell-header">Sales stage</div>
    },
    {
      id: 'mrr',
      label: <div className="cell-header">Unweighted MRR FY24</div>
    },
    {
      id: 'tcv',
      label: <div className="cell-header">TCV</div>
    },
    {
      id: 'startDate',
      label: <div className="cell-header">Start date</div>
    },
    {
      id: 'endDate',
      label: <div className="cell-header">End date</div>
    },
    {
      id: 'projectManager',
      label: <div className="cell-header">Project manager</div>
    },
    {
      id: 'override',
      label: <div className="cell-header">Probability %
        <InfoTooltip
          infoContent={
            'Probability updates limited to forecasting scope only, not CRM.'
          }
        />
      </div>
    },
    // TODO: Commenting out will need in future: Custom Groups
    // {
    //   id: 'phase',
    //   label: <div className="cell-header">Phase</div>
    // },
    {
      id: 'checkbox',
      label: <div className="cell-header">Include</div>
    },
    {
      id: 'edit',
      label: <div className="cell-header"/>
    }
  ]);
};

export const TOGGLE_FILTER_HOVER = 'You can modify the FTE allocation in the table when you are in the FTE view. Other views are read only.';
export const EMP_TYPE = {
  EMP_TYPE_KEY: ['CONTRACTOR', 'CONTRACT', 'CONTIGENTWORKER', 'CONTINGENTWORKER'],
  EMP_TYPE_VALUE: 'Contigent worker',
  ROLE_TYPE: 'Contractor',
  EMP_ROLE_KEY : 'Role'
};
export const OTHERS_INFO = 'All service charges and revenue reversals as applicable';
export const SHOW_SIGNED_CONTRACT = 'Hide contract signed';
export const EDIT = 'Edit';
export const DELETE = 'Delete';
export const MODIFY= 'Modify';
export const AD_HOC = 'AD_HOC';
export const PROJECT_SOURCE_NAME = {
  INTERNAL: 'Internal',
  ADHOC: 'Ad-hoc',
  CRM: 'CRM'
};

export const CONTROLS_LABEL = {
  HEADER_LABEL: 'Controls',
  HEADER_DESC: 'Below are the project controls based on the locations you have selected. Please review and continue.',
  MAIN_ERROR_MESSAGE: 'Please correct the following errors and try again',
  UTILISATION_INFO: 'Enter the expected resource utilisation % per month for each location',
  CONTROLS_SUCCESS: 'Forecast controls updated successfully.',
  ACTION_DISCARDED: 'discarded',
  ACTION_MODIFIED: 'modified',
  ACTION_ADDED: 'added',
  ORG: 'ORG',
  CLIENT: 'CLIENT',
  HOLIDAYS_LINK: '+ Holidays',
  UTILISATION_LINK: 'View/Modify',
  ADD_LOCATION: '+ Location',
  UNEQUALLY: 'Multiple Values',
  MODIFY_HOLIDAYS_BACK: 'Modify Holidays',
  ADD_HOLIDAY: 'Add Holiday',
  EMPTY_CLIENT_HOLIDAYS_MSG: 'You have not added any client holidays yet',
  UST_HOLIDAYS: 'UST Holidays',
  CLIENT_HOLIDAYS: 'Client Holidays',
  HOLIDAY_DATE_LABEL: 'Holiday Date *',
  HOLIDAY_NAME_LABEL: 'Holiday Name *',
  HOLIDAY_DATE: 'holidayDate',
  HOLIDAY_NAME: 'holidayName',
  CONTROLS_TABLE: 'project-controls-table',
  ADD_LOCATION1: 'Add Location',
  ADD_LOC_SUBTITLE: 'Locations are not available. You can add locations manually',
  NO_LOCATION_FOUND: 'No Location Found!',
  WORKING_HRS_DAY_LABEL: 'Working hrs/day *',
  WORKING_HRS_MONTH_LABEL: 'Working hrs/month *',
  SEARCH_LOCATION_LABEL: 'Search Location',
  LOCATION: 'location',
  UTILISATION_LABEL: 'Utilisation (%) *',
  UTILISATION: 'utilisation',
  UTILISATION_BACK_LINK: 'Utilisation (%)',
  CONTROL_CONFIRM_MODAL_TITLE: 'Recomputing in Progress!',
  CONTROL_CONFIRM_MODAL_MSG_1: 'Your forecast setting have been saved.',
  CONTROL_CONFIRM_MODAL_MSG_2: 'Recomputing now. Please wait before making any changes.',
  CONTROLS_INFO_MSG_1: 'Changes will affect the project\'s forecasted values, but individual resource modifications remain unaffected.',
  CONTROLS_INFO_MSG_2: 'Changes will update all project configurations under this account. Modifications at the project or individual resource level will remain unaffected.'
};

export const WORK_HOURS = {
  DAILY: {
    MIN: 1,
    MAX: 24
  },
  MONTHLY: {
    MIN: 1,
    MAX: 744
  }
};

export const UTILISATION_LIMIT = {
  MIN: 0,
  MAX: 100
};

export const FORECAST_CONTROLS_HEADERS = {
  DAILY_WORKING_HOURS: 'Working hrs/day',
  MONTHLY_WORKING_HOURS: 'Working hrs/month',
  CITY: 'City',
  UTILISATION: 'Utilisation',
  HOLIDAYS: 'Holidays',
  ACTION: 'action'
};

export const FORECAST_CONTROLS_COL_KEYS = {
  COL_ACTION_ICON: 'actionIcon',
  COL_CITY: 'locationValue',
  COL_DAILY_WORKING_HOURS: 'dailyWorkingHours',
  COL_MONTHLY_WORKING_HOURS: 'monthlyWorkingHours',
  COL_UTILISATION: 'utilisationMap',
  COL_HOLIDAYS: 'holidayList'
};

export const FORECAST_CONTROLS_KEYS = {
  UTILISATION: 'utilisationMap',
  OVERRIDED_DAILY_WORKING_HOURS: 'overridedDailyWorkingHours',
  OVERRIDED_MONTHLY_WORKING_HOURS: 'overridedMonthlyWorkingHours'
};

export const CONTROLS_ALERT_LIST = [
  {
    id: FORECAST_CONTROLS_COL_KEYS.COL_DAILY_WORKING_HOURS,
    detail: `Invalid entry: Working hours per day cannot be 0 or exceed ${WORK_HOURS.DAILY.MAX} hours. Please provide a valid value.`
  },
  {
    id: FORECAST_CONTROLS_COL_KEYS.COL_MONTHLY_WORKING_HOURS,
    detail: `Invalid entry: Working hours per month cannot be 0 or exceed ${WORK_HOURS.MONTHLY.MAX} hours. Please provide a valid value.`
  },
  {
    id: FORECAST_CONTROLS_COL_KEYS.COL_UTILISATION,
    detail: `Invalid entry: Utilisation (%) cannot be exceed ${UTILISATION_LIMIT.MAX}. Please provide a valid value.`
  },{
    id:FORECAST_CONTROLS_COL_KEYS.COL_CITY,
    detail:'There already exists forecast controls for the selected location'
  }
];

export const ALERT_CONFIGURATION= {
  ALERT_TYPE:{
    BORDERED:'bordered-list',
    ERROR_BORDERED:'error-bordered',
    ERROR_BORDERED_LIST:'error-bordered-list',
    SOLID_ERROR:'solid-error'
  },
  ERROR_TYPE:{
    ALERT_LIST:'alertList',
    ERROR_LIST:'errorList'
  },
  MULTIPLE_FORECAST_ERRORS:'There are some errors noticed. Please review',
  DUPLICATE_RECORDS_FOUND: 'Duplicate records found for',
  PLEASE_VERIFY: 'Please verify.',
  ASSOCIATES:'associate(s)',
  DEFAULT_DUPLICATE_ERROR:'User already assigned to the project. Verify the details'
};

export const NA = 'NA';
export const tempAccountID = '60cfa2d1ec2d9877883466c7';
export const BACK = 'Back';
export const OPP_STATE = 'OPEN';
export const OPP_STAGE = 'OPPORTUNITY_IDENTIFIED';
export const OPP_CURR_SITUTATION= 'In progress';
export const OPP_SOLUTION = 'Solution';
export const INITIAL_OPP_STAGE = 'OPPORTUNITY_IDENTIFIED';
export const CONFIRMATION_MODAL_TITLE = 'Are you sure?';
export const CONFIRMATION_MODAL_AD_HOC_DESCRIPTION = 'You are attempting to delete the ad hoc project from the list. If you proceed, the forecasted data will be lost.Please confirm or cancel to return.';
export const CONFIRMATION_MODAL_CRM_INTERNAL_SOURCE_DESCRIPTION = 'You are about to delete a manually added project from the list. If you proceed, the forecasted data will be lost. Confirm to proceed or Cancel to return.';
export const EXCLUSION_MODAL_SUBTITLE = 'Reason for exclusion';
export const EXCLUSION_MODAL_TITLE = 'Exclude opportunity';
export const ADHOC_OPP_MODAL_TITLE = 'Add Adhoc opportunities';
export const EDIT_OPP_MODAL_TITLE = 'Edit Adhoc opportunities';
export const PROJECT_NAME = 'Project Name *';
export const ACCOUNT_LABEL = 'Account *';
export const EST_CLOSURE_DATE='Est. Closure date *';
export const CLIENT_CONTACT = 'Client contact *';
export const PROJECT_MANAGERS = 'Project Manager(s) *';
export const EST_START_DATE = 'Est. Start Date *';
export const EST_END_DATE = 'Est. End Date *';
export const NEED_SOLUTION = 'Need / Potential Solution *';
export const MAX_SERVICE_LINE = 5;
export const PRIMARY_SERVICE_LINE = 'Service Line *';
export const DELIVERY_TYPE = 'Delivery Type *';
export const BILLING_TYPE = 'Billing Type *';
export const BUSINESS_PORTFOLIO = 'Business Portfolio *';
export const PRIMARY_PROVIDER = 'Provider *';
export const DESCRIPTION_LABEL = 'Description *';
export const EST_REVENUE = 'Est. Revenue *';
export const EST_COST = 'Est. Cost *';
export const PROGRAM='Program *';
export const AUTO_HIDE_DURATION = 6000;
export const forecastControlAccountId = '60cfa2d1ec2d9877883466c7';
export const DRAFT_PROJECT_TOOLTIP = 'A draft version is available. Save the final numbers to keep the forecast up-to-date.';
export const OPP_TYPE = {
  PARENT:'PARENT',
  AD_HOC: 'AD_HOC',
  ADHOC: 'Adhoc',
  OTHERS: 'Others',
  CUSTOM_CANDIDATE: 'custom-candidate',
  COMPLETED_PROJECT: 'completed-project'
};
export const ICONS = {
  PENCIL: 'pencil',
  INFO: 'info'
};
export const OPP_CHOOSE_FORECAST_DROPDOWN = [
  {
    id: '1',
    label: 'All opportunities'
  },
  {
    id: '2',
    label: 'Completed opportunities only'
  },
  {
    id: '3',
    label: 'Not completed opportunities only'
  }
];
export const SELECTED_OPP_TITLE = 'Selected opportunities';
export const SELECTED_OPP_SUB_TITLE = 'Choose the desired forecasting method and initiate the forecasting process for the project by clicking the Forecast button.';
export const ALL_OPP = 'All opportunities';
export const FORECAST_TAB = [{ label: 'Project' }, { label: 'Resource' }];
export const RESOURCE_LEVEL_FORECAST='RESOURCE_LEVEL_FORECAST';
export const PROJECT_LEVEL_FORECAST='PROJECT_LEVEL_FORECAST';
export const CHANGE_FORECAST_WARNING= 'You are attempting to change the forecasting type for this opportunity. If you proceed, the forecasted data will be lost. Please confirm or cancel to return.';
export const DELETED= 'deleted';
export const CREATED= 'created';
export const EDITED= 'edited';
export const SIGNED_CONTRACT_STAGE = ['Contract signed' , 'Execution completed'];
export const FORECAST = 'Forecast';
export const USD = 'USD';
export const CHOOSE_FORECAST_SUBTITLE= <>
              Home &gt; Opportunities selection &gt;{' '}
  <span>Choose forecasting</span>
</>;
export const ACCOUNT_LEVEL_FORECASTING_BREADCRUMD_SUBTITLE = <>
Home &gt; <span>Account level forecasting</span>
</>;
export const ACCOUNT_LEVEL_FORECASTING_TAB_VALUES = ['Project Level Rolled Up', 'Sales', 'GnA'];
export const MONTHS_STRING = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];
export const CURRENT_WEEK = 'Current Week';
export const KPI_HEADER = {
  name: 'KPI',
  id: 50,
  type: 'header'
};
export const RESOURCE_PROJECT_LEVEL_SUMMARY = [
  [{
    type: 'blank-space',
    id: uniqueId()
  }],
  [{
    value: 'Total Revenue',
    type: 'role',
    uid: 'totalRevenue'
  }],
  [{
    value: 'Resource Cost',
    type: 'role',
    uid: 'finalResourceCostOtherCostSum'
  }],
  [{
    value: 'Direct Expenses',
    type: 'role',
    uid: 'directExpense', 
    accountUid :'investmentDE'
  }],
  [{
    value: 'Gross Margin',
    type: 'role',
    subType: 'total',
    uid: 'grossMargin'
  }],
  [{ 
    value: 'Gross Margin%',
    type: 'role',
    subType: 'total',
    uid: 'grossMarginPercentage',
    isPercentage: true
  }]
];

export const ACCOUNT_LEVEL_SUMMARY = [
  [{
    type: 'blank-space',
    id: uniqueId()
  }],
  [{
    value: 'Total Revenue',
    type: 'role',
    uid: 'totalRevenue'
  }],
  [{
    value: 'Resource Cost',
    type: 'role',
    uid: 'finalResourceCostOtherCostSum'
  }],
  [{
    value: 'Direct Expenses',
    type: 'role',
    uid: 'investmentDE',
    infoTooltip: 'includes COR investments'
  }],
  [{
    value: 'Gross Margin',
    type: 'role',
    subType: 'total',
    uid: 'grossMargin'
  }],
  [{ 
    value: 'Gross Margin%',
    type: 'role',
    subType: 'total',
    uid: 'grossMarginPercentage',
    isPercentage: true
  }],
  [{
    value: 'Expense SGnA',
    type: 'role',
    uid: 'sgnaCost'
  }],
  [{
    value: 'Adj. EBITDA',
    type: 'role',
    subType: 'total',
    uid: 'adjEbitda'
  }],
  [{
    value: 'Adj. EBITDA%',
    type: 'role',
    subType: 'total',
    uid: 'adjEbitdaPercentage',
    isPercentage: true
  }],
  [{
    type: 'blank-space',
    id: uniqueId()
  }],
  [{
    value: 'Corporate OH',
    type: 'role',
    uid: 'corporateOHAmout'
  }],
  [{
    value: 'Corporate OH %',
    type: 'role',
    uid: 'corporateOHPercentage',
    isPercentage: true
  }],
  [{
    value: 'Vertical OH',
    type: 'role',
    uid: 'verticalOHAmout'
  }],
  [{
    value: 'Vertical OH %',
    type: 'role',
    uid: 'verticalOHPercentage',
    isPercentage: true
  }],
  [{
    type: 'blank-space',
    id: uniqueId
  }],
  [{
    value: 'Net. EBITDA',
    type: 'role',
    subType: 'total',
    uid: 'netEbitda'
  }],
  [{
    value: 'Net. EBITDA%',
    type: 'role',
    subType: 'total',
    uid: 'netEbitdaPercentage',
    isPercentage: true
  }]
];

const splitCellDollarPercentage = [{
  value: '$',
  subValue: '%',
  type: 'cost-split-cell-label',
  pID: uniqueId()
}];

export const HORIZONTAL_SPLIT_CELL_SUMMARY = [
  [{
    value:  'Total Revenue',
    type: 'role',
    uid: 'totalRevenue',
    hideControls: true
  },{
    value: '',
    pID: uniqueId(),
    type: 'label-row',
    subType:'label-cell'
  }],
  [{
    value:  'Resource Cost',
    type: 'role',
    uid: 'finalResourceCostOtherCostSum',
    hideControls: true
  },
  {
    value: '',
    pID: uniqueId(),
    type: 'label-row',
    subType:'label-cell'
  }],
  [{
    value:  'Direct Expenses',
    type: 'role',
    uid: 'directExpense',
    subUID: 'directExpensePercentage',
    hideControls: true
  },
  ...splitCellDollarPercentage
  ],
  [{
    value:  'Gross Profit Margin',
    type: 'role',
    subType: 'total',
    uid: 'grossMargin',
    subUID: 'grossMarginPercentage',
    hideControls: true
  },
  ...splitCellDollarPercentage]
];

export const HORIZONTAL_SPLIT_CELL_SUMMARY_ACCOUNT = [
  [{
    value:  'Total Revenue',
    type: 'role',
    uid: 'totalRevenue',
    hideControls: true
  },{
    value: '',
    pID: uniqueId(),
    type: 'label-row',
    subType:'label-cell'
  }],
  [{
    value:  'Resource Cost',
    type: 'role',
    uid: 'finalResourceCostOtherCostSum',
    hideControls: true
  },
  {
    value: '',
    pID: uniqueId(),
    type: 'label-row',
    subType:'label-cell'
  }],
  [{
    value: 'Direct Expenses',
    type: 'role',
    uid: 'investmentDE',
    subUID: 'investmentDEPercentage',
    hideControls: true,
    infoTooltip: 'Investments included'
  },
  ...splitCellDollarPercentage
  ],
  [{
    value:  'Gross Profit Margin',
    type: 'role',
    subType: 'total',
    uid: 'grossMargin',
    subUID: 'grossMarginPercentage',
    hideControls: true
  },
  ...splitCellDollarPercentage],

  [{
    value:  'SG&A',
    type: 'role',
    uid: 'sgnaCost',
    subUID: 'sgnaPercentage',
    hideControls: true
  },
  ...splitCellDollarPercentage
  ],
  [{
    value:  'Net EBITDA',
    type: 'role',
    uid: 'netEbitda',
    subUID: 'netEbitdaPercentage',
    hideControls: true
  },
  ...splitCellDollarPercentage
  ]
];

export const CONST_ROW_VALUES = { type: 'cost', pID: 'jwig1900x0'};
export const PROJECT_SUMMARY_BREADCRUMB_SUBTITLE = {
  HOME: <>Home &gt; Opportunities selection &gt; </>,
  ACCOUNT_HOME: <>Home &gt; </>, 
  SUMMARY: <span> Summary </span>
};

export const DURATION = {
  QUARTER : {
    low: 'quarter',
    upper: 'Quarter',
    text: 'Quarter Trends Here'
  },
  MONTHLY: {
    low: 'month',
    upper: 'Monthly',
    text: 'Monthly Trends Here'
  },
  TREND: 'trend'
};

export const CHOOSE_FORECASTING_BREADCRUMBS = {
  BREADCRUMB_HOME: 'Home',
  BREADCRUMB_OPP_SELECTION: 'Opportunities selection',
  BREADCRUMB_CHOOSE_FORECASTING: 'Choose forecasting'
};

export const PROJECT_FORECASTING_BREADCRUMBS = {
  BREADCRUMB_HOME: 'Home',
  BREADCRUMB_OPP_SELECTION: 'Opportunities Selection',
  BREADCRUMB_CHOOSE_FORECASTING: 'Choose Forecasting',
  BREADCRUMB_RESOURCE_LEVEL: 'Resource Level Forecasting', 
  BREADCRUMB_SUMMARY : 'Summary',
  BREADCRUMB_PROJECT_LEVEL:'Project Level Forecasting',
  BREADCRUMB_ACCOUNT_LEVEL :'Account Level Forecasting',
  BREADCRUMB_FORECASTING: 'Forecasting'
};

export const MONTHS = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12
};
export const FORECASTING_SELECTION_ROUTE = 'forecasting-selection';
export const CUSTOM_GROUP = 'custom-group';

export const PROJECT_FORECAST ='projectForecasting';
export const FORECASTING_HOME = 'forecast-dashboard';

export const PROJECT_LEVEL_FORECASTING_COLUMNS  = (billingType) => [
  {
    name:'',
    subName:'',
    id:50,
    type: billingType === PROJECT_FORECASTING_TYPE.MILESTONE_BASED ? CELL_TYPES.HEADER : CELL_TYPES.HEADER_TOGGLE
  },
  {
    name: PROJECT_FORECASTING.COST_TYPE,
    id:51,
    type: CELL_TYPES.HEADER,
    subName: PROJECT_FORECASTING.COST_HR
  },
  {
    name: PROJECT_FORECASTING.INFLATION,
    id:52,
    type: CELL_TYPES.HEADER,
    subName: '(%)'
  },
  {
    name: PROJECT_FORECASTING.HIRING_MONTH,
    id:53,
    type: CELL_TYPES.HEADER,
    subName:''
  },
  {
    name:'',
    id:54,
    type:CELL_TYPES.HEADER_LABEL,
    subName:''
  }
];

export const PROJECT_LEVEL_PRE_MONTH_HEADER = [
  {
    name: '',
    subName: '',
    id: 57,
    type: CELL_TYPES.HEADER_SECONDARY,
    subType: CELL_TYPES.ROLE
  },
  {
    name: '',
    subName: '',
    id: 58,
    type: CELL_TYPES.HEADER_SECONDARY,
    subType: CELL_TYPES.COST
  },
  {
    name: '',
    subName: '',
    id: 59,
    type: CELL_TYPES.HEADER_SECONDARY,
    subType: CELL_TYPES.COST
  },
  {
    name:'',
    subName:'',
    id:60,
    type: CELL_TYPES.HEADER_SECONDARY,
    subType: CELL_TYPES.COST
  }
];

export const INVESTMENT_MODAL = {
  ARE_YOU_SURE: 'Are you sure?',
  DELETE_MESSAGE: 'Are you sure, you want to delete this Investment?',
  MODIFY_INVESTMENT: 'Modify Investment',
  ADD_INVESTMENT : 'Add Investment',
  ADD_COR_INVESTMENT : 'Add COR Investment',
  INVESTMENT_CATEGORY: 'Investment Category *',
  EXPENSE_NAME: 'Enter Investment Category *',
  COST: 'Cost Per Month*',
  FROM: 'From *',
  TO: 'To *',
  USD: 'USD',
  OTHERS_CODE: 'OTHERS',
  INVESTMENT_CATEGORY_LABEL: 'INVESTMENT_CATEGORY',
  FIELDS: {
    INVESTMENT_CATEGORY: 'investmentCategory',
    EXPENSE_NAME: 'expenseName',
    PERIOD_FROM: 'periodFrom',
    PERIOD_TO: 'periodTo',
    COST: 'cost'
  },
  ERROR: 'Cost must be number value and should not be zero or negative.',
  CHARS_REGEX: '/^[0-9]+$/',
  INSIDE_MODAL_DELETE: 'INSIDE_MODAL_DELETE'
};

export const UNIT_TYPES = [
  {
    id: 'MEMBERS',
    label: 'Members',
    header: 'No. of members',
    field: 'noOfUnits'
  },
  {
    id: 'TRANSACTIONS',
    label: 'Transactions',
    header: 'No. of transactions',
    field: 'noOfUnits'
  },{
    id: 'UNITS',
    label: 'Units',
    header: 'No. of units',
    field: 'noOfUnits'
  },{
    id: 'TICKETS',
    label: 'Tickets',
    header: 'No. of tickets',
    field: 'noOfUnits'
  }
];

export const REVENUE_ALERT_LIST = [
  {
    id: 'rate_err',
    detail: 'The rate/unit should be valid entry.'
  },
  {
    id: 'first_row_err',
    detail: 'The lower limit for the first row should be 0.'
  },
  {
    id: 'lower_limit_err',
    detail: 'The lower limit should be valid entry.'
  },
  {
    id: 'lower_limit_1_err',
    detail: 'The lower limit should be valid and greater than Upper limit of the previous row by 1.'
  },
  {
    id: 'upper_limit_err',
    detail: 'The upper limit should be valid and greater than Lower limit.'
  },
  {
    id:'cell_valid_err',
    detail:'Limits not specified for the value:'
  }
];


export const SERVICE_ALLOCATION_THRESHOLD=100;

export const COLUMN_TYPE = {
  TEXTBOX: 'textbox'
};

export const ENTITY_TYPE = {
  ACCOUNT: 'ACCOUNT'
};

export const ACCOUNT_DROPDOWN = {
  PARENT_ACCOUNT: 'Parent Account',
  ACCOUNT: 'Account',
  PROGRAM: 'Program',
  VERTICAL: 'Vertical'
};

export const FORECAST_DELIVERY_TYPE ={
  STAFF_AUGMENTATION:'Staff Augmentation',
  MANAGED_SERVICES:'Managed Services',
  MANAGED_CAPACITY:'Managed Capacity',
  FIXED_BID:'Fixed Bid',
  OUTCOME_BASED:'Outcome Based'
};

export const FORECAST_BILLING_TYPE = {
  PER_UNIT :'Per Unit',
  MILESTONE_BASED :'Milestone Based',
  TIME_AND_EXPENSE : 'Time and Expense'
};

export const FORECAST_TYPE ={
  RESOURCE_FORECASTING:'resource-forecasting',
  PROJECT_FORECASTING:'project-forecasting',
  ACCOUNT_FORECASTING: 'Account-forecasting'
};

export const FINANCIAL_YEAR = {
  FY: 'FY',
  YEAR: '24'
};

export const ACCOUNT_LEVEL_CONSTANTS = {
  DIRECT_EXPENSE_LABEL: 'Direct Expenses',
  DIRECT_EXPENSE_ID: 'directExpense',
  INVESTMENT_LABEL: 'Investments',
  OTHER_COR_INVESTMENT_LABEL: 'Other COR Investments',
  INVESTMENT_ID: 'investment',
  TOTAL_DIRECT_EXPENSE: 'Total Direct Expenses',
  TOTAL_INVESTMENT: 'Total Investment',
  INVESTMENTS_COST_KEY: 'investmentCost',
  DIRECT_EXPENSE_AMOUNT_KEY : 'amout',
  INVESTMENT_PER: 'investmentCostPercentage',
  DIRECT_PER: 'directExpensePercentage',
  PROJECT_ROLLED_UP: 'Project Level Rolled Up',
  OTHER: 'Other Direct Expenses',
  PROJECT_ROLLED_UP_KEY: 'PROJECT_ROLLED_UP',
  OTHER_KEY: 'OTHER',
  PERIOD_DETAILS_LIST: 'periodDetailsList',
  NET_EDIDTA_LABEL:'Net. EBITDA',
  SGA_LABEL: 'SG&A',
  REVENUE_LABEL: 'Revenue',
  RESOURCE_COST_TITLE : 'Resource Cost',
  GROSS_MARGIN : 'Gross Profit Margin',
  SALES_COMPENSATION_LABEL: 'Sales compensation',
  SALES_COMPENSATION_ID: 'salesCompensation',
  OTHER_SALES_EXP_LABEL: 'Other sales expenses',
  OTHER_SALES_EXP_ID: 'otherSalesExpenses',
  OTHER_SALES_EXP: 'otherSalesExp',
  OTHER_GNA_EXP: 'otherGnaExp',
  ACCOUNT_LABEL: 'Account',
  SEATS_LABEL: 'seats',
  HEAD_COUNT_LABEL: 'Head Count',
  UTLSN_LABEL: 'utlsn',
  COST_LABEL: 'cost',
  GROUP_NAME: 'row-title-lite-with-gap',
  GROUP_NAME_BOLD: 'row-title-bold',
  SALES_ID: 'salesId',
  GNA_ID: 'gnaId',
  SEATS_COST_LABEL: 'Seat cost',
  DELETE_INVESTMENT_MODAL_MSG: 'Are you sure, you want to delete the investment from forecasting?',
  HEAD_COUNT_KEY: 'headCount',
  OTHERS: 'Others',
  TOTAL_SEAT_COST: 'Total Seat Cost'
};

export const SALES_AND_GNA_CONSTANT = [
  [
    {
      label: 'Sales Compensation',
      id: 'salesCompensationsRoles'
    },
    {
      label: 'Other Sales Expenses',
      id: 'otherSalesExp'
    }
  ],
  [
    {
      label: 'GnA Compensation',
      id: 'gnaCompensationsRoles'
    },
    {
      label: 'Other GnA Expenses',
      id: 'otherGnaExp'
    },
    {
      label: 'Seat Cost (Location wise breakup)',
      id: 'seatCostList'
    }
  ],
  [
    {
      label: 'Total Sales Compensation',
      id : 'salesTotalCost',
      controls : true,
      nonEditable: true
    },
    {
      catergoryDescription: 'salesCategoryDescription',
      label: 'Total Other Sales Expenses',
      id : 'otherSalesTotal',
      other: true,
      nonEditable: true
    }
  ],
  [
    {
      label: 'Total GNA Compensation',
      id : 'gnaTotalCost',
      controls : true,
      nonEditable: true
    },
    {
      catergoryDescription: 'gnaCategoryDescription',
      label: 'Total Other GNA Expenses',
      id : 'otherGnaTotal',
      other: true,
      nonEditable: true
    }
  ]
];

export const ACCOUNT_GRID_EXPENSES_LABEL = {
  SALES: 'salesCategoryDescription',
  GNA: 'gnaCategoryDescription'
};

export const DUPLICATE_HOLIDAY = {
  DUPLICATE_HOLIDAY_ERROR_MESSEGE : 'Holiday exists for the selected date. Please verify'
};
export const CELL_FLAG = {
  IMPORTANT: 'IMPORTANT'
};

export const COST_VARIANCE = (costVariance) => {
  return(
    <div>
      Cost variance of ${costVariance} based on entered completion percentage
    </div>
  );};

export const FORECASTING_SUMMARY = {
  PROJECT: 'project-forecasting-summary',
  RESOURCE: 'resource-forecasting-summary',
  ACCOUNT: 'account-forecasting-summary'
};

export const PROJECT_SUMMARY_CONSTANTS = {
  SUMMARY: 'Summary',
  CURRENCY_TEXT: 'Currency is set as United States Dollar',
  GROSS_PFT_MARGIN: 'Gross Profit Margin'
};

export const ADJUSTMENT_THRESHOLD_PEAKED='Your entered value is higher than usual.';
export const MANAGERS = {
  ACCOUNT: 'Account Manager',
  PROJECT: 'Project Manager',
  ENTITY: 'ACCOUNT'
};

export const DATE_ERRORMSGS = {
  endDateGreater: 'Est. end date cannot be greater than Est. closure date',
  startDateGreater: 'Est. start date cannot be greater than Est. end date or Est. closure date',
  endDateGreaterThanstartDate: 'Est. end date should be greater than Est. start date',
  closureDateGreaterThanStartDate: 'Est. closure date should be greater than Est. start date'
};
// eslint-disable-next-line no-useless-escape
export const ESCAPE_NUMBER = /\,/g;

export const PERCENTAGE_ERROR = 'Attention: verify the cost variance based on the entered completion percentage.';

export const SUMMARY_BREADCRUMBS = {
  RESOURCE: ' Resource level forecasting ',
  PROJECT: ' Project level forecasting ',
  ACCOUNT: ' Account level forecasting '
};
export const FORECAST_DASHBOARD_CONSTANTS = {
  VIEW_ALL: 'View all',
  ALL: 'All',
  RECENT: 'Recent',
  FORECAST: 'Forecasts',
  FILTER: 'filter',
  OPPORTUNITY_FILTER_BUTTON: 'opportunity-filter-button',
  CONFIRM_MODAL_TITLE: 'Confirm forecast submission',
  SUBMIT_CONFIRM_MSG: 'You’re about to submit the forecast for review. Upon submission, the forecast would be locked for further updates. Please confirm to finalise and submit.',
  SUBMISSION_TITLE: 'Confirm Submission',
  GROSS_PROFIT_MARGIN: 'Gross Profit Margin',
  NET_EBIDTA: 'Net EBITDA',
  REVENUE: 'Revenue',
  DIRECT_EXPENSE: 'Direct Expenses',
  RESOURCE_COST: 'Resource Cost',
  EXPENSE_SGA: 'Expense SG&A',
  FORECAST_SUBMIT_SUCCESS: 'Forecasting is submitted successfully',
  NEW: 'NEW',
  NUMERIC: 'numeric',
  FORCAST_SUBMIT_REMINDER: 'Reminder: Submit forecasts for review by Thursday, 5pm IST for accurate forecast reporting.',
  SUBMIT_STATUS: 'SUBMITTED',
  IN_PROGRESS_STATUS: 'IN_PROGRESS',
  REVIEW_FORECAST: 'Review forecast',
  VIEW_ALL_HISTORICAL_CARDS_LIMIT: 52,
  HISTORICAL_CARDS_LIMIT: 4,
  HISTORICAL_CARDS_PAGE_NO: 0,
  FORECAST_BTN_LABEL: 'Forecast',
  MODIFY_SUBMISSION: 'Modify Submission',
  CONFIRM_MODIFY_SUBMISSION_TITLE: 'Confirm modify submission',
  MODIFY_SUBMISSION_MODAL_MSG: 'Are you sure you want to modify the submitted forecast for this week? Upon confirmation, users with modification privileges will be able to make changes to the forecast data.',
  FORECAST_MODIFY_SUBMISSION: 'The forecast is now unlocked for updates. Don’t forget to submit your changes on time!',
  FORECAST_SUBMIT: 'SUBMIT',
  FORECAST_REOPEN: 'REOPEN',
  UPDATED_LABEL: 'Updated:',
  SUBMITTED_LABEL: 'Submitted:',
  VH_BFM_WIP_MESSAGE: 'Work-in-progress forecast numbers for this week.',
  NOTES_SUCCESS_MESSAGE: 'Notes added successfully.',
  NOTES_UPDATED_MESSAGE: 'Notes updated successfully',
  ACCOUNT_MANAGER: 'ACCOUNT_MANAGER',
  NOTES_ERROR_MSG: 'Please enter valid notes',
  NOTES_MAXIMUM_LENGTH_ERROR_MSG: 'Maximum allowed character length is 255'
};

export const FORECAST_DASHBOARD_SUMMARY = {
  INFO: 'All values are in USD'
};

export const FORECAST_ACCOUNT_SUMMARY = { ACCOUNT_LEVEL_SUMMARY : 'account-forecasting-summary'};

export const CHOOSE_FORECASTING_SUMMARY_STRINGS = {
  TOTAL_REVENUE : 'Total Project Revenue',
  RESOURCE_COST : 'Project Resource Cost',
  DIRECT_EXPENSE : 'Project Direct Expenses',
  GROSS_PROFIT_MARGIN : 'Project Gross Profit Margin',
  TOTAL_OPPS: 'Total Opportunities'
}; 
export const ROUTES = {
  FORECAST_SELECTION: '/forecasting-selection',
  FORECAST_DASHBOARD: '/forecast-dashboard',
  FORECAST_DASHBOARD_VIEW_ALL_FORECAST: '/forecast-dashboard/view-all-forecast'
};

export const OPPORTUNITY_NEW_DEAL = 'New deal';
export const OPPORTUNITY_COMPLETED = 'Completed';

export const PROBABILITY_MODAL = {
  MODIFY_PROB_INFO: 'You can modify the probability, which in turn affects the projected weighted revenue/cost.',
  PROBABILITY_LABEL: 'Probability',
  PROBABILITY_FIELD: 'probabilityOverride',
  MODIFY_PROBABILITY: 'Modify probability',
  TOOLTIP_CONTENT: 'The value has been applied, and the revenue/cost has been changed accordingly.',
  RV_ICON_PENCIL: 'pencil',
  MRR_LABEL: `MRR (FY${moment().format('YY')})`,
  TCV_LABEL: 'TCV',
  SALES_STAGE_LABEL: 'Sales stage',
  START_DATE_LABEL: 'Starts date',
  END_DATE_LABEL: 'End date',
  PROBABILITY_ERROR: 'Probability value must be number',
  CRM: 'CRM'
};

export const CHOOSE_FORECAST_SUMMARY_TOOLTIP = 'Includes resource cost, travel and asset cost and any other type of costs like partner cost, capital charges etc.';

export const OPPORTUNITY_SEARCH_PLACEHOLDER='Find Opportunity by Name or ID';

export const FORECAST_OPPORTUNITY_SEARCH='forecast-opportunity-search';
export const FORECAST_OPPORTUNITY_DASHBOARD_SEARCH='opportunity-dashboard-search';

export const OPPORTUNITY_SEARCH = {
  LABEL : 'Enter Resource/Role Name or Employee ID',
  NAME  : 'Enter resource/role name or employee ID',
  LABEL_CHOOSE_FORECASTING : 'Enter Project Name/ID (Min. 3 Characters)',
  NAME_CHOOSE_FORECASTING  : 'Enter project name/ID (min. 3 Characters)'
};

export const EMPTY_SCREEN_MESSAGE={
  TITLE:'No Records Found!',
  SUBTITLE:'We couldn’t find what you are looking for.'
};

export const EMPTY_SCREEN_MESSAGE_NO_DATA ={
  TITLE: 'No Records Found',
  SUBTITLE:'Get started by adding the roles/resources.',
  VARIENT:'contained',
  LABEL:'Add Resource',
  ROLE : 'Add Role',
  TYPE:'outlined'
};

export const VIEW = 'View';
export const RESOURCE_LABEL = 'Resource';
export const PROJECT_LABEL = 'Project';

export const DATES_LABELS = {
  START_DATE: 'Start Date',
  END_DATE: 'End Date'
};

export const BACK_TO_HOME = 'Back to home';
export const FORECASTING_SUMMARY_LABEL = '* Final Net EBITDA might fluctuate due to portfolio overhead adjustments.' ;

export const MAX_NUMBER_LIMIT = 999999999999;

export const EXCLUDE_OPPORTUNITY_SUCCESS_MSG = 'has been successfully excluded!';

export const FORECAST_CANDIDATES = {
  ACCOUNT_FORECAST_CANDIDATES:'account-forecast-candidates',
  PROJECT_FORECAST_CANDIDATES:'project-forecast-candidates'
};

export const CURRENCY_USD = 'USD';
export const CURRENCY = 'Currency';

export const ADJUSTMENT_THRESHOLD_KEY = 'FORECAST_REVENUE_ADJUSTMENT_THRESHOLD_LEVEL';

export const IST_TEXT = 'IST';

export const OPP_ID_LABEL = 'Opportunity ID';

export const PROJECT_DETAILS = {
  PROJECT_NAME: 'Project Name',
  PROJECT_ID:'Project ID',
  PROJECT_DURATION:'Project Duration',
  PROJECT_DELIVERY_TYPE :'Delivery Type',
  PROJECT_BILLING_TYPE :'Billing Type',
  PROJECT_TCV :'TCV',
  GROUP_NAME: 'Group Name',
  GROUP_MRR: 'MRR',
  NUMBER_OF_OPPORTUNITIES: 'Number Of Opportunities'
};

export const FORECAST_CHART_CONFIG ={
  LINEAR:'linear',
  LINE:'line',
  BAR:'bar',
  CUSTOM:'custom',
  MONTHLY_TRENDS:'Monthly Trends',
  QUARTERLY_TRENDS:'Quarterly Trends',
  NET_EBITDA:'Net EBITDA',
  GPM:'GPM',
  FORECAST_TRENDS:'Quarterly Financials',
  STATUS_TWO:'#881e87',
  STATUS_LIGHT:'#f3f6f7',
  STATUS_FIVE:'#dbd3bd',
  STATUS_FOUR:'#0097ac',
  EMPTY_SCREEN_TITLE:'No Records Found',
  EMPTY_SCREEN_SUBTITLE:'We couldn’t find what you are looking for.',
  MONTHLY_TRENDS_ID:'monthly-trends',
  QUARTERLY_TRENDS_ID:'quarterly-trends',
  CURRENT_QUARTER:'currentQuarter',
  CURRENT_MONTH:'currentMonth'
};

export const FORECAST_REVENUE_EBITDA_LEGEND=[{label:'Actuals',barLegend:'Revenue',lineLegend:'Net EBITDA %'},{label:'Forecast',barLegend:'Revenue',lineLegend:'Net EBITDA %',className:'alt-legend'}];
export const FORECAST_REVENUE_GPM_LEGEND=[{label:'Actuals',barLegend:'Revenue',lineLegend:'GPM %'},{label:'Forecast',barLegend:'Revenue',lineLegend:'GPM %',className:'alt-legend'}];

export const CHOOSE_FORECAST_EMPTY_SCREEN ={
  SUBTITLE:'No Active Project/Opportunities Found For The Account',
  TITLE:'No Data Found!'
};

export const DATA_GRID_CONTROL_CELL = {
  TOTAL_COLUMN_ID: 'totalColumnId',
  TYPE : {
    READONLY: 'dynamic-readonly',
    TEXT: 'text',
    CUSTOM_NUMBER: 'custom-number',
    DYNAMIC_HEADER: 'dynamic-header',
    HEADER: 'header'
  },
  CLASS: {
    EXTRA_BORDER_BOTTOM: 'extra-border-bottom',
    NEW_RESOURCE_STATUS: 'new-resource-status',
    NEW_ROLE_STATUS: 'new-role-status',
    CROSSOVER_TOOLTIP_ACTIVE: 'crossover-tooltip-active',
    DISABLED_CELL: 'disabled-cell',
    TEXT_DISABLED: 'text-disabled',
    GROUP_HEADER: 'group-header'
  }
};

export const ACCOUNT_TOTAL_LABEL = 'Direct Expense & COR Investment';

export const ADD_OTHERS_PROJECT_MODAL = {
  MODAL_TITLE: 'Add Other Project',
  SEARCH_MANAGER: 'search-manager',
  SEARCH_MANAGER_TEXT: 'Search By Name or Email',
  PROJECT_MANAGER: 'Project Manager(s)',
  PROJECT_NAME_TEXT: 'Project Name',
  OTHER_PROJECT: 'OTHER_PROJECT',
  SEARCH_PLACEHOLDER: 'Search By Project ID or Name ( Enter Minimum 3 Characters )',
  SEARCH_LABEL: 'Search Project ID or Name',
  NO_RESULT: 'No Results Found'
};

export const GENERIC_ERROR_MESSAGE = 'Unexpected Error Occurred! Please contact the product support/team for details.';

export const TIME_DELAY = {
  TIME_DELAY_1000 : 1000
};

export const GRAPH_BUFFER_VALUE=1.2;

export const OPPORTUNITY_SOURCE={
  ADHOC:'Adhoc',
  CRM:'CRM',
  INTERNAL:'Internal'
};

export const BILLING_TYPE_ERROR={
  code:'BLLNG_TYP_ALERT',
  detail:'Billing type missing for opportunity; Select one to proceed.'
};
export const  BILLING_DROPDOWN={
  DELIVERY_TYPE_DATA:'deliveryTypeData',
  BILLING_TYPE_DATA:'billingTypeData',
  BILLING_TYPE:'BLLNG_TYP',
  TIME_AND_EXPENSE:'T&E'
};
export const COR_INVESTMENT_INCLUDED='includes COR investments';
export const CROSSOVER_MONTH_SUBTYPE='header-tooltip';
export const CROSSOVER_MONTH_TOOLTIP='Actuals post revenue recognition for the period are pending. Current display reflects previously projected values';
export const TOOLTIP_STORAGE_KEY = 'CROSSOVER_TOOLTIP_OPEN';

export const GRID_CONSTANTS = {
  TOGGLE_SWITCH_CELL: 'toggleSwitchCell',

  SORT_TYPE: {
    ASC: 'asc',
    DESC: 'desc'
  },

  DATA_TYPE: {
    OBJECT: 'object',
    STRING: 'string'
  },

  TABS: {
    FTE_BILLABLE_HRS: 'FTE / Billed Hours',
    REVENUE_COST: 'Revenue / Cost',
    GPM: 'GPM',
    COST:'Cost'
  },

  KEY: {
    BILL_RATE: 'revisedBillRate',
    COST_RATE: 'costRate',
    FTE: 'fte',
    BILLABLE_HOURS: 'billableHours',
    BILLABLE_HOURS_COLOR: 'billableHoursColor',
    PERCENTAGE: 'percentage',
    REVENUE: 'revenue',
    COST: 'cost',
    AMOUT: 'amout',
    GPM: 'gpm',
    GROSSMARGIN: 'grossMargin',
    GPM_PERCENTAGE: 'grossMarginPercentage',
    GPM_PERCENTAGE_COLOR: 'gpmPercentageColor',
    GROSS_MARGIN_PERCENTAGE: 'grossMarginPercentage',
    FINAL_RESOURCE_COST:'finalResourceCost'
  },

  PAYLOAD_TYPE: {
    RESOURCE: 'RESOURCE',
    OTHER_EXP: 'OTHER_EXP',
    DIRECT_EXP: 'DIRECT_EXP',
    GROSS_MARGIN: 'GROSS_MARGIN'
  },
  
  PAYLOAD_SUBTYPE: {
    BILLABLE_HRS: 'BILLABLE_HRS',
    REVENUE: 'REVENUE',
    COST: 'COST',
    EXPENSE: 'EXPENSE',
    PERCENTAGE: 'PERCENTAGE',
    GROSSMARGIN: 'GROSSMARGIN'
  },

  TITLE: {
    OTHERS_REVENUE: 'Revenue - Others',
    OTHERS_COST: 'Cost - Others',
    DIRECT_EXPENSES_$: 'Direct Expenses $',
    DIRECT_EXPENSES_PERCENT: 'Direct Expenses %',
    GROSS_PROFIT_MARGIN_$: 'Gross Profit Margin $',
    GROSS_PROFIT_MARGIN_PERCENT: 'Gross Profit Margin %',
    FTE: 'FTE',
    BILLABLE_HOURS: 'Billed Hours' ,
    REVENUE: 'Revenue',
    COST: 'Cost',
    GPM_$: '$',
    GPM_PERCENT: '%',
    COST_RATE:'Cost Rate/',
    HOUR:'Hr'
  },

  CLR_TXT_CLS: {
    Amber: 'text-attention',
    Red: 'text-error'
  },

  CLR_BG_CLS: {
    Amber: 'text-bg-attention',
    Red: 'text-bg-error'
  },

  META_TYPE: {
    PERIOD_SUMMARY : 'PERIOD_SUMMARY',
    FY_SUMMARY: 'FY_SUMMARY'
  },
  HEADER_KEY: {
    FINAL_RESOURCE_COST_OTHER_COST_SUM: 'finalResourceCostOtherCostSum',
    TOTAL_REVENUE: 'totalRevenue'
  },

  IMMED_ACTION_REQ: 'Immediate action required',
  ATTENTION_NEEDED: 'Attention needed',
  BILL_RATE_HEADER: 'Bill Rate/',
  COST_RATE_HEADER: 'Cost Rate/',
  HR: 'Hr',
  OTHERS_INFO_MSG: 'All service charges and revenue reversals as applicable'
};

export const FILTER_OPPORTUNITES = {
  SALES_STAGE_LABEL: 'Sales Stage*',
  PARENT_ACCOUNT_NAME : 'parentAccountId',
  ACCOUNT_NAME : 'accounts',
  PROGRAM_NAME : 'programs',
  SALES_STAGE_NAME : 'salesStages',
  SOURCE_NAME : 'projectSources',
  DELIVERY_TYPE_NAME : 'deliveryType',
  BILLING_TYPE_NAME : 'billingType',
  PROJECT_MANAGER_NAME : 'projectManager',
  INCLUDE_CLOSED_PROJECTS : 'includeCompletedProjects',
  SOURCE_LABEL: 'Source*',
  INCLUDE_CLOSED_PROJECTS_LABEL: 'Include completed projects',
  RESET_FILTER: 'Reset Filter',
  DROPDOWN_ALL_VALUE: 'all',
  FILTER: 'Filter',
  COMPLTED_PROJECTS_INFO_TEXT: 'Project considered completed if end date is in past.',
  MANDATORY_VALIDATION_MESSAGE: 'Required fields must be filled in to proceed'
};

export const OPPORTUNITY_MAX_COUNT_REACHED = 'You have reached the end of the opportunities list.';
export const OPPORTUNITY_DASHBOARD_LIMIT = 20;

export const PROJECT_LEVEL_ERROR_MESSAGE={
  SELECT_REVENUE_METHOD: 'Select a revenue method in order to move ahead.',
  SELECT_COST_METHOD: 'Select a cost method in order to move ahead.',
  SELECT_REVENUE_COST_METHOD: 'Select a revenue/cost method in order to move ahead.'
};

export const PROJECT_LEVEL_BANNER_MESSAGE={
  COST_REVENUE_METHOD:'Select Revenue & Cost Method',
  BANNER_BODY:'You have to select revenue and cost method in order to see the values'
};
export const EXCEL_DOWNLOAD_SPLIT_STRING = 'filename="%s"';
export const ALLOCATION_TABLE_WARNING='Once you have selected Allocation, you will not be able to go back CRM/PIP';

export const FORECAST_CONTROL_TYPES = {
  PROJECT_CONTROLS: 'projectControls',
  FORECAST_CONTROLS: 'forecastControls',
  RESOURCE_CONTROLS:'resourceControls'
};
export const NO_LABEL_TEXT = 'No Label';

export const PROJECT_STAGE = {
  CONTRACT_SIGNED: 'CONTRACT_SIGNED'
};
export const ACTIVE_DELIVERY_TYPE='ACTIVE';

// eslint-disable-next-line react/no-multi-comp
export const SEARCH_RESULTS = (showing, total) => {
  return(
    <div> Showing <strong>{showing}</strong> of <strong>{total}</strong> candidates</div>
  );
};

export const OPPORTUNITY_MODIFY_PROJECT_STAGE_CONTRACT = 'contract signed';

export const OPPORTUNITY_SELECTION_TOOL_TIP = 'List includes active projects and pipeline opportunities';

export const CURRENCY_STANDARD = 'Currency is set as USD';

export const CUSTOM_GROUP_MODAL = {
  SEARCH_NO_OPTIONS_TEXT: 'Search by project ID or name ( Enter minimum 3 characters )',
  BILLING_TYPE_ERROR: 'Billing type mismatch, cannot add to group',
  PROJECT_MANAGER_MISMATCH_ERROR: 'Grouping not allowed as different project managers are assigned to one or more projects selected',
  ACCOUNT_MISMATCH_ERROR: 'Selected project belongs to a different account',
  PROGRAM_MISMATCH_ERROR: 'Selected project belongs to a different program',
  DELETE_INFO_MSG: 'Projects cannot be removed from the group once created. To manage them individually, please ungroup and forecast separately.',
  GROUP_NAME_ERROR: 'The custom group name exceeds permissible character limits of 30 characters.',
  UNWEIGHTED_MRR_LABEL: 'Unweighted MRR',
  TCV_LABEL: 'TCV',
  PROBABILITY_LABEL: 'Probability',
  DELIVERY_TYPE_LABEL: 'Delivery type',
  BILLING_TYPE_LABEL: 'Billing type',
  SALES_STAGE_LABEL: 'Sales stage',
  START_DATE: 'Start date',
  END_DATE: 'End date',
  MODIFY_GROUP: 'Modify group',
  CREATE_GROUP: 'Create group',
  DISMISS: 'Dismiss',
  GROUP_NAME: 'Group name',
  SEARCH_TEXT: 'Search Project ID or Name',
  ADDED_CANDIDATES: 'Added candidates',
  DELETE_MODAL_TITLE: 'Proceed to ungroup these projects ?',
  CUTSOM_GROUP_MANAGER_PERMISSION_MSG: 'All the project managers mapped to these projects will have access to the group and associated project details.',
  NO_OPPORTUNITIES_FOUND: 'No Project/Opportunities found.',
  ITEM_ADDED_ERROR_MSG: 'Selected project has already been added.'
};

export const CURRENCY_DOLLAR_ICON = ' $';

export const NO_FILE_SCREEN_CONSTANTS = {
  SCREEN_TITLE: 'No Data Found',
  SCREEN_SUBTITLE: 'No CRM/PIP Data For Adhoc Opportunity.',
  SCREEN_SECONDARY_TITLE: 'Continue to enter values manually or choose another method.'
};

export const BILLING_TYPE_MISSING_MESSAGE = 'Please update the billing type in CRM to enable forecasting for this opportunity.';
export const BILLING_TYPE_MISSING_TITLE = 'Billing Type Missing.';
export const CONST_MESSAGES = {
  SAVE_AS_DRAFT: 'Forecast data as per the last saved draft version displayed.',
  REVISED_BILL_RATE : 'Default bill and cost rates are based on last month’s actuals. If unavailable, update rates for individual resources until actuals are available.'
};
export const TRANSITION = 'transition';
export const PROJECT = 'PROJECT';
export const COMMENTS = 'Comments';
export const DASH = '-';
export const LOAD_MORE = 'Load more';

export const MODAL_TYPE = {
  DELETE_CUSTOM_GROUP: 'DELETE_CUSTOM_GROUP',
  EMPTY_BILLING_TYPE: 'EMPTY_BILLING_TYPE'
};

export const GROUP = 'GROUP';
export const GROUP_DELETE_SUCCESS_MSG = 'Group has been successfully ungrouped.';
export const GROUP_DELETE_ERROR_MSG = 'Group id is missing. Unable to ungrouped.';

export const DIALOG_MODAL_CONFIG = (handlePrimaryButtonFtn, handleSecondaryButtonFtn, modalType, id) => {
  switch (modalType) {
    case MODAL_TYPE.DELETE_CUSTOM_GROUP:
      return {
        description: 
          <p>Ungrouping will delete the group and require each project to be forecasted individually. This action cannot be undone.</p>
        ,
        handlePrimaryButton: handlePrimaryButtonFtn,
        handleSecondaryButton: () => handleSecondaryButtonFtn(id),
        modalIcon: 'i',
        primaryButton: true,
        primaryButtonLabel: FORM_LABELS.CANCEL,
        secondaryButton: true,
        secondaryButtonLabel: BTN_LABELS.CONFIRM,
        title: CUSTOM_GROUP_MODAL.DELETE_MODAL_TITLE
      };
    case MODAL_TYPE.EMPTY_BILLING_TYPE:
      return {
        description: BILLING_TYPE_MISSING_MESSAGE,
        handleSecondaryButton: handleSecondaryButtonFtn,
        modalIcon: 'i',
        primaryButton: false,
        secondaryButton: true,
        secondaryButtonLabel: BTN_LABELS.OK_GOT_IT,
        title: BILLING_TYPE_MISSING_TITLE
      };
    default:
      break;  
  };
};

export const NO_PAST_SUBMISSIONS_MSG = <>
        No Forecast Records Found!
  <small>You have not forecasted yet. Please get started.</small>
</>;
export const MODIFY_GROUP = 'Modify Group';

export const OPPORTUNITY_SELECTION_ERROR_CODES = {
  PROBABILITY_OTHER_THAN_100: '6009-1205',
  PENDING_FOR_SUBMISSION: '6009-1086'
};

export const getMultipleErrorMessageConfig = (errors, code) => {
  switch(code) {
    case OPPORTUNITY_SELECTION_ERROR_CODES.PROBABILITY_OTHER_THAN_100: return {linkText: `${errors?.length} ‘Contract Signed’ projects`, errorSubText: 'with probability other than 100% ; Update to proceed.'};
    case OPPORTUNITY_SELECTION_ERROR_CODES.PENDING_FOR_SUBMISSION: return {linkText: `${errors?.length} projects`, errorSubText: 'pending. Update or exclude to proceed with submission.'};
    default: return '';
  };
};

export const TIME_AND_EXPENSE_DISPLAY_LABEL = 'T&E';
export const MINI_DROPDOWN_POSITION = 'top';

export const SKIP_PROPERTIES = {
  OLD_PROBABILITY_OVERRIDE: 'oldProbabilityOverride',
  ID: 'id', 
  BASE_LOCATION: 'baseLocation', 
  LOCATION_ID: 'locationId',
  EMPLOYMENT_TYPE: 'employmentType',
  RESPONSE_TYPE: 'responseType', 
  TIMESTAMP: 'timestamp'
};

export const CHILD_ACCOUNTS_WITH_PARENT = 'CHILD_ACCOUNTS_WITH_PARENT';

export const BILLING_TYPE_CODE = {
  TIME_EXPENSE: 'TIM_EXP',
  FLAT_FEE_MONTHLY: 'FLT_FEE_MNTHLY',
  LICENSE_FEE: 'LCNS_FEE',
  PER_UNIT: 'PER_UNT',
  MILESTONE: 'MLSTN_BSD'
};

export const GROUP_BY_LOCATION = 'Group by Location';