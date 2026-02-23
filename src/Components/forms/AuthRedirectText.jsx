import { Link, Typography } from "@mui/material";

const AuthRedirectText = ({ prompt, linkLabel, onClick }) => {
    return (
        <Typography variant="body2" textAlign="center" sx={{ mt: 1 }}>
            {prompt}{" "}
            <Link
                component="button"
                variant="body2"
                type="button"
                onClick={onClick}
                sx={{ cursor: "pointer", fontWeight: 600 }}
            >
                {linkLabel}
            </Link>
        </Typography>
    );
};

export default AuthRedirectText;
