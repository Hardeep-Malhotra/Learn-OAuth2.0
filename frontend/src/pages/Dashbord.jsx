import { useAuth } from "../context/AuthContext";
import { logout } from "../api/authApi";

function Dashbord() {
  const { user } = useAuth();

  return (
    <div style={{ textAlign: "center ", marginTop: "100px" }}>
      <h1>Dashboard</h1>

      {user && (
        <>
          <img
            src={user.photo}
            alt="profile"
            style={{ borderRadius: "50%", width: "80px" }}
          />
          <h2>Welcome, {user.name}</h2>
          <p>{user.email}</p>
        </>
      )}

      <button
        onClick={logout}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Logout
      </button>
    </div>
  );
}

export default Dashbord;
