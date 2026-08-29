export type Medium = "Eat" | "Create" | "Move" | "Explore" | "Serve" | "Learn" | "Play";

export const mediums: { name: Medium; icon: string; description: string }[] = [
  {
    name: "Eat",
    icon: "/images/icons/eat.png",
    description: "Dinners, noodle nights, and tables full of strangers who won't stay strangers.",
  },
  {
    name: "Create",
    icon: "/images/icons/create.png",
    description: "Paint, draw, build. Hands-on nights with nothing to prove and no talent required.",
  },
  {
    name: "Move",
    icon: "/images/icons/move.png",
    description: "Runs, watch parties, and anything that gets the heart rate up alongside people.",
  },
  {
    name: "Explore",
    icon: "/images/icons/explore.png",
    description: "Festivals, traditions, and flavors from cultures near and far. Atlanta's whole world.",
  },
  {
    name: "Serve",
    icon: "/images/icons/serve.png",
    description: "Cleanups, drives, and days spent leaving the city a little better than we found it.",
  },
  {
    name: "Learn",
    icon: "/images/icons/learn.png",
    description: "Workshops, talks, and skills worth picking up alongside people just as curious.",
  },
  {
    name: "Play",
    icon: "/images/icons/play.png",
    description: "Game nights, pickup matches, and the kind of nonsense that needs no reason.",
  },
];

// Cities Tiger Club operates in. Atlanta is the only one live today, but
// every event carries a `city` field and the filter UI already supports
// more than one option — so adding the next city is just: add it here,
// and start tagging events with it in the array below.
export const cities: string[] = ["Atlanta"];

export type RegistrationType = "EXTERNAL" | "NATIVE";

/* Whether registration is open right now. Separate from EventStatus so
   that "the event is on but the door is shut" (sold out, closed early)
   is expressible without cancelling the event. */
export type RegistrationStatus =
  | "OPEN"
  | "CLOSED"
  | "SOLD_OUT"
  | "WAITLIST"
  | "NOT_REQUIRED";

export type EventStatus = "DRAFT" | "PUBLISHED" | "CANCELLED" | "COMPLETED";

export type TigerEvent = {
  id: string;
  title: string;
  medium: Medium;
  city: string;
  date: string;
  month: string;
  day: string;
  location: string;
  description: string;
  image: string;
  link?: string;
  linkLabel?: string;
  /* Start/end time as it should read on the page, e.g. "10am – 12pm". */
  time?: string;
  /* Secondary line, e.g. ticket price. Kept out of the description. */
  price?: string;

  /* -------------------------------------------------------------------
     Ticketing fields. All optional, all absent from today's events —
     the site keeps rendering exactly as before until they are filled in.

     `price` above is free prose ("$45 per person, tax and gratuity
     included") and stays that way for legacy entries. `priceCents` is
     the structured value the pricing module reads. When both exist the
     structured one wins for calculation and `price` is treated as a
     footnote, so the two can coexist during the migration rather than
     needing a big-bang rewrite of every event.
     ------------------------------------------------------------------- */

  /* URL-safe identifier for a future /events/[slug] page. Falls back to
     `id`, which is already slug-shaped, via eventSlug() below. */
  slug?: string;
  address?: string;
  /* ISO 8601 with offset. The existing `date`/`month`/`day` strings are
     display values and carry no year or time; these are the machine
     values that registration, calendar export and history sorting need.
     Both are kept because the display strings are hand-tuned copy. */
  startsAt?: string;
  endsAt?: string;
  capacity?: number | null;

  /* Integer cents. 0 means genuinely free; omitted means "no structured
     price yet", which renders no pricing UI at all. */
  priceCents?: number | null;
  /* Overrides membershipConfig.defaultMemberDiscountPercentage. */
  memberDiscountPercentage?: number | null;
  /* An explicit member price, for events priced by hand rather than by
     percentage. Beats the percentage when present. */
  memberPriceCents?: number | null;

  /* EXTERNAL — registration happens on Partiful/Eventbrite/a partner
     site, and `link` is where we send people. NATIVE — registration
     happens here. Everything today is EXTERNAL; this field is what lets
     events move across one at a time. */
  registrationType?: RegistrationType;
  externalTicketUrl?: string;
  registrationStatus?: RegistrationStatus;
  eventStatus?: EventStatus;
/* Every event is one of three kinds:

       original — Tiger Club creates and hosts it from scratch
       pick     — an existing Atlanta experience we curate and bring
                  people to; we don't host it
       collab   — co-created with another organisation, venue or community

     Defaults to "original" when omitted, since most events are ours. */
  kind?: "original" | "pick" | "collab";
  /* Who runs it (picks) or who we made it with (collabs). */
  presentedBy?: string;
};

