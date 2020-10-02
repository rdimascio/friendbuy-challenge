/**
 * Validate an email address.
 * @param {string} email
 */
export default (email) =>
	typeof email == 'string' ? /^\S+@\S+[.][0-9a-z]+$/.test(email) : false;
