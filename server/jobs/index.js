import Agenda from "agenda";
import { definitions } from "./definitions";

const agendaOptions = {
  db: {
    address: process.env.MONGO_DB,
    collection: "jobs",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  },
  processEvery: "1 minute",
};

export const agenda = new Agenda(agendaOptions);

agenda
  .on("ready", function () {
    agenda.start().then(r => console.log('agenda started'));
  })
  .on("error", () => console.log("Agenda connection error!"));

// Loads agenda definitions
definitions(agenda);
