import { connect, connections } from "mongoose";
import urls from "../../utils/urls";

export default async () => {
  if (connections?.[0].readyState) return;

  await connect(urls.dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME,
    maxPoolSize: 3,
  }).catch((e) => {
    throw e;
  });
};
