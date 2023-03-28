export const eventPopulator = [
  {
    $lookup: {
      from: "eventparents",
      let: { eventParent: "$eventParent" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$eventParent"],
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
      let: { event: "$event" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$event"],
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
      let: { user: "$user" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$user"],
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
      let: { event: "$event" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$event"],
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
      let: { user: "$user" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$user"],
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
      let: { organiztion: "$organization" },
      pipeline: [
        {
          $match: {
            $expr: {
              $eq: ["$_id", "$$organization"],
            },
          },
        },
      ],
      as: "organization",
    },
  },
  { $unwind: "$organization" },
];
