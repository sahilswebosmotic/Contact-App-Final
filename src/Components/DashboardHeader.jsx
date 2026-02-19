import { AppBar, Box, Button,Paper, Modal, Stack, Toolbar, Typography } from "@mui/material";
import { useCSVDownloader } from "react-papaparse";
import React from "react";

const DashboardHeader = ({ userData, onImportOpen, onLogout, handleExportContacts ,openLogout,handleCloseLogout,handleOpenLogout }) => {
    const { CSVDownloader} = useCSVDownloader();


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
                    sx={{ width: { xs: "100%", sm: "auto" } , display: "flex", justifyContent: { xs: "stretch", sm: "flex" } }}
                >
                    <CSVDownloader
                        filename="Contacts_2026"
                        bom
                        config={{ delimiter: ";" }}
                        data={userData}
                    >
                        <Button
                            onMouseOver={(e) =>
                                (e.target.style.background = "#303f9f")
                            }
                            onMouseOut={(e) =>
                                (e.target.style.background = "#3f51b5")
                            }
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
                    <Modal sx={{ display: "flex", justifyContent: "center", alignItems: "center" }} open={openLogout} onClose={handleCloseLogout} >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", px: { xs: 1.5, sm: 2 }, pb: { xs: 3.5, sm: 6 } }}>
                            <Box sx={{ width: "100%", maxWidth: { xs: 620, md: 540 }, p: { xs: 0, sm: 1.2, md: 1.6 } }}>
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: { xs: 2, sm: 2.8, md: 3.2 },
                                        borderRadius: { xs: 2.2, sm: 2.6 },
                                        border: 1,
                                        borderColor: "divider",
                                        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
                                    }}
                                >
                                    <Box
                                        sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.4, sm: 1.8 } }}
                                    >
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.dark" }}>
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Are you sure you want to logout? Make sure to save any unsaved changes before logging out.
                                            </Typography>
                                        </Box>
                                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.2 ,width:"100%" }}>
                                        <Button 
                                        onClick={onLogout}
                                        >Ok</Button>
                                        <Button 
                                        onClick={handleCloseLogout}
                                        >Cancel</Button>
                                        </Box>
                                    </Box>
                                </Paper>
                            </Box>
                        </Box>
                    </Modal>
                </Stack>
            </Toolbar>
        </AppBar>
    );
};

export default DashboardHeader;

