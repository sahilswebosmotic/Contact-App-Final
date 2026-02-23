import { Alert, Button, Stack } from "@mui/material";
import AuthFormCard from "@components/AuthFormCard";
import AuthFieldList from "./AuthFieldList";
import AuthRedirectText from "./AuthRedirectText";
import { useNavigate } from "react-router-dom";

const LOGIN_FIELDS = [
    { label: "Email", name: "email" },
    { label: "Password", name: "password", type: "password" },
];

export default function LoginForm({ register, onSubmit, message, messageType = "error" }) {
    const navigate = useNavigate();

    return (
        <AuthFormCard title="Login" subtitle="Welcome back, please sign in">
            <Stack component="form" noValidate onSubmit={onSubmit} spacing={1.8} sx={{ width: "100%" }}>
                {message && <Alert severity={messageType}>{message}</Alert>}

                <AuthFieldList fields={LOGIN_FIELDS} register={register} />

                <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.2 }}>
                    Login
                </Button>

                <AuthRedirectText
                    prompt="New user?"
                    linkLabel="Create account"
                    onClick={() => navigate("/signup")}
                />
            </Stack>
        </AuthFormCard>
    );
}
