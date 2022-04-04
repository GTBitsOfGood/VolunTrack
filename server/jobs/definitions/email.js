import { emailHandler } from "../handlers/email";

// Pairs the name of the job with the associated handler
export const emailDefinitions = (agenda) => {
  agenda.define("send-survey-email", emailHandler.sendSurveyEmail);
};
