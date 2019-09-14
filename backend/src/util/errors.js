/**
 * User submitted non-unique email
 */
class EmailInUseError extends Error {
  constructor(message, email) {
    super(`Email In Use Error: ${message}`);
    this.name = this.constructor.name;
    this.data = { email };
  }
}

module.exports = {
  EmailInUseError
};
