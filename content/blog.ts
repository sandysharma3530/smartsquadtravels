export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readingTime: string;
  coverImage: string;
  coverAlt: string;
  tags: string[];
  content: string[];
  gallery?: { src: string; alt: string; caption?: string }[];
};

/**
 * Informational blog content — general guidance only.
 * Do not fabricate business case studies or unverified claims.
 */
export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-the-right-traveller-for-a-group-trip",
    title: "How to Choose the Right Traveller for a Group Trip",
    excerpt:
      "A simple checklist for matching the vehicle, the comfort and the route when a group is travelling from Delhi NCR.",
    date: "2026-03-15",
    readingTime: "5 min read",
    coverImage: "/images/blog/choose-traveller.jpg",
    coverAlt: "Group travel vehicle parked for a family trip",
    tags: ["Traveller rental", "Group travel", "Planning"],
    content: [
      "Choosing a vehicle starts with how many people are travelling, how much luggage you have, and how long you will be on the road. A 21-seater Force Traveller often suits a family or an office group. A Force Urbania is usually more comfortable when fewer people are travelling and the day is long.",
      "List what you need before you ask for a quote: air conditioning, reclining seats, charging points, luggage space, live location and a cabin camera. Share the pickup points, the destination and a rough return time so the quote matches the real driving days.",
      "Do not compare only the headline price. Ask how rest stops, hill stretches, night driving and waiting time are handled. A clear quote for your trip is more useful than a fixed package that may not match the group.",
      "Before you confirm, check the vehicle you are booking, who the driver is, and what the quoted amount includes. Clear details mean fewer surprises on the day.",
    ],
  },
  {
    slug: "traveller-safety-checklist-before-a-hill-journey",
    title: "Traveller Safety Checklist Before a Hill Journey",
    excerpt:
      "Simple preparation tips for a safer, more comfortable hill trip in a group vehicle.",
    date: "2026-02-28",
    readingTime: "4 min read",
    coverImage: "/images/blog/hill-safety.jpg",
    coverAlt: "Winding mountain road suitable for planned hill journeys",
    tags: ["Safety", "Hill travel", "Checklist"],
    content: [
      "Hill trips are more comfortable when the driving is planned in daylight, the weather is checked, and the daily distance is realistic. Tell us the pace you prefer when you ask for a quote, so the travel days are not overloaded.",
      "Carry motion-sickness medicine if anyone needs it, keep water within reach, and plan short breaks. Luggage should be secured, and the aisle should stay clear so people can move safely inside the vehicle.",
      "Ask how the vehicle is prepared for hills: brakes, tyres, air conditioning and whether the driver knows the route. Live location and a simple contact plan help families and organisers stay in touch.",
      "If you are travelling in the monsoon or in winter, leave spare time in the plan and stay flexible about viewpoint or temple timings.",
    ],
  },
  {
    slug: "places-to-visit-around-tungnath-and-chopta",
    title: "Places to Visit Around Tungnath and Chopta",
    excerpt:
      "A short guide to the places near Chopta and Tungnath for groups planning their own trip.",
    date: "2026-01-20",
    readingTime: "6 min read",
    coverImage: "/images/blog/chopta-guide.jpg",
    coverAlt: "Green meadows and mountains near Chopta",
    tags: ["Chopta", "Tungnath", "Uttarakhand"],
    content: [
      "Chopta is known for its meadows and the walk toward Tungnath, often described as one of the highest Shiva temples. Groups usually balance temple time, a short walk and rest, depending on fitness.",
      "Nearby viewpoints and small local markets are open depending on the season. Check trails, weather and local advice before you lock the day's plan.",
      "Smart Squad Travels does not sell fixed tour packages, so you can shape the journey around what your group actually wants: more rest, more time at the temple, or a tighter weekend.",
      "When you ask for a quote, mention how many people are coming, the month you prefer, and whether elders or children are joining. That helps us suggest the right vehicle and a realistic pace.",
    ],
  },
  {
    slug: "group-travel-planning-tips-from-delhi-ncr",
    title: "Group Travel Planning Tips from Delhi NCR",
    excerpt:
      "How families, offices and organisers can plan a smoother outstation trip from Noida, Greater Noida and Delhi.",
    date: "2025-12-10",
    readingTime: "5 min read",
    coverImage: "/images/blog/delhi-ncr-planning.jpg",
    coverAlt: "Highway travel planning from Delhi NCR",
    tags: ["Delhi NCR", "Planning", "Outstation"],
    content: [
      "Start with one shared brief: a shortlist of places, the dates, how many people are coming, a luggage estimate, and the stops that matter. One person collecting this makes the quote faster and more accurate.",
      "From Delhi NCR, an early start often makes the first day easier on popular Uttarakhand, Himachal and Rajasthan routes. Plan meal and rest stops in advance instead of deciding every break on the road.",
      "Decide whether you want one place to stay or several towns. A custom trip works best when the vehicle plan matches how the group actually wants to move.",
      "Ask for a quote with the pickup address, destination, return date and preferred vehicle. Clear details lead to a clearer price.",
    ],
  },
  {
    slug: "traveller-rental-checklist-for-wedding-transportation",
    title: "Traveller Rental Checklist for Wedding Transportation",
    excerpt:
      "How to plan guest pickups, venue shuttles and family travel on a wedding day.",
    date: "2025-11-05",
    readingTime: "4 min read",
    coverImage: "/images/blog/wedding-transport.jpg",
    coverAlt: "Decorated venue driveway ready for guest transportation",
    tags: ["Wedding", "Guest transfers", "Checklist"],
    content: [
      "Wedding transport works when the timing is clear. List every pickup point, when guests need to reach the venue, and spare time for photos or rituals that may run long.",
      "Share how many guests are in each vehicle, whether they have luggage or gifts, and whether elders need an easier step up. A clean Traveller helps guests feel looked after.",
      "Name one contact for the wedding day, keep WhatsApp updates simple, and agree what happens if a ceremony shifts. Clear communication takes pressure off the family and the planner.",
      "Ask for a quote that includes waiting time, extra stops and any limits on decoration. A fixed package rarely matches a wedding schedule.",
    ],
  },
];

export function getPostBySlug(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}

export function getAllPosts() {
  return [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
