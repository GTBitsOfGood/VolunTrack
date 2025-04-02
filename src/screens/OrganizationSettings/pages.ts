import {
  TrophyIcon,
  BuildingOffice2Icon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
  DocumentPlusIcon,
  SquaresPlusIcon,
} from "@heroicons/react/24/solid";

export const organizationSettingsPages: Page[] = [
  {
    title: "Organization Info",
    key: "orgInfo",
    icon: BuildingOffice2Icon,
    sections: [
      {
        title: "Nonprofit Information",
        fields: [
          { name: "name", label: "Nonprofit Name" },
          { name: "website", label: "Website" },
          { name: "notificationEmail", label: "Email Address" },
        ],
      },
    ],
  },
  {
    title: "Styling & Theme",
    key: "styling",
    icon: AdjustmentsHorizontalIcon,
    sections: [
      {
        title: "Theme",
        fields: [
          {
            name: "theme",
            label: "Theme Selector",
            type: "dropdown",
          },
        ],
      },
      {
        title: "Nonprofit Logo",
        fields: [
          {
            name: "imageUrl",
            label: "Link to the Logo",
            placeholder: "https://bitsofgood.org/favicon.png",
          },
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
        title: "Event Location",
        fields: [
          { name: "defaultEventAddress", label: "Address" },
          { name: "defaultEventCity", label: "City" },
          { name: "defaultEventState", label: "State" },
          { name: "defaultEventZip", label: "Zip Code" },
        ],
      },
      {
        title: "Event Contact",
        fields: [
          { name: "defaultContactName", label: "Full Name" },
          {
            name: "defaultContactEmail",
            label: "Email Address",
            placeholder: "example@bitsofgood.com",
          },
          {
            name: "defaultContactPhone",
            label: "Phone Number",
            placeholder: "xxx-xxx-xxxx",
          },
        ],
      },
    ],
  },
  {
    title: "Customization",
    key: "customization",
    icon: SquaresPlusIcon,
    helperText: "Set default values to create events faster",
    sections: [],
  },
  {
    title: "Award Thresholds",
    key: "awards",
    icon: TrophyIcon,
    helperText:
      "Motivate and engage volunteers by setting thresholds for different medals",
    sections: [
      {
        title: "Event Medal Thresholds",
        fields: [
          { name: "eventSilver", label: "Silver Medal", type: "number" },
          { name: "eventGold", label: "Gold Medal", type: "number" },
        ],
      },
      {
        title: "Hours Volunteered Medal Thresholds",
        fields: [
          { name: "hoursSilver", label: "Silver Medal", type: "number" },
          { name: "hoursGold", label: "Gold Medal", type: "number" },
        ],
      },
    ],
  },
  {
    title: "Waiver Management",
    key: "waiver",
    icon: DocumentPlusIcon,
    sections: [],
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
