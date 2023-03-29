import axios from "axios";

// don't need to query for invited admins, just query the organization instead and update that
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
  axios.post("/api/attendances/checkin", {
    userId,
    eventId,
    eventName,
    volunteerName,
    volunteerEmail,
  });

export const checkOutVolunteer = (userId, eventId) =>
  axios.post("/api/attendances/checkout", { userId, eventId });

export const getEventVolunteersByAttendance = (eventId, isCheckedIn) =>
  axios.get(
    `/api/events/${eventId}/volunteersByAttendance?isCheckedIn=${isCheckedIn}`
  );

export const updateEventById = (id, event) =>
  axios.put(`/api/events/${id}`, event);

export const getAttendanceForEvent = (eventId) =>
  axios.post("/api/attendances/statistics", { eventId });

export const getEventStatistics = (startDate, endDate) =>
  axios.get(
    `/api/attendances/eventstatistics?startDate=${startDate}&endDate=${endDate}`
  );

export const deleteAttendance = (id) =>
  axios.delete(`/api/attendances/${id}`, { id });

export const updateAttendance = (id, newData) =>
  axios.put(`/api/attendances/${id}`, { id, newData });

export const getHistoryEvents = (organizationId) =>
  axios.get(`/api/historyEvents?organizationId=${organizationId}`);

export const createOrganization = (organization) =>
  axios.post(`/api/organizations`, organization);

export const fetchOrganizations = () => axios.get(`/api/organizations`);

export const toggleStatus = (id) => {
  axios.post(`/api/organizations/${id}/toggleStatus`);
};
