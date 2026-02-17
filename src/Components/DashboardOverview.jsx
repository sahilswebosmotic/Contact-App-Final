import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

const DashboardOverview = ({
    totalContacts,
    onOpenForm,
}) => {
    return (
        <Box sx={{ px: { xs: 1.5, sm: 2, md: 10 }, py: { xs: 2.5, sm: 4 } }}>
            <Paper
                elevation={0}
                sx={{
                    borderRadius:10,
                    p: { xs: 2.5, md: 3 },
                    border: 1,
                    borderColor: "divider",
                    bgcolor: "background.paper",
                    boxShadow: "0 12px 35px rgba(15, 23, 42, 0.08)",
                }}
            >
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={2}
                    alignItems={{ xs: "flex-start", md: "center" }}
                    justifyContent="space-between"
                >
                    <Stack
                        direction={{ xs: "column", sm: "row" }}
                        spacing={1.2}
                        alignItems={{ xs: "flex-start", sm: "center" }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "primary.dark",
                                fontSize: { xs: "1.05rem", sm: "1.25rem" },
                            }}
                        >
                            Contacts Dashboard
                        </Typography>
                        <Chip
                            color="info"
                            variant="outlined"
                            label={`Total contacts: ${totalContacts}`}
                        />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                        <Button onClick={onOpenForm} variant="contained" color="primary" sx={{ minWidth: 140 }} fullWidth>
                            + Add Contact
                        </Button>
                    </Stack>
                </Stack>
            </Paper>
        </Box>
    );
};

export default DashboardOverview;

