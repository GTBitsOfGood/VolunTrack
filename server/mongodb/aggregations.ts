export const eventPopulation = [
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

export const attendancePopulation = [
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

export const registrationPopulation = [
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
