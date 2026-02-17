import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const DEFAULT_FORM = {
    name: "",
    email: "",
    phonenumber: "",
    profilImage: "",
};

const safeJsonParse = (value, fallback) => {
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
};

const getUsers = () => safeJsonParse(localStorage.getItem("users"), []) || [];
const getCurrentUser = () =>
    safeJsonParse(localStorage.getItem("currentUser"), null);

const persistUsersAndCurrentUser = (users, currentUser) => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};

export default function useContactsDashboard() {
    const navigate = useNavigate();
    const initialUser = getCurrentUser();

    const [errors, setErrors] = useState({});
    const [userName, setUserName] = useState(initialUser?.name || "User");
    const [userData, setUserData] = useState(initialUser?.Contacts || []);
    const [editingContactId, setEditingContactId] = useState(null);
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [previewUrl, setPreviewUrl] = useState("");
    const [openForm,setopenForm] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    const fileInputRef = useRef(null);

    useEffect(() => {
        if (!getCurrentUser()) {
            navigate("/login");
        }
    }, [navigate]);

    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // Multi tab sync by the Local Storage

    useEffect(() => {
        const handleStorageSync = (event) => {
            if (event.storageArea !== localStorage) {
                return;
            }

            if (event.key && event.key !== "users" && event.key !== "currentUser") {
                return;
            }

            const latestCurrentUser = getCurrentUser();

            if (!latestCurrentUser) {
                navigate("/login");
                return;
            }

            const latestContacts = Array.isArray(latestCurrentUser.Contacts)
                ? latestCurrentUser.Contacts
                : [];

            setUserName(latestCurrentUser.name || "User");
            setUserData(latestContacts);

            if (
                editingContactId !== null &&
                !latestContacts.some((contact) => contact.Contact_id === editingContactId)
            ) {
                setEditingContactId(null);
            }
        };

        window.addEventListener("storage", handleStorageSync);

        return () => {
            window.removeEventListener("storage", handleStorageSync);
        };
    }, [editingContactId, navigate]);

    // Reseting Form State

    const resetFormState = () => {
        setFormData(DEFAULT_FORM);
        setPreviewUrl("");
        setErrors({});
        setEditingContactId(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const showSuccess = (message) => {
        setNotification({
            open: true,
            message,
            severity: "success",
        });
    };

    const handleCloseNotification = (_, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setNotification((prev) => ({
            ...prev,
            open: false,
        }));
    };

    const requireCurrentUser = () => {
        const currentUser = getCurrentUser();

        if (!currentUser) {
            navigate("/login");
            return null;
        }

        return currentUser;
    };

    const updateCurrentUserContacts = (contactsUpdater) => {
        const users = getUsers();
        const currentUser = requireCurrentUser();

        if (!currentUser) {
            return null;
        }

        const updatedUsers = users.map((user) => {
            if (user.User_id !== currentUser.User_id) {
                return user;
            }

            const existingContacts = Array.isArray(user.Contacts) ? user.Contacts : [];

            return {
                ...user,
                Contacts: contactsUpdater(existingContacts),
            };
        });

        const updatedCurrentUser =
            updatedUsers.find((user) => user.User_id === currentUser.User_id) ||
            currentUser;

        persistUsersAndCurrentUser(updatedUsers, updatedCurrentUser);
        setUserData(updatedCurrentUser.Contacts || []);

        return updatedCurrentUser;
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");

        navigate(-1);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        const nextPreviewUrl = URL.createObjectURL(file);
        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData((prev) => ({
                ...prev,
                profilImage: reader.result,
            }));

            setPreviewUrl((prev) => {
                if (prev?.startsWith("blob:")) {
                    URL.revokeObjectURL(prev);
                }

                return nextPreviewUrl;
            });
        };

        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        if (previewUrl?.startsWith("blob:")) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl("");
        setFormData((prev) => ({
            ...prev,
            profilImage: "",
        }));

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const nextErrors = {};

        if (!previewUrl) {
            nextErrors.profilImage = "Profile image is required";
        }

        if (!formData.name.trim()) {
            nextErrors.name = "Name is required";
        }

        if (!formData.email.trim()) {
            nextErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            nextErrors.email = "Please enter a valid email address";
        }

        if (!formData.phonenumber) {
            nextErrors.phonenumber = "phonenumber is required";
        } else if (formData.phonenumber.length !== 10) {
            nextErrors.phonenumber = "Phone number must contain 10 digits";
        }

        setErrors(nextErrors);

        return Object.keys(nextErrors).length === 0;
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        updateCurrentUserContacts((existingContacts) => {
            if (editingContactId !== null) {
                return existingContacts.map((contact) =>
                    contact.Contact_id === editingContactId
                        ? {
                            ...contact,
                            ...formData,
                            Contact_id: contact.Contact_id,
                        }
                        : contact,
                );
            }

            return [
                ...existingContacts,
                {
                    ...formData,
                    Contact_id: uuidv4(),
                },
            ];
        });

        const wasEditing = editingContactId !== null;
        resetFormState();
        handleCloseForm();

        if (wasEditing) {
            showSuccess("Contact updated successfully.");
            return;
        }

        showSuccess("Contact added successfully.");
    };

    const handleDeleteContact = (contactId) => {
        updateCurrentUserContacts((existingContacts) =>
            existingContacts.filter((contact) => contact.Contact_id !== contactId),
        );

        showSuccess("Contact deleted successfully.");

        if (editingContactId === contactId) {
            resetFormState();
        }
    };

    const handleEditContact = (contact) => {
        setEditingContactId(contact.Contact_id);
        setFormData({
            name: contact.name || "",
            email: contact.email || "",
            phonenumber: contact.phonenumber || "",
            profilImage: contact.profilImage || "",
        });
        setPreviewUrl(contact.profilImage || "");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
        handleOpenForm();
    };

    const handleCancelEdit = () => {
        resetFormState();
        handleCloseForm();
    };

    const handleAddContactClick = () => {
        handleSubmit();
    };

    const handleOpenImport = () => setImportOpen(true);
    const handleCloseImport = () => setImportOpen(false);


    const handleOpenForm = () => setopenForm(true);
    const handleCloseForm = () => setopenForm(false);

    const handleImportContacts = (rows) => {
        if (!rows?.length) {
            return;
        }

        const normalizedRows = rows
        // step 1 : remove the header from the csv
            .slice(1)
            // step 2 :  filter for the every field value availability
            .filter((row) => row.length >= 3)
            // step 3 :  loop on rows and get the value from it and show it in table
            .map((row) => ({
                name: row[0] || "",
                email: row[1] || "",
                phonenumber: row[2] || "",
                profilImage: row[3] || "",
                Contact_id: uuidv4(),
            }));


        if (!normalizedRows.length) {
            return;
        }

        updateCurrentUserContacts((existingContacts) => [
            ...existingContacts,
            ...normalizedRows,
        ]);

        showSuccess(`${normalizedRows.length} contact imported successfully.`);
    };

    return {
        userName,
        userData,
        importOpen,
        openForm,
        formData,
        errors,
        previewUrl,
        fileInputRef,
        notification,
        isEditMode: editingContactId !== null,
        setopenForm,
        handleOpenForm,
        handleCloseForm,
        showSuccess,
        handleCloseNotification,
        handleLogout,
        handleOpenImport,
        handleCloseImport,
        handleImportContacts,
        handleAddContactClick,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
    };
}
