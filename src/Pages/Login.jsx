import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../components/validation/authSchemas";
import { useNavigate } from "react-router-dom";
import LoginForm from "../components/forms/LoginForm";

function Login() {
    const navigate = useNavigate();
        const {
            register,
            handleSubmit,
            setError,
            formState: { errors },
        } = useForm({
            resolver: yupResolver(loginSchema),
        });

    const onSubmit = (data) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const emailUser = users.find((user) => user.email === data.email);

        if (!emailUser) {
            setError("email", {
                type: "manual",
                message: "Email is not registered",
            });
            return;
        }

        if (emailUser.password !== data.password) {
            setError("password", {
                type: "manual",
                message: "Incorrect password",
            });
            return;
        }

        sessionStorage.setItem(
            "currentUser",
            JSON.stringify({ User_id: emailUser.User_id }),
        );

            navigate("/dashboard",{
                state: { message: `Welcome back, ${emailUser.name}!` },
            });
    };
    return (
        <LoginForm
        register={register}
        errors={errors}
        onSubmit={handleSubmit(onSubmit)}
        />
    );
}

export default Login;