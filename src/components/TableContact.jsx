import {
    Box,
    Paper,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Typography,
} from "@mui/material";
import { useState } from "react";
import ContactTableRow from "./contact/ContactTableRow";
import ConfirmDialog from "./common/ConfirmDialog";

const TableContact = ({
    userData,
    onDeleteContact,
    onEditContact,
    openDelete,
    handleCloseDelete,
    handleOpenDelete,
}) => {
    const [selectedContactId, setSelectedContactId] = useState(null);

    const handleRequestDelete = (contactId) => {
        setSelectedContactId(contactId);
        handleOpenDelete();
    };

    const handleConfirmDelete = () => {
        if (!selectedContactId) return;
        onDeleteContact(selectedContactId);
    };

    return (
        <Box
            sx={{
                width: { xxl: "65%", xl: "70%", lg: "80%", md: "85%", sm: "90%", xs: "95%" },
                alignSelf: "center",
                justifySelf: "center",
                px: { xs: 1.5, sm: 2, md: 4 },
                pb: { xs: 4, sm: 6 },
            }}
        >
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
                            <TableCell sx={{ position: "sticky", bgcolor: "grey.300", left: 0, zIndex: 1 }}>
                                Profile Image
                            </TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {userData.map((contact) => (
                            <ContactTableRow
                                key={contact.Contact_id}
                                contact={contact}
                                onDelete={handleRequestDelete}
                                onEdit={onEditContact}
                            />
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

            <ConfirmDialog
                open={openDelete}
                onClose={handleCloseDelete}
                onConfirm={handleConfirmDelete}
                message="Are you sure you want to delete this contact? This action cannot be undone."
                confirmColor="error"
            />
        </Box>
    );
};

export default TableContact;
