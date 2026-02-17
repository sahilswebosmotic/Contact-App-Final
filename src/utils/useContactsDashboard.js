import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

/*
    DEFAULT_FORM

    This object defines the stable structure of your form state.

    WHY this exists:
    React controlled inputs require deterministic values.
    If you start with undefined → inputs become uncontrolled → warnings + bugs.

    Also reused when resetting the form to avoid duplicating object shapes.
*/
const DEFAULT_FORM = {
    name: "",
    email: "",
    phonenumber: "",
    profilImage: "", // base64 string representation of image
};

/* ---------------- SAFE STORAGE HELPERS ---------------- */

/*
    safeParse

    PURPOSE:
    Safely read JSON data from localStorage.

    WHY this is critical:
    localStorage is NOT guaranteed to contain valid JSON.
    It may be:
    - null
    - corrupted
    - manually edited
    - partially written

    Without try/catch → JSON.parse crash → entire React app fails.
*/
const safeParse = (key, fallback) => {
    try {
        const value = localStorage.getItem(key);

        /*
            localStorage.getItem returns:
            - string (if exists)
            - null (if missing)

            If null → return fallback
            If exists → parse JSON
        */
        return value ? JSON.parse(value) : fallback;
    } catch {
        /*
            Defensive recovery strategy.

            Instead of crashing UI, silently return fallback state.
            Prevents catastrophic application failure.
        */
        return fallback;
    }
};

/*
    Storage accessor helpers.

    WHY they exist:
    Centralizes parsing logic.
    Avoids repeating JSON.parse everywhere.
    Guarantees consistent error handling.
*/
const getUsers = () => safeParse("users", []);
const getCurrentUser = () => safeParse("currentUser", null);

/*
    persistUsersAndCurrentUser

    PURPOSE:
    Write updated state back to localStorage.

    WHY:
    React state is ephemeral (lost on refresh).
    localStorage is persistence layer.

    Both users & currentUser must stay synchronized.
    If not → stale UI + data inconsistencies.
*/
const persistUsersAndCurrentUser = (users, currentUser) => {
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
};

/* ---------------- HOOK ---------------- */

