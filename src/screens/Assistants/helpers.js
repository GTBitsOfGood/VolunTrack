import { object, string } from "yup";

export const invitedAdminValidator = object().shape({
  email: string().trim().required("Email is required").email("Invalid email"),
});
