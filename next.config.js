/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },

  /* /events was the events listing until it was renamed to
     /experiences, matching the label the nav has always used. Anything
     already pointing at the old path — search results, the Discord
     server, shared links, printed cards — keeps working.

     308 (permanent) rather than 307, so search engines transfer the old
     URL's ranking instead of indexing both. The query string is carried
     over automatically, which matters because the medium filters use it:
     /events?medium=Eat lands on /experiences?medium=Eat. */
  async redirects() {
    return [
      { source: "/events", destination: "/experiences", permanent: true },
    ];
  },
};

module.exports = nextConfig;
