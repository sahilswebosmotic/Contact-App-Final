
export const getUsers = () => {
    try {
        return JSON.parse(localStorage.getItem("users")) || [];
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
