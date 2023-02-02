import { string, object } from "yup";
import * as yup from "yup";

export const createAccountValidator = object().shape({
  first_name: string().trim().required("First name is required"),
  last_name: string().trim().required("Last name is required"),
  email: string().trim().required("Email is required").email("Invalid email"),
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum."),
  password_confirm: string().required("Confirm your password."),

  // .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  // yup-password
});

export const validationSchema = yup.object({
  password: yup
    .string()
    .required("Password is required")
    .min(5, "Your password is too short.")
    .matches(/[a-zA-Z]/, "Password can only contain Latin letters."),
  password_confirm: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

export const loginValidator = object().shape({
  email: string().trim().required("Email is required").email("Invalid email"),
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum."),
});
