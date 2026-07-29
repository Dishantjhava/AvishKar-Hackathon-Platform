
import api from "./api";

export const getMyTeam = () => api.get("/teams/mine");

export const getTeamById = (id) => api.get(`/teams/${id}`);

export const createTeam = (data) => api.post("/teams", data);

export const updateTeam = (id, data) => api.put(`/teams/${id}`, data);

export const deleteTeam = (id) => api.delete(`/teams/${id}`);

export const inviteMember = (teamId, email) => api.post(`/teams/${teamId}/invite`, { email });

export const getPendingInvites = (teamId) => api.get(`/teams/${teamId}/invites`);

export const removeMember = (teamId, userId) => api.delete(`/teams/${teamId}/members/${userId}`);

export const leaveTeam = (teamId) => api.post(`/teams/${teamId}/leave`);

export const transferLeadership = (teamId, newLeaderId) => api.patch(`/teams/${teamId}/transfer`, { newLeaderId });

/* Feature 2: Search teams by name */
export const searchTeams = (query) => api.get(`/teams/search?query=${encodeURIComponent(query)}`);

/* Email Team Invitation Flow */
export const getInviteDetails = (token) => api.get(`/invitations/${token}`);
export const acceptTeamInvite = (token) => api.post(`/invitations/${token}/accept`);
