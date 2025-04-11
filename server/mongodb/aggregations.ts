export const eventPopulator = [
  {
    $lookup: {
      from: "events",
      localField: "eventParent",
      foreignField: "eventParent",
      as: "allEvents",
    },
  },
  {
    $lookup: {
      from: "eventparents",
      localField: "eventParent",
      foreignField: "_id",
      as: "eventParent",
    },
  },
  {
    $unwind: {
      path: "$eventParent",
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $addFields: {
      recurringEvents: {
        $size: {
          $filter: {
            input: "$allEvents",
            as: "event",
            cond: { $gt: ["$$event.date", "$date"] },
          },
        },
      },
    },
  },
  {
    $unset: ["allEvents"],
  },
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
