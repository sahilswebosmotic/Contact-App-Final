import {
    Button,
    Box,
    Paper,
    Avatar,
    Stack,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
    Modal
} from "@mui/material";
import { useState } from "react";
const TableContact = ({ userData, onDeleteContact, onEditContact, openDelete, handleCloseDelete, handleOpenDelete }) => {
    
    const [selectedContactId, setSelectedContactId] = useState(null);
    const handleRequestDelete = (contactId) => {
        setSelectedContactId(contactId);
        handleOpenDelete();
    };

    const handleConfirmDelete = () => {
        if(!selectedContactId) return;
        onDeleteContact(selectedContactId);
    };
    return (
        <Box sx={{ width: { xxl: '65%', xl: '70%', lg: '80%', md: '85%', sm: '90%', xs: '95%' }, alignSelf: "center", justifySelf: "center", px: { xs: 1.5, sm: 2, md: 4 }, pb: { xs: 4, sm: 6 } }}>
            <TableContainer
                component={Paper}
                sx={{
                    borderRadius: 2,
                    border: 1,
                    borderColor: "divider",
                    overflowX: "auto",
                    boxShadow: "0 12px 24px rgba(15, 23, 42, 0.06)",
                }}
            >
                <Table sx={{ minWidth: 680 }}>
                    <TableHead sx={{ bgcolor: "grey.300" }}>
                        <TableRow>
                            <TableCell sx={{ position: 'sticky', bgcolor: "grey.300", left: 0, zIndex: 1 }} >Profile Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody >
                        {userData.map((contact) => (
                            <TableRow key={contact.Contact_id}>
                                <TableCell sx={{ position: 'sticky', bgcolor: "white", left: 0, zIndex: 1 }}>
                                    {contact.profilImage ? (
                                        <Avatar
                                            src={contact.profilImage}
                                        />
                                    ) : (
                                        <Avatar
                                            src={undefined}
                                        />
                                    )}

                                </TableCell>
                                <TableCell
                                >{contact.name ? contact.name : "—"}</TableCell>
                                <TableCell
                                >{contact.email ? contact.email : "—"}</TableCell>
                                <TableCell
                                >{contact.phonenumber ? contact.phonenumber : "—"}</TableCell>
                                <TableCell  >
                                    <Stack direction={{ xs: "column", lg: "row" }} sx={{ maxWidth: "60%" }} spacing={1}>
                                    <Button
                                            color="error"
                                            variant="contained"
                                            onClick={() => handleRequestDelete(contact.Contact_id)}
                                            fullWidth
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            color="success"
                                            onClick={() => onEditContact(contact)}
                                            variant="contained"
                                            fullWidth
                                            sx={{ width: "100%" }}
                                            size="small"
                                        >
                                            Edit
                                        </Button>

                                    </Stack>
                                </TableCell>
                            </TableRow>
                        ))}

                        {userData.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={5}>
                                    <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: "center" }}>
                                        No contacts found. Add a contact to see it here.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>

                </Table>
            </TableContainer>
            <Modal
                sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
                open={openDelete}
                onClose={handleCloseDelete}
            >
                <Box sx={{ px: { xs: 1.5, sm: 2 }, pb: { xs: 3.5, sm: 6 } }}>
                    <Paper
                        elevation={0}
                        sx={{
                            p: { xs: 2, sm: 2.8, md: 3.2 },
                            borderRadius: { xs: 2.2, sm: 2.6 },
                            border: 1,
                            borderColor: "divider",
                            boxShadow: "0 14px 28px rgba(15, 23, 42, 0.08)",
                            maxWidth: 520
                        }}
                    >
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                            Are you sure you want to delete this contact? This action cannot be undone.
                        </Typography>

                        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.2 }}>
                            <Button onClick={handleConfirmDelete}>
                                Ok
                            </Button>
                            <Button onClick={handleCloseDelete}>
                                Cancel
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Modal>
        </Box>
    );
}

export default TableContact