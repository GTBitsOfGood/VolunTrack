import { string, object } from "yup";

export const invitedAdminValidator = object().shape({
  email: string().email().trim(),
});
