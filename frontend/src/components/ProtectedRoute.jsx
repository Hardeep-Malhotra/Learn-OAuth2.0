import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p style={{ textAlign: "center", marginTop: "100px" }}>Loading...</p>
    );
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectRoute;
