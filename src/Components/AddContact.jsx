import {
    Button,
    Box,
    Typography,
    Stack,
} from "@mui/material";
import AppModal from "./common/AppModal";
import ProfileImageInput from "./contact/ProfileImageInput";
import ContactFormFields from "./contact/ContactFormFields";

const AddContact = ({
    formData,
    openForm,
    handleCloseForm,
    errors,
    previewUrl,
    fileInputRef,
    onChange,
    onFileChange,
    onRemoveImage,
    onSubmit,
    isEditMode,
    onCancelEdit,
}) => {
    return (
        <AppModal open={openForm} onClose={handleCloseForm} maxWidth={540}>
            <Box
                component="form"
                noValidate
                onSubmit={onSubmit}
                sx={{ display: "flex", flexDirection: "column", gap: { xs: 1.4, sm: 1.8 } }}
            >
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.dark" }}>
                        {isEditMode ? "Update Contact" : "Add New Contact"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Fill in the details below to save contact information.
                    </Typography>
                </Box>

                <ProfileImageInput
                    previewUrl={previewUrl}
                    onFileChange={onFileChange}
                    fileInputRef={fileInputRef}
                    onRemoveImage={onRemoveImage}
                    error={errors.profilImage}
                />

                <ContactFormFields formData={formData} errors={errors} onChange={onChange} />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                    <Button variant="contained" color="primary" type="submit" fullWidth>
                        {isEditMode ? "Save" : "Add Contact"}
                    </Button>

                    {isEditMode && (
                        <Button variant="outlined" color="inherit" onClick={onCancelEdit} fullWidth>
                            Cancel
                        </Button>
                    )}
                </Stack>
            </Box>
        </AppModal>
    );
};

export default AddContact;



