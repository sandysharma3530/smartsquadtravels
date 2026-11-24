/**
 * FAQ content shown on the homepage and used for FAQPage schema.
 * Keep answers accurate — do not invent prices, response SLAs, or ownership claims.
 */
export type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

export const faqs: FaqItem[] = [
  {
    id: "where-based",
    question: "Where are you based?",
    answer:
      "Our office is at Panchsheel Greens, Ghaziabad. We can pick the group up there, or from Noida, Greater Noida and other Delhi addresses if people are starting from more than one place.",
  },
  {
    id: "which-vehicle",
    question: "Should I choose the Urbania or the Traveller?",
    answer:
      "Choose the Force Urbania when the group is smaller and the day on the road is long. For a full family, a class or a wedding party, the 21-seat Force Traveller is usually the better fit. Tell us how many people are coming and we will recommend one.",
  },
  {
    id: "two-pickups",
    question: "Can you pick us up from two different places?",
    answer:
      "Yes, if both addresses are in Ghaziabad, Noida or Delhi and you tell us the order. Extra stops and waiting time are included in the quote, so there is no surprise on the day.",
  },
  {
    id: "hotels",
    question: "Do you arrange hotels or a sightseeing package?",
    answer:
      "No. The quote covers the vehicle, the driver and the days on the road. You arrange where you stay, where you eat, and which places you enter.",
  },
  {
    id: "how-early",
    question: "How early should I get in touch for a hill trip?",
    answer:
      "For a weekend to Nainital or Mussoorie, a few days is often enough. For Manali, Shimla, Kedarnath or a Kashmir route, write to us as soon as the dates are fixed so the driving days are not rushed.",
  },
  {
    id: "what-to-send",
    question: "What do you need before you can quote?",
    answer:
      "The travel date, the pickup point, the destination, a return date if you have one, how many people are coming, and whether you prefer the Traveller or the Urbania. A message is a request for a price, not a confirmed booking.",
  },
];

export function getFaqs() {
  return faqs;
}
