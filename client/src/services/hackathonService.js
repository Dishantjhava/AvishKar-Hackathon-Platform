import api from "./api";

export const getAllHackathons = (params) => api.get("/hackathons", { params });

export const getHackathonById = (id) => api.get(`/hackathons/${id}`);

export const createHackathon = (data) => api.post("/hackathons", data);

export const updateHackathon = (id, data) => api.put(`/hackathons/${id}`, data);

export const deleteHackathon = (id) => api.delete(`/hackathons/${id}`);

export const updateStatus = (id, data) => api.patch(`/hackathons/${id}/status`, data);

export const assignJudges = (id, data) => api.patch(`/hackathons/${id}/judges`, data);
