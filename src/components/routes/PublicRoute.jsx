import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../services/storage";

export default function PublicRoute({ children }) {
    const currentUser = getCurrentUser();

    if (currentUser?.User_id) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}