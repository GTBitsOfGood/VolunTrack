import axios from "axios";

export const filterApplicants = (filterGroups) => {
  let filtersToApply = {};
  const query = Object.entries(filterGroups).reduce(
    (queryString, [group, { values }]) => {
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
        return `${queryString}${group}=${JSON.stringify(
          filtersToApply[group]
        )}&`;
      }
    },
    ""
  );
  return axios.get("/api/users?" + query);
};

export const fetchMoreApplicants = (lastPaginationId) =>
  axios.get(
    `/api/users?${
      lastPaginationId ? "lastPaginationId=" + lastPaginationId : ""
    }`
  );

export const fetchUserManagementData = (lastPaginationId) =>
  axios.get(
    `/api/users/managementData?${
      lastPaginationId ? "lastPaginationId=" + lastPaginationId : ""
    }`
  );

export const getCurrentUser = () => axios.get("/api/users/current");

export const fetchUserCount = () => axios.get("/api/users/count");

export const updateApplicantStatus = (email, status) =>
  axios.post(`/api/users/updateStatus?email=${email}&status=${status}`);

export const updateUser = (
  email,
  first,
  last,
  number,
  birthday,
  zip,
  hours,
  address,
  city,
  state
) => {
  var query = "";
  if (first.length != 0) {
    query += "first_name=" + first + "&";
  }
  if (last.length != 0) {
    query += "last_name=" + last + "&";
  }
  if (number.length != 0) {
    query += "phone_number=" + number + "&";
  }
  if (number.length != 0) {
    query += "phone_number=" + number + "&";
  }
  if (birthday.length != 0) {
    query += "date_of_birth=" + birthday + "&";
  }
  if (zip.length != 0) {
    query += "zip_code=" + zip + "&";
  }
  if (hours.length != 0) {
    query += "total_hours=" + hours + "&";
  }
  if (address.length != 0) {
    query += "address=" + address + "&";
  }
  if (city.length != 0) {
    query += "city=" + city + "&";
  }
  if (state.length != 0) {
    query += "state=" + state + "&";
  }

  if (query.length > 0) {
    query = query.slice(0, -1);
    axios.post(`/api/users/updateUser?email=${email}&${query}`);
  }
};

export const updateApplicantRole = (email, role) =>
  axios.post(`/api/users/updateRole?email=${email}&role=${role}`);

export const searchApplicants = (textinput, searchType) => {
  return axios.get("/api/users/searchByContent", {
    params: { searchquery: textinput, searchtype: searchType },
  });
};

export const fetchVolunteers = (eventVolunteers) => {
  return axios.get(
    `/api/users/eventVolunteers?volunteers=${JSON.stringify(eventVolunteers)}`
  );
};

export const fetchEvents = (startDate, endDate) =>
  axios.get(`/api/events?startDate=${startDate}&endDate=${endDate}`);

export const fetchEventsById = (_id) => axios.get("/api/events/" + _id);

export const createEvent = (event) => axios.post("/api/events", event);

export const editEvent = (event, sendConfirmationEmail) => axios.put("/api/events", { event: event, sendConfirmationEmail: sendConfirmationEmail});

export const deleteEvent = (_id) => axios.delete("/api/events/" + _id);

export const editProfile = (id, user) => axios.put(`/api/users/${id}`, user);

export const getWaivers = () => axios.get("/api/waivers?adult=true&minor=true");

export const deleteWaiver = (id) => axios.delete(`/api/waivers/${id}`);

export const uploadWaiver = (waiver) => axios.post("/api/waivers", waiver);
