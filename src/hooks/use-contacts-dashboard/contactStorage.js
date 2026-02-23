import { v4 as uuidv4 } from "uuid";
import { getCurrentUser, getUsers } from "../../services/storage";

const TAB_ID_KEY = "tab_id";
const USERS_KEY = "users";
export const CONTACTS_LAST_UPDATE_KEY = "contacts_last_update";

export const getOrCreateTabId = () => {
    let tabId = sessionStorage.getItem(TAB_ID_KEY);

    if (!tabId) {
        tabId = uuidv4();
        sessionStorage.setItem(TAB_ID_KEY, tabId);
    }

    return tabId;
};

export const getCurrentUserContext = () => {
    const users = getUsers();
    const currentUser = getCurrentUser();

    if (!currentUser?.User_id) {
        return {
            users,
            currentUser: null,
            matchedUser: null,
        };
    }

    const matchedUser = users.find(
        (user) => user.User_id === currentUser.User_id
    );

    return {
        users,
        currentUser,
        matchedUser: matchedUser || null,
    };
};

export const saveContactsForCurrentUser = ({ updatedContacts, tabId }) => {
    const { users, currentUser } = getCurrentUserContext();
    if (!currentUser?.User_id) return false;

    const updatedUsers = users.map((user) => {
        if (user.User_id === currentUser.User_id) {
            return { ...user, Contacts: updatedContacts };
        }
        return user;
    });

    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
    localStorage.setItem(
        CONTACTS_LAST_UPDATE_KEY,
        JSON.stringify({
            tabId,
            User_id: currentUser.User_id,
            timestamp: Date.now(),
        })
    );

    return true;
};
