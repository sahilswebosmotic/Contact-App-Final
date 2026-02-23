import { Alert, Button, Stack } from "@mui/material";
import AuthFormCard from "@components/AuthFormCard";
import AuthFieldList from "./AuthFieldList";
import AuthRedirectText from "./AuthRedirectText";
import { useNavigate } from "react-router-dom";

const SIGNUP_FIELDS = [
    { label: "Name", name: "name" },
    { label: "Email", name: "email" },
    { label: "Password", name: "password", type: "password" },
    { label: "Confirm Password", name: "confirmPassword", type: "password" },
];

export default function SignupForm({ register, onSubmit, message, messageType = "error" }) {
    const navigate = useNavigate();

    return (
        <AuthFormCard title="Sign Up" subtitle="Create your account to continue">
            <Stack component="form" noValidate onSubmit={onSubmit} spacing={1.8} sx={{ width: "100%" }}>
                {message && <Alert severity={messageType}>{message}</Alert>}

                <AuthFieldList fields={SIGNUP_FIELDS} register={register} />

                <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.2 }}>
                    Register
                </Button>

                <AuthRedirectText
                    prompt="Already have an account?"
                    linkLabel="Login here"
                    onClick={() => navigate("/")}
                />
            </Stack>
        </AuthFormCard>
    );
}
