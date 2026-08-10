"use client";

import { motion } from "framer-motion";

function TigerAtTheEnd() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -10, rotate: 0.8 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative mx-auto my-8 sm:my-10 md:my-14 w-[190px] sm:w-[230px] md:w-[285px]"
    >
      {/* The page-long tail ends here, a little way INSIDE the rump rather
          than kissing its outline. The tiger sits at z-10 and the tail at
          z-index -1, so those last few pixels are covered by the animal's
          own body — which is what makes the join read as one creature
          instead of a line stopping next to a shape. */}
      <span data-stripe-end className="absolute left-[50%] top-[8%] h-px w-px" />

      <svg viewBox="0 0 300 390" className="block h-auto w-full overflow-visible">
        <defs>
          <filter id="tiger-paper-edge" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
          </filter>
        </defs>

        <g filter="url(#tiger-paper-edge)">
          {/* top-down/back-view body: rump first, head pointing into the section */}
          <path
            d="M150 18 C110 18 80 43 77 84 C72 129 85 173 93 212 C99 242 100 277 111 307 C121 335 135 351 150 354 C165 351 179 335 189 307 C200 277 201 242 207 212 C215 173 228 129 223 84 C220 43 190 18 150 18 Z"
            fill="#D97721"
          />

          {/* haunches create a real rear silhouette instead of a pill-shaped mascot */}
          <path d="M83 78 C56 88 45 114 49 148 C53 177 67 194 93 199 C87 159 79 122 83 78 Z" fill="#D97721" />
          <path d="M217 78 C244 88 255 114 251 148 C247 177 233 194 207 199 C213 159 221 122 217 78 Z" fill="#D97721" />

          {/* rear legs and paws */}
          <path d="M88 164 C62 179 52 204 57 231 C61 252 73 265 91 268 C98 239 100 206 96 177 Z" fill="#D97721" />
          <path d="M212 164 C238 179 248 204 243 231 C239 252 227 265 209 268 C202 239 200 206 204 177 Z" fill="#D97721" />
          <path d="M58 224 C44 232 39 247 44 260 C49 272 65 276 82 266" fill="#D97721" />
          <path d="M242 224 C256 232 261 247 256 260 C251 272 235 276 218 266" fill="#D97721" />

          {/* shoulders, neck and small head at the far end, so we're clearly looking down its back */}
          <path d="M108 278 C92 288 86 307 93 326 C100 346 118 356 150 357 C182 356 200 346 207 326 C214 307 208 288 192 278 Z" fill="#D97721" />
          <path d="M121 330 C116 355 127 378 150 382 C173 378 184 355 179 330 Z" fill="#D97721" />
          <path d="M124 342 L108 332 L114 355 Z" fill="#D97721" />
          <path d="M176 342 L192 332 L186 355 Z" fill="#D97721" />

          {/* cream flashes soften the animal and echo the illustrated reference */}
          <path d="M122 292 C132 302 139 309 150 313 C161 309 168 302 178 292 C174 315 166 326 150 330 C134 326 126 315 122 292 Z" fill="#F5F0E3" opacity="0.9" />
          <path d="M132 357 C138 365 144 369 150 370 C156 369 162 365 168 357 C164 373 158 380 150 382 C142 380 136 373 132 357 Z" fill="#F5F0E3" opacity="0.9" />

          {/* Organic, asymmetrical stripes. They follow the tiger's anatomy instead of sitting as horizontal bars. */}
          <g fill="#16140F">
            <path d="M107 40 C121 47 132 54 143 69 C132 67 118 65 101 58 C96 54 99 45 107 40 Z" />
            <path d="M193 40 C179 47 168 54 157 69 C168 67 182 65 199 58 C204 54 201 45 193 40 Z" />
            <path d="M91 71 C111 78 126 88 140 105 C122 101 106 98 84 91 C80 84 82 77 91 71 Z" />
            <path d="M209 71 C189 78 174 88 160 105 C178 101 194 98 216 91 C220 84 218 77 209 71 Z" />
            <path d="M82 106 C105 113 123 124 139 143 C119 137 101 134 78 128 C74 121 76 112 82 106 Z" />
            <path d="M218 106 C195 113 177 124 161 143 C181 137 199 134 222 128 C226 121 224 112 218 106 Z" />
            <path d="M81 145 C105 149 124 160 141 178 C120 173 101 171 79 169 C76 162 77 152 81 145 Z" />
            <path d="M219 145 C195 149 176 160 159 178 C180 173 199 171 221 169 C224 162 223 152 219 145 Z" />
            <path d="M91 188 C110 190 127 201 142 218 C125 214 111 213 96 215 C91 209 89 198 91 188 Z" />
            <path d="M209 188 C190 190 173 201 158 218 C175 214 189 213 204 215 C209 209 211 198 209 188 Z" />
            <path d="M99 228 C115 229 130 239 143 253 C128 250 116 250 104 253 C99 247 97 237 99 228 Z" />
            <path d="M201 228 C185 229 170 239 157 253 C172 250 184 250 196 253 C201 247 203 237 201 228 Z" />
            <path d="M108 267 C124 270 137 278 146 289 C131 286 120 286 110 289 C106 282 106 275 108 267 Z" />
            <path d="M192 267 C176 270 163 278 154 289 C169 286 180 286 190 289 C194 282 194 275 192 267 Z" />
            <path d="M121 316 C131 318 140 323 147 331 C136 330 129 331 121 334 C118 328 118 322 121 316 Z" />
            <path d="M179 316 C169 318 160 323 153 331 C164 330 171 331 179 334 C182 328 182 322 179 316 Z" />
            {/* short central markings make the back read furry rather than perfectly mirrored */}
            <path d="M143 80 C148 85 151 92 150 100 C146 96 143 91 141 86 Z" />
            <path d="M155 117 C151 124 149 132 151 140 C155 136 158 130 159 123 Z" />
            <path d="M143 156 C149 161 152 168 151 176 C147 172 144 168 141 162 Z" />
            <path d="M156 198 C151 204 149 211 151 218 C155 215 158 209 160 204 Z" />
            <path d="M145 238 C149 244 151 250 150 256 C146 253 143 249 142 244 Z" />
          </g>

          {/* dark claws / paw definition */}
          <path d="M49 251 l-9 6 M55 256 l-8 8 M251 251 l9 6 M245 256 l8 8" stroke="#16140F" strokeWidth="4" strokeLinecap="round" />
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
      <div className="absolute inset-0 -z-10 opacity-[0.04] paper-texture" />

      <div className="relative z-10 w-full max-w-6xl min-h-[64vh] flex flex-col">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-[1fr_180px_1fr] items-start gap-3 md:gap-8 pt-16 md:pt-24"
        >
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-right">Life is happening.</p>
          <div aria-hidden="true" />
          <p className="font-display text-3xl md:text-5xl leading-tight text-center md:text-left">Grab it by the tail.</p>
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
