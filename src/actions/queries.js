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
  state,
  courtH,
  notes
) => {
  var query = "";
  if (first) {
    query += "first_name=" + first + "&";
  }
  if (last) {
    query += "last_name=" + last + "&";
  }
  if (number) {
    query += "phone_number=" + number + "&";
  }
  if (birthday) {
    query += "date_of_birth=" + birthday + "&";
  }
  if (zip) {
    query += "zip_code=" + zip + "&";
  }
  if (hours) {
    query += "total_hours=" + hours + "&";
  }
  if (address) {
    query += "address=" + address + "&";
  }
  if (city) {
    query += "city=" + city + "&";
  }
  if (state) {
    query += "state=" + state + "&";
  }
  if (courtH) {
    query += "courtH=" + courtH + "&";
  }
  if (notes) {
    query += "notes=" + notes + "&";
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

export const editEvent = (event, sendConfirmationEmail) =>
  axios.put("/api/events", {
    event: event,
    sendConfirmationEmail: sendConfirmationEmail,
  });

export const deleteEvent = (_id) => axios.delete("/api/events/" + _id);

export const editProfile = (id, user) => axios.put(`/api/users/${id}`, user);

export const getWaivers = () => axios.get("/api/waivers?adult=true&minor=true");

export const deleteWaiver = (id) => axios.delete(`/api/waivers/${id}`);

export const uploadWaiver = (waiver) => axios.post("/api/waivers", waiver);

export const checkInVolunteer = (userId, eventId) =>
  axios.post("/api/attendance/checkin", { userId, eventId });

export const checkOutVolunteer = (userId, eventId) =>
  axios.post("/api/attendance/checkout", { userId, eventId });

export const getEventVolunteersByAttendance = (eventId, isCheckedIn) =>
  axios.get(
    `/api/events/${eventId}/volunteersByAttendance?isCheckedIn=${isCheckedIn}`
  );

export const updateEventById = (id, event) =>
  axios.put(`/api/events/${id}`, event);