export default function useContactsDashboard() {

    /*
        useNavigate

        Allows programmatic navigation between routes.

        WHY:
        Hooks cannot redirect using JSX.
        Navigation must occur imperatively.
    */
    const navigate = useNavigate();

    /*
        initialUser

        Reads persisted session data during hook initialization.

        WHY:
        Hooks execute during render.
        UI state must be available immediately.
    */
    const initialUser = getCurrentUser();

    /* ---------------- STATE DECLARATIONS ---------------- */

    /*
        errors → stores validation messages
        userName → displayed dashboard name
        userData → contacts rendered inside table
        editingContactId → controls edit vs add mode
        formData → controlled input values
        previewUrl → blob URL for image preview
        openForm → form modal visibility
        importOpen → import modal visibility
        notification → snackbar / toast messages
    */
    const [errors, setErrors] = useState({});

    /*
        Initialize username from persisted session.

        WHY fallback:
        Storage may be empty or corrupted.
    */
    const [userName, setUserName] = useState(initialUser?.name || "User");

    /*
        Initialize contacts from currentUser.

        WHY fallback:
        Contacts may not exist or be invalid array.
    */
    const [userData, setUserData] = useState(initialUser?.Contacts || []);

    /*
        Tracks which contact is being edited.

        WHY:
        Single form handles both add & edit operations.
    */
    const [editingContactId, setEditingContactId] = useState(null);

    /*
        Controlled form values.

        WHY:
        Prevent uncontrolled input issues.
    */
    const [formData, setFormData] = useState(DEFAULT_FORM);

    /*
        previewUrl

        Blob URL for instant image preview.

        WHY blob instead of base64 preview:
        Blob rendering is fast & memory-efficient for UI.
    */
    const [previewUrl, setPreviewUrl] = useState("");

    /*
        Modal visibility flags.
    */
    const [openForm, setopenForm] = useState(false);
    const [importOpen, setImportOpen] = useState(false);

    /*
        notification

        Stores UI feedback messages.

        WHY separate state:
        Decouples UI feedback from business logic.
    */
    const [notification, setNotification] = useState({
        open: false,
        message: "",
        severity: "success",
    });

    /*
        fileInputRef

        WHY useRef instead of useState:
        DOM references should not trigger re-renders.

        Used for manually clearing file input value.
    */
    const fileInputRef = useRef(null);

    /* ---------------- AUTH GUARD ---------------- */

    /*
        Ensures valid session.

        WHY:
        Users can manually type routes.
        Dashboard without session = invalid state.

        If missing user → redirect immediately.
    */
    useEffect(() => {
        if (!getCurrentUser()) {
            navigate("/login");
        }
    }, [navigate]);

    /* ---------------- CLEANUP ---------------- */

    /*
        Blob URL memory management.

        WHY:
        URL.createObjectURL allocates browser resources.
        Must revoke to avoid memory leaks.
    */
    useEffect(() => {
        return () => {
            if (previewUrl?.startsWith("blob:")) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    /* ---------------- MULTI TAB SYNC ---------------- */

    /*
        Synchronize state across browser tabs.

        WHY:
        localStorage emits events when modified in OTHER tabs.

        Without this → stale UI → inconsistent experience.
    */
    useEffect(() => {
        const handleStorageSync = () => {
            const latestCurrentUser = getCurrentUser();

            /*
                If session removed elsewhere → force logout.
            */
            if (!latestCurrentUser) {
                navigate("/login");
                return;
            }

            /*
                Defensive validation of Contacts structure.
            */
            const latestContacts = Array.isArray(latestCurrentUser.Contacts)
                ? latestCurrentUser.Contacts
                : [];

            /*
                Update UI with latest storage state.
            */
            setUserName(latestCurrentUser.name || "User");
            setUserData(latestContacts);

            /*
                If editing contact deleted in another tab → exit edit mode.
            */
            if (
                editingContactId !== null &&
                !latestContacts.some(c => c.Contact_id === editingContactId)
            ) {
                setEditingContactId(null);
            }
        };

        window.addEventListener("storage", handleStorageSync);
        return () => window.removeEventListener("storage", handleStorageSync);
    }, [editingContactId, navigate]);

    /* ---------------- HELPERS ---------------- */

    /*
        Resets entire form state.

        WHY:
        Prevent stale values when closing modal or switching modes.
    */
    const resetFormState = () => {
        setFormData(DEFAULT_FORM);
        setPreviewUrl("");
        setErrors({});
        setEditingContactId(null);

        /*
            File inputs cannot be controlled by React state.
            Must clear manually via DOM reference.
        */
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    /*
        showSuccess

        Centralized notification logic.

        WHY:
        Avoid duplicate UI logic & inconsistent messages.
    */
    const showSuccess = (message) => {
        setNotification({
            open: true,
            message,
            severity: "success",
        });
    };

    /*
        Notification close handler.

        WHY clickaway guard:
        Prevent accidental dismissal.
    */
    const handleCloseNotification = (_, reason) => {
        if (reason === "clickaway") return;
        setNotification(prev => ({ ...prev, open: false }));
    };

    /*
        requireCurrentUser

        PURPOSE:
        Guarantees valid session before mutations.

        WHY:
        Storage state may change asynchronously.
    */
    const requireCurrentUser = () => {
        const currentUser = getCurrentUser();
        if (!currentUser) {
            navigate("/login");
            return null;
        }
        return currentUser;
    };

    /*
        updateCurrentUserContacts

        CORE DATA UPDATE MECHANISM.

        WHY abstraction:
        - Enforces immutable updates
        - Prevents scattered storage logic
        - Maintains synchronization between users & currentUser
    */
    const updateCurrentUserContacts = (contactsUpdater) => {
        const users = getUsers();
        const currentUser = requireCurrentUser();
        if (!currentUser) return;

        const updatedUsers = users.map(user => {

            // Only modify logged-in user's data
            if (user.User_id !== currentUser.User_id) return user;

            const existingContacts = Array.isArray(user.Contacts)
                ? user.Contacts
                : [];

            return {
                ...user,
                Contacts: contactsUpdater(existingContacts),
            };
        });

        const updatedCurrentUser =
            updatedUsers.find(u => u.User_id === currentUser.User_id) ||
            currentUser;

        // Persist synchronized updates
        persistUsersAndCurrentUser(updatedUsers, updatedCurrentUser);

        // Update UI state immediately
        setUserData(updatedCurrentUser.Contacts || []);
    };

    /* ---------------- ACTIONS ---------------- */

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        navigate("/login");
    };

    /*
        Controlled input handler.

        WHY spread pattern:
        Prevent overwriting entire form state.
    */
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear validation errors as user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    /*
        File selection handler.

        Uses:
        Blob → fast preview
        Base64 → persistence-safe storage
    */
    const handleFileChange = (event) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const nextPreviewUrl = URL.createObjectURL(file);
        const reader = new FileReader();

        reader.onloadend = () => {
            setFormData(prev => ({
                ...prev,
                profilImage: reader.result,
            }));

            setPreviewUrl(prev => {
                if (prev?.startsWith("blob:")) {
                    URL.revokeObjectURL(prev);
                }
                return nextPreviewUrl;
            });
        };

        reader.readAsDataURL(file);
    };

    // ... rest of logic unchanged


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
