import { Box, Button, Typography } from "@mui/material";
import AppModal from "./AppModal";

const ConfirmDialog = ({
    open,
    onClose,
    onConfirm,
    message,
    confirmLabel = "Ok",
    cancelLabel = "Cancel",
    confirmColor = "primary",
}) => {
    return (
        <AppModal open={open} onClose={onClose} maxWidth={520}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {message}
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.2 }}>
                <Button onClick={onConfirm} color={confirmColor}>{confirmLabel}</Button>
                <Button onClick={onClose} color="inherit">{cancelLabel}</Button>
            </Box>
        </AppModal>
    );
};

export default ConfirmDialog;
