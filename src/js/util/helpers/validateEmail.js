/**
 * Validate an email address.
 * @param {string} email
 */
export default (email) => /^\S+@\S+[.][0-9a-z]+$/.test(email);
