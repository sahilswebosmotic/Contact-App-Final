export const normalizeEmail = (value = "") =>
    value.trim().toLowerCase();

export const normalizePhone = (value = "") =>
    value.replace(/\D/g, "");