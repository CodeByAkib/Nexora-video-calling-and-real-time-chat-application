import axios from "axios";

// VITE_API_URL (full URL including /api) wins when set. Otherwise: local dev talks to the
// backend on :5001, and production uses the relative "/api" (served by a Vercel rewrite or
// by the backend itself).
const BASE_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api");

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // send cookies with the request
});
