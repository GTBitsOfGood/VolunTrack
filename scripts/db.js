/* eslint-disable no-console */
/**
 * Shared helpers for the scripts in this folder.
 *
 * They only ever talk to a database running on this machine (localhost,
 * 127.0.0.1 or the `mongo` service from docker-compose.yml). Any other host,
 * such as the shared dev or production cluster on MongoDB Atlas, is refused
 * before a connection is even attempted.
 */
require("dotenv").config();

const mongoose = require("mongoose");

const LOCAL_HOSTS = new Set([
  "localhost",
  "127.0.0.1",
  "0.0.0.0",
  "[::1]",
  "mongo", // the database service in docker-compose.yml
  "host.docker.internal",
]);

const dbUrl = process.env.MONGO_DB ?? "mongodb://localhost:27017";

/**
 * Returns the host names in a plain mongodb:// connection string, without
 * ports.
 */
function hostsOf(url) {
  const match = /^mongodb:\/\/(?:[^@/]*@)?([^/?]+)/i.exec(url);
  if (!match) return [];
  return match[1]
    .split(",")
    .map((hostAndPort) => hostAndPort.replace(/:\d+$/, "").toLowerCase());
}

/**
 * True only for a plain mongodb:// URL whose every host is on this machine.
 * mongodb+srv:// URLs always point at a remote cluster, so they never match.
 */
function isLocalDatabase(url) {
  const hosts = hostsOf(url);
  return hosts.length > 0 && hosts.every((host) => LOCAL_HOSTS.has(host));
}

/** Hides the username and password in a connection string before printing it. */
function redact(url) {
  return url.replace(/\/\/[^@/]*@/, "//<credentials>@");
}

/**
 * Connects to the database named by MONGO_DB (and DB_NAME, like the app does),
 * but only if it runs on this machine.
 */
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

/** Deletes every record in every collection. Collections and indexes stay. */
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
