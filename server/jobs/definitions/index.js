import { emailDefinitions } from "./email";

const definitionsList = [emailDefinitions];

// Goes through each definition and calls agenda.define, pairing the name of the job with the associated handler in /handlers
export const definitions = (agenda) => {
  definitionsList.forEach((definition) => definition(agenda));
};