// Pulled from atigercub.com/events — swap in real photography when available.
export const events: TigerEvent[] = [
  {
    time: "4pm \u2013 8pm",
    id: "indonesia-independence-81",
    title: "81st Indonesia Independence Day Celebration",
    medium: "Explore",
    city: "Atlanta",
    date: "Aug 30",
    month: "AUG",
    day: "30",
    location: "Korean Community Culture Center, Norcross, GA",
    description:
      "Spend the evening inside Atlanta's Indonesian community with Indonesian food, traditional and pop performances, karaoke, games, and a celebration of 81 years of independence.",
    image: "/images/indonesia.jpg",
    kind: "pick",
    presentedBy: "Indonesian Community Heritage Foundation",
  },
  {
    id: "world-cup-watch-party",
    title: "World Cup Semifinal Watch Party",
    medium: "Move",
    city: "Atlanta",
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
    city: "Atlanta",
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
    city: "Atlanta",
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
    time: "10am \u2013 12pm",
    link: "https://partiful.com/e/6qbYzQvsB2LlHhwzXjlO?c=PBA9uuw5",
    linkLabel: "RSVP",
    id: "creative-cafe-social",
    title: "Creative Café Social",
    medium: "Create",
    city: "Atlanta",
    date: "Sep 13",
    month: "SEP",
    day: "13",
    location: "Recuerdos Cafe, Atlanta",
    description:
      "Bring something you've been making, finished or unfinished, grab a coffee, and spend the morning swapping stories and ideas with other creative people around Atlanta.",
    image: "/images/create-mural.jpg",
  },
  {
    kind: "collab",
    time: "6am \u2013 4pm",
    id: "dragon-boat-festival",
    title: "Atlanta Hong Kong Dragon Boat Festival",
    medium: "Explore",
    city: "Atlanta",
    date: "Sep 12",
    month: "SEP",
    day: "12",
    location: "Lake Lanier Olympic Park",
    description:
      "Watch dragon boats race across Lake Lanier while exploring food, performances, traditions, and Atlanta's Asian communities. Stop by Tiger Club's cultural storytelling space between races.",
    image: "/images/dragon-boat.jpg",
    link: "https://www.dragonboatatlanta.com/",
    linkLabel: "Learn More",
  },
  {
    kind: "pick",
    time: "10am \u2013 10pm",
    id: "mini-kennycon",
    title: "Mini-KennyCon 2026",
    medium: "Learn",
    city: "Atlanta",
    date: "Sep 12",
    month: "SEP",
    day: "12",
    location: "West Cobb Church, Marietta",
    description:
      "Spend a Saturday discovering new tabletop games, learning as you go, and jumping into a table whenever something catches your eye. No board game expertise required.",
    image: "/images/kennycon.jpg",
    link: "https://fancons.com/events/info/28147/mini-kennycon-2026",
    linkLabel: "Learn More",
  },
  {
    price: "$45 per person, tax and gratuity included",
    time: "6:30pm \u2013 8:30pm",
    link: "https://partiful.com/e/k2VBxjugI1iUasRyoaYj?c=tr7NgZ0G",
    linkLabel: "RSVP",
    id: "bite-club-mexico",
    title: "Bite Club: A Taste of México",
    medium: "Eat",
    city: "Atlanta",
    date: "Sep 16",
    month: "SEP",
    day: "16",
    location: "CT Reforma, Buckhead",
    description:
      "Join us at CT Reforma for Mexican Independence Day and travel three courses through Mexican food, stories, and tradition, ending with café de olla and El Grito. Come hungry and leave knowing a little more than what was on your plate.",
    image: "/images/eat-dinner.jpg",
  },
  {
    kind: "collab",
    presentedBy: "Community Bucket",
    time: "6:45pm",
    id: "beltline-lantern-parade",
    title: "BeltLine Lantern Parade Volunteer Group",
    medium: "Serve",
    city: "Atlanta",
    date: "Sep 19",
    month: "SEP",
    day: "19",
    location: "Adair Park II, BeltLine tent near the Tift Avenue parking lot",
    description:
      "Don't just watch the Lantern Parade. Help make it happen. Join our volunteer crew to guide the parade, support performers, and see one of Atlanta's favorite traditions from inside the action.",
    image: "/images/lantern-parade.jpg",
  },
  {
    kind: "collab",
    time: "9am – 12pm",
    id: "refuge-coffee-run",
    title: "The Refuge Coffee Run: Welcome Home",
    medium: "Move",
    city: "Atlanta",
    date: "Sep 19",
    month: "SEP",
    day: "19",
    location: "Clarkston, GA",
    description:
      "Run, walk, or cheer, then stick around with Tiger Club after the finish line for coffee, treats, and an easygoing hangout instead of heading straight home.",
    image: "/images/refuge-run.jpg",
    link: "https://www.refugecoffeeco.com/events/refuge-coffee-run/",
    linkLabel: "Learn More",
  },
  {
    kind: "pick",
    time: "10am – 5pm",
    id: "japanfest",
    title: "JapanFest 2026",
    medium: "Explore",
    city: "Atlanta",
    date: "Sep 20",
    month: "SEP",
    day: "20",
    location: "Gas South Convention Center, Duluth",
    description:
      "Spend the day wandering JapanFest together through Japanese food, performances, martial arts, traditional crafts, vendors, and plenty of things you probably didn't know existed in Atlanta. We'll explore in small Tiger Club groups so nobody has to go alone.",
    image: "/images/japanfest.jpg",
    link: "https://www.japanfest.org/",
    linkLabel: "Learn More",
  },
  {
    kind: "pick",
    time: "10am \u2013 1pm",
    id: "doghead-farm-volunteer-social",
    title: "Doghead Farm Volunteer Social",
    medium: "Serve",
    city: "Atlanta",
    date: "Oct 10",
    month: "OCT",
    day: "10",
    location: "Doghead Farm, Sylvan Hills, Atlanta",
    description:
      "Spend the morning on Concrete Jungle's half-acre urban farm planting, cultivating, and harvesting produce to donate. Lend a hand, learn a thing or two about farming, and meet the rest of the crew over the rows.",
    image: "/images/doghead-farm.jpg",
    presentedBy: "Concrete Jungle",
  },
  {
    kind: "collab",
    time: "1pm \u2013 5pm",
    id: "compassioncon",
    title: "CompassionCon",
    medium: "Serve",
    city: "Atlanta",
    date: "Oct 25",
    month: "OCT",
    day: "25",
    location: "Legacy Decatur",
    description:
      "An afternoon of neighborhood tables, live music, hands-on workshops, and free food in Decatur, where dozens of small Atlanta organizations set up shop and you can wander, taste, ask questions, and leave with three new things to do.",
    image: "/images/compassioncon.jpg",
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

/* The single source of truth for "is this event still ahead of us?".
   The events page had this logic inline; the homepage had none at all and
   was slicing the first five entries regardless of date, which is why
   July listings were still showing under "what are you doing this week?". */
export const EVENT_YEAR = 2026;

export function eventDate(e: TigerEvent) {
  return new Date(`${e.date}, ${EVENT_YEAR}`);
}

/* ---------------------------------------------------------------------
   Defaulting helpers. Every existing event predates the ticketing
   fields, so rather than backfill 19 records by hand (and risk getting
   one wrong), the defaults live here. Callers ask these functions
   instead of reading the raw optional field, which means adding a
   structured value to an event later changes behaviour with no code
   change anywhere else.
   --------------------------------------------------------------------- */

export function eventSlug(e: TigerEvent) {
  return e.slug ?? e.id;
}

/* Everything is EXTERNAL until explicitly moved. That is the safe
   default: an event wrongly marked NATIVE would offer a checkout that
   does not exist, whereas one wrongly marked EXTERNAL just links out. */
export function registrationTypeOf(e: TigerEvent): RegistrationType {
  return e.registrationType ?? "EXTERNAL";
}

export function eventStatusOf(e: TigerEvent): EventStatus {
  return e.eventStatus ?? "PUBLISHED";
}

export function registrationStatusOf(e: TigerEvent): RegistrationStatus {
  if (e.registrationStatus) return e.registrationStatus;
  // An external event with a link is "go register over there"; one
  // without any link asks nothing of the visitor.
  return e.link || e.externalTicketUrl ? "OPEN" : "NOT_REQUIRED";
}

export function ticketUrlOf(e: TigerEvent) {
  return e.externalTicketUrl ?? e.link ?? null;
}

/* The machine-readable start, preferring an explicit ISO timestamp and
   falling back to the display date. Returns null rather than an Invalid
   Date so callers must handle "we don't know when this is". */
export function eventStart(e: TigerEvent): Date | null {
  if (e.startsAt) {
    const d = new Date(e.startsAt);
    if (!Number.isNaN(d.getTime())) return d;
  }
  const d = eventDate(e);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function upcomingEvents(list: TigerEvent[] = events) {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return list
    .filter((e) => eventDate(e) >= startOfToday)
    .sort((a, b) => eventDate(a).getTime() - eventDate(b).getTime());
}
