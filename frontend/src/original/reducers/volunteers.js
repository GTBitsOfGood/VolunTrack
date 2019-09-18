import * as types from '../actions/types';

const initialState = {
  pending: [],
  newest: [],
  all: [],
  denied: [],
  deleted: [],
  current_volunteer: undefined,
  filter: {
    language: '',
    skills: 'no_filter',
    birthday: {
      month: 0,
      day: 0
    },
    availability: {
      set: false,
      weekday_mornings: false,
      weekday_afternoons: false,
      weekday_evenings: false,
      weekend_mornings: false,
      weekend_afternoons: false,
      weekend_evenings: false
    },
    criminal_history: {
      no_felony: false,
      no_sexual_violent: false,
      no_drugs: false,
      no_driving: false
    }
  },
  selected_volunteers: []
};

export default function volunteers(state = initialState, action) {
  switch (action.type) {
    case types.LOAD_ALL_VOLUNTEERS:
      return Object.assign({}, state, { all: action.all ? action.all : [] });
    case types.LOAD_PENDING_VOLUNTEERS:
      return Object.assign({}, state, { pending: action.pending });
    case types.LOAD_NEWEST_VOLUNTEERS:
      return Object.assign({}, state, { newest: action.newest });
    case types.LOAD_DENIED_VOLUNTEERS:
      return Object.assign({}, state, { denied: action.denied });
    case types.LOAD_DELETED_VOLUNTEERS:
      return Object.assign({}, state, { deleted: action.deleted });
    case types.UPDATE_CURRENT_VOLUNTEER:
      if (state.all.length === 0) return state;
      const pendingVolunteers = state.pending.find(item => item._id === action.id);
      const allVolunteers = state.all.find(item => item._id === action.id);
      const deniedVolunteers = state.denied.find(item => item._id === action.id);
      return Object.assign({}, state, {
        current_volunteer:
          pendingVolunteers || allVolunteers || deniedVolunteers || /*deletedVolunteer*/ undefined
      });
    case types.APPROVE_VOLUNTEER:
      const volunteerToApprove = state.pending.find(item => item._id === action.id);
      if (!volunteerToApprove) {
        //approving from denied
        const volunteerToApproveD = state.denied.find(item => item._id === action.id);
        const newDenied = state.pending.slice();
        newDenied.splice(state.pending.indexOf(volunteerToApproveD), 1);
        const newAll = state.all.slice();
        newAll.push(volunteerToApproveD);
        const newNewest = state.newest.slice();
        newNewest.unshift(volunteerToApproveD);
        return Object.assign({}, state, { denied: newDenied, all: newAll, newest: newNewest });
      } else {
        const newPending = state.pending.slice();
        newPending.splice(state.pending.indexOf(volunteerToApprove), 1);
        const newAll = state.all.slice();
        newAll.push(volunteerToApprove);
        const newNewest = state.newest.slice();
        newNewest.unshift(volunteerToApprove);
        return Object.assign({}, state, { pending: newPending, all: newAll, newest: newNewest });
      }

    case types.DENY_VOLUNTEER:
      const volunteerToDeny = state.pending.find(item => item._id === action.id);
      if (!volunteerToDeny) {
        const newPendingD = state.pending.slice();
        newPendingD.splice(state.pending.indexOf(volunteerToDeny), 1);
        const newDenied = state.denied.slice();
        newDenied.push(volunteerToDeny);
        const newNewestD = state.newest.slice();
        newNewestD.unshift(volunteerToDeny);
        return Object.assign({}, state, {
          pending: newPendingD,
          denied: newDenied,
          newest: newNewestD
        });
      } else {
        const volunteerToDenyA = state.all.find(item => item._id === action.id);
        const newAll = state.all.slice();
        newAll.splice(state.all.indexOf(volunteerToDenyA), 1);
        const newDenied = state.denied.slice();
        newDenied.push(volunteerToDenyA);
        const newNewestD = state.newest.slice();
        newNewestD.unshift(volunteerToDenyA);
        return Object.assign({}, state, { all: newAll, denied: newDenied, newest: newNewestD });
      }

    case types.DELETE_VOLUNTEER:
      const volunteerToDelete = state.all.find(item => item._id === action.id);
      if (volunteerToDelete) {
        const newAll = state.all.slice();
        newAll.splice(state.all.indexOf(volunteerToDelete), 1);
        const newDeleted = state.deleted.slice();
        newDeleted.push(volunteerToDelete);
        return Object.assign({}, state, { all: newAll, deleted: newDeleted });
      } else {
        const volunteerToDeleteP = state.pending.find(item => item._id === action.id);
        if (volunteerToDeleteP) {
          const newPending = state.pending.slice();
          newPending.splice(state.pending.indexOf(volunteerToDeleteP), 1);
          const newDeleted = state.deleted.slice();
          newDeleted.push(volunteerToDeleteP);
          return Object.assign({}, state, { pending: newPending, deleted: newDeleted });
        } else {
          const volunteerToDeleteD = state.denied.find(item => item._id === action.id);
          const newDenied = state.denied.slice();
          newDenied.splice(state.denied.indexOf(volunteerToDeleteD), 1);
          const newDeleted = state.deleted.slice();
          newDeleted.push(volunteerToDeleteD);
          return Object.assign({}, state, { all: newAll, deleted: newDeleted });
        }
      }

    case types.UPDATE_VOLUNTEER_FILTER:
      const newFilterObject = Object.assign({}, state.filter, action.filter);
      return Object.assign({}, state, { filter: newFilterObject });
    case types.ADD_SELECTED_VOLUNTEER:
      const volunteerToAddAll = state.all.find(item => item._id === action.id);
      const volunteerToAddPending = state.pending.find(item => item._id === action.id);
      const selected_volunteers_cpy = state.selected_volunteers.slice();
      const volunteerToAdd = volunteerToAddAll || volunteerToAddPending;
      selected_volunteers_cpy.push({
        _id: volunteerToAdd._id,
        email: volunteerToAdd.bio.email
      });
      return Object.assign({}, state, { selected_volunteers: selected_volunteers_cpy });
    case types.REMOVE_SELECTED_VOLUNTEER:
      const selected_volunteers_new = state.selected_volunteers.filter(
        volunteer => volunteer._id !== action.id
      );
      return Object.assign({}, state, { selected_volunteers: selected_volunteers_new });

    default:
      return state;
  }
}
