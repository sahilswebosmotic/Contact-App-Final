import { TextField } from "@mui/material";

export default function FormInput({
    label,
    name,
    register,
    type = "text",
}) {
    return (
        <TextField
            label={label}
            type={type}
            {...register(name)}
            fullWidth
            margin="normal"
        />
    );
}
