import { string, object, ref } from "yup";

export const createAccountValidator = object().shape({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  email: string().trim().required("Email is required").email("Invalid email"),
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum.")
    .matches(/[a-zA-Z]/, "Password should at least contain 1 letter"),
  passwordConfirm: string().oneOf(
    [ref("password"), null],
    "Passwords must match"
  ),
  orgCode: string().trim().required("Nonprofit code is required"),
});

export const changePasswordValidator = object().shape({
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum.")
    .matches(/[a-zA-Z]/, "Password should at least contain 1 letter"),
  password_confirm: string().oneOf(
    [ref("password"), null],
    "Passwords must match"
  ),
});

export const loginValidator = object().shape({
  email: string().trim().required("Email is required").email("Invalid email"),
  password: string()
    .required("No password provided.")
    .min(10, "Password is too short - should be 10 chars minimum."),
});
