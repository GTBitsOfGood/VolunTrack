import {
  TrophyIcon,
  BuildingOffice2Icon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";

export const adminSettingsPages: Page[] = [
  {
    title: "Notification Preferences",
    key: "notifPref",
    icon: BuildingOffice2Icon,
    sections: [
      {
        title: "Toggle Alerts",
        fields: [
          { name: "Email", label: "Placeholder" },
          { name: "Dashboard", label: "Placeholder" },
          { name: "SMS Alerts", label: "Placeholder" },
        ],
      },
    ],
  },
  {
    title: "Volunteer Approval",
    key: "volApp",
    icon: AdjustmentsHorizontalIcon,
    sections: [
      {
        title: "Enable Workflow",
        fields: [
          {
            name: "Enable",
            label: "Enable",
            type: "dropdown",
          },
        ],
      },
      {
        title: "Customize Message",
        fields: [
          { name: "defaultMessage", label: "Message" },
        ],
      },
    ],
  },
  {
    title: "Default Values",
    key: "defaultValues",
    icon: DocumentTextIcon,
    helperText: "Set default values to create events faster",
    sections: [
      {
        title: "Event Defaults",
        fields: [
          { name: "defaultCap", label: "Volunteer Cap" },
          { name: "defaultShift", label: "Shift Duration" },
        ],
      },
    ],
  },
  {
    title: "User Management",
    key: "userMgmt",
    icon: SquaresPlusIcon,
    helperText: "Manage user settings",
    sections: [
        {
            title: "Add/Remove Admins",
            fields: [
                { name: "placeholder", label: "placeholder" },
            ]
        },
        {
            title: "Reset Passwords",
            fields: [
                { name: "placeholder", label: "placeholder" },
            ]
        },
        {
            title: "Activity Logs",
            fields: [
                { name: "placeholder", label: "placeholder" },
            ]
        }
    ],
  },
  {
    title: "System Configuration",
    key: "sysConfig",
    icon: TrophyIcon,
    helperText:
      "Configure system-wide settings",
    sections: [
      {
        title: "Timezone",
        fields: [
          { name: "timezone", label: "placeholder" },
        ],
      },
      {
        title: "Language",
        fields: [
          { name: "language", label: "placeholder" },
        ],
      },
      {
        title: "Branding",
        fields: [
          { name: "branding", label: "placeholder" },
        ],
      },
    ],
  },
];

type Page = {
  title: string;
  key: string;
  icon: any; // TODO: can we style the icons?
  helperText?: string;
  sections: Section[];
};

type Section = {
  title: string;
  fields: Field[];
};

type Field = {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
};
