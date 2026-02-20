// export const getFromLocalStorage = (key) =>  JSON.parse(localStorage.getItem([key]))

// export const getFromsessoinStorage = (key) => JSON.parse(sessionStorage.getItem([key]))

// export const setFromLocalStorage = (key,value) =>  JSON.parse(localStorage.getItem([key],value))

// export const setFromsessoinStorage = (key,value) => JSON.parse(sessionStorage.getItem([key],value))

import { v4 as uuidv4 } from "uuid";
// import { normalizeEmail,normalizePhone } from "/utils/normalization";




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