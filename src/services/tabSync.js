export const CONTACTS_UPDATE_KEY = "contacts_last_update";

export const broadcastContactsUpdate = (tabId, User_id) => {
    localStorage.setItem(CONTACTS_UPDATE_KEY, JSON.stringify({
        tabId,
        User_id,
        timestamp: Date.now(),
    }));
};