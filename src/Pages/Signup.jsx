import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../components/validation/authSchemas";
import { useNavigate } from "react-router-dom";
import SignupForm from "../components/forms/signupForm";
import { v4 as uuidv4 } from "uuid";

function Signup() {
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(signupSchema),
    });



    const onSubmit = (data) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const email = data.email.trim().toLowerCase();

        const userExists = users.find(
            (user) => user.email.toLowerCase() === email
        );

        if (userExists) {
            setError("email", {
                type: "manual",
                message: "Email already registered",
            });
            return;
        }

        const newUser = {
            User_id: uuidv4(),
            name: data.name.trim(),
            email,
            password: data.password,
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
            errors={errors}
            onSubmit={submitHandler}
        />
    );
}

export default Signup;