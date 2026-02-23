import { Box, Modal, Paper } from "@mui/material";

const AppModal = ({
    open,
    onClose,
    children,
    maxWidth = 540,
    paperSx,
    contentSx,
}) => {
    return (
        <Modal
            sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
            open={open}
            onClose={onClose}
        >
            <Box sx={{ px: { xs: 1.5, sm: 2 }, ...contentSx }}>
                <Paper
                    elevation={0}
                    sx={{
                        mx: "auto",
                        width: "100%",
                        maxWidth,
                        p: { xs: 2, sm: 2.8, md: 3.2 },
                        borderRadius: { xs: 2.2, sm: 2.6 },
                        border: 1,
                        borderColor: "divider",
                        boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
                        ...paperSx,
                    }}
                >
                    {children}
                </Paper>
            </Box>
        </Modal>
    );
};

export default AppModal;
