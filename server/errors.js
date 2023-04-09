/** User submitted non-unique email */
class EmailInUseError extends Error {
  constructor(message, email) {
    super(`Email In Use Error: ${message}`);
    this.name = this.constructor.name;
    this.data = { email };
  }
}

// placeholder
class SendEmailError extends Error {
  constructor() {
    super("Send email error");
  }
}

module.exports = {
  EmailInUseError,
  SendEmailError,
};
