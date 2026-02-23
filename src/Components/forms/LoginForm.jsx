import { Box, Button, Typography ,Stack,Link} from "@mui/material";
import FormInput from "./FormInput";
import AuthFormCard from "@components/AuthFormCard";
import { useNavigate } from "react-router-dom";
export default function LoginForm({
    register,
    errors,
    onSubmit,
}) {

    const navigate = useNavigate();

    return (
        <>
            <AuthFormCard title="Login" subtitle="Welcome back, please sign in">
                <Stack component="form" noValidate onSubmit={onSubmit} spacing={1.8} sx={{ width: "100%" }}>

                    <FormInput
                        label="Email"
                        name="email"
                        register={register}
                        errors={errors}
                    />

                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        register={register}
                        errors={errors}
                    />

                    <Button type="submit" variant="contained" fullWidth size="large" sx={{ mt: 1, py: 1.2 }}>
                        Login
                    </Button>

                    <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                        New user?{" "}
                        <Link
                            component="button"
                            variant="body2"
                            type="button"
                            onClick={() => navigate("/signup")}
                            sx={{ cursor: "pointer", fontWeight: 600 }}
                        >
                            Create account
                        </Link>
                    </Typography>
                </Stack>
            </AuthFormCard>
        </>
    );
}
