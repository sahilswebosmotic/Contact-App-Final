import { useState } from "react";

export const useDashboardNotification = () => {
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "",
    });

    const showNotification = (message, severity) => {
        setNotification({
            open: true,
            message,
            severity,
        });
    };

    const showSuccess = (message) => showNotification(message, "success");
    const showError = (message) => showNotification(message, "error");

    const handleCloseNotification = () => {
        setNotification((prev) => ({ ...prev, open: false }));
    };

    return {
        notification,
        showSuccess,
        showError,
        handleCloseNotification,
    };
};
