import * as yup from "yup";

export const signupSchema = yup.object({
    name: yup.string().required("Name is required"),

    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    password: yup
        .string()
        .min(6, "Minimum 6 characters")
        .required("Password is required"),

    confirmPassword: yup
        .string()
        .required("Confirm Password is required")
        .oneOf([yup.ref("password")], "Passwords must match"),
});

export const loginSchema = yup.object({
    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    password: yup
        .string()
        .required("Password is required"),
});

export const contactSchema = yup.object().shape({
    name: yup.string().required("Name is required"),

    email: yup
        .string()
        .email("Invalid email")
        .required("Email is required"),

    phonenumber: yup
        .string()
        .required("Phone number is required")
        .matches(/^[0-9]{10}$/, "Must be 10 digits"),
});