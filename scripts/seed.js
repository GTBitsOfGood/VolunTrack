/* eslint-disable no-console */
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const { clearDatabase, connectToLocalDatabase, disconnect } = require("./db");

const PASSWORD = "password123";
const baseUrl = process.env.BASE_URL ?? "http://localhost:3000";

const ORGANIZATION = {
  name: "Local Test Org",
  slug: "local-test",
  website: "https://example.com",
  imageUrl: `${baseUrl}/images/bog_logo.png`,
  notificationEmail: "admin@test.com",
  theme: "magenta",
  defaultEventState: "GA",
  defaultEventCity: "Atlanta",
  defaultEventAddress: "123 Peachtree St NE",
  defaultEventZip: "30308",
  defaultContactName: "Test Admin",
  defaultContactEmail: "admin@test.com",
  defaultContactPhone: "555-555-0100",
  invitedAdmins: [],
  originalAdminEmail: "admin@test.com",
  active: true,
  eventSilver: 4,
  eventGold: 8,
  hoursSilver: 20,
  hoursGold: 40,
  homePage: "",
  aboutPageToggle: false,
};

const PENDING_ORGANIZATION = {
  name: "Pending Test Org",
  slug: "pending-test",
  website: "https://example.org",
  notificationEmail: "pending@test.com",
  theme: "magenta",
  defaultContactName: "Pat Pending",
  defaultContactEmail: "pending@test.com",
  defaultContactPhone: "555-555-0200",
  invitedAdmins: ["pending@test.com"],
  originalAdminEmail: "pending@test.com",
  active: false,
  eventSilver: 4,
  eventGold: 8,
  hoursSilver: 20,
  hoursGold: 40,
  homePage: "",
  aboutPageToggle: false,
};

const USERS = [
  {
    email: "admin@test.com",
    firstName: "Test",
    lastName: "Admin",
    role: "admin",
    phone: "555-555-0100",
    isBitsOfGoodAdmin: false,
  },
  {
    email: "manager@test.com",
    firstName: "Test",
    lastName: "Manager",
    role: "manager",
    phone: "555-555-0101",
    isBitsOfGoodAdmin: false,
  },
  {
    email: "volunteer@test.com",
    firstName: "Test",
    lastName: "Volunteer",
    role: "volunteer",
    phone: "555-555-0102",
    isBitsOfGoodAdmin: false,
  },
  {
    email: "bogadmin@test.com",
    firstName: "Bits",
    lastName: "OfGood",
    role: "admin",
    phone: "555-555-0103",
    isBitsOfGoodAdmin: true,
  },
];

const EVENTS = [
  {
    title: "Community Food Drive",
    daysFromNow: 7,
    startTime: "09:00",
    endTime: "12:00",
    maxVolunteers: 20,
    requiresApproval: false,
    description: "Sort and pack donations at the food bank.",
  },
  {
    title: "Park Cleanup Day",
    daysFromNow: 14,
    startTime: "10:00",
    endTime: "13:00",
    maxVolunteers: 15,
    requiresApproval: true,
    description:
      "Pick up litter and mulch the trails. Registrations need admin approval.",
  },
];

function dateInDays(days) {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + days)
  );
}

async function buildSeedData() {
  await connectToLocalDatabase();

  // Delete all data
  await clearDatabase();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  const organizations = mongoose.connection.collection("organizations");
  const users = mongoose.connection.collection("users");
  const eventParents = mongoose.connection.collection("eventparents");
  const events = mongoose.connection.collection("events");

  // Create organizations
  const { insertedId: organizationId } = await organizations.insertOne({
    ...ORGANIZATION,
    createdAt: thirtyDaysAgo,
    updatedAt: now,
    __v: 0,
  });

  await organizations.insertOne({
    ...PENDING_ORGANIZATION,
    createdAt: now,
    updatedAt: now,
    __v: 0,
  });

  // Create users
  for (const user of USERS) {
    await users.insertOne({
      ...user,
      organizationId,
      status: "new",
      address: "123 Peachtree St NE",
      city: "Atlanta",
      state: "GA",
      zip: "30308",
      imageUrl: "/images/gradient-avatar.png",
      passwordHash: await bcrypt.hash(user.email + PASSWORD, 10),
      createdAt: now,
      updatedAt: now,
      __v: 0,
    });
  }

  // Create events
  for (const event of EVENTS) {
    const { daysFromNow, ...details } = event;
    const { insertedId: eventParentId } = await eventParents.insertOne({
      ...details,
      localTime: "EDT",
      address: ORGANIZATION.defaultEventAddress,
      city: ORGANIZATION.defaultEventCity,
      state: ORGANIZATION.defaultEventState,
      zip: ORGANIZATION.defaultEventZip,
      eventContactPhone: ORGANIZATION.defaultContactPhone,
      eventContactEmail: ORGANIZATION.defaultContactEmail,
      isPrivate: false,
      isValidForCourtHours: false,
      isNotifyAdmin: false,
      sendReminderEmail: false,
      organizationId,
      pocName: ORGANIZATION.defaultContactName,
      pocEmail: ORGANIZATION.defaultContactEmail,
      pocPhone: ORGANIZATION.defaultContactPhone,
      orgName: ORGANIZATION.name,
      orgAddress: ORGANIZATION.defaultEventAddress,
      orgCity: ORGANIZATION.defaultEventCity,
      orgState: ORGANIZATION.defaultEventState,
      orgZip: ORGANIZATION.defaultEventZip,
      tasks: [],
      createdAt: now,
      updatedAt: now,
      __v: 0,
    });
    await events.insertOne({
      date: dateInDays(daysFromNow),
      eventParent: eventParentId,
      isEnded: false,
      createdAt: now,
      updatedAt: now,
      __v: 0,
    });
  }
}

buildSeedData()
  .then(() => disconnect())
  .then(() => {
    console.info("\nDatabase seeded successfully!");
    console.info(`\nSign in at ${baseUrl}/login with password "${PASSWORD}":`);
    for (const user of USERS) {
      console.info(`  ${user.email}`);
    }
    console.info(`\nOrganization code for new sign-ups: ${ORGANIZATION.slug}`);

    process.exit(0);
  })
  .catch(async (err) => {
    console.error("Error seeding database");
    console.error(err.message);

    await disconnect().catch(() => undefined);
    process.exit(1);
  });
