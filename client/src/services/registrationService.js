import api from "./api";

export const registerForHackathon = (data) => api.post("/registrations", data);

export const getMyRegistrations = () => api.get("/registrations/mine");

export const getRegistrationsByHackathon = (hackathonId) => api.get(`/registrations/hackathon/${hackathonId}`);

export const updateRegistrationStatus = (id, data) => api.patch(`/registrations/${id}/status`, data);

export const cancelRegistration = (id) => api.delete(`/registrations/${id}`);
