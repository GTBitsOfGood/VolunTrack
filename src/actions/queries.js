import axios from "axios";

export const fetchUserManagementData = (lastPaginationId) =>
  axios.get(
    `/api/users/managementData?${
      lastPaginationId ? "lastPaginationId=" + lastPaginationId : ""
    }`
  );

export const getCurrentUser = (userId) =>
  axios.get("/api/users/current?volunteer=" + userId);

export const fetchUserCount = () => axios.get("/api/users/count");

export const updateUser = (userId, userInfo) => {
  axios.post(`/api/users/${userId}`, userInfo);;
};

export const fetchVolunteers = (eventVolunteers) => {
  return axios.get(
    `/api/users/eventVolunteers?volunteers=${JSON.stringify(eventVolunteers)}`
  );
};

export const fetchEvents = (startDate, endDate) =>
  axios.get(`/api/events?startDate=${startDate}&endDate=${endDate}`);

export const fetchEventsById = (_id) => axios.get("/api/events/" + _id);

// not sure if this works
export const fetchEventsByUserId = (userId) => {
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

export const deleteUser = (id, user) => axios.delete(`/api/users/${id}`, user)

export const getWaivers = () => axios.get("/api/waivers?adult=true&minor=true");

export const deleteWaiver = (id) => axios.delete(`/api/waivers/${id}`);

export const uploadWaiver = (waiver) => axios.post("/api/waivers", waiver);

export const updateInvitedAdmins = (email) =>
  axios.post(`/api/settings/updateInvitedAdmin`, { email });

export const getInvitedAdmins = () =>
  axios.get(`/api/settings/getInvitedAdmin`);

export const removeInvitedAdmin = (email) =>
  axios.post(`/api/settings/removeInvitedAdmin`, { email });

export const checkInVolunteer = (userId, eventId, eventName) =>
  axios.post("/api/attendance/checkin", { userId, eventId, eventName });

export const checkOutVolunteer = (userId, eventId) =>
  axios.post("/api/attendance/checkout", { userId, eventId });

export const getEventVolunteersByAttendance = (eventId, isCheckedIn) =>
  axios.get(
    `/api/events/${eventId}/volunteersByAttendance?isCheckedIn=${isCheckedIn}`
  );

export const updateEventById = (id, event) =>
  axios.put(`/api/events/${id}`, event);

export const getAttendanceForEvent = (eventId) =>
  axios.post("/api/attendance/statistics", { eventId });

export const deleteAttendance = (id) =>
  axios.delete(`/api/attendance/${id}`, { id });

export const updateAttendance = (id, newData) =>
  axios.put(`/api/attendance/${id}`, { id, newData });

export const getHistoryEvents = () => axios.get("/api/historyEvents");
