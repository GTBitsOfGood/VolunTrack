/**
 * Utility functions for getting the customizable volunteer/member term
 * Configured via NEXT_PUBLIC_VOLUNTEER_TERM environment variable Default:
 * "volunteer"
 */

const baseTerm = process.env.NEXT_PUBLIC_VOLUNTEER_TERM || "volunteer";

/**
 * Get the volunteer term in lowercase singular form
 *
 * @returns {string} E.g., "volunteer"
 */
export const getVolunteerTerm = () => baseTerm.toLowerCase();

/**
 * Get the volunteer term capitalized (first letter uppercase)
 *
 * @returns {string} E.g., "Volunteer"
 */
export const getVolunteerTermCapitalized = () => {
  const term = baseTerm.toLowerCase();
  return term.charAt(0).toUpperCase() + term.slice(1);
};

/**
 * Get the volunteer term in plural form (adds 's')
 *
 * @returns {string} E.g., "volunteers"
 */
export const getVolunteerTermPlural = () => {
  const term = baseTerm.toLowerCase();
  return `${term}s`;
};

/**
 * Get the volunteer term in plural form, capitalized
 *
 * @returns {string} E.g., "Volunteers"
 */
export const getVolunteerTermPluralCapitalized = () => {
  const term = baseTerm.toLowerCase();
  return term.charAt(0).toUpperCase() + term.slice(1) + "s";
};

/**
 * Get the volunteer term in all uppercase
 *
 * @returns {string} E.g., "VOLUNTEER"
 */
export const getVolunteerTermUpperCase = () => baseTerm.toUpperCase();
