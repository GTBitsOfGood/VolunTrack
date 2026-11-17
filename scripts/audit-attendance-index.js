/* eslint-disable no-console */
const { connectToLocalDatabase, disconnect } = require("./db");

async function main() {
  try {
    const connection = await connectToLocalDatabase();
    const duplicates = await connection
      .collection("attendances")
      .aggregate([
        {
          $group: {
            _id: { userId: "$userId", eventId: "$eventId" },
            count: { $sum: 1 },
            attendanceIds: { $push: "$_id" },
          },
        },
        { $match: { count: { $gt: 1 } } },
      ])
      .toArray();
    console.log(JSON.stringify({ duplicateGroups: duplicates }, null, 2));
    if (duplicates.length) {
      console.error(
        "Resolve duplicates with an admin before installing the unique index. No records were modified."
      );
      process.exitCode = 1;
    }
  } finally {
    await disconnect();
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
