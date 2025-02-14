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
  {
    $addFields: {
      recurringEvents: {
        $size: {
          $filter: {
            input: "$allEvents",
            as: "event",
            cond: {
              $let: {
                vars: {
                  rootDate: "$date", // Assign the root document's date to a variable
                },
                in: { $gt: ["$$event.date", "$$rootDate"] }, // Compare event date with rootDate
              },
            },
          },
        },
      },
    },
  },
  {
    $unset: ["allEvents"],
  }
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
