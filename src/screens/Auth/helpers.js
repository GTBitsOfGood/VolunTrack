import { string, object } from "yup";

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

export const loginValidator = object().shape({
  email: string().trim().required("Email is required").email("Invalid email"),
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum."),
});
