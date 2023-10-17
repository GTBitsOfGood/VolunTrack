import { string, object, ref } from "yup";

export const checkInValidator = object().shape({
  firstName: string().trim().required("First name is required"),
  lastName: string().trim().required("Last name is required"),
  email: string().trim().required("Email is required").email("Invalid email"),
  phoneNumber: string().trim().required("Phone number is Required").min(9, "This is not a full phone number."),
  signature: string().trim().required("A signature is required")
});
