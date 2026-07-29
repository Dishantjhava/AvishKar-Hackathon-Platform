import api from "./api";

export const signup = (data) => api.post("/auth/signup", data);

export const login = (credentials) => api.post("/auth/login", credentials);

export const googleLogin = (payload) => api.post("/auth/google", payload);

export const getMe = () => api.get("/auth/me");
