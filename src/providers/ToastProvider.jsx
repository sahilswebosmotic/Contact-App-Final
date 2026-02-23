import { Alert, Snackbar } from "@mui/material";
import {
    useState,
} from "react";
import { ToastContext } from "./ToastContext";


export const ToastProvider = ({ children }) => {
    const [toast, setToast] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const showToast = (message, severity = "success") => {
        setToast({
            open: true,
            message,
            severity,
        });
    };

    const showSuccess = (message) => showToast(message, "success");
    const showError = (message) => showToast(message, "error");

    const handleClose = () => {
        setToast((prev) => ({ ...prev, open: false }));
    };

    const value = {
        showToast,
        showSuccess,
        showError,
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            <Snackbar
                open={toast.open}
                autoHideDuration={1800}
                onClose={handleClose}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert
                    severity={toast.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                    onClose={handleClose}
                >
                    {toast.message}
                </Alert>
            </Snackbar>
        </ToastContext.Provider>
    );
};
