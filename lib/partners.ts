export type Partner = { name: string; slug: string; url?: string };

// Logos live in public/partners/<slug>.webp (480×480, same-size tiles).
export const partners: Partner[] = [
  { name: "Uptown Atlanta", slug: "uptown-atlanta", url: "https://www.uptownatlanta.com" },
  { name: "CHOW À LA CARTE", slug: "chow-a-la-carte", url: "https://chowclubatlanta.com/" },
  { name: "Recuerdos Cafe", slug: "recuerdos-cafe", url: "https://www.recuerdosatl.com/" },
  { name: "Postern Coffee", slug: "postern-coffee", url: "https://posterncoffee.com/" },
  { name: "Amistad Coffee", slug: "amistad-coffee", url: "https://www.instagram.com/amistadcoffeeco/?hl=en" },
  { name: "The Bite of Korea", slug: "the-bite-of-korea", url: "https://biteofkorea.com" },
  { name: "CT Reforma Taqueria", slug: "ct-reforma", url: "https://reforma.cttacos.com/" },
  { name: "The International Night Market Atlanta", slug: "atlanta-international-night-market-v2", url: "https://atlnightmarketfoundation.org/" },
  { name: "The Supermarket", slug: "the-supermarket", url: "https://www.thesupermarketatl.com/" },
  { name: "Round Trip Brewing Co", slug: "round-trip-brewing-co", url: "https://roundtripbrewing.com" },
  { name: "Concrete Jungle", slug: "concrete-jungle", url: "https://www.concrete-jungle.org" },
  { name: "Out of Hand Theatre", slug: "out-of-hand-theatre", url: "https://www.outofhandtheater.com" },
  { name: "Hong Kong Dragon Boat Festival", slug: "hong-kong-dragon-boat-festival-v3", url: "https://www.dragonboatatlanta.com" },
  { name: "Trees Atlanta", slug: "trees-atlanta", url: "https://www.treesatlanta.org" },
];
