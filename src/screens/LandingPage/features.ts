import {
  getVolunteerTerm,
  getVolunteerTermPlural,
  getVolunteerTermPluralCapitalized,
} from "../../utils/volunteerTerm";

export const features = [
  {
    title: "Plan memorable events",
    description: `Rally ${getVolunteerTermPlural()} to your cause with VolunTrack events! Craft public events for broad outreach, organize private group activities for tailored collaboration, and set up recurring events for ongoing ${getVolunteerTerm()} support. Empower your cause with our user-friendly platform, simplifying event management for a more connected and impactful future.`,
    imageUrl: "/images/plan-memorable-events-ss.png",
  },
  {
    title: "Simplify attendance management",
    description: `Efficiently oversee your nonprofit events with VolunTrack's powerful attendance management features. Access a comprehensive list of all ${getVolunteerTermPlural()} attending an event and easily check in/out ${getVolunteerTermPlural()}. We also support ${getVolunteerTerm()} walk ins through a simple QR code!`,
    imageUrl: "/images/attendance-ss.png",
  },
  {
    title: "Emphasize your mission",
    description:
      "Tailor your nonprofit's online presence with VolunTrack's customizable organization settings, allowing you to white-label the platform to reflect your unique identity. Showcase your brand prominently by incorporating your organization's logo and theme, ensuring a seamless and professional user experience. In addition to styling, you can set up and manage waivers for your organization.",
    imageUrl: "/images/emphasize-your-mission-ss.png",
  },
  {
    title: "Promote admin efficiency",
    description: `Manage all your ${getVolunteerTermPlural()} (and admin assistants!) from within VolunTrack. Easily edit their profiles and view their participation activity. If you want to move the data to other platforms, you can also easily export all your ${getVolunteerTermPlural()} to a CSV.`,
    imageUrl: "/images/manage-volunteers-ss.png",
  },
  {
    title: `Simplify ${getVolunteerTerm()} registration`,
    description: `Enable ${getVolunteerTermPlural()} to easily register for your events through their own portal. ${getVolunteerTermPluralCapitalized()} can view upcoming events, manage their registration, and update their profile. ${getVolunteerTermPluralCapitalized()} also receive confirmation emails when registering and can reset their password, ensuring they stay connected to your organization`,
    imageUrl: "/images/volunteer-registration-ss.png",
  },
  {
    title: "Track your impact",
    description: `Track participation at a per ${getVolunteerTerm()}, per event, and overall level. ${getVolunteerTermPluralCapitalized()} can also track their individual progress and contribution through VolunTrack and as they take part in more events, they will unlock additional medals. Notice an attendance error? Admins can also edit attendance for each event in case a ${getVolunteerTerm()} forgot to check in or out.`,
    imageUrl: "/images/overall-attendance-ss.png",
  },
];
