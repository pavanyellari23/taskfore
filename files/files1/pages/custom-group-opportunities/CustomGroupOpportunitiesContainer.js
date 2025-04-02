import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CustomGroupedOpportunities from './CustomGroupedOpportunities';
import { OpportunitiesActionType } from 'store/types/OpportunitiesActionType';
import { MetaDataActionType } from 'store/types/MetaDataActionType';
import { getCustomGroupCandidates, getCustomGrpProjectsList, editCustomGroups, setCustomGroupCandidates, deleteCustomGroupAction } from 'store/actions/Opportunities';
import { getAccountDropdown, getProgramDropdown } from 'store/actions/MetaData';

const CustomGroupOpportunitiesContainer = (props) => { 
  const { getCustomGroupCandidatesAction, getCustomGroupProjectsList, editCustomGroupDispatcher, setCustomGpCandidates, deleteCustomGroupDispatcher, getAccountDropDownAction, getProgramDropdownDispatcher } = props;

  const callBackHandler = ({type , payload}) => {
    switch(type){
      case OpportunitiesActionType.GET_CUSTOM_GROUP_CANDIDATES: 
        getCustomGroupCandidatesAction(payload);
        break;
      case OpportunitiesActionType.GET_CUSTOM_GROUP_PROJECTS_LIST:
        getCustomGroupProjectsList(payload);
        break;
      case OpportunitiesActionType.EDIT_CUSTOM_GROUP: 
        editCustomGroupDispatcher(payload);
        break;
      case OpportunitiesActionType.SET_CUSTOM_GROUP_CANDIDATES: 
        setCustomGpCandidates(payload);
        break;
      case OpportunitiesActionType.DELETE_CUSTOM_GROUP:
        deleteCustomGroupDispatcher(payload);
        break;
      case MetaDataActionType.GET_ACCOUNT_DROPDOWN:
        getAccountDropDownAction(payload);
        break;
      case MetaDataActionType.GET_PROGRAM_DROPDOWN:
        getProgramDropdownDispatcher(payload);
        break;  
      default: 
        break;
    }
  };

  return (
    <div>
      <CustomGroupedOpportunities
        {...props}
        callBackHandler={callBackHandler}
      />
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    metaData: state.metaData,
    opportunities: state.opportunities,
    customGroupedCandidates: state.opportunities.custom_grouped_candidates
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    getCustomGroupProjectsList: (payload) => {
      dispatch(getCustomGrpProjectsList(payload));
    },
    getCustomGroupCandidatesAction: (payload) => {
      dispatch(getCustomGroupCandidates(payload));
    },
    editCustomGroupDispatcher: (payload) => {
      dispatch(editCustomGroups(payload));
    },
    setCustomGpCandidates: (payload) => {
      dispatch(setCustomGroupCandidates(payload));
    },
    deleteCustomGroupDispatcher: (payload) => {
      dispatch(deleteCustomGroupAction(payload));
    },
    getAccountDropDownAction: (payload) => {
      dispatch(getAccountDropdown(payload));
    },
    getProgramDropdownDispatcher: (payload) => {
      dispatch(getProgramDropdown(payload));
    }
  };
};

CustomGroupOpportunitiesContainer.propTypes = {
  deleteCustomGroupDispatcher: PropTypes.func,
  editCustomGroupDispatcher: PropTypes.func,
  getAccountDropDownAction: PropTypes.func,
  getCustomGroupCandidatesAction: PropTypes.func,
  getCustomGroupProjectsList: PropTypes.func,
  getProgramDropdownDispatcher:PropTypes.func,
  setCustomGpCandidates: PropTypes.func
};

export default connect(
  mapStateToProps,
  mapDispatchToProps)
(CustomGroupOpportunitiesContainer);
