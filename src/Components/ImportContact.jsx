import { Button, Stack, Typography } from "@mui/material";
import { useCSVReader } from "react-papaparse";
import AppModal from "./common/AppModal";

const ImportContact = ({ open, onClose, onImport }) => {
    const { CSVReader } = useCSVReader();

    return (
        <AppModal open={open} onClose={onClose} maxWidth={430}>
            <Stack spacing={1.6}>
                <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.dark" }}>
                    Import Contacts
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Upload a CSV file with columns: name, email, phonenumber, profilImage.
                </Typography>

                <CSVReader
                    onUploadAccepted={(results) => {
                        const rows = results.data || [];
                        onImport(rows);
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
        </AppModal>
    );
};

export default ImportContact;
