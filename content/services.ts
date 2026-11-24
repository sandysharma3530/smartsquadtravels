export type Service = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: "users" | "briefcase" | "heart" | "plane" | "temple" | "graduation" | "map";
};

export const services: Service[] = [
  {
    id: "family",
    slug: "family-group-trips",
    title: "Family weekends",
    description:
      "Parents, children and elders travel together, with pickup from the Ghaziabad, Noida or Delhi address you choose.",
    icon: "users",
  },
  {
    id: "corporate",
    slug: "corporate-travel",
    title: "Office days out",
    description:
      "One vehicle for the whole team, timed to your meeting or event rather than a sightseeing timetable.",
    icon: "briefcase",
  },
  {
    id: "wedding",
    slug: "wedding-transportation",
    title: "Wedding-day shuttles",
    description:
      "Morning pickup, the venue, and the drop home. Waiting between functions is included in the quote we send first.",
    icon: "heart",
  },
  {
    id: "airport",
    slug: "airport-transfers",
    title: "Delhi airport groups",
    description:
      "One vehicle for the whole party when flights land early or late, instead of a separate cab for every family.",
    icon: "plane",
  },
  {
    id: "religious",
    slug: "religious-journeys",
    title: "Temple trips",
    description:
      "You choose the darshan time. We plan the road, how far the vehicle can go, and where it will wait.",
    icon: "temple",
  },
  {
    id: "school",
    slug: "school-college-trips",
    title: "School and college days",
    description:
      "A picnic or visit day for a class. The school's return time stays fixed, and a teacher is the contact on the day.",
    icon: "graduation",
  },
  {
    id: "outstation",
    slug: "customized-outstation-travel",
    title: "Multi-stop trips",
    description:
      "Several towns on the dates you choose. The quote follows that list. Your stay and meals stay with you.",
    icon: "map",
  },
];

export const whyChooseUs = [
  {
    id: "pricing",
    title: "A price before you travel",
    description:
      "The quote follows the route, the dates, the vehicle and any waiting time. We do not list fixed package rates on this site.",
  },
  {
    id: "vehicles",
    title: "A vehicle that fits the group",
    description:
      "The 21-seat Traveller when the list is long. The Urbania when fewer people are travelling and the day is long.",
  },
  {
    id: "drivers",
    title: "Your stops, written down",
    description:
      "The driver leaves with your pickup points and planned halts, so the day is not decided at the first toll.",
  },
  {
    id: "ontime",
    title: "More than one pickup",
    description:
      "If people are spread across Ghaziabad, Noida and Delhi, we set the pickup order and include that time in the quote.",
  },
  {
    id: "flexible",
    title: "Hill roads in daylight",
    description:
      "On mountain stretches we would rather start earlier than drive the narrow road after dark.",
  },
  {
    id: "support",
    title: "One WhatsApp chat",
    description:
      "The person who sent your quote stays on the same chat on the day you travel.",
  },
  {
    id: "clean",
    title: "Cabin checked for your group",
    description:
      "Seats, cooling and bag space are checked against your passenger count before anyone boards.",
  },
  {
    id: "gps",
    title: "Live location when the vehicle has it",
    description:
      "If the vehicle assigned to you can share its location, we will tell you. It is not fitted on every booking.",
  },
  {
    id: "cctv",
    title: "A cabin camera only when one is fitted",
    description:
      "Ask us to confirm a cabin camera for your date. We only offer it on vehicles that actually have one.",
  },
] as const;
