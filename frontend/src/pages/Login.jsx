import { useState } from "react";
import { manualLoginApi, manualSignupApi } from "../api/authApi";

const Login = () => {
  // Toggle between Login and Signup state
  const [isSignup, setIsSignup] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Trigger Google OAuth Login Flow
  const handleGoogleLogin = () => {
    // This directly targets the passport backend route we verified earlier
    window.open("http://localhost:5000/auth/google", "_self");
  };

  // Handle Form Submission (Both manual login & account linking signup)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      if (isSignup) {
        // Run Signup logic or Account linking if account existed via Google
        const response = await manualSignupApi(formData);
        if (response.data.success) {
          setMessage(response.data.message);
          // If successfully signed up or linked, clear form fields
          setFormData({ name: "", email: "", password: "" });
        }
      } else {
        // Run Manual Login logic
        const response = await manualLoginApi({
          email: formData.email,
          password: formData.password,
        });
        if (response.data.success) {
          // Success! Redirect to dashboard
          window.location.href = "/dashboard";
        }
      }
    } catch (err) {
      // Catch backend validation error messages
      setError(err.response?.data?.message || "Something went wrong!");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "50px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>
        {isSignup ? "Create Account / Link Password" : "Login to Account"}
      </h2>

      {message && (
        <div style={{ color: "green", marginBottom: "15px" }}>{message}</div>
      )}
      {error && (
        <div style={{ color: "red", marginBottom: "15px" }}>{error}</div>
      )}

      <form onSubmit={handleSubmit}>
        {isSignup && (
          <div style={{ marginBottom: "10px" }}>
            <label>Name: </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{ width: "100%", padding: "8px" }}
            />
          </div>
        )}

        <div style={{ marginBottom: "10px" }}>
          <label>Email: </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Password: </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button
          type="submit"
          style={{
            width: "100%",
            padding: "10px",
            background: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {isSignup ? "Sign Up" : "Log In"}
        </button>
      </form>

      <div style={{ textAlign: "center", margin: "20px 0" }}>OR</div>

      {/* 🔥 GOOGLE LOGIN BUTTON */}
      <button
        onClick={handleGoogleLogin}
        style={{
          width: "100%",
          padding: "10px",
          background: "#db4437",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Sign In with Google
      </button>

      <p style={{ marginTop: "20px", textAlign: "center" }}>
        {isSignup
          ? "Already have an account?"
          : "New User or want to link Google account?"}{" "}
        <span
          style={{
            color: "#007bff",
            cursor: "pointer",
            textDecoration: "underline",
          }}
          onClick={() => {
            setIsSignup(!isSignup);
            setMessage("");
            setError("");
          }}
        >
          {isSignup ? "Login here" : "Register / Link Password here"}
        </span>
      </p>
    </div>
  );
};

export default Login;
