import { TextField } from "@mui/material";

const CONTACT_FIELDS = [
    { label: "Name", name: "name", autoComplete: "name" },
    { label: "Email", name: "email", type: "email", autoComplete: "email" },
    { label: "Phone Number", name: "phonenumber", type: "tel", autoComplete: "tel" },
];

const ContactFormFields = ({ formData, errors, onChange }) => {
    return CONTACT_FIELDS.map((field) => (
        <TextField
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type || "text"}
            value={formData[field.name]}
            onChange={onChange}
            error={!!errors[field.name]}
            helperText={errors[field.name]}
            autoComplete={field.autoComplete}
        />
    ));
};

export default ContactFormFields;
