import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { normalizeEmail, normalizePhone } from "../utils/normalization";
import { validateContactForm } from "../utils/validation";
import {
    mapRowsToObjects,
    validateCsvHeaders
} from "../utils/csv";

import {
    getUsers,
    getCurrentUser,
    saveUserContacts,
    buildContact
} from "../services/storage";

import {
    broadcastContactsUpdate,
    CONTACTS_UPDATE_KEY
} from "../services/tabSync";

/* DEFAULT FORM */

const DEFAULT_FORM = {
    name: "",
    email: "",
    phonenumber: "",
    profilImage: "",
};

const TAB_ID_KEY = "tab_id";

const getTabId = () => {
    let tabId = sessionStorage.getItem(TAB_ID_KEY);

    if (!tabId) {
        tabId = uuidv4();
        sessionStorage.setItem(TAB_ID_KEY, tabId);
    }

    return tabId;
};

export default function useContactsDashboard() {
    const navigate = useNavigate();
    const fileInputRef = useRef(null);
    const tabIdRef = useRef(null);

    const [userData, setUserData] = useState([]);
    const [userName, setUserName] = useState("User");
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState("");
    const [editingContactId, setEditingContactId] = useState(null);

    const [openForm, setOpenForm] = useState(false);
    const [openLogout, setOpenLogout] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "",
    });

    /* INITIAL LOAD */

    useEffect(() => {
        tabIdRef.current = getTabId();

        const currentUser = getCurrentUser();
        console.log("INIT currentUser:", currentUser);

        if (!currentUser?.User_id) {
            console.warn("No user session. Redirecting.");
            navigate("/");
            return;
        }

        const users = getUsers();
        console.log("INIT users:", users);

        if (!users.length) {
            console.warn("No users in storage.");
            navigate("/");
            return;
        }

        const matchedUser = users.find(
            user => user.User_id === currentUser.User_id
        );

        console.log("INIT matchedUser:", matchedUser);

        if (!matchedUser) {
            console.warn("Session user missing from storage.");
            navigate("/");
            return;
        }

        setUserName(matchedUser.name || "User");
        setUserData(matchedUser.Contacts || []);
    }, []);

    /* MULTI TAB SYNC */

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== CONTACTS_UPDATE_KEY) return;

            const payload = JSON.parse(event.newValue || "{}");

            if (payload.tabId === tabIdRef.current) return;

            const currentUser = getCurrentUser();
            if (!currentUser?.User_id) return;
            if (payload.User_id !== currentUser.User_id) return;

            const users = getUsers();
            const matchedUser = users.find(
                user => user.User_id === currentUser.User_id
            );

            if (!matchedUser) return;

            setUserData(matchedUser.Contacts || []);
            setUserName(matchedUser.name || "User");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    /* NOTIFICATIONS */

    const showSuccess = (message) => {
        setNotification({ open: true, message, severity: "success" });
    };

    const showError = (message) => {
        setNotification({ open: true, message, severity: "error" });
    };

    const handleCloseNotification = () => {
        setNotification(prev => ({ ...prev, open: false }));
    };

    /* FORM */

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
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

    /* STORAGE */

    const persistContacts = (updatedContacts) => {
        const currentUser = getCurrentUser();
        console.log("persistContacts user:", currentUser);

        if (!currentUser?.User_id) {
            console.warn("Cannot persist. No user.");
            return;
        }

        saveUserContacts(currentUser.User_id, updatedContacts);
        broadcastContactsUpdate(tabIdRef.current, currentUser.User_id);

        setUserData(updatedContacts);
    };

    /* SUBMIT */

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("SUBMIT TRIGGERED");

        const validationErrors = validateContactForm(formData);
        console.log("Validation:", validationErrors);

        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        const currentUser = getCurrentUser();
        console.log("Submit user:", currentUser);

        if (!currentUser?.User_id) {
            showError("Session expired.");
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(
            user => user.User_id === currentUser.User_id
        );

        console.log("Submit matchedUser:", matchedUser);

        if (!matchedUser) {
            showError("User not found.");
            return;
        }

        const existingContacts = matchedUser.Contacts || [];

        const email = normalizeEmail(formData.email);
        const phone = normalizePhone(formData.phonenumber);

        const duplicateErrors = {};

        if (
            existingContacts.some(contact =>
                contact.Contact_id !== editingContactId &&
                normalizeEmail(contact.email) === email
            )
        ) duplicateErrors.email = "Email already exists";

        if (
            existingContacts.some(contact =>
                contact.Contact_id !== editingContactId &&
                normalizePhone(contact.phonenumber) === phone
            )
        ) duplicateErrors.phonenumber = "Phone already exists";

        if (Object.keys(duplicateErrors).length) {
            setErrors(duplicateErrors);
            return;
        }

        const updatedContacts = editingContactId
            ? existingContacts.map(contact =>
                contact.Contact_id === editingContactId
                    ? { ...contact, ...formData }
                    : contact
            )
            : [...existingContacts, buildContact(formData)];

        persistContacts(updatedContacts);

        resetForm();
        setOpenForm(false);
        showSuccess("Contact saved successfully.");
    };

    const handleAddContact = (e) => handleSubmit(e);

    const handleEditContact = (contact) => {
        setEditingContactId(contact.Contact_id);
        setFormData(contact);
        setPreviewUrl(contact.profilImage || "");
        setOpenForm(true);
    };

    const handleDeleteContact = (contactId) => {
        const updated = userData.filter(
            contact => contact.Contact_id !== contactId
        );

        persistContacts(updated);
        setOpenDelete(false);
        showSuccess("Contact deleted successfully.");
    };

    /* CSV */

    const handleImportContacts = (rows) => {
        console.log("IMPORT TRIGGERED:", rows);

        if (!rows.length) {
            showError("Empty file.");
            return;
        }

        const headers = rows[0];
        console.log("CSV Headers:", headers);

        if (!validateCsvHeaders(headers)) {
            showError("Invalid CSV format.");
            return;
        }

        const currentUser = getCurrentUser();
        if (!currentUser?.User_id) {
            showError("Session expired.");
            return;
        }

        const users = getUsers();
        const matchedUser = users.find(
            user => user.User_id === currentUser.User_id
        );

        if (!matchedUser) return;

        const existingContacts = matchedUser.Contacts || [];
        const importContacts = mapRowsToObjects(rows);

        const newContacts = [];

        importContacts.forEach(row => {
            const email = normalizeEmail(row.email);
            const phone = normalizePhone(row.phonenumber);

            if (!email || phone.length !== 10) return;

            const duplicate = existingContacts.some(c =>
                normalizeEmail(c.email) === email ||
                normalizePhone(c.phonenumber) === phone
            );

            if (!duplicate) newContacts.push(buildContact(row));
        });

        if (!newContacts.length) {
            showError("No new contacts found.");
            return;
        }

        persistContacts([...existingContacts, ...newContacts]);

        setImportOpen(false);
        showSuccess("Contacts imported successfully.");
    };

    const handleExportContacts = () => {
        showSuccess("Contacts exported successfully.");
    };

    /* LOGOUT */

    const handleLogout = () => {
        sessionStorage.removeItem("currentUser");
        navigate("/");
    };

    return {
        userName,
        openForm,
        userData,
        importOpen,
        formData,
        errors,
        previewUrl,
        fileInputRef,
        notification,
        isEditMode: editingContactId !== null,
        openLogout,
        openDelete,

        handleOpenDelete: () => setOpenDelete(true),
        handleCloseDelete: () => setOpenDelete(false),

        handleOpenLogout: () => setOpenLogout(true),
        handleCloseLogout: () => setOpenLogout(false),

        handleOpenForm: () => setOpenForm(true),
        handleCloseForm: () => setOpenForm(false),

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
        handleCancelEdit: () => setOpenForm(false),
        handleExportContacts,
    };
}