import {
    Button,
    Box,
    Paper,
    TextField,
    IconButton,
    Avatar,
    Typography,
    Stack,
    Modal,
} from "@mui/material";

const AddContact = ({
    formData,
    openForm,
    handleCloseForm,
    errors,
    previewUrl,
    fileInputRef,
    onChange,
    onAddContact,
    onFileChange,
    onRemoveImage,
    onSubmit,
    isEditMode,
    onCancelEdit,
}) => {
    return (
        <Modal sx={{ display: "flex", justifyContent: "center", alignItems:"center"}} open ={openForm} onClose={handleCloseForm} >
        
        <Box sx={{ display: "flex", justifyContent: "center", alignItems:"center", px: { xs: 1.5, sm: 2 }, pb: { xs: 3.5, sm: 6 } }}>
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

                        <IconButton component="label" sx={{ alignSelf: "center", p: 0.5 }}>
                            <Avatar
                                src={previewUrl}
                                sx={{
                                    width: { xs: 86, sm: 98 },
                                    height: { xs: 86, sm: 98 },
                                    border: 2,
                                    borderColor: "primary.light",
                                }}
                                />
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                onChange={onFileChange}
                                ref={fileInputRef}
                                />
                        </IconButton>

                        {errors.profilImage && !previewUrl && (
                            <Typography variant="caption" color="error" sx={{ textAlign: "center", mt: -0.8 }}>
                                {errors.profilImage}
                            </Typography>
                        )}

                        {previewUrl && (
                            <Button variant="outlined" color="inherit" onClick={onRemoveImage} sx={{ alignSelf: "center" }}>
                                Remove Image
                            </Button>
                        )}

                        <TextField
                            label="Name"
                            name="name"
                            value={formData.name}
                            onChange={onChange}
                            error={!!errors.name}
                            helperText={errors.name}
                            autoComplete="name"
                            />

                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={onChange}
                            error={!!errors.email}
                            helperText={errors.email}
                            autoComplete="email"
                            />

                        <TextField
                            label="Phone Number"
                            name="phonenumber"
                            type="tel"
                            value={formData.phonenumber}
                            onChange={onChange}
                            error={!!errors.phonenumber}
                            helperText={errors.phonenumber}
                            autoComplete="tel"
                            />

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                            <Button variant="contained" color="primary" type="submit" onClick={onAddContact} fullWidth>
                                {isEditMode ? "Update Contact" : "Add Contact"}
                            </Button>

                            {isEditMode && (
                                <Button variant="outlined" color="inherit" onClick={onCancelEdit} fullWidth>
                                    Cancel
                                </Button>
                            )}
                        </Stack>
                    </Box>
                </Paper>
            </Box>
        </Box>
    </Modal>
    );
};

export default AddContact;





