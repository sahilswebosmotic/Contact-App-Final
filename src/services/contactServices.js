
import { getUsers, getCurrentUser,  saveUserContacts } from "./storage";
import { normalizeEmail, normalizePhone } from "../utils/normalization";
import { v4 as uuidv4 } from "uuid";

export const saveContact = (data, isEditMode, existingData) => {
    const users = getUsers();
    const currentUser = getCurrentUser();

    const matchedUser = users.find(
        (user) => user.User_id === currentUser.User_id
    );

    if (!matchedUser) return { error: "User not found" };

    const existingContacts = matchedUser.Contacts || [];

    const email = normalizeEmail(data.email);
    const phone = normalizePhone(data.phonenumber);

    const emailExists = existingContacts.some(
        (contact) =>
            contact.Contact_id !== existingData?.Contact_id &&
            normalizeEmail(contact.email) === email
    );

    if (emailExists) {
        return { error: "Email already exists", field: "email" };
    }

    const phoneExists = existingContacts.some(
        (contact) =>
            contact.Contact_id !== existingData?.Contact_id &&
            normalizePhone(contact.phonenumber) === phone
    );

    if (phoneExists) {
        return { error: "Phone number already exists", field: "phonenumber" };
    }

    const finalImage =
        data.profilImage instanceof File
            ? URL.createObjectURL(data.profilImage)
            : existingData?.profilImage || null;

    const contactData = {
        name: data.name,
        email,
        phonenumber: phone,
        profilImage: finalImage,
    };

    let updatedContacts;

    if (isEditMode && existingData) {
        updatedContacts = existingContacts.map((contact) =>
            contact.Contact_id === existingData.Contact_id
                ? { ...contact, ...contactData }
                : contact
        );
    } else {
        updatedContacts = [
            ...existingContacts,
            { ...contactData, Contact_id: uuidv4() },
        ];
    }

    matchedUser.Contacts = updatedContacts;
    saveUserContacts(users);

    return { success: true };
};