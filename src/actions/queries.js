import axios from "axios";

export const getUsers = (organizationId, role) =>
  axios.get(`/api/users/getUsers?role=${role}`);

export const getCurrentUser = (userId) =>
  axios.get("/api/users/current?volunteer=" + userId);

export const updateUser = (userId, userInfo) => {
  axios.post(`/api/users/${userId}`, userInfo);
};

export const fetchVolunteers = (eventVolunteers, organizationId) => {
  return axios.get(
    `/api/users/eventVolunteers?volunteers=${JSON.stringify(
      eventVolunteers
    )}&organizationId=${organizationId}`
  );
};

export const fetchEvents = (startDate, endDate, organizationId) =>
  axios.get(
    `/api/events?startDate=${startDate}&endDate=${endDate}&organizationId=${organizationId}`
  );

export const fetchEventsById = (_id) => axios.get("/api/events/" + _id);

export const fetchAttendanceByUserId = (userId) => {
  return axios.get("/api/users/stats?volunteer=" + userId);
};

export const createEvent = (event) => axios.post("/api/events", event);

export const editEvent = (event, sendConfirmationEmail) =>
  axios.put("/api/events", {
    event: event,
    sendConfirmationEmail: sendConfirmationEmail,
  });

export const deleteEvent = (_id, userId) =>
  axios.delete(`/api/events/${_id}?userId=${userId}`);

// credentials signup
export const createUserFromCredentials = (user) =>
  axios.post(`/api/users`, user);

export const getUserFromId = (id) => axios.get(`/api/users/${id}`);

export const deleteUser = (id, user) => axios.delete(`/api/users/${id}`, user);

//WAIVERS
export const getWaivers = (type, organizationId) =>
  axios.get(`/api/waivers?type=${type}&organizationId=${organizationId}`);

export const updateWaiver = (type, text, organizationId) =>
  axios.post("/api/waivers", { type, text, organizationId });

export const updateInvitedAdmins = (email, organizationId) =>
  axios.post(`/api/settings/updateInvitedAdmin`, { email, organizationId });

export const getInvitedAdmins = (organizationId) =>
  axios.get(`/api/settings/getInvitedAdmin?organizationId=${organizationId}`);

export const removeInvitedAdmin = (email, organizationId) =>
  axios.post(`/api/settings/removeInvitedAdmin`, { email, organizationId });

export const checkInVolunteer = (
  userId,
  eventId,
  eventName,
  volunteerName,
  volunteerEmail
) =>
  axios.post("/api/attendance/checkin", {
    userId,
    eventId,
    eventName,
    volunteerName,
    volunteerEmail,
  });

export const checkOutVolunteer = (userId, eventId) =>
  axios.post("/api/attendance/checkout", { userId, eventId });

export const getEventVolunteersByAttendance = (eventId, checkInStatus) =>
  axios.get(
    `/api/events/${eventId}/volunteersByAttendance?checkInStatus=${checkInStatus}`
  );

export const updateEventById = (id, event) =>
  axios.put(`/api/events/${id}`, event);

export const getAttendanceForEvent = (eventId) =>
  axios.post("/api/attendance/statistics", { eventId });

export const getEventStatistics = (startDate, endDate) =>
  axios.get(
    `/api/attendance/eventstatistics?startDate=${startDate}&endDate=${endDate}`
  );

export const deleteAttendance = (id) =>
  axios.delete(`/api/attendance/${id}`, { id });

export const updateAttendance = (id, newData) =>
  axios.put(`/api/attendance/${id}`, { id, newData });

export const getHistoryEvents = (organizationId) =>
  axios.get(`/api/historyEvents?organizationId=${organizationId}`);

export const createOrganization = (organization) =>
  axios.post(`/api/organizations`, organization);
