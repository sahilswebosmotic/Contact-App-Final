import { validateCsvHeaders } from "../../utils/csv";
import {
    getDuplicateContactErrors,
    getNewContactsFromImportRows,
    getUpdatedContactsAfterSubmit,
    validateContactForm,
} from "./contactValidation";

export const createContactActions = ({
    formData,
    editingContactId,
    userData,
    getExistingContactsOrNotify,
    saveContactsToStorage,
    setErrors,
    resetForm,
    showSuccess,
    showError,
    closeForm,
    closeDelete,
    closeImport,
}) => {
    const handleSubmit = (e) => {
        e.preventDefault();

        const validation = validateContactForm(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }

        const existingContacts = getExistingContactsOrNotify();
        if (!existingContacts) return;

        const duplicateErrors = getDuplicateContactErrors({
            existingContacts,
            formData,
            editingContactId,
        });

        if (Object.keys(duplicateErrors).length > 0) {
            setErrors(duplicateErrors);
            return;
        }

        const updatedContacts = getUpdatedContactsAfterSubmit({
            existingContacts,
            formData,
            editingContactId,
        });

        const didSave = saveContactsToStorage(updatedContacts);
        if (!didSave) return;

        resetForm();
        closeForm();
        showSuccess("Contact saved successfully.");
    };

    const handleDeleteContact = (contactId) => {
        const updated = userData.filter(
            (contact) => contact.Contact_id !== contactId
        );

        const didSave = saveContactsToStorage(updated);
        if (!didSave) return;

        showError("Contact deleted successfully.");
        closeDelete();
    };

    const handleImportContacts = (rows) => {
        if (!rows.length) {
            showError("Empty file.");
            return;
        }

        const headers = rows[0];
        if (!validateCsvHeaders(headers)) {
            showError("Invalid CSV format.");
            return;
        }

        const existingContacts = getExistingContactsOrNotify();
        if (!existingContacts) return;

        const newContacts = getNewContactsFromImportRows({
            rows,
            existingContacts,
        });

        if (!newContacts.length) {
            showError("No new contacts found.");
            return;
        }

        const didSave = saveContactsToStorage([
            ...existingContacts,
            ...newContacts,
        ]);
        if (!didSave) return;

        showSuccess("Contacts imported successfully.");
        closeImport();
    };

    const handleExportContacts = () => {
        showSuccess("Contacts Exported successfully....");
    };

    return {
        handleSubmit,
        handleDeleteContact,
        handleImportContacts,
        handleExportContacts,
    };
};
