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
  link?: string;
  linkLabel?: string;
};

// Pulled from atigercub.com/events — swap in real photography when available.
export const events: TigerEvent[] = [
  {
    id: "world-cup-watch-party",
    title: "World Cup Semifinal Watch Party",
    medium: "Move",
    date: "Jul 15",
    month: "JUL",
    day: "15",
    location: "Milam Park",
    description: "A big screen, a loud crowd, and a reason to cheer with people you haven't met yet.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "bite-club-korea",
    title: "Bite Club: Bite of Korea",
    medium: "Eat",
    date: "Jul 16",
    month: "JUL",
    day: "16",
    location: "Tucker, GA",
    description: "Korean food, conversation, and a table that keeps growing all night.",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=1400&auto=format&fit=crop",
    link: "https://partiful.com/e/4S3CS9C7IGONvBxaYBK1?c=Ol8nU_yY",
    linkLabel: "RSVP",
  },
  {
    id: "creative-coffee-doraville",
    title: "Creative Coffee Meetup",
    medium: "Create",
    date: "Jul 17",
    month: "JUL",
    day: "17",
    location: "Doraville, GA",
    description: "A relaxed coffee-shop gathering for artists, designers, and builders around ATL.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1400&auto=format&fit=crop",
    link: "https://partiful.com/e/k28h6U9GOsR5Ws0wBqfn?c=0AUE-CEo",
    linkLabel: "RSVP",
  },
  {
    id: "creative-cafe-social",
    title: "Creative Café Social",
    medium: "Create",
    date: "Sep 11",
    month: "SEP",
    day: "11",
    location: "The Reading Room, Decatur, GA",
    description: "A casual show-and-tell for Atlanta's creative community — bring something you've made and share the story behind it.",
    image: "https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "dragon-boat-festival",
    title: "Atlanta Hong Kong Dragon Boat Festival",
    medium: "Explore",
    date: "Sep 12",
    month: "SEP",
    day: "12",
    location: "Lake Lanier Olympic Park",
    description: "A day of dragon boat racing and community celebration on the water.",
    image: "https://images.unsplash.com/photo-1747326842329-fa63e8748fc4?q=80&w=1400&auto=format&fit=crop",
    link: "https://www.dragonboatatlanta.com/",
    linkLabel: "Learn More",
  },
  {
    id: "mini-kennycon",
    title: "Mini-KennyCon 2026",
    medium: "Learn",
    date: "Sep 12",
    month: "SEP",
    day: "12",
    location: "West Cobb Church, Marietta",
    description: "A full day of tabletop games for beginners and strategy regulars alike — bring a friend.",
    image: "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?q=80&w=1400&auto=format&fit=crop",
    link: "https://fancons.com/events/info/28147/mini-kennycon-2026",
    linkLabel: "Learn More",
  },
  {
    id: "bite-club-mexico",
    title: "Bite Club: A Taste of México",
    medium: "Eat",
    date: "Sep 16",
    month: "SEP",
    day: "16",
    location: "CT Reforma, Buckhead",
    description: "Celebrate Mexican Independence Day with a curated dinner exploring the flavors and stories behind the food. $45/person.",
    image: "https://images.unsplash.com/photo-1648437595587-e6a8b0cdf1f9?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: "refuge-coffee-run",
    title: "The Refuge Coffee Run: Welcome Home",
    medium: "Move",
    date: "Sep 19",
    month: "SEP",
    day: "19",
    location: "Clarkston, GA",
    description: "A race day welcoming newcomers to the Clarkston community — 1K, 5K, or color run.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1400&auto=format&fit=crop",
    link: "https://www.refugecoffeeco.com/events/refuge-coffee-run/",
    linkLabel: "Learn More",
  },
  {
    id: "japanfest",
    title: "JapanFest 2026",
    medium: "Explore",
    date: "Sep 20",
    month: "SEP",
    day: "20",
    location: "Gas South Convention Center, Duluth",
    description: "One of Georgia's largest cultural festivals — we'll explore it together in small groups.",
    image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1400&auto=format&fit=crop",
    link: "https://www.japanfest.org/",
    linkLabel: "Learn More",
  },
  {
    id: "compassioncon",
    title: "CompassionCon",
    medium: "Serve",
    date: "Oct 25",
    month: "OCT",
    day: "25",
    location: "Legacy Decatur",
    description: "A gathering centered on compassion and community connection.",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1400&auto=format&fit=crop",
    link: "https://compassioncon.org/",
    linkLabel: "Learn More",
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

// x/y are rough percentage positions on the metro Atlanta map in TigerWasHere.
export const memories: Memory[] = [
  {
    id: "bite-club-01",
    title: "BITE CLUB #01",
    location: "Tucker, GA",
    date: "July 16, 2026",
    attendees: "52 people.",
    note: "Korean food + strangers + a very crowded restaurant.",
    image: "/images/bite-club-01.jpeg",
    x: 72,
    y: 27,
  },
  {
    id: "creative-coffee-01",
    title: "CREATIVE COFFEE #01",
    location: "Doraville, GA",
    date: "July 17, 2026",
    attendees: "24 people.",
    note: "Sketchbooks, laptops, and one very long conversation about fonts.",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?q=80&w=1200&auto=format&fit=crop",
    x: 66,
    y: 30,
  },
  {
    id: "world-cup-01",
    title: "WATCH PARTY #01",
    location: "Milam Park",
    date: "July 15, 2026",
    attendees: "80 people.",
    note: "One shared screen, way too much noise for a park.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1200&auto=format&fit=crop",
    x: 54,
    y: 55,
  },
  {
    id: "coffee-run-01",
    title: "COFFEE RUN #01",
    location: "Clarkston, GA",
    date: "Sept 19, 2026",
    attendees: "45 people.",
    note: "Nobody ran a good pace. Everybody finished.",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=1200&auto=format&fit=crop",
    x: 78,
    y: 38,
  },
  {
    id: "grant-park-01",
    title: "PARK DAY #01",
    location: "Grant Park",
    date: "June 2026",
    attendees: "31 people.",
    note: "Gloves on, trash bags full, everyone stayed for pizza after.",
    image: "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=1200&auto=format&fit=crop",
    x: 53,
    y: 61,
  },
  {
    id: "dragon-boat-01",
    title: "DRAGON BOAT #01",
    location: "Lake Lanier",
    date: "Sept 12, 2026",
    attendees: "60 people.",
    note: "Raced badly, cheered loudly, stayed for the after-party.",
    image: "https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=1200&auto=format&fit=crop",
    x: 85,
    y: 22,
  },
];
