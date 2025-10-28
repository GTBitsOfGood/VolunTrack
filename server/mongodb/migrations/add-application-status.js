const { MongoClient } = require("mongodb");
require("dotenv").config();

(async () => {
  const uri = process.env.MONGO_DB || "mongodb://localhost:27017";
  const dbName = process.env.DB_NAME || "test";
  const client = new MongoClient(uri, { useUnifiedTopology: true });

  try {
    await client.connect();
    const db = client.db(dbName);
    const res = await db
      .collection("users")
      .updateMany(
        { applicationStatus: { $exists: false } },
        { $set: { applicationStatus: "approved", approvedAt: new Date() } }
      );
    console.log("modifiedCount", res.modifiedCount);
  } catch (err) {
    console.error("Migration failed:", err);
    process.exitCode = 1;
  } finally {
    await client.close();
  }
})();
