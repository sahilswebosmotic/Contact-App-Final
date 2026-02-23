import {
    Button,
    Box,
    Paper,
    IconButton,
    Avatar,
    Typography,
    Stack,
    Modal,
} from "@mui/material";
import FormInput from "./forms/formInput";

const AddContact = ({
    openForm,
    handleCloseForm,
    errors,
    register,       
    handleSubmit,
    previewUrl,
    onFileChange,
    onRemoveImage,
    onSubmit,
    isEditMode,
    onCancelEdit,
}) => {
    return (
        <Modal
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            open={openForm}
            onClose={handleCloseForm}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    px: { xs: 1.5, sm: 2 },
                    pb: { xs: 3.5, sm: 6 },
                }}
            >
                <Box
                    sx={{
                        width: "100%",
                        maxWidth: { xs: 620, md: 540 },
                        p: { xs: 0, sm: 1.2, md: 1.6 },
                    }}
                >
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
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                gap: { xs: 1.4, sm: 1.8 },
                            }}
                        >
                            <Box>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700, color: "primary.dark" }}
                                >
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
                                    width: 96,
                                    height: 96,
                                    border: 2,
                                    borderColor: "primary.light",
                                }}
                            />
                            <input
                                hidden
                                type="file"
                                accept="image/*"
                                {...register("profilImage")}
                                onChange={onFileChange}
                            />
                        </IconButton>

                        {errors.profilImage && (
                            <Typography
                                variant="caption"
                                color="error"
                                sx={{ textAlign: "center" }}
                            >
                                {errors.profilImage?.message}
                            </Typography>
                        )}

                        {previewUrl && (
                            <Button
                                variant="outlined"
                                color="inherit"
                                onClick={onRemoveImage}
                                sx={{ alignSelf: "center" }}
                            >
                                Remove Image
                            </Button>
                        )}

                        <FormInput
                            label="Name"
                            name="name"
                            register={register}
                            errors={errors}
                        />

                        <FormInput
                            label="Email"
                            name="email"
                            type="email"
                            register={register}
                            errors={errors}
                        />

                        <FormInput
                            label="Phone Number"
                            name="phonenumber"
                            type="tel"
                            register={register}
                            errors={errors}
                        />

                            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.2}>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    type="submit"
                                    onClick={handleSubmit(onSubmit)}
                                    fullWidth
                                >
                                    {isEditMode ? "Save" : "Add Contact"}
                                </Button>

                                {isEditMode && (
                                    <Button
                                        variant="outlined"
                                        color="inherit"
                                        onClick={onCancelEdit}
                                        fullWidth
                                    >
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
