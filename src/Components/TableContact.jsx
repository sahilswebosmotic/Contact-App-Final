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
} from "@mui/material";
const TableContact = ({ userData, onDeleteContact, onEditContact }) => {

    return (
        <Box sx={{ width : { xxl :'65%', xl:'70%', lg:'80%', md : '85%',sm: '90%' , xs : '95%'}, alignSelf:"center",justifySelf:"center", px: { xs: 1.5, sm: 2, md: 4 }, pb: { xs: 4, sm: 6 } }}>
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
                            <TableCell sx = {{position:'sticky' ,bgcolor: "grey.300", left:0, zIndex:1}} >Profile Image</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone Number</TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody >
                        {userData.map((contact) => (
                            <TableRow key={contact.Contact_id}>
                                <TableCell sx = {{position:'sticky' ,bgcolor: "white",left:0, zIndex:1}}>
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
                                // sx={{ wordBreak: "break-word" }}
                                >{contact.name ? contact.name : "—"}</TableCell>
                                <TableCell 
                                // sx={{ wordBreak: "break-word", maxWidth: 240 }}
                                >{contact.email ? contact.email : "—"}</TableCell>
                                <TableCell 
                                // sx={{ wordBreak: "break-word" }}
                                >{contact.phonenumber ? contact.phonenumber : "—"}</TableCell>
                                <TableCell  >
                                    <Stack direction={{ xs: "column", lg: "row" }} sx={{maxWidth:"60%"}} spacing={1}>
                                        <Button
                                            color="error"
                                            variant="contained"
                                            onClick={() => onDeleteContact(contact.Contact_id)}
                                            fullWidth
                                            sx={{width:"100%"}}
                                            size="small"
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            color="success"
                                            onClick={() => onEditContact(contact)}
                                            variant="contained"
                                            fullWidth
                                            sx={{width:"100%"}}
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
        </Box>
    );
}

export default TableContact