import { useEffect, useRef, useState } from "react";
import {
    CONTACTS_LAST_UPDATE_KEY,
    getCurrentUserContext,
    getOrCreateTabId,
    saveContactsForCurrentUser,
} from "./contactStorage";

export const useContactsDataState = ({ showError }) => {
    const tabIdRef = useRef(null);
    const [userData, setUserData] = useState(
        () => getCurrentUserContext().matchedUser?.Contacts || []
    );
    const [userName, setUserName] = useState(
        () => getCurrentUserContext().matchedUser?.name || "User"
    );

    useEffect(() => {
        tabIdRef.current = getOrCreateTabId();
    }, []);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key !== CONTACTS_LAST_UPDATE_KEY) return;

            const newValue = JSON.parse(event.newValue || "{}");
            if (newValue.tabId === tabIdRef.current) return;

            const { currentUser, matchedUser } = getCurrentUserContext();
            if (!currentUser?.User_id || !matchedUser) return;
            if (newValue.User_id !== currentUser.User_id) return;

            setUserData(matchedUser.Contacts || []);
            setUserName(matchedUser.name || "User");
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, []);

    const getExistingContactsOrNotify = () => {
        const { matchedUser } = getCurrentUserContext();
        if (!matchedUser) {
            showError("User not found.");
            return null;
        }

        return matchedUser.Contacts || [];
    };

    const saveContactsToStorage = (updatedContacts) => {
        const didSave = saveContactsForCurrentUser({
            updatedContacts,
            tabId: tabIdRef.current,
        });

        if (!didSave) {
            showError("User not found.");
            return false;
        }

        setUserData(updatedContacts);
        return true;
    };

    return {
        userData,
        userName,
        saveContactsToStorage,
        getExistingContactsOrNotify,
    };
};
