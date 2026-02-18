import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
//   DEFAULT FORM  

const DEFAULT_FORM = {
    name: "",
    email: "",
    phonenumber: "",
    profilImage: "",
};

const REQUIRED_HEADERS = [
    "name",
    "email",
    "phonenumber",
    "profilImage",
    "Contact_id",
];

// HELPERS 

const normalizeEmail = (value) => value.trim().toLowerCase();
const normalizePhone = (value) => value.replace(/\D/g, "");


const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
    } catch {
        return [];
    }
};

const getCurrentUser = () => {
    try {
        return JSON.parse(localStorage.getItem("currentUser"));
    } catch {
        return null;
    }
};

//   HOOK  

export default function useContactsDashboard() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState("User");
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState("");
    const [editingContactId, setEditingContactId] = useState(null);
    const [openForm, setopenForm] = useState(false);
    const [importOpen, setImportOpen] = useState(false);
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "",
    });

//  AUTH CHECK 

    useEffect(() => {
        const currentUser = getCurrentUser();
        if (!currentUser.User_id) {
            navigate("/");
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(
            u => u.User_id === currentUser.User_id
        );

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setUserName(matchedUser.name || "User");
        setUserData(matchedUser.Contacts || []);
    }, [navigate]);


    //   MULTI TAB SYNC  

    useEffect(() => {
        const handleStorageChange = () => {

            const currentUser = getCurrentUser();
            if (!currentUser.User_id) return;

            const users = getUsers();

            const matchedUser = users.find(
                user => user.User_id === currentUser.User_id
            );

            if (!matchedUser) return;

            setUserData(matchedUser.Contacts || []);
            setUserName(matchedUser.name || "User");
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);


    //   NOTIFICATIONS  

    const showSuccess = (message) => {
        setNotification({
            open: true,
            message,
            severity: "success",
        });
    };

    const showError = (message) => {
        setNotification({
            open: true,
            message,
            severity: "error",
        });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    //  FORM  

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: "",
            }));
        }
    };


    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setFormData(prev => ({
                ...prev,
                profilImage: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewUrl("");
        setFormData(prev => ({ ...prev, profilImage: "" }));
    };

    const resetForm = () => {
        setFormData(DEFAULT_FORM);
        setPreviewUrl("");
        setErrors({});
        setEditingContactId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // SAVE CONTACT

    const saveContactsToStorage = (updatedContacts) => {
        const users = getUsers();
        const currentUser = getCurrentUser();

        const updatedUsers = users.map(user => {
            if (user.User_id === currentUser.User_id) {
                return { ...user, Contacts: updatedContacts };
            }
            return user;
        });

        localStorage.setItem("users", JSON.stringify(updatedUsers));
        localStorage.setItem("currentUser",JSON.stringify({ User_id: currentUser.User_id })
        );

        setUserData(updatedContacts);
    };

    const validateForm = () => {
        const newErrors = {};
        const phone = normalizePhone(formData.phonenumber);

        if (!formData.name.trim())
            newErrors.name = "Name is required";

        if (!formData.email.trim())
            newErrors.email = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
            newErrors.email = "Invalid email";

        if (!phone)
            newErrors.phonenumber = "Phone required";
        else if (phone.length !== 10)
            newErrors.phonenumber = "Phone must be 10 digits";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const users = getUsers();
        const currentUser = getCurrentUser();
        const matchedUser = users.find(
            u => u.User_id === currentUser.User_id
        );

        const existingContacts = matchedUser.Contacts || [];

        const email = normalizeEmail(formData.email);
        const phone = normalizePhone(formData.phonenumber);

        const duplicateErrors = {};

        if (
            existingContacts.some(contact =>
                contact.Contact_id !== editingContactId &&
                normalizeEmail(contact.email) === email
            )
        ) {
            duplicateErrors.email = "Email already exists";
        }

        if (
            existingContacts.some(contact =>
                contact.Contact_id !== editingContactId &&
                normalizePhone(contact.phonenumber) === phone
            )
        ) {
            duplicateErrors.phonenumber = "Phone number already exists";
        }

        if (Object.keys(duplicateErrors).length > 0) {
            setErrors(duplicateErrors);
            return;
        }


        let updatedContacts;

        if (editingContactId) {
            updatedContacts = existingContacts.map(contact =>
                contact.Contact_id === editingContactId
                    ? { ...contact, ...formData }
                    : contact
            );
        } else {
            updatedContacts = [
                ...existingContacts,
                { ...formData, Contact_id: uuidv4() },
            ];
        }

        saveContactsToStorage(updatedContacts);
        resetForm();
        setopenForm(false);
        showSuccess("Contact saved successfully.");
    };

    const handleAddContact = (e) => handleSubmit(e);

    const handleEditContact = (contact) => {
        setEditingContactId(contact.Contact_id);
        setFormData(contact);
        setPreviewUrl(contact.profilImage || "");
        setopenForm(true);
    };

    const handleCancelEdit = () => {
        resetForm();
        setopenForm(false);
    };

    const handleDeleteContact = (contactId) => {
        if (!window.confirm("Delete this contact?")) return;

        const updated = userData.filter(
            c => c.Contact_id !== contactId
        );

        saveContactsToStorage(updated);
        showError("Contact deleted successfully.");
    };

    //  CSV IMPORT  


    const mapRowsToObjects = (rows) => {
        const headers = rows[0];

        return rows.slice(1).map(row => {
            const obj = {};
            headers.forEach((header, index) => {
                obj[header] = row[index];
            });
            return obj;
        });
    };

    const handleImportContacts = (rows) => {
        if (!rows.length) {
            showError("Empty file.");
            return;
        }

        const headers = rows[0];

        if (
            headers.length !== REQUIRED_HEADERS.length ||
            headers.some((h, i) => h !== REQUIRED_HEADERS[i])
        ) {
            showError("Invalid CSV format.");
            return;
        }

        const users = getUsers();
        const currentUser = getCurrentUser();
        if (!currentUser?.User_id) {
            showError("User not found.");
            return;
        }

        const matchedUser = users.find(
            user => user.User_id === currentUser.User_id
        );

        const existingContacts = matchedUser?.Contacts || [];

        const existingEmails = existingContacts.map(c =>
            normalizeEmail(c.email)
        );

        const existingPhones = existingContacts.map(c =>
            normalizePhone(c.phonenumber)
        );

        const importContacts = mapRowsToObjects(rows);

        const newContacts = [];

        importContacts.forEach(row => {
            const name = String(row.name || "").trim();
            const email = normalizeEmail(row.email || "");
            const phone = normalizePhone(row.phonenumber || "");
            const profilImage = row.profilImage || "";

            if (!name ||!email ||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||phone.length !== 10) return;

            const isDuplicate =
                existingEmails.includes(email) ||
                existingPhones.includes(phone) ||
                newContacts.some(c =>
                    normalizeEmail(c.email) === email ||
                    normalizePhone(c.phonenumber) === phone
                );

            if (!isDuplicate) {
                newContacts.push({
                    name,
                    email,
                    phonenumber: phone,
                    profilImage,
                    Contact_id: uuidv4(),
                });
            }
        });

        if (!newContacts.length) {
            showError("No new contacts found.");
            return;
        }

        saveContactsToStorage([
            ...existingContacts,
            ...newContacts,
        ]);

        showSuccess("Contacts imported successfully.");
        setImportOpen(false);
    };



    //   LOGOUT  

    const handleLogout = () => {
        if (!window.confirm("Logout?")) return;
        localStorage.removeItem("currentUser");
        navigate("/");
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
        handleOpenForm: () => setopenForm(true),
        handleCloseForm: handleCancelEdit,
        showError,
        showSuccess,
        handleCloseNotification,
        handleLogout,
        handleOpenImport: () => setImportOpen(true),
        handleCloseImport: () => setImportOpen(false),
        handleImportContacts,
        handleAddContact,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
    };
}


