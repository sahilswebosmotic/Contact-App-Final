import { Avatar, Button, Stack, TableCell, TableRow } from "@mui/material";

const valueOrDash = (value) => (value ? value : "-");

const ContactTableRow = ({ contact, onDelete, onEdit }) => {
    return (
        <TableRow>
            <TableCell sx={{ position: "sticky", bgcolor: "white", left: 0, zIndex: 1 }}>
                <Avatar src={contact.profilImage || undefined} />
            </TableCell>
            <TableCell>{valueOrDash(contact.name)}</TableCell>
            <TableCell>{valueOrDash(contact.email)}</TableCell>
            <TableCell>{valueOrDash(contact.phonenumber)}</TableCell>
            <TableCell>
                <Stack direction={{ xs: "column", lg: "row" }} sx={{ maxWidth: "60%" }} spacing={1}>
                    <Button
                        color="error"
                        variant="contained"
                        onClick={() => onDelete(contact.Contact_id)}
                        fullWidth
                        size="small"
                    >
                        Delete
                    </Button>
                    <Button
                        color="success"
                        onClick={() => onEdit(contact)}
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
    );
};

export default ContactTableRow;
