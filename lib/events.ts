export type Category = "Eat" | "Create" | "Move" | "Explore" | "Learn" | "Give";

export const categories: { name: Category; emoji: string }[] = [
  { name: "Eat", emoji: "🍜" },
  { name: "Create", emoji: "🎨" },
  { name: "Move", emoji: "🏃" },
  { name: "Explore", emoji: "🌎" },
  { name: "Learn", emoji: "📚" },
  { name: "Give", emoji: "❤️" },
];

export type Badge = "Original" | "Partner" | "Promoted";

export type TigerEvent = {
  id: string;
  title: string;
  category: Category;
  badge: Badge;
  day: string;
  weekday: string;
  month: string;
  time: string;
  location: string;
  description: string;
  image: string;
  ctaLabel: string;
  ctaUrl: string;
};

// Pulled from https://atigercub.com/events/ — upcoming events only.
export const events: TigerEvent[] = [
  {
    id: "dragon-boat-festival",
    title: "Atlanta Hong Kong Dragon Boat Festival",
    category: "Explore",
    badge: "Partner",
    day: "12",
    weekday: "Sat",
    month: "Sep",
    time: "All day",
    location: "Lake Lanier Olympic Park, Gainesville, GA",
    description:
      "A day of dragon boat racing and community celebration on Lake Lanier — partnered with the Atlanta Hong Kong Dragon Boat Festival.",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Learn More",
    ctaUrl: "https://www.dragonboatatlanta.com/",
  },
  {
    id: "mini-kennycon",
    title: "Mini-KennyCon 2026",
    category: "Learn",
    badge: "Promoted",
    day: "12",
    weekday: "Sat",
    month: "Sep",
    time: "10:00 AM – 10:00 PM",
    location: "West Cobb Church, Marietta, GA",
    description:
      "A casual one-day tabletop gaming event — meet new people, try new games, and enjoy up to 12 hours of board game fun, beginner or strategy regular.",
    image:
      "https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Learn More",
    ctaUrl: "https://fancons.com/events/info/28147/mini-kennycon-2026",
  },
  {
    id: "refuge-coffee-run",
    title: "The Refuge Coffee Run: Welcome Home",
    category: "Move",
    badge: "Promoted",
    day: "19",
    weekday: "Sat",
    month: "Sep",
    time: "5K 9:00 AM · 1K 10:15 AM · Color Run 10:30 AM",
    location: "Refuge Coffee Co., Clarkston, GA",
    description:
      "Refuge Coffee Co.'s own race day, welcoming newcomers to the Clarkston community. We love this one and wanted to help spread the word.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Learn More",
    ctaUrl: "https://www.refugecoffeeco.com/events/refuge-coffee-run/",
  },
  {
    id: "japanfest",
    title: "JapanFest 2026",
    category: "Explore",
    badge: "Promoted",
    day: "20",
    weekday: "Sun",
    month: "Sep",
    time: "10:00 AM – 5:00 PM",
    location: "Gas South Convention Center, Duluth, GA",
    description:
      "One of Georgia's largest cultural festivals. We're organizing a group of 20 to go together at a discounted rate — meet up, explore in small groups, connect all day.",
    image:
      "https://images.unsplash.com/photo-1528360983277-13d401cdc186?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Learn More",
    ctaUrl: "https://www.japanfest.org/",
  },
  {
    id: "compassioncon",
    title: "CompassionCon",
    category: "Give",
    badge: "Partner",
    day: "25",
    weekday: "Sun",
    month: "Oct",
    time: "10:00 AM – 2:00 PM",
    location: "Legacy Decatur (Decatur Legacy Park)",
    description:
      "A gathering focused on compassion and community connection, hosted alongside Decatur Legacy Park.",
    image:
      "https://images.unsplash.com/photo-1593113646773-028c64a8f1b8?q=80&w=1600&auto=format&fit=crop",
    ctaLabel: "Learn More",
    ctaUrl: "https://compassioncon.org/",
  },
];

export const discordUrl = "https://discord.gg/6u83g4P8Cb";
