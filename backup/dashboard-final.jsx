import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Button,
    Typography,
    Box,
    Paper,
    AppBar,
    Toolbar,
    TextField,
    IconButton,
    Avatar,
    Modal,
    Container,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
} from "@mui/material";
function Dashboard() {
    const navigate = useNavigate();

    const [userData, setUserData] = useState([]);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phonenumber: "",
        profilImage: "",
    });

    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState("");

    const user = JSON.parse(localStorage.getItem("currentUser"));



    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
    }, [user, navigate]);



    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);



    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);

        const reader = new FileReader();
        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                profilImage: reader.result,
            }));
        };
        reader.readAsDataURL(file);
        setPreviewUrl(fileUrl);
    };

    const handleRemoveImage = () => {
        setPreviewUrl("");

        setFormData((prev) => ({
            ...prev,
            profilImage: "",
        }));

        if (fileInputRef.current) fileInputRef.current.value = "";

    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
            navigate("/login");
            return;
        }

        const updatedUsers = users.map((u) => {
            if (u.User_id === currentUser.User_id) {
                return {
                    ...u,
                    Contacts: [
                        ...u.Contacts,
                        {
                            ...formData,
                            Contact_id: Date.now(),
                        },
                    ],
                };
            }
            return u;
        });

        const updatedCurrentUser = updatedUsers.find(
            (u) => u.User_id === currentUser.User_id,
        );

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

        setUserData(updatedCurrentUser.Contacts);

        setFormData({
            name: "",
            email: "",
            phonenumber: "",
            profilImage: "",
        });

        setPreviewUrl("");
        handleClose();
    };


    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [tableOpen, setTableOpen] = useState(false);
    const handleTableOpen = () => setTableOpen(true);
    const handleTableClose = () => setTableOpen(false);


    const handleDeleteContatct = (contactId) => {
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        if (!currentUser) {
            navigate("/login");
            return;
        }

        const updatedUsers = users.map((u) => {
            if (u.User_id === currentUser.User_id) {
                return {
                    ...u,
                    Contacts: u.Contacts.filter(
                        (contact) => contact.Contact_id !== contactId,
                    ),
                };
            }
            return u;
        });
        
        const updatedCurrentUser = updatedUsers.find(
            (u) => u.User_id === currentUser.User_id,
        );

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));
        
        setUserData(updatedCurrentUser.Contacts);
    };

    return (
        <>
            <Box>
                <AppBar position="sticky" sx={{ padding: "0.5% 8%" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h4">Contact App</Typography>

                        <Box>
                            <Button
                                color="error"
                                variant="contained"
                                sx={{ mx: 1 }}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>

                            <Button
                                color="warning"
                                variant="contained"
                                sx={{ mx: 1 }}
                                onClick={() => console.log("Export not implemented")}
                            >
                                Export Excel
                            </Button>

                            <Button
                                color="success"
                                variant="contained"
                                sx={{ mx: 1 }}
                                onClick={() => console.log("Import not implemented")}
                            >
                                Import Excel
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{ margin: "1% 10%" }}>
                <Paper elevation={6} sx={{ borderRadius: 3, p: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
                        <Button 
                        onClick={handleOpen} 
                        variant="outlined">
                            Add Contact
                        </Button>

                        <Button onClick={handleTableOpen} variant="outlined">
                            Contact List
                        </Button>
                    </Box>
                </Paper>
            </Box>


            <Modal open={open} onClose={handleClose}>
            {/* <AddContact /> */}
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <Paper sx={{ p: 3, width: 320 }}>
                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                        >
                            <Container
                                sx={{ display: "flex", justifyContent: "space-between", p: 0 }}
                            >
                                <Typography variant="h6">Add Contact</Typography>

                                <Button color="error" onClick={handleClose}>
                                    Close
                                </Button>
                            </Container>

                            <IconButton component="label" sx={{ alignSelf: "center" }}>
                                <Avatar src={previewUrl} sx={{ width: 80, height: 80 }} />
                                <input
                                    hidden
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    ref={fileInputRef}
                                />
                            </IconButton>

                            {previewUrl && (
                                <Button variant="outlined" onClick={handleRemoveImage}>
                                    Remove Image
                                </Button>
                            )}

                            <TextField
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                            />

                            <TextField
                                label="Phone Number"
                                name="phonenumber"
                                type="tel"
                                value={formData.phonenumber}
                                onChange={handleChange}
                            />

                            <Button variant="contained" type="submit">
                                Add Contact
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Modal> 



            <Modal open={tableOpen} onClose={handleTableClose}>
                <Box
                    sx={{
                        minHeight: "100vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        p: 3,
                    }}
                >
                    <TableContainer component={Paper} sx={{ maxWidth: "80vw", maxHeight: "80vh" }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Profile Image</TableCell>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Email</TableCell>
                                    <TableCell>Phone Number</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>

                            <TableBody>
                                {userData.map((contact) => (
                                    <TableRow key={contact.Contact_id}>
                                        <TableCell>
                                            {contact.profilImage ? (
                                                <Avatar
                                                    src={contact.profilImage}
                                                />
                                            ) : (
                                                "—"
                                            )}
                                        </TableCell>
                                        <TableCell>{contact.name ? contact.name : "—"}</TableCell>
                                        <TableCell>{contact.email ? contact.email : "—"}</TableCell>
                                        <TableCell>{contact.phonenumber ? contact.phonenumber : "—"}</TableCell>
                                        <TableCell>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                onClick={() => handleDeleteContatct(contact.Contact_id)}
                                            >
                                                Delete
                                            </Button>
                                            <Button
                                                color="error"
                                                variant="outlined"
                                                // onClick={() => handleUpdateContact(contact.Contact_id)}
                                            >
                                                Update
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Modal>
        </>
    );
}

export default Dashboard;
