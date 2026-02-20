import { Navigate } from "react-router-dom";

const getCurrentUser = () => {
  try {
    return JSON.parse(sessionStorage.getItem("currentUser"));
  } catch {
    return null;
  }
};

const getUsers = () => {
  try {
    return JSON.parse(localStorage.getItem("users")) || [];
  } catch {
    return [];
  }
};


export default function ProtectedRoute({ children }) {
  const currentUser = getCurrentUser();
if (!currentUser?.User_id) {
    return <Navigate to="/" replace />;
}

const users = getUsers();
const matchedUser = users.find(u => u.User_id === currentUser.User_id);

if (!matchedUser) {
    return <Navigate to="/" replace />;
}

  return children;
}