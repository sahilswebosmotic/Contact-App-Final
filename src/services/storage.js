

import { v4 as uuidv4 } from "uuid";

export const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem("currentUser")) || [];
    } catch {
        return [];
    }
};

export const getCurrentUser = () => {
    try {
        return JSON.parse(sessionStorage.getItem("currentUser"));
    } catch {
        return null;
    }
};

export const saveUserContacts = (User_id, updatedContacts) => {
    const users = getUsers();

    const updatedUsers = users.map(user =>
        user.User_id === User_id
            ? { ...user, Contacts: updatedContacts }
            : user
    );

    localStorage.setItem("users", JSON.stringify(updatedUsers));
};

export const buildContact = (formData) => ({
    ...formData,
    Contact_id: uuidv4(),
});