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

function Signup() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
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

        // Check if email already exists
        const userExists = users.find(user => user.email === formData.email);

        if (userExists) {
            setErrors({ email: "Email already registered" });
            return;
        }

        users.push(formData);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Signup successful! Please login.");
        navigate("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%"
            }}
        >
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
                <Box
                    component="form"
                    noValidate
                    onSubmit={handleSubmit}
                    sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2.2 }}
                >
                    <Typography variant="h4" textAlign="center" gutterBottom>
                        Sign Up
                    </Typography>
                    <Typography variant="body2" textAlign="center" color="text.secondary" sx={{ mb: 1 }}>
                        Create your account to continue
                    </Typography>

                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        fullWidth
                        error={!!errors.name}
                        helperText={errors.name}
                    />

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

                    <Button
                        variant="contained"
                        type="submit"
                        size="large"
                        sx={{ mt: 1, py: 1.2 }}
                    >
                        Sign Up
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
                        Already have an account?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            type="button"
                            onClick={() => navigate("/login")}
                            sx={{ cursor: "pointer" }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Paper>
            </Box>
        </Box>
    );
}

export default Signup;
