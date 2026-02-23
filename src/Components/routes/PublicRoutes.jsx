import { Navigate } from "react-router-dom";

const getCurrentUser = () => {
    try {
        return JSON.parse(sessionStorage.getItem("currentUser"));
    } catch {
        return null;
    }
};

export default function PublicRoute({ children }) {
    const currentUser = getCurrentUser();

    if (currentUser?.User_id) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
}