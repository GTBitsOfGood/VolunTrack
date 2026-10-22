/* eslint-disable no-console */
// Dedicated, additive local fixtures. Never reads application DB credentials.
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");

const dbName = "voluntrack_clock_manual";
const password = "clock-local-only-123";
const readEmail = (name) => {
  const email = process.env[name]?.trim().toLowerCase();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new Error(`Supply your personal test address in ${name}.`);
  }
  return email;
};

async function main() {
  const volunteerEmail = readEmail("CLOCK_VOLUNTEER_EMAIL");
  const adminEmail = readEmail("CLOCK_ADMIN_EMAIL");
  if (volunteerEmail === adminEmail) {
    throw new Error(
      "Use distinct addresses or personal email aliases for the two roles."
    );
  }
  const client = new MongoClient("mongodb://127.0.0.1:27018", {
    serverSelectionTimeoutMS: 5000,
  });
  await client.connect();
  try {
    const db = client.db(dbName);
    for (const { name } of await db.listCollections().toArray()) {
      if (await db.collection(name).findOne({})) {
        throw new Error(
          `${dbName} is not empty. Existing fixtures were left untouched.`
        );
      }
    }
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/New_York",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const part = (type) => parts.find((p) => p.type === type).value;
    const today = new Date(
      `${part("year")}-${part("month")}-${part("day")}T00:00:00Z`
    );
    const organizationId = new ObjectId();
    const volunteerId = new ObjectId();
    const adminId = new ObjectId();
    await db.collection("organizations").insertOne({
      _id: organizationId,
      name: "Clock QA Local",
      slug: "clock-qa-local",
      active: true,
      theme: "magenta",
      invitedAdmins: [],
      originalAdminEmail: adminEmail,
      notificationEmail: adminEmail,
      imageUrl: "/images/bog_logo.png",
      website: "https://example.invalid",
      eventSilver: 4,
      eventGold: 8,
      hoursSilver: 20,
      hoursGold: 40,
      createdAt: now,
      updatedAt: now,
    });
    for (const [id, email, role] of [
      [volunteerId, volunteerEmail, "volunteer"],
      [adminId, adminEmail, "admin"],
    ]) {
      await db.collection("users").insertOne({
        _id: id,
        email,
        organizationId,
        role,
        firstName: "Clock",
        lastName: role,
        status: "new",
        phone: "555-555-0100",
        address: "123 Test Street",
        city: "Atlanta",
        state: "GA",
        zip: "30308",
        imageUrl: "/images/gradient-avatar.png",
        isBitsOfGoodAdmin: false,
        passwordHash: await bcrypt.hash(email + password, 10),
        createdAt: now,
        updatedAt: now,
      });
    }
    const scenarios = [
      ["Approved review-required shift", true, "approved", 0],
      ["Approved no-review shift", false, "approved", 0],
      ["Pending review", true, "pending", 0],
      ["Denied review", true, "denied", 0],
      ["Unregistered shift", false, null, 0],
      ["Tomorrow shift", false, "approved", 1],
      ["Past shift", false, "approved", -1],
    ];
    const links = [];
    for (const [title, requiresApproval, approved, days] of scenarios) {
      const eventParent = new ObjectId();
      const eventId = new ObjectId();
      await db.collection("eventparents").insertOne({
        _id: eventParent,
        organizationId,
        title,
        requiresApproval,
        startTime: "00:00",
        endTime: "23:59",
        localTime: "America/New_York",
        address: "123 Test Street",
        city: "Atlanta",
        state: "GA",
        zip: "30308",
        eventContactPhone: "555-555-0100",
        eventContactEmail: adminEmail,
        pocName: "Clock Admin",
        pocEmail: adminEmail,
        pocPhone: "555-555-0100",
        maxVolunteers: 20,
        isPrivate: false,
        isNotifyAdmin: false,
        sendReminderEmail: false,
        isValidForCourtHours: false,
        tasks: [],
        description:
          "Local clock verification fixture. Broad hours keep today's test available.",
        createdAt: now,
        updatedAt: now,
      });
      await db.collection("events").insertOne({
        _id: eventId,
        eventParent,
        date: new Date(today.getTime() + days * 86400000),
        isEnded: false,
        createdAt: now,
        updatedAt: now,
      });
      if (approved)
        await db.collection("registrations").insertOne({
          organizationId,
          eventId,
          userId: volunteerId,
          approved,
          minors: [],
          tasks: [],
          createdAt: now,
          updatedAt: now,
        });
      links.push({
        scenario: title,
        eventId: eventId.toString(),
        path: `/events/${eventId}/register`,
      });
    }
    console.log(
      JSON.stringify(
        {
          database: dbName,
          organizationId,
          volunteerId,
          adminId,
          password,
          shifts: links,
        },
        null,
        2
      )
    );
    console.log(
      "Fixtures inserted directly into local Mongo. No emails sent. Existing seed command was not used."
    );
  } finally {
    await client.close();
  }
}
main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
