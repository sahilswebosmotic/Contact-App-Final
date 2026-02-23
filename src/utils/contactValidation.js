import { normalizePhone } from "./normalization";

export const validateContactForm = (formData) => {
    const errors = {};
    const phone = normalizePhone(formData.phonenumber);

    if (!formData.name?.trim())
        errors.name = "Name is required";

    if (!formData.email?.trim())
        errors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errors.email = "Invalid email";

    if (!phone)
        errors.phonenumber = "Phone required";
    else if (phone.length !== 10)
        errors.phonenumber = "Phone must be 10 digits";

    return errors;
};