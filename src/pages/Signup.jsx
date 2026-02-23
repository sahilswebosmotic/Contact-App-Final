import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/forms/SignupForm";
import { v4 as uuidv4 } from "uuid";

function Signup() {
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("error");

    const { register, handleSubmit } = useForm();

    const onSubmit = (data) => {
        setMessage("");
        const name = data.name?.trim();
        const email = data.email?.trim().toLowerCase();
        const password = data.password?.trim();
        const confirmPassword = data.confirmPassword?.trim();

        if (!name || !email || !password || !confirmPassword || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 6 || password !== confirmPassword ) {
            setMessage("Please enter valid credentials.");
            setMessageType("error");
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(
            (user) => user.email.toLowerCase() === email
        );

        if (userExists) {
            setMessage("Email already registered.");
            setMessageType("error");
            return;
        }

        const newUser = {
            User_id: uuidv4(),
            name,
            email,
            password,
            Contacts: [],
        };

        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        navigate("/", {
            state: { message: "Account created successfully. Please login." },
        });
    };

    const submitHandler = handleSubmit(onSubmit);

    return (
        <SignupForm
            register={register}
            onSubmit={submitHandler}
            message={message}
            messageType={messageType}
        />
    );
}

export default Signup;
