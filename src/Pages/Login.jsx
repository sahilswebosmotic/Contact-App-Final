
import { useState } from "react";
import {
    Alert,
    Snackbar,
    TextField,
    Button,
    Typography,
    Link,
    Stack,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";
import AuthFormCard from "../Components/AuthFormCard";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});
    const [notification, setNotification] = useState({
        open: !!location.state?.message,
        message: location.state?.message || "",
        severity: "success",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });

        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ""
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const emailUser = users.find(user => user.email === formData.email);

        if (!emailUser) {
            setErrors({
                email: "Email is not registered"
            });
            navigate("/");
            return;
        }

        if (emailUser.password !== formData.password) {
            setErrors({
                password: "Incorrect password"
            });
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(emailUser));

        setNotification({
            open: true,
            message: "Login successful.",
            severity: "success",
        });

        setTimeout(() => {
            navigate("/dashboard", {
                state: { message: "Welcome back! Login successful." },
            });
        }, 450);
    };

    return (
        <>
            <AuthFormCard title="Login" subtitle="Welcome back, please sign in">
                <Stack component="form" noValidate onSubmit={handleSubmit} spacing={1.8} sx={{ width: "100%" }}>
                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        error={!!errors.email}
                        helperText={errors.email}
                        autoComplete="email"
                    />

                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
                        autoComplete="current-password"
                    />

                    <Button variant="contained" type="submit" fullWidth size="large" sx={{ mt: 1, py: 1.2 }}>
                        Login
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        New user?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            type="button"
                            onClick={() => navigate("/")}
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                            Create account
                        </Link>
                    </Typography>
                </Stack>
            </AuthFormCard>

            <Snackbar
                open={notification.open}
                autoHideDuration={2300}
                onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setNotification((prev) => ({ ...prev, open: false }))}
                    severity={notification.severity}
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </>
    );
}

export default Login;