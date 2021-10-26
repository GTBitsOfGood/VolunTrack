import { string, object, number, date } from 'yup';

export const eventValidator = object().shape({
    firstName: string()
        .trim()
        .required(),
    LastName: string()
        .trim()
        .required(),
    phoneNumber: string()
        .trim()
        .required(),
    email: string()
        .email()
        .required()
        .trim(),
    city: string()
        .trim()
        .required(),
    state: string()
        .trim()
        .required(),
    zip_code: number()
        .positive()
        .required()
});
