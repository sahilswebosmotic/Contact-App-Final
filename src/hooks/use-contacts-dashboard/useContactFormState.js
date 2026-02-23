import { useRef, useState } from "react";
import { DEFAULT_FORM } from "./constants";

export const useContactFormState = () => {
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState(DEFAULT_FORM);
    const [errors, setErrors] = useState({});
    const [previewUrl, setPreviewUrl] = useState("");
    const [editingContactId, setEditingContactId] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: "",
            }));
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
            setFormData((prev) => ({
                ...prev,
                profilImage: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveImage = () => {
        setPreviewUrl("");
        setFormData((prev) => ({ ...prev, profilImage: "" }));
    };

    const resetForm = () => {
        setFormData(DEFAULT_FORM);
        setPreviewUrl("");
        setErrors({});
        setEditingContactId(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleEditContact = (contact, onOpenForm) => {
        setEditingContactId(contact.Contact_id);
        setFormData(contact);
        setPreviewUrl(contact.profilImage || "");
        onOpenForm();
    };

    const handleCancelEdit = (onCloseForm) => {
        resetForm();
        onCloseForm();
    };

    return {
        fileInputRef,
        formData,
        setFormData,
        errors,
        setErrors,
        previewUrl,
        editingContactId,
        handleChange,
        handleFileChange,
        handleRemoveImage,
        resetForm,
        handleEditContact,
        handleCancelEdit,
    };
};
