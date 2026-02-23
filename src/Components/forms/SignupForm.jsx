import { Stack, Button, Link, Typography } from "@mui/material";
import AuthFormCard from "@components/AuthFormCard";
import FormInput from "./FormInput";
import { useNavigate } from "react-router-dom";

export default function SignupForm({
    register,
    errors,
    onSubmit,
}) {
    const navigate = useNavigate();

    return (
        <AuthFormCard
            title="Sign Up"
            subtitle="Create your account to continue"
        >
            <Stack
                component="form"
                noValidate
                onSubmit={onSubmit}
                spacing={1.8}
                sx={{ width: "100%" }}
            >
                <FormInput
                    label="Name"
                    name="name"
                    register={register}
                    errors={errors}
                />

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

                <FormInput
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    register={register}
                    errors={errors}
                />

                <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    size="large"
                    sx={{ mt: 1, py: 1.2 }}
                >
                    Register
                </Button>

                <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
                    Already have an account?{" "}
                    <Link
                        component="button"
                        variant="body2"
                        onClick={() => navigate("/")}
                        sx={{ cursor: "pointer", fontWeight: 600 }}
                    >
                        Login here
                    </Link>
                </Typography>
            </Stack>
        </AuthFormCard>
    );
}