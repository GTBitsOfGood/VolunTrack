import {
  BellIcon,
  UserCheckIcon,
  CalendarDaysIcon,
  UsersIcon,
  CogIcon,
} from "@heroicons/react/24/solid";

export const adminSettingsPages: Page[] = [
  {
    title: "Notification Preferences",
    key: "notifPref",
    icon: BellIcon,
    helperText: "Configure email, dashboard, and SMS alert preferences",
    sections: [
      {
        title: "Email Alerts",
        fields: [
          {
            name: "emailAlerts",
            label: "Email Alerts",
            type: "toggle",
            description: "Receive notifications via email"
          },
          {
            name: "emailEventRegistrations",
            label: "Event Registrations",
            type: "toggle",
            description: "Get notified when volunteers register for events"
          },
          {
            name: "emailEventCancellations",
            label: "Event Cancellations",
            type: "toggle",
            description: "Get notified when events are cancelled"
          },
        ],
      },
      {
        title: "Dashboard Alerts",
        fields: [
          {
            name: "dashboardAlerts",
            label: "Dashboard Alerts",
            type: "toggle",
            description: "Show alerts on dashboard"
          },
          {
            name: "dashboardEventReminders",
            label: "Event Reminders",
            type: "toggle",
            description: "Show event reminders on dashboard"
          },
        ],
      },
      {
        title: "SMS Alerts",
        fields: [
          {
            name: "smsAlerts",
            label: "SMS Alerts",
            type: "toggle",
            description: "Receive SMS notifications"
          },
          {
            name: "smsUrgentAlerts",
            label: "Urgent Alerts",
            type: "toggle",
            description: "Receive urgent notifications via SMS"
          },
        ],
      },
    ],
  },
  {
    title: "Volunteer Approval",
    key: "volApp",
    icon: UserCheckIcon,
    helperText: "Configure volunteer approval process and messaging",
    sections: [
      {
        title: "Approval Settings",
        fields: [
          {
            name: "enableWorkflow",
            label: "Enable Approval Workflow",
            type: "toggle",
            description: "Enable manual approval for new volunteers"
          },
          {
            name: "autoApproveVolunteers",
            label: "Auto-approve Volunteers",
            type: "toggle",
            description: "Automatically approve new volunteer registrations"
          },
          {
            name: "requireBackgroundCheck",
            label: "Require Background Check",
            type: "toggle",
            description: "Require background check before approval"
          },
        ],
      },
      {
        title: "Custom Messaging",
        fields: [
          {
            name: "defaultMessage",
            label: "Welcome Message",
            type: "textarea",
            description: "Message sent to approved volunteers",
            placeholder: "Thank you for your interest in volunteering!"
          },
          {
            name: "rejectionMessage",
            label: "Rejection Message",
            type: "textarea",
            description: "Message sent to rejected volunteers",
            placeholder: "Thank you for your interest, but we cannot approve your application at this time."
          },
        ],
      },
    ],
  },
  {
    title: "Default Values",
    key: "defaultValues",
    icon: CalendarDaysIcon,
    helperText: "Set default values for new events",
    sections: [
      {
        title: "Event Defaults",
        fields: [
          {
            name: "defaultCap",
            label: "Default Volunteer Cap",
            type: "number",
            description: "Default maximum volunteers per event"
          },
          {
            name: "defaultShift",
            label: "Default Shift Duration (hours)",
            type: "number",
            description: "Default length of volunteer shifts"
          },
          {
            name: "defaultEventDuration",
            label: "Default Event Duration (hours)",
            type: "number",
            description: "Default length of events"
          },
        ],
      },
      {
        title: "Event Settings",
        fields: [
          {
            name: "requireWaiver",
            label: "Require Waiver by Default",
            type: "toggle",
            description: "Require waiver for all events by default"
          },
          {
            name: "autoSendReminders",
            label: "Auto-send Reminders",
            type: "toggle",
            description: "Automatically send event reminders"
          },
        ],
      },
    ],
  },
  {
    title: "User Management",
    key: "userMgmt",
    icon: UsersIcon,
    helperText: "Manage admins, passwords, and view activity logs",
    sections: [
      {
        title: "Admin Management",
        fields: [
          {
            name: "allowAdminSelfRemoval",
            label: "Allow Admin Self-Removal",
            type: "toggle",
            description: "Allow admins to remove themselves"
          },
          {
            name: "requireAdminApproval",
            label: "Require Admin Approval",
            type: "toggle",
            description: "Require approval for new admin additions"
          },
        ],
      },
      {
        title: "Password Policies",
        fields: [
          {
            name: "passwordExpirationDays",
            label: "Password Expiration (days)",
            type: "number",
            description: "Days before passwords expire"
          },
          {
            name: "requireStrongPasswords",
            label: "Require Strong Passwords",
            type: "toggle",
            description: "Enforce strong password requirements"
          },
        ],
      },
      {
        title: "Activity Logging",
        fields: [
          {
            name: "logUserActivity",
            label: "Log User Activity",
            type: "toggle",
            description: "Track user actions and changes"
          },
          {
            name: "logRetentionDays",
            label: "Log Retention (days)",
            type: "number",
            description: "How long to keep activity logs"
          },
        ],
      },
    ],
  },
  {
    title: "System Configuration",
    key: "sysConfig",
    icon: CogIcon,
    helperText: "Configure system-wide settings and branding",
    sections: [
      {
        title: "Regional Settings",
        fields: [
          {
            name: "timezone",
            label: "Default Timezone",
            type: "select",
            description: "Default timezone for the organization"
          },
          {
            name: "language",
            label: "Default Language",
            type: "select",
            description: "Default language for the interface"
          },
          {
            name: "dateFormat",
            label: "Date Format",
            type: "select",
            description: "How dates are displayed"
          },
        ],
      },
      {
        title: "Branding Elements",
        fields: [
          {
            name: "customLogo",
            label: "Custom Logo URL",
            type: "text",
            description: "URL for custom organization logo",
            placeholder: "https://example.com/logo.png"
          },
          {
            name: "primaryColor",
            label: "Primary Color",
            type: "color",
            description: "Primary color for the interface"
          },
          {
            name: "customFavicon",
            label: "Custom Favicon URL",
            type: "text",
            description: "URL for custom favicon",
            placeholder: "https://example.com/favicon.ico"
          },
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
  description?: string;
  isRequired?: boolean;
  placeholder?: string;
  type?: string;
};
