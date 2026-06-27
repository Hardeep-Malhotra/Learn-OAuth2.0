import { loginWithGoogle } from "../api/authApi";

function Login() {
  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome</h1>
      <p>Please log in to continue</p>
      <button
        onClick={loginWithGoogle}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Login With Google
      </button>
    </div>
  );
}

export default Login;
