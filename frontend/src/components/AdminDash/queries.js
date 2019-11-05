import axios from 'axios';

export const filterApplicants = filterGroups => {
  let filtersToApply = {};
  const query = Object.entries(filterGroups).reduce((queryString, [group, { values }]) => {
    Object.entries(values).forEach(([filter, filterValue]) => {
      if (filterValue) {
        console.log(filterValue);
        if (!filtersToApply[group]) filtersToApply[group] = {};
        filtersToApply[group][filter] = filterValue;
      }
    });
    if (!filtersToApply[group]) {
      return queryString;
    } else {
      return `${queryString}${group}=${JSON.stringify(filtersToApply[group])}&`;
    }
  }, '');
  return axios.get('/api/users?' + query);
};

export const fetchMoreApplicants = lastPaginationId =>
  axios.get(`/api/users?${lastPaginationId ? 'lastPaginationId=' + lastPaginationId : ''}`);

export const fetchUserManagementData = lastPaginationId =>
  axios.get(
    `/api/users/managementData?${lastPaginationId ? 'lastPaginationId=' + lastPaginationId : ''}`
  );

export const fetchUserCount = () => axios.get('/api/users/count');

export const updateApplicantStatus = (email, status) =>
  axios.post(`/api/users/updateStatus?email=${email}&status=${status}`);

export const updateApplicantRole = (email, role) =>
  axios.post(`/api/users/updateRole?email=${email}&role=${role}`);

export const searchApplicants = (textinput, searchType) => {
  return axios.get('/api/users/searchByContent', {
    params: { searchquery: textinput, searchtype: searchType }
  });
};

export const fetchEvents = () => axios.get('/api/events');

export const createEvent = event => axios.post('/api/events', event);

export const editEvent = event => axios.put('/api/events', event);

export const deleteEvent = _id => axios.delete('/api/events/' + _id);
