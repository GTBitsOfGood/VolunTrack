import mongoose, { connect } from "mongoose";
import dotenv from "dotenv";

{
  /**
   * Instruction for Schema Update/Migration: 0. Premises: No need to stop or
   * re-start server; Ensure process.env.MONGO_DB is configured correctly;
   * Ensure the last line "runMigration();" is uncommented;
   *
   * 1. Step 1: Manually add "type: module" in package.json; --> This was not
   *    updated for good as some scripts are still using CommonJS syntax
   * 2. Step 2: if located at path "VolunTrack/" run "node
   *    server/mongodb/migrations/EventParent-Add-isNotifyAdmin.js" otherwise:
   *    modify file path in above run command accordingly, and run
   * 3. Step 3: comment the last line "runMigration();" -> avoid running when
   *    server starts next time
   */
}

dotenv.config();

const dbUrl = process.env.MONGO_DB || "mongodb://localhost:27017";

async function runMigration() {
  console.log("Start DB connection");

  await connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: process.env.DB_NAME || "test",
    maxPoolSize: 3,
  }).catch((e) => {
    throw e;
  });

  console.log("DB connected");

  const EventParent = mongoose.model(
    "EventParent",
    new mongoose.Schema({
      isNotifyAdmin: { type: Boolean, default: false },
    })
  );
  console.log("New Schema Defined");
  try {
    /** Include new column isNotifyAdmin */
    const result = await EventParent.updateMany(
      { isNotifyAdmin: { $exists: false } },
      { $set: { isNotifyAdmin: false } }
    );
    console.log(`${result.modifiedCount} documents updated.`);
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    mongoose.disconnect();
  }
}

// runMigration();
