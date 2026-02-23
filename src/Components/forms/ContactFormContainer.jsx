import { contactSchema } from "@components/validation/authSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import AddContact from "./AddContact";
import { saveContact } from "";
import { showSuccess } from "@utils/notifications";

export const ContactFormContainer = ({
    openForm,
    handleClose,
    isEditMode,
    existingData,
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        reset,
        setError,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(contactSchema),
        defaultValues: {
            name: "",
            email: "",
            phonenumber: "",
            profilImage: null,
        },
    });

    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        const handleModeChange = () => {
        if (isEditMode && existingData) {
            reset({
                name: existingData.name,
                email: existingData.email,
                phonenumber: existingData.phonenumber,
                profilImage: null,
            });

            setPreviewUrl(existingData.profilImage || null);
        } else {
            reset();
            setPreviewUrl(null);
        }
    };
        handleModeChange();
    }, [isEditMode, existingData, reset]);

    const onFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setValue("profilImage", file, { shouldValidate: true });
        setPreviewUrl(URL.createObjectURL(file));
    };

    const onRemoveImage = () => {
        setValue("profilImage", null, { shouldValidate: true });
        setPreviewUrl(null);
    };

    const onSubmit = (data) => {
        const result = saveContact(data, isEditMode, existingData);

        if (result?.error) {
            setError(result.field, {
                type: "manual",
                message: result.error,
            });
            return;
        }

        showSuccess(
            isEditMode
                ? "Contact updated successfully."
                : "Contact added successfully."
        );

        reset();
        setPreviewUrl(null);
        handleClose();
    };

    return (
        <AddContact
            openForm={openForm}
            handleCloseForm={handleClose}
            register={register}
            handleSubmit={handleSubmit}
            errors={errors}
            onSubmit={onSubmit}
            previewUrl={previewUrl}
            onFileChange={onFileChange}
            onRemoveImage={onRemoveImage}
            isEditMode={isEditMode}
        />
    );
};