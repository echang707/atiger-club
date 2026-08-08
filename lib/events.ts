export type Medium = "Eat" | "Create" | "Move" | "Explore" | "Serve" | "Learn";

export const mediums: { name: Medium }[] = [
  { name: "Eat" },
  { name: "Create" },
  { name: "Move" },
  { name: "Explore" },
  { name: "Serve" },
  { name: "Learn" },
];

export type TigerEvent = {
  id: string;
  title: string;
  medium: Medium;
  date: string;
  month: string;
  day: string;
  location: string;
  description: string;
  image: string;
};

export const events: TigerEvent[] = [
  {
    id: "dragon-boat-festival",
    title: "Dragon Boat Festival",
    medium: "Explore",
    date: "Sep 12",
    month: "SEP",
    day: "12",
    location: "Lake Lanier",
    description:
      "A morning on the water, borrowed paddles, and a crowd cheering for whoever's boat is closest to sinking.",
    image:
      "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "coffee-run-ice-cream",
    title: "Coffee Run + Ice Cream Social",
    medium: "Move",
    date: "Sep 19",
    month: "SEP",
    day: "19",
    location: "Clarkston",
    description:
      "Easy miles out, something cold waiting at the finish. Bring whoever's dragging you along.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "bite-club",
    title: "Bite Club",
    medium: "Eat",
    date: "Sep 24",
    month: "SEP",
    day: "24",
    location: "Atlanta",
    description:
      "A long table, a rotating menu, and strangers who don't stay strangers past the second course.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "life-drawing-loft",
    title: "Life Drawing at the Loft",
    medium: "Create",
    date: "Oct 1",
    month: "OCT",
    day: "01",
    location: "Old Fourth Ward",
    description: "No experience needed — just charcoal, music, and an hour of focus.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "park-day-cleanup",
    title: "Park Day: Community Cleanup",
    medium: "Serve",
    date: "Oct 4",
    month: "OCT",
    day: "04",
    location: "Grant Park",
    description: "Gloves, trash bags, and a good excuse to be outside with good people.",
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "pottery-101",
    title: "Pottery 101",
    medium: "Learn",
    date: "Oct 9",
    month: "OCT",
    day: "09",
    location: "Cabbagetown Studio",
    description: "Hands in clay, phones away. Take home whatever you make.",
    image:
      "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "night-market-crawl",
    title: "Night Market Crawl",
    medium: "Explore",
    date: "Oct 15",
    month: "OCT",
    day: "15",
    location: "Chinatown",
    description: "Lanterns, street food, and a small group exploring after dark.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "supper-club-westside",
    title: "Supper Club: Westside Table",
    medium: "Eat",
    date: "Oct 21",
    month: "OCT",
    day: "21",
    location: "Westside",
    description: "A long table, a rotating menu, and strangers who won't stay strangers.",
    image:
      "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1400&auto=format&fit=crop",
  },
];

export type Memory = {
  id: string;
  title: string;
  location: string;
  date: string;
  attendees: string;
  note: string;
  image: string;
  x: number;
  y: number;
};

export const memories: Memory[] = [
  {
    id: "bite-club-01",
    title: "BITE CLUB #01",
    location: "Tucker, GA",
    date: "July 16, 2026",
    attendees: "52 people.",
    note: "Korean food + strangers + a very crowded restaurant.",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1200&auto=format&fit=crop",
    x: 74,
    y: 38,
  },
  {
    id: "sunrise-run-02",
    title: "SUNRISE RUN #02",
    location: "Piedmont Park",
    date: "July 23, 2026",
    attendees: "31 people.",
    note: "Three miles, one wrong turn, coffee after.",
    image:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
    x: 46,
    y: 44,
  },
  {
    id: "life-drawing-03",
    title: "LIFE DRAWING #01",
    location: "Old Fourth Ward",
    date: "July 30, 2026",
    attendees: "18 people.",
    note: "Charcoal, quiet, and one very good playlist.",
    image:
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    x: 58,
    y: 30,
  },
  {
    id: "park-cleanup-04",
    title: "PARK DAY #01",
    location: "Grant Park",
    date: "Aug 2, 2026",
    attendees: "40 people.",
    note: "Nine trash bags. One good excuse to be outside.",
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1200&auto=format&fit=crop",
    x: 55,
    y: 62,
  },
  {
    id: "night-market-05",
    title: "NIGHT MARKET #01",
    location: "Chinatown",
    date: "Aug 5, 2026",
    attendees: "60 people.",
    note: "Lanterns, dumplings, a group that didn't want to leave.",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    x: 30,
    y: 50,
  },
];
