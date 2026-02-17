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
import { useNavigate } from "react-router-dom";
import AuthFormCard from "../Components/AuthFormCard";

function Signup() {
    const navigate = useNavigate();



    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    });
    const [errors, setErrors] = useState({});
    const [notificationOpen, setNotificationOpen] = useState(false);



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
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmpassword) {
            newErrors.confirmpassword = "Confirm Password is Required";
        }
        else if (formData.password != formData.confirmpassword) {
            newErrors.confirmpassword = "Check the password "
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };





    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const email = formData.email.trim().toLowerCase();
        const userExists = users.find(
            (user) => user.email.toLowerCase() === email
        );
        if (userExists) {
            setErrors({ email: "Email already registered" });
            return;
        }
        const newUser = {
            User_id: Date.now(),
            name: formData.name.trim(),
            email: email,
            password: formData.password,
            Contacts: []
        };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));
        setNotificationOpen(true);
        setTimeout(() => {
            navigate("/login", {
                state: { message: "Signup successful. Please login." },
            });
        }, 700);
    };





    return (
        <>
            <AuthFormCard title="Sign Up" subtitle="Create your account to continue">
                <Stack component="form" noValidate onSubmit={handleSubmit} spacing={1.8} sx={{ width: "100%" }}>

                    <TextField
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={!!errors.name}
                        helperText={errors.name}
                        autoComplete="name"
                    />

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
                        autoComplete="new-password"
                    />

                    <TextField
                        label="Confirm Password"
                        name="confirmpassword"
                        type="password"
                        value={formData.confirmpassword}
                        onChange={handleChange}
                        error={!!errors.confirmpassword}
                        helperText={errors.confirmpassword}
                        autoComplete="new-password"
                    />

                    <Button
                        variant="contained"
                        type="submit"
                        fullWidth
                        size="large"
                        sx={{ mt: 1, py: 1.2 }}
                    >
                        Sign Up
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        Already have an account?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            type="button"
                            onClick={() => navigate("/login")}
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                            Login here
                        </Link>
                    </Typography>
                </Stack>
            </AuthFormCard>

            <Snackbar
                open={notificationOpen}
                autoHideDuration={2200}
                onClose={() => setNotificationOpen(false)}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
                <Alert
                    onClose={() => setNotificationOpen(false)}
                    severity="success"
                    variant="filled"
                    sx={{ width: "100%" }}
                >
                    Account created successfully.
                </Alert>
            </Snackbar>
        </>
    );
}

export default Signup;
