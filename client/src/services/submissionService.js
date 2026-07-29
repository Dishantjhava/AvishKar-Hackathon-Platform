
import api from "./api";

export const getMySubmission = () => api.get("/submissions/mine");

export const getSubmissionsByHackathon = (hackathonId) => api.get(`/submissions?hackathonId=${hackathonId}`);

export const getSubmissionById = (id) => api.get(`/submissions/${id}`);

export const createSubmission = (data) => api.post("/submissions", data);

export const updateSubmission = (id, data) => api.put(`/submissions/${id}`, data);

export const deleteSubmission = (id) => api.delete(`/submissions/${id}`);

/* Feature 3: Search submissions by project name or tech stack */
export const searchSubmissions = (query) => api.get(`/submissions/search?query=${encodeURIComponent(query)}`);
