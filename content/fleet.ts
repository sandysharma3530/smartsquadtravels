export type FleetImageCategory =
  | "front-exterior"
  | "side-exterior"
  | "rear-exterior"
  | "interior-seating"
  | "driver-cabin"
  | "ac-vents"
  | "charging-points"
  | "luggage-space"
  | "gps-cctv"
  | "night-lighting";

export type FleetImage = {
  id: string;
  src: string;
  alt: string;
  caption: string;
  category: FleetImageCategory;
};

export type FleetVehicle = {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  badge: string;
  seatingCapacity: number | null;
  description: string;
  features: string[];
  coverImage: string;
  coverAlt: string;
  owned: boolean;
  available: boolean;
  gallery: FleetImage[];
};

/**
 * Replace image paths under /public/images/fleet/ with your own photos.
 * Keep the same filenames or update the `src` fields below.
 */
export const fleetVehicles: FleetVehicle[] = [
  {
    id: "force-traveller",
    slug: "force-traveller",
    name: "Force Traveller",
    shortName: "Traveller",
    badge: "21 Seater",
    seatingCapacity: 21,
    description:
      "Choose the 21-seat Force Traveller when a full family, a class or a wedding party will not fit in two cars. It is the larger vehicle we arrange from Ghaziabad.",
    features: [
      "Reclining seats",
      "Air-conditioned cabin",
      "Live location, if the vehicle has it",
      "Cabin camera, if one is fitted",
      "Space for group luggage",
      "Music in the cabin",
    ],
    coverImage: "/images/fleet/traveller/cover.jpg",
    coverAlt: "White 21-seater Force Traveller van for group travel",
    owned: false,
    available: true,
    gallery: [
      {
        id: "tr-front",
        src: "/images/fleet/traveller/front-exterior.jpg",
        alt: "Force Traveller front exterior view",
        caption: "Front exterior",
        category: "front-exterior",
      },
      {
        id: "tr-side",
        src: "/images/fleet/traveller/side-exterior.jpg",
        alt: "Force Traveller side exterior profile",
        caption: "Side exterior",
        category: "side-exterior",
      },
      {
        id: "tr-rear",
        src: "/images/fleet/traveller/rear-exterior.jpg",
        alt: "Force Traveller rear exterior with luggage door",
        caption: "Rear exterior",
        category: "rear-exterior",
      },
      {
        id: "tr-interior",
        src: "/images/fleet/traveller/interior-seating.jpg",
        alt: "Force Traveller interior pushback seating",
        caption: "Interior seating",
        category: "interior-seating",
      },
      {
        id: "tr-cabin",
        src: "/images/fleet/traveller/driver-cabin.jpg",
        alt: "Force Traveller driver cabin",
        caption: "Driver cabin",
        category: "driver-cabin",
      },
      {
        id: "tr-ac",
        src: "/images/fleet/traveller/ac-vents.jpg",
        alt: "Force Traveller air conditioning vents",
        caption: "AC vents",
        category: "ac-vents",
      },
      {
        id: "tr-charge",
        src: "/images/fleet/traveller/charging-points.jpg",
        alt: "USB charging points inside Force Traveller",
        caption: "Charging points",
        category: "charging-points",
      },
      {
        id: "tr-luggage",
        src: "/images/fleet/traveller/luggage-space.jpg",
        alt: "Force Traveller luggage storage area",
        caption: "Luggage space",
        category: "luggage-space",
      },
      {
        id: "tr-gps",
        src: "/images/fleet/traveller/gps-cctv.jpg",
        alt: "GPS tracking and CCTV features in Force Traveller",
        caption: "GPS and CCTV",
        category: "gps-cctv",
      },
    ],
  },
  {
    id: "force-urbania",
    slug: "force-urbania",
    name: "Force Urbania",
    shortName: "Urbania",
    // Seating from config — update when confirming exact capacity
    badge: "Premium MPV",
    seatingCapacity: 17,
    description:
      "Choose the Force Urbania when the group is smaller and the day is long. The cabin is quieter, the seats recline further, and the quote names the exact vehicle.",
    features: [
      "Quieter cabin",
      "Seats that recline further",
      "An air vent at each seat",
      "More legroom",
      "A charging point by the seat",
      "A separate space for bags",
    ],
    coverImage: "/images/fleet/urbania/cover.jpg",
    coverAlt: "Force Urbania premium group travel vehicle",
    owned: false,
    available: true,
    gallery: [
      {
        id: "ur-front",
        src: "/images/fleet/urbania/front-exterior.jpg",
        alt: "Force Urbania front exterior view",
        caption: "Front exterior",
        category: "front-exterior",
      },
      {
        id: "ur-side",
        src: "/images/fleet/urbania/side-exterior.jpg",
        alt: "Force Urbania side exterior profile",
        caption: "Side exterior",
        category: "side-exterior",
      },
      {
        id: "ur-rear",
        src: "/images/fleet/urbania/rear-exterior.jpg",
        alt: "Force Urbania rear exterior",
        caption: "Rear exterior",
        category: "rear-exterior",
      },
      {
        id: "ur-interior",
        src: "/images/fleet/urbania/interior-seating.jpg",
        alt: "Force Urbania premium recliner seating",
        caption: "Interior seating",
        category: "interior-seating",
      },
      {
        id: "ur-cabin",
        src: "/images/fleet/urbania/driver-cabin.jpg",
        alt: "Force Urbania driver cabin",
        caption: "Driver cabin",
        category: "driver-cabin",
      },
      {
        id: "ur-ac",
        src: "/images/fleet/urbania/ac-vents.jpg",
        alt: "Individual AC vents in Force Urbania",
        caption: "Individual AC vents",
        category: "ac-vents",
      },
      {
        id: "ur-charge",
        src: "/images/fleet/urbania/charging-points.jpg",
        alt: "USB charging points in Force Urbania",
        caption: "USB charging",
        category: "charging-points",
      },
      {
        id: "ur-luggage",
        src: "/images/fleet/urbania/luggage-space.jpg",
        alt: "Force Urbania luggage storage area",
        caption: "Luggage space",
        category: "luggage-space",
      },
      {
        id: "ur-gps",
        src: "/images/fleet/urbania/gps-cctv.jpg",
        alt: "GPS and safety features in Force Urbania",
        caption: "GPS and CCTV",
        category: "gps-cctv",
      },
    ],
  },
];

export function getFleetBySlug(slug: string) {
  return fleetVehicles.find((v) => v.slug === slug);
}

export function getFleetBadge(vehicle: FleetVehicle) {
  if (vehicle.seatingCapacity != null) {
    return `${vehicle.seatingCapacity} Seater`;
  }
  return vehicle.badge;
}
