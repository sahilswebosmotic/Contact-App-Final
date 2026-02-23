import { TextField } from "@mui/material";

export default function FormInput({
    label,
    name,
    register,
    errors,
    type = "text",
}) {
    return (
        <TextField
            label={label}
            type={type}
            {...register(name)}
            error={!!errors[name]}  
            helperText={errors[name]?.message}
            fullWidth
            margin="normal"
        />
    );
}