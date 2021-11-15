import { string, object } from 'yup';

export const capitalizeFirstLetter = s => {
  if (s === '') return s;
  return `${s[0].toUpperCase()}${s.slice(1)}`;
};

export const profileValidator = object().shape({
  first_name: string()
    .trim()
    .required(),
  last_name: string()
    .trim()
    .required(),
  email: string()
    .email()
    .trim()
    .required(),
  phone_number: string()
    .trim()
    .required()
});
