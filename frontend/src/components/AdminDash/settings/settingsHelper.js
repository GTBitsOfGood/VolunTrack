import { string, object, number } from 'yup';

export const eventValidator = object().shape({
    firstName: string()
        .trim(),
    LastName: string()
        .trim(),
    phoneNumber: string()
        .trim(),
    email: string()
        .email()
        .trim(),
});
