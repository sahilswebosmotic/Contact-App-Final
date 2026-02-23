import { useNavigate } from "react-router-dom";
import { createContactActions } from "./use-contacts-dashboard/createContactActions";
import { useContactFormState } from "./use-contacts-dashboard/useContactFormState";
import { useContactsDataState } from "./use-contacts-dashboard/useContactsDataState";
import { useDashboardNotification } from "./use-contacts-dashboard/useDashboardNotification";
import { useDashboardUiState } from "./use-contacts-dashboard/useDashboardUiState";

export default function useContactsDashboard() {
    const navigate = useNavigate();
    const {
        showSuccess,
        showError,
    } = useDashboardNotification();

    const {
        openForm,
        setOpenForm,
        openLogout,
        setOpenLogout,
        openDelete,
        setOpenDelete,
        importOpen,
        setImportOpen,
        handleOpenLogout,
        handleCloseLogout,
        handleOpenDelete,
        handleCloseDelete,
        handleOpenForm,
        handleOpenImport,
        handleCloseImport,
    } = useDashboardUiState();

    const {
        userData,
        userName,
        saveContactsToStorage,
        getExistingContactsOrNotify,
    } = useContactsDataState({ showError });

    const {
        fileInputRef,
        formData,
        errors,
        setErrors,
        previewUrl,
        editingContactId,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        resetForm,
        handleEditContact: editContact,
        handleCancelEdit: cancelEdit,
    } = useContactFormState();

    const handleEditContact = (contact) => editContact(contact, handleOpenForm);
    const handleCancelEdit = () => cancelEdit(() => setOpenForm(false));

    const {
        handleSubmit,
        handleDeleteContact,
        handleImportContacts,
        handleExportContacts,
    } = createContactActions({
        formData,
        editingContactId,
        userData,
        getExistingContactsOrNotify,
        saveContactsToStorage,
        setErrors,
        resetForm,
        showSuccess,
        showError,
        closeForm: () => setOpenForm(false),
        closeDelete: () => setOpenDelete(false),
        closeImport: () => setImportOpen(false),
    });

    const handleLogout = () => {
        sessionStorage.removeItem("currentUser");
        navigate("/");
        setOpenLogout(false);
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
        isEditMode: editingContactId !== null,
        openLogout,
        handleOpenLogout,
        handleCloseLogout,
        openDelete,
        handleOpenDelete,
        handleCloseDelete,
        handleOpenForm,
        handleCloseForm: handleCancelEdit,
        handleLogout,
        handleOpenImport,
        handleCloseImport,
        handleImportContacts,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        handleSubmit,
        handleDeleteContact,
        handleEditContact,
        handleCancelEdit,
        handleExportContacts,
    };
}
