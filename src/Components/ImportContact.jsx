import { Box, Button, Paper, Stack, Modal, Typography } from "@mui/material";
import { useCSVReader } from "react-papaparse";

const ImportContact = ({ open, onClose, onImport }) => {
    const { CSVReader } = useCSVReader();

    return (
        <Modal sx={{display:'flex',justifyContent:'center',alignItems:'center'}} open={open} onClose={onClose}>
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    px: 2,
                }}
            >
                <Paper
                    elevation={0}
                    sx={{
                        bgcolor: "background.paper",
                        p: { xs: 2.4, sm: 3 },
                        width: "100%",
                        maxWidth: 430,
                        border: 1,
                        borderColor: "divider",
                        boxShadow: "0 20px 45px rgba(15, 23, 42, 0.12)",
                    }}
                >
                    <Stack spacing={1.6}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.dark" }}>
                            Import Contacts
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Upload a CSV file with columns: name, email, phonenumber, profilImage.
                        </Typography>

                        <CSVReader
                            onUploadAccepted={(results) => {
                                const rows = results?.data || [];

                                if (onImport) onImport(rows);

                                // onClose();
                            }}
                        >
                            {({ getRootProps, acceptedFile, getRemoveFileProps }) => (
                                <Stack spacing={1.2}>
                                    <Button {...getRootProps()} variant="contained" color="primary" fullWidth>
                                        Browse CSV
                                    </Button>

                                    <Typography variant="body2" color="text.secondary">
                                        {acceptedFile?.name || "No file selected"}
                                    </Typography>

                                    {acceptedFile && (
                                        <Button {...getRemoveFileProps()} variant="outlined" color="inherit" fullWidth>
                                            Remove
                                        </Button>
                                    )}
                                </Stack>
                            )}
                        </CSVReader>
                    </Stack>
                </Paper>
            </Box>
        </Modal>
    );
};

export default ImportContact;

