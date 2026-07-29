import api from "./api";

export const getAllUsers = () => api.get("/users");

export const getUserById = (id) => api.get(`/users/${id}`);

export const updateProfile = (id, data) => api.put(`/users/${id}/profile`, data);

export const updateUser = (id, data) => api.put(`/users/${id}`, data);

export const deleteUser = (id) => api.delete(`/users/${id}`);

export const toggleBlockUser = (id, blocked) => api.patch(`/users/${id}/block`, { blocked });
