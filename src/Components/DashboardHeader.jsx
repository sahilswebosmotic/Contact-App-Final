import { AppBar, Box, Button, Stack, Toolbar, Typography } from "@mui/material";
import { useCSVDownloader } from "react-papaparse";
import ConfirmDialog from "./common/ConfirmDialog";

const DashboardHeader = ({
    userData,
    onImportOpen,
    onLogout,
    handleExportContacts,
    openLogout,
    handleCloseLogout,
    handleOpenLogout,
}) => {
    const { CSVDownloader } = useCSVDownloader();

    return (
        <AppBar
            position="sticky"
            color="transparent"
            elevation={0}
            sx={{
                borderBottom: 1,
                borderColor: "divider",
                backdropFilter: "blur(10px)",
                bgcolor: "rgba(248, 250, 252, 0.92)",
            }}
        >
            <Toolbar
                sx={{
                    px: { xs: 1.5, sm: 2, md: 8 },
                    py: 1,
                    justifyContent: "space-between",
                    alignItems: { xs: "flex-start", sm: "center" },
                    gap: 1.2,
                    flexWrap: "wrap",
                }}
            >
                <Box sx={{ pr: { xs: 1, sm: 0 } }}>
                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 700,
                            color: "primary.dark",
                            fontSize: { xs: "1.45rem", sm: "1.85rem" },
                        }}
                    >
                        Contact App
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        A calm space to manage your network
                    </Typography>
                </Box>

                <Stack
                    direction={{ xs: "row", sm: "row" }}
                    spacing={1.2}
                    sx={{
                        width: { xs: "100%", sm: "auto" },
                        display: "flex",
                        justifyContent: { xs: "stretch", sm: "flex" },
                    }}
                >
                    <CSVDownloader filename="Contacts_2026" bom config={{ delimiter: ";" }} data={userData}>
                        <Button
                            onMouseOver={(e) => (e.target.style.background = "#303f9f")}
                            onMouseOut={(e) => (e.target.style.background = "#3f51b5")}
                            variant="contained"
                            color="primary"
                            sx={{
                                borderRadius: "8px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 2,
                                sm: { width: "100vw" },
                            }}
                            onClick={handleExportContacts}
                        >
                            Export
                        </Button>
                    </CSVDownloader>

                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2,
                        }}
                        onClick={onImportOpen}
                    >
                        Import
                    </Button>

                    <Button
                        variant="contained"
                        color="error"
                        sx={{
                            borderRadius: "8px",
                            textTransform: "none",
                            fontWeight: 600,
                            px: 2,
                        }}
                        onClick={handleOpenLogout}
                    >
                        Logout
                    </Button>

                    <ConfirmDialog
                        open={openLogout}
                        onClose={handleCloseLogout}
                        onConfirm={onLogout}
                        message="Are you sure you want to logout? Make sure to save any unsaved changes before logging out."
                    />
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;
