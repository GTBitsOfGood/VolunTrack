/* eslint-disable no-console */
/**
 * Empties every collection in the LOCAL database.
 *
 *     docker compose exec app yarn db:clear
 */
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
