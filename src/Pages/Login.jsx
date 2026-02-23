import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const [errorMessage, setErrorMessage] = useState("");
    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        setErrorMessage("");
        const email = data.email?.trim().toLowerCase();
        const password = data.password?.trim();

        if (!email || !password ||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setErrorMessage("Please fill in all required fields.");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const emailUser = users.find((user) => user.email.toLowerCase() === email);

        if (!emailUser || !emailUser.email || emailUser.password !== password) {
            setErrorMessage("Please enter valid credentials.");
            return;
        }

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify({ User_id: emailUser.User_id }),
        );

        navigate("/dashboard", {
            state: { message: `Welcome back, ${emailUser.name}!` },
        });
    };

    return (
        <LoginForm
            register={register}
            onSubmit={handleSubmit(onSubmit)}
            message={errorMessage || location.state?.message}
            messageType={errorMessage ? "error" : "success"}
        />
    );
}

export default Login;
