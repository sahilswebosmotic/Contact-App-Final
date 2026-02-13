import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Typography, Box, Paper } from "@mui/material";

function Dashboard() {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("currentUser"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                px: 2
            }}
        >
            <Paper elevation={6} sx={{ width: "100%", maxWidth: 520, borderRadius: 3 }}>
                <Box sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
                    <Typography variant="h4" gutterBottom>
                        Welcome, {user?.name}
                    </Typography>

                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        You are now logged in to your dashboard.
                    </Typography>

                    <Button
                        variant="contained"
                        sx={{ mt: 1, px: 4, py: 1.2 }}
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </Box>
            </Paper>
        </Box>
    );
}

export default Dashboard;
