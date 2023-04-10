export const eventPopulator = [
  {
    $lookup: {
      from: "eventparents",
      let: { eventParentId: "$eventParentId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$eventParentId"],
            },
          },
        },
      ],
      as: "eventParent",
    },
  },
  { $unwind: "$eventParent" },
];

export const attendancePopulator = [
  {
    $lookup: {
      from: "events",
      let: { eventId: "$eventId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$eventId"],
            },
          },
        },
      ],
      as: "event",
    },
  },
  {
    $lookup: {
      from: "users",
      let: { userId: "$userId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$userId"],
            },
          },
        },
      ],
      as: "user",
    },
  },
  { $unwind: "$event" },
  { $unwind: "$user" },
];

export const registrationPopulator = [
  {
    $lookup: {
      from: "events",
      let: { eventId: "$eventId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$eventId"],
            },
          },
        },
      ],
      as: "event",
    },
  },
  {
    $lookup: {
      from: "users",
      let: { userId: "$userId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$userId"],
            },
          },
        },
      ],
      as: "user",
    },
  },
  { $unwind: "$event" },
  { $unwind: "$user" },
];

export const userPopulator = [
  {
    $lookup: {
      from: "organizations",
      let: { organiztionId: "$organizationId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$organizationId"],
            },
          },
        },
      ],
      as: "organization",
    },
  },
  { $unwind: "$organization" },
];
