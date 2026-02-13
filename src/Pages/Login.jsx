import { useState } from "react";
import {
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    Link
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [errors, setErrors] = useState({});

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
            return;
        }

        if (emailUser.password !== formData.password) {
            setErrors({
                password: "Incorrect password"
            });
            return;
        }

        localStorage.setItem("currentUser", JSON.stringify(emailUser));

        navigate("/dashboard");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2
            }}
        >
            <Paper elevation={6} sx={{ width: "100%", maxWidth: 460, borderRadius: 3 }}>
                <Box component="form" noValidate onSubmit={handleSubmit} sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2.2 }}>
                    <Typography variant="h4" textAlign="center" gutterBottom>
                        Login
                    </Typography>
                    <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                        Welcome back, please sign in
                    </Typography>

                    <TextField
                        label="Email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.password}
                        helperText={errors.password}
                    />

                    <Button variant="contained" type="submit" size="large" sx={{ mt: 1, py: 1.2 }}>
                        Login
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        New user?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            type="button"
                            onClick={() => navigate("/")}
                            sx={{ cursor: "pointer" }}
                        >
                            Create account
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Box>
    );
}

export default Login;
