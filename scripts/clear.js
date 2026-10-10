const { clearDatabase, connectToLocalDatabase, disconnect } = require("./db");

async function run() {
  await connectToLocalDatabase();
  await clearDatabase();
}

run()
  .then(() => disconnect())
  .then(() => {
    console.info("DB cleared");

    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Error clearing DB");
    console.error(err.message);

    await disconnect().catch(() => undefined);
    process.exit(1);
  });
