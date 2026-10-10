require("dotenv").config();

const mongoose = require("mongoose");

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "mongo",
  "host.docker.internal",
]);

const dbUrl = process.env.MONGO_DB ?? "mongodb://localhost:27017";

function hostsOf(url) {
  const match = /^mongodb:\/\/(?:[^@/]*@)?([^/?]+)/i.exec(url);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((hostAndPort) => hostAndPort.replace(/:\d+$/, "").toLowerCase());
}

function isLocalDatabase(url) {
  const hosts = hostsOf(url);
  return hosts.length > 0 && hosts.every((host) => LOCAL_HOSTS.has(host));
}

function redact(url) {
  return url.replace(/\/\/[^@/]*@/, "//<credentials>@");
}

async function connectToLocalDatabase() {
  if (process.env.NODE_ENV === "production") {
    throw new Error('Refusing to run because NODE_ENV is "production".');
  }
  if (!isLocalDatabase(dbUrl)) {
    throw new Error(
      `Refusing to run because MONGO_DB points at ${redact(dbUrl)}, which ` +
        "is not a database on this machine. These scripts only ever touch " +
        "a local database (localhost, 127.0.0.1 or the docker-compose " +
        '"mongo" service).'
    );
  }

  await mongoose.connect(dbUrl, {
    dbName: process.env.DB_NAME,
    maxPoolSize: 3,
    serverSelectionTimeoutMS: 20000,
  });
  console.log(
    `Connected to database "${mongoose.connection.name}" at ${redact(dbUrl)}`
  );
  return mongoose.connection;
}

async function clearDatabase() {
  const collections = await mongoose.connection.db
    .listCollections({}, { nameOnly: true })
    .toArray();

  for (const { name, type } of collections) {
    if (type === "view" || name.startsWith("system.")) continue;
    const { deletedCount } = await mongoose.connection
      .collection(name)
      .deleteMany({});
    console.log(`  ${name}: deleted ${deletedCount}`);
  }
}

function disconnect() {
  return mongoose.disconnect();
}

module.exports = { connectToLocalDatabase, clearDatabase, disconnect };
