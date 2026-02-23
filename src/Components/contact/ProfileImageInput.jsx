import { Button, IconButton, Avatar, Typography } from "@mui/material";

const ProfileImageInput = ({ previewUrl, onFileChange, fileInputRef, onRemoveImage, error }) => {
    return (
        <>
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

            {error && !previewUrl && (
                <Typography variant="caption" color="error" sx={{ textAlign: "center", mt: -0.8 }}>
                    {error}
                </Typography>
            )}

            {previewUrl && (
                <Button variant="outlined" color="inherit" onClick={onRemoveImage} sx={{ alignSelf: "center" }}>
                    Remove Image
                </Button>
            )}
        </>
    );
};

export default ProfileImageInput;
