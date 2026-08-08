export type Category =
  | "Food"
  | "Creativity"
  | "Culture"
  | "Active"
  | "Learning"
  | "Volunteering"
  | "Special";

export const categories: { name: Category; emoji: string }[] = [
  { name: "Food", emoji: "🍽️" },
  { name: "Creativity", emoji: "🎨" },
  { name: "Culture", emoji: "🌎" },
  { name: "Active", emoji: "🏃" },
  { name: "Learning", emoji: "📚" },
  { name: "Volunteering", emoji: "❤️" },
  { name: "Special", emoji: "✨" },
];

export type TigerEvent = {
  id: string;
  title: string;
  category: Category;
  date: string;
  time: string;
  location: string;
  description: string;
  image: string;
};

export const events: TigerEvent[] = [
  {
    id: "supper-club-westside",
    title: "Supper Club: Westside Table",
    category: "Food",
    date: "Aug 14",
    time: "7:00 PM",
    location: "Westside",
    description: "A long table, a rotating menu, and strangers who won't stay strangers.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "life-drawing-loft",
    title: "Life Drawing at the Loft",
    category: "Creativity",
    date: "Aug 17",
    time: "6:30 PM",
    location: "Old Fourth Ward",
    description: "No experience needed — just charcoal, music, and an hour of focus.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "night-market-crawl",
    title: "Night Market Crawl",
    category: "Culture",
    date: "Aug 21",
    time: "8:00 PM",
    location: "Chinatown",
    description: "Lanterns, street food, and a small group exploring after dark.",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "sunrise-run-club",
    title: "Sunrise Run Club",
    category: "Active",
    date: "Aug 23",
    time: "6:15 AM",
    location: "Piedmont Park",
    description: "Three miles, easy pace, coffee after. Bring whoever's dragging you along.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "pottery-101",
    title: "Pottery 101",
    category: "Learning",
    date: "Aug 28",
    time: "5:00 PM",
    location: "Cabbagetown Studio",
    description: "Hands in clay, phones away. Take home whatever you make.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "park-day-cleanup",
    title: "Park Day: Community Cleanup",
    category: "Volunteering",
    date: "Sep 1",
    time: "9:00 AM",
    location: "Grant Park",
    description: "Gloves, trash bags, and a good excuse to be outside with good people.",
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: "rooftop-solstice",
    title: "Rooftop Solstice Gathering",
    category: "Special",
    date: "Sep 6",
    time: "7:30 PM",
    location: "Downtown",
    description: "Our biggest gathering of the season — live music, skyline, everyone welcome.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop",
  },
];
