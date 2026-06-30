import axios from "axios";

const BACKEND_URL = "http://localhost:5000";

// Create an Axios instance with common configurations
const API = axios.create({
  baseURL: `${BACKEND_URL}/auth`,
  withCredentials: true, // CRITICAL: Automatically includes the session cookie with every request
});

// 1. Redirect the user to Google's OAuth page
export function loginWithGoogle() {
  window.location.href = `${BACKEND_URL}/auth/google`;
}

// 2. Check if a user is already logged in (used by AuthContext)
export async function getCurrentUser() {
  const response = await API.get("/current_user");
  return response.data; // Returns { loggedIn: true/false, user: {...} }
}

// 3. Log the user out and clear the session
export function logout() {
  window.location.href = `${BACKEND_URL}/auth/logout`;
}

// 4. 🔥 ADDED: Handle manual form signup and account linking
export async function manualSignupApi(userData) {
  return API.post("/signup", userData);
}

// 5. 🔥 ADDED: Handle manual form login
export async function manualLoginApi(userData) {
  return API.post("/login", userData);
}
