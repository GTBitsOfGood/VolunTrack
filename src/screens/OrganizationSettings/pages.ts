import {
  TrophyIcon,
  BuildingOffice2Icon,
  AdjustmentsHorizontalIcon,
  DocumentTextIcon,
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
          { name: "non_profit_name", label: "Nonprofit Name" },
          { name: "non_profit_website", label: "Website" },
          { name: "notification_email", label: "Email Address" },
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
        title: "Nonprofit Logo",
        fields: [
          {
            name: "logo_link",
            label: "Link to the Logo",
            placeholder: "https://bitsofgood.org/favicon.png",
          },
        ],
      },
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
          { name: "default_address", label: "Address" },
          { name: "default_city", label: "City" },
          { name: "default_state", label: "State" },
          { name: "default_zip", label: "Zip Code" },
        ],
      },
      {
        title: "Event Contact",
        fields: [
          { name: "default_contact_name", label: "Full Name" },
          {
            name: "default_contact_email",
            label: "Email Address",
            placeholder: "example@bitsofgood.com",
          },
          {
            name: "default_contact_phone",
            label: "Phone Number",
            placeholder: "xxx-xxx-xxxx",
          },
        ],
      },
    ],
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
          { name: "event_silver", label: "Silver Medal" },
          { name: "event_gold", label: "Gold Medal" },
        ],
      },
      {
        title: "Hours Volunteered Medal Thresholds",
        fields: [
          { name: "hours_silver", label: "Silver Medal" },
          { name: "hours_gold", label: "Gold Medal" },
        ],
      },
    ],
  },
];

interface Page {
  title: string;
  key: string;
  icon: any; // TODO: can we style the icons?
  helperText?: string;
  sections: Section[];
}

interface Section {
  title: string;
  fields: Field[];
}

interface Field {
  name: string;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
}
