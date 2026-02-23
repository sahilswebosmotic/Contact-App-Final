import { v4 as uuidv4 } from "uuid";
import { mapRowsToObjects } from "../../utils/csv";
import { normalizeEmail, normalizePhone } from "../../utils/normalization";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const validateContactForm = (formData) => {
    const errors = {};
    const phone = normalizePhone(formData.phonenumber);

    if (!formData.name.trim()) {
        errors.name = "Name is required";
    }

    if (!formData.email.trim()) {
        errors.email = "Email is required";
    } else if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = "Invalid email";
    }

    if (!phone) {
        errors.phonenumber = "Phone required";
    } else if (phone.length !== 10) {
        errors.phonenumber = "Phone must be 10 digits";
    }

    return {
        errors,
        isValid: Object.keys(errors).length === 0,
    };
};

export const getDuplicateContactErrors = ({
    existingContacts,
    formData,
    editingContactId,
}) => {
    const email = normalizeEmail(formData.email);
    const phone = normalizePhone(formData.phonenumber);
    const errors = {};

    if (
        existingContacts.some(
            (contact) =>
                contact.Contact_id !== editingContactId &&
                normalizeEmail(contact.email) === email
        )
    ) {
        errors.email = "Email already exists";
    }

    if (
        existingContacts.some(
            (contact) =>
                contact.Contact_id !== editingContactId &&
                normalizePhone(contact.phonenumber) === phone
        )
    ) {
        errors.phonenumber = "Phone number already exists";
    }

    return errors;
};

export const getUpdatedContactsAfterSubmit = ({
    existingContacts,
    formData,
    editingContactId,
}) => {
    if (editingContactId) {
        return existingContacts.map((contact) =>
            contact.Contact_id === editingContactId
                ? { ...contact, ...formData }
                : contact
        );
    }

    return [
        ...existingContacts,
        { ...formData, Contact_id: uuidv4() },
    ];
};

export const getNewContactsFromImportRows = ({
    rows,
    existingContacts,
}) => {
    const existingEmails = existingContacts.map((contact) =>
        normalizeEmail(contact.email)
    );
    const existingPhones = existingContacts.map((contact) =>
        normalizePhone(contact.phonenumber)
    );

    const importContacts = mapRowsToObjects(rows);
    const newContacts = [];

    importContacts.forEach((row) => {
        const name = (row.name || "").trim();
        const email = normalizeEmail(row.email || "");
        const phone = normalizePhone(row.phonenumber || "");
        const profilImage = row.profilImage || "";

        if (
            !name ||
            !email ||
            !EMAIL_REGEX.test(email) ||
            phone.length !== 10
        ) {
            return;
        }

        const isDuplicate =
            existingEmails.includes(email) ||
            existingPhones.includes(phone) ||
            newContacts.some(
                (contact) =>
                    normalizeEmail(contact.email) === email ||
                    normalizePhone(contact.phonenumber) === phone
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

    return newContacts;
};
