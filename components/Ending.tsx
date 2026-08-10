"use client";

import { motion } from "framer-motion";

// Replaces the old symmetrical top-down mascot. This is a genuine
// three-quarter rear/overhead pose, drawn with the same brush language
// as the tail (organic silhouette, thick curved tapered black marks
// rooted on alternating flanks) so the two read as one continuous
// illustration rather than a line meeting an icon. The rump sits high
// and to the right, angled to meet the tail as it curls in from that
// side; the spine twists diagonally down to the shoulders, and the
// head turns away in profile rather than facing the reader — nothing
// here is mirrored left-to-right the way the old mascot was.
function TigerAtTheEnd() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -10, rotate: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative mx-auto my-8 sm:my-10 md:my-14 w-[220px] sm:w-[270px] md:w-[340px]"
    >
      {/* Just inside the rump's high right shoulder — where the curled
          return leg of the tail (see the ending section of buildRoute
          in lib/tail.ts) actually arrives, rather than the page's
          centre line. The tiger sits at z-10 and the tail at z-index
          -1, so the last stretch is covered by the root wedge below —
          which is what makes the join read as one creature rather than
          a line stopping near a shape. */}
      <span data-stripe-end className="absolute left-[76%] top-[4%] h-px w-px" />

      <svg viewBox="0 0 340 400" className="block h-auto w-full overflow-visible">
        <defs>
          <filter id="tiger-paper-edge" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
          </filter>
        </defs>

        <g filter="url(#tiger-paper-edge)">
          {/* The tail root: a diagonal wedge, not a vertical one, so the
              page-long tail thickens into the rump at the same angle it
              was travelling on the way in. */}
          <path
            d="M245 -30 C266 -6 282 24 291 58 C297 80 297 100 289 118 L225 96 C227 66 231 34 236 2 C238 -10 241 -21 245 -30 Z"
            fill="#D97721"
          />
          <path d="M247 -8 C258 2 267 14 272 28 C262 24 253 18 246 10 Z" fill="#16140F" />
          <path d="M277 42 C266 47 257 55 251 66 C261 65 271 61 279 54 Z" fill="#16140F" />

          {/* Far hind haunch — smaller and set back, reading as the leg
              perspective is receding behind the near one. */}
          <path
            d="M215 108 C186 120 172 148 178 180 C183 206 199 222 224 226 C219 190 213 148 215 108 Z"
            fill="#D97721"
          />

          {/* Main body: rump (high right) sweeping diagonally down to
              the shoulder (low left) in one continuous asymmetric
              curve — this is the twist that reads as a three-quarter
              turn rather than a flat top-down icon. */}
          <path
            d="M289 118 C298 152 293 184 271 208 C282 236 281 264 262 284 C240 306 205 308 178 296 C168 316 152 330 132 335 C104 341 74 331 58 308 C44 288 43 264 55 244 C40 236 30 222 28 205 C25 182 36 161 58 150 C64 128 80 111 103 103 C128 94 156 96 178 110 C196 96 218 90 240 94 C263 98 281 106 289 118 Z"
            fill="#D97721"
          />

          {/* Near hind haunch — the leg closer to the reader, drawn
              larger and lower to sell the depth. */}
          <path
            d="M255 176 C282 190 296 216 291 246 C287 271 271 286 246 289 C250 249 253 212 255 176 Z"
            fill="#D97721"
          />

          {/* Rear legs — deliberately unequal lengths and bends, one
              extended and weight-bearing, one shorter and tucked. */}
          <path d="M256 232 C274 252 279 276 269 300 C262 318 246 328 227 327 C233 297 240 262 245 228 Z" fill="#D97721" />
          <path d="M186 205 C170 224 165 248 175 269 C182 284 196 292 212 289 C204 260 195 231 189 202 Z" fill="#D97721" />
          <path d="M232 315 c-14 4 -26 15 -30 29 c-4 13 4 24 18 26 c9 -14 15 -34 18 -50 Z" fill="#D97721" />
          <path d="M180 262 c-12 10 -18 25 -14 39 c3 12 15 19 27 16 c-2 -19 -6 -39 -9 -55 Z" fill="#D97721" />

          {/* Shoulder, turned neck and the head in profile — pointed
              down and away, so the reader is looking along its back at
              a head that's already turning to leave the frame. */}
          <path
            d="M58 244 C36 254 22 274 24 297 C26 320 44 336 70 337 C60 313 55 288 56 264 Z"
            fill="#D97721"
          />
          <path
            d="M72 300 C54 306 42 320 41 337 C40 355 54 368 76 369 C86 369 96 366 103 358 C93 342 82 322 76 302 Z"
            fill="#D97721"
          />
          {/* the ear, catching the light at the very edge of the turn */}
          <path d="M78 296 C72 284 71 271 78 261 C86 268 91 279 90 292 Z" fill="#D97721" />
          {/* a hint of jaw/muzzle in profile, nothing more — the face
              itself is turning away from the reader, not toward it */}
          <path d="M41 337 C30 341 21 349 18 360 C16 368 20 374 28 374 C36 366 41 353 41 337 Z" fill="#D97721" />

          {/* cream throat/chest flash, off-axis rather than centred */}
          <path d="M60 320 C68 332 78 340 90 343 C82 353 68 356 56 350 C48 345 44 335 46 325 Z" fill="#F5F0E3" opacity="0.9" />

          {/* Organic tiger stripes: thick curved tapered marks, rooted
              on alternating flanks, none mirrored, each with its own
              length, angle and lean — the same brush used to band the
              tail itself. */}
          <g fill="#16140F">
            <path d="M258 40 C270 50 279 62 283 78 C270 73 258 66 249 54 C248 48 252 43 258 40 Z" />
            <path d="M232 70 C252 78 268 91 278 110 C260 105 244 99 228 88 C224 82 226 75 232 70 Z" />
            <path d="M200 96 C222 100 241 111 254 130 C234 127 216 122 199 113 C195 107 196 100 200 96 Z" />
            <path d="M268 132 C284 145 293 163 292 184 C278 174 267 159 261 141 C262 137 264 133 268 132 Z" />
            <path d="M225 128 C246 135 262 150 271 170 C252 164 236 155 222 143 C220 138 221 132 225 128 Z" />
            <path d="M175 118 C196 126 213 141 223 161 C204 155 187 145 172 131 C170 126 171 121 175 118 Z" />
            <path d="M254 190 C271 200 281 217 280 237 C265 228 254 214 249 195 C250 192 252 191 254 190 Z" />
            <path d="M195 158 C216 166 233 181 243 201 C223 195 206 184 191 169 C190 165 191 161 195 158 Z" />
            <path d="M139 118 C160 122 178 133 191 151 C171 148 154 141 138 130 C135 126 136 121 139 118 Z" />
            <path d="M225 246 C243 255 254 271 254 290 C239 282 227 269 220 252 C221 250 223 247 225 246 Z" />
            <path d="M158 174 C178 179 195 191 207 209 C188 205 172 196 157 184 C156 181 157 177 158 174 Z" />
            <path d="M108 145 C128 146 146 156 159 173 C140 172 123 167 107 158 C105 154 106 149 108 145 Z" />
            <path d="M190 254 C207 260 219 272 224 289 C207 284 193 275 183 261 C185 258 187 256 190 254 Z" />
            <path d="M122 190 C141 194 157 205 167 222 C149 219 133 211 119 200 C118 196 119 193 122 190 Z" />
            <path d="M78 172 C97 176 112 187 122 203 C104 200 89 192 76 181 C75 178 76 175 78 172 Z" />
            <path d="M150 280 C165 288 175 300 178 315 C163 309 151 300 143 286 C145 283 147 281 150 280 Z" />
            <path d="M92 224 C110 229 124 240 133 256 C116 253 101 245 89 234 C88 231 90 227 92 224 Z" />
            <path d="M108 300 C122 308 132 320 135 334 C121 328 110 319 103 306 C104 304 106 302 108 300 Z" />
            <path d="M65 258 C82 264 96 275 104 290 C87 287 73 279 63 267 C63 264 64 261 65 258 Z" />
            <path d="M52 300 C64 310 71 323 71 337 C60 331 51 321 47 308 C48 305 50 302 52 300 Z" />
          </g>

          {/* dark claws on the near, weight-bearing paws only — the far
              paws are foreshortened enough that claw detail would just
              read as noise */}
          <path d="M232 318 l-8 7 M240 322 l-7 9" stroke="#16140F" strokeWidth="4" strokeLinecap="round" />
          <path d="M23 368 l-9 3 M31 372 l-8 6" stroke="#16140F" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section
      data-stripe-invert
      className="relative text-paper min-h-[80vh] flex flex-col items-center justify-center overflow-visible px-6"
    >
      {/* The dark backdrop lives on its own layer, well below TheStripe's
          z-index (-1). Previously this was just `bg-ink` on the section
          itself, which paints at stacking level 0 — ABOVE the stripe —
          so the tail vanished the instant it entered the one section
          where it needs to be visible: connecting into the tiger. */}
      <div className="absolute inset-0 -z-20 bg-ink" />
      {/* A transition zone rather than a hard edge. The tail arrives from
          the cream page above and has to stay legible the whole way in,
          so the top of this section fades from paper to ink over ~220px
          instead of switching in one scanline — which is where the tail
          used to visually disappear for a beat. It sits at -z-20 with the
          ink, so it is still behind the tail at z-index -1. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 -z-20 h-[220px]"
        style={{ background: "linear-gradient(to bottom, #F4F0E6 0%, rgba(22,20,15,0) 100%)" }}
      />
      <div className="absolute inset-0 -z-10 opacity-[0.04] paper-texture" />

      {/* A soft warm pool on the centre axis. It does no work on its own,
          but it puts the brightest point of the section exactly where the
          tail lands, so the eye follows the tail down into the animal
          instead of drifting to the two lines of copy. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[70%]"
        style={{
          background:
            "radial-gradient(60% 55% at 50% 62%, rgba(217,119,33,0.13), rgba(217,119,33,0) 70%)",
        }}
      />

      <div className="relative z-10 w-full max-w-6xl min-h-[64vh] flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid w-full grid-cols-1 md:grid-cols-[1fr_260px_1fr] items-baseline gap-3 md:gap-0 pt-16 md:pt-24"
        >
          {/* Split either side of a wide centre gutter. The gutter is not
              decoration — it is the lane the tail comes down, which is why
              it is sized against the tail's weight rather than by eye. */}
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-right text-shield-invert">
            Life is happening.
          </p>
          <div aria-hidden="true" />
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-left text-shield-invert">
            Grab it by the tail.
          </p>
        </motion.div>

        <TigerAtTheEnd />

        <motion.a
          href="/events"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-auto mb-14 self-center text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
        >
          see what&rsquo;s happening →
        </motion.a>
      </div>
    </section>
  );
}
