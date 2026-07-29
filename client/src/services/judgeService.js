import api from "./api";

export const getAssignedSubmissions = () => api.get("/reviews/assigned");

export const submitReview = (data) => api.post("/reviews", data);

export const getReviewBySubmission = (submissionId) => api.get(`/reviews/${submissionId}`);

export const updateReview = (id, data) => api.put(`/reviews/${id}`, data);
