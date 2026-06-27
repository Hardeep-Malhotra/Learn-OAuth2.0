// This file connects our frontend to the backend.
// Pages just call these functions instead of writing URLs everywhere.

const BACKEND_URL = "http://localhost:5000";

// 1. Send the user to Google to log in
export function loginWithGoogle() {
  // Opens the backend login link, which opens the Google Login page
  window.location.href = `${BACKEND_URL}/auth/google`;
}

// 2. Check if a user is already logged in
export async function getCurrentUser() {
  // Ask the backend if the current visitor is logged in
  const response = await fetch(`${BACKEND_URL}/auth/user`, {
    // 'include' sends the secret login cookie (session) to the backend
    credentials: "include",
  });

  // Returns backend data: { loggedIn: true/false, user: {...} }
  return response.json();
}

// 3. Log the user out
export function logout() {
  // Opens the backend logout link to clear the login session
  window.location.href = `${BACKEND_URL}/auth/logout`;
}
