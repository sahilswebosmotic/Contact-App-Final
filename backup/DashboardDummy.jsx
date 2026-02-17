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
    TableBody
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
        }
    }, [user, navigate]);

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const fileUrl = URL.createObjectURL(file);

        setFormData({
            ...formData,
            profilImage: fileUrl,
        });

        setPreviewUrl(fileUrl);
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
                        ...u["Contacts"],
                        {
                            ...formData,
                            Contact_id: Date.now(),
                        },
                    ],
                };
            }
            return u;
        });
        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser", JSON.stringify(updatedUsers));
        setUserData(updatedUsers.Contacts);

        setFormData({
            name: "",
            email: "",
            phonenumber: "",
            profilImage: "",
        });

        setPreviewUrl("");
    };

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     const users = JSON.parse(localStorage.getItem("users")) || [];
    //     const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    //     if (!currentUser) {
    //         navigate("/login");
    //         return;
    //     }

    //     const updatedUsers = users.map((u) => {
    //         if (u.User_id === currentUser.User_id) {
    //             return {
    //                 ...u,
    //                 Contacts: [
    //                     ...u.Contacts,
    //                     // { ...formData, Contact_id: Date.now() },
    //                 ],
    //             };
    //         }
    //         return u;
    //     });

    //     const updatedCurrentUser = updatedUsers.find(
    //         (u) => u.User_id === currentUser.User_id
    //     );

    //     localStorage.setItem("users", JSON.stringify(updatedUsers));
    //     localStorage.setItem("currentUser", JSON.stringify(updatedCurrentUser));

    //     setUserData(updatedCurrentUser.Contacts);

    //     setFormData({
    //         name: "",
    //         email: "",
    //         phonenumber: "",
    //         profilImage: "",
    //     });

    //     setPreviewUrl("");
    //     handleClose();
    // };


    const handleRemoveImage = () => {
        setPreviewUrl("");
        setFormData({
            ...formData,
            profilImage: "",
        });

        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const [tableopen, setTableOpen] = useState(false);
    const handleTableOpen = () => setTableOpen(true);
    const handleTableClose = () => setTableOpen(false);

    return (
        <>
            <Box>
                <AppBar position="sticky" color="primary" sx={{ padding: "0.5% 8%" }}>
                    <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography variant="h4">Contact App</Typography>
                        <Box>
                            <Button
                                color="error"
                                variant="contained"
                                sx={{ mt: 1, mx: 2, px: 4, py: 1.2 }}
                                onClick={handleLogout}
                            >
                                Logout
                            </Button>
                            <Button
                                color="warning"
                                variant="contained"
                                sx={{ mt: 1, mx: 2, px: 4, py: 1.2 }}
                                onClick={handleLogout}
                            >
                                Export Excel
                            </Button>
                            <Button
                                color="success"
                                variant="contained"
                                sx={{ mt: 1, mx: 2, px: 4, py: 1.2 }}
                                onClick={handleLogout}
                            >
                                Import Excel
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>
            </Box>

            <Box sx={{ margin: "1% 10%", height: "100%" }}>
                <Paper elevation={6} sx={{ width: "100%", borderRadius: 10 }}>
                    <Box
                        sx={{ padding: "1% 5%", display: "flex", justifyContent: "center" }}
                    >
                        <Button
                            onClick={handleOpen}
                            sx={{
                                borderRadius: 5,
                                margin: "0% 5%",
                                border: "1px solid #1976d2",
                            }}
                        >
                            <Typography variant="h7" color="#1976d2">
                                Add Contact
                            </Typography>
                        </Button>

                        <Button
                            onClick={handleTableOpen}
                            sx={{
                                borderRadius: 5,
                                margin: "0% 5%",
                                border: "1px solid #1976d2",
                            }}
                        >
                            <Typography variant="h7" color="#1976d2">
                                Contact List
                            </Typography>
                        </Button>

                    </Box>
                </Paper>
            </Box>

            {/* Add Contact Model */}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box
                    sx={{
                        minHeight: "100vh",
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        px: 2,
                    }}
                >
                    <Paper
                        elevation={6}
                        sx={{ width: "100%", maxWidth: "20%", borderRadius: 3 }}
                    >
                        <Box
                            component="form"
                            noValidate
                            onSubmit={handleSubmit}
                            sx={{ p: 4, display: "flex", flexDirection: "column", gap: 2.2 }}
                        >
                            <Container
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                }}
                            >
                                <Typography variant="h6">Add Contact</Typography>
                                <Button variant="contained" onClick={handleClose} color="error">
                                    Close
                                </Button>
                            </Container>

                            <IconButton component="label" sx={{ alignSelf: "center" }}>
                                <Avatar src={previewUrl} sx={{ width: 100, height: 100 }} />
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
                                fullWidth
                            />

                            <TextField
                                label="Email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                            />

                            <TextField
                                label="Phone Number"
                                name="phonenumber"
                                type="tel"
                                value={formData.phonenumber}
                                onChange={handleChange}
                                fullWidth
                            />

                            <Button
                                variant="contained"
                                type="submit"
                                size="large"
                                sx={{ mt: 1, py: 1.2 }}
                            >
                                Sign Up
                            </Button>
                        </Box>
                    </Paper>
                </Box>
            </Modal>

            {/* List Contact  Records*/}
            <Modal
                open={tableopen}
                onClose={handleTableClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align="right">Email</TableCell>
                                    <TableCell align="right">Phone Number</TableCell>
                                    <TableCell align="right">Profile Image</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {userData.map((user) => (
                                    <TableRow
                                        key={user.Contact_id}>
                                        <TableCell component="th" scope="row">
                                            {user.name}
                                        </TableCell>
                                        <TableCell align="right">{user.email}</TableCell>
                                        <TableCell align="right">{user.phonenumber}</TableCell>
                                        <TableCell align="right">{user.profilImage}</TableCell>
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
