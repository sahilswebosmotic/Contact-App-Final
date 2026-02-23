import { Navigate } from "react-router-dom";

import { getCurrentUser, getUsers } from "../../services/storage";

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