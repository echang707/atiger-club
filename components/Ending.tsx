"use client";

import { motion } from "framer-motion";

function TigerAtTheEnd() {
  return (
    <motion.div
      aria-hidden="true"
      initial={{ opacity: 0, y: -10, rotate: 0.6 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none relative z-10 mx-auto mt-10 w-[205px] sm:w-[245px] md:w-[300px]"
    >
      {/* Exact tail socket. The page-long SVG ends here, centered on the rump. */}
      <span data-stripe-end className="absolute left-1/2 top-0 h-px w-px -translate-x-1/2" />

      <svg viewBox="0 0 300 390" className="block h-auto w-full overflow-visible">
        <defs>
          <filter id="tiger-paper-edge" x="-8%" y="-8%" width="116%" height="116%">
            <feTurbulence type="fractalNoise" baseFrequency="0.012 0.045" numOctaves="2" seed="9" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.1" />
          </filter>
        </defs>

        <g filter="url(#tiger-paper-edge)">
          {/* Rear-facing/top-down body. The broad rump is intentionally at the top so the tail plugs in naturally. */}
          <path d="M150 8 C108 8 77 35 74 81 C70 126 83 170 91 210 C97 242 98 279 109 310 C120 341 135 358 150 362 C165 358 180 341 191 310 C202 279 203 242 209 210 C217 170 230 126 226 81 C223 35 192 8 150 8 Z" fill="#D97721" />
          <path d="M80 73 C54 84 43 111 47 147 C51 178 66 196 93 201 C87 158 78 119 80 73 Z" fill="#D97721" />
          <path d="M220 73 C246 84 257 111 253 147 C249 178 234 196 207 201 C213 158 222 119 220 73 Z" fill="#D97721" />
          <path d="M88 165 C61 181 51 207 56 235 C60 256 73 270 92 272 C99 241 100 208 96 179 Z" fill="#D97721" />
          <path d="M212 165 C239 181 249 207 244 235 C240 256 227 270 208 272 C201 241 200 208 204 179 Z" fill="#D97721" />
          <path d="M58 227 C43 235 38 250 44 263 C49 276 66 280 83 269" fill="#D97721" />
          <path d="M242 227 C257 235 262 250 256 263 C251 276 234 280 217 269" fill="#D97721" />
          <path d="M108 282 C92 292 86 311 93 330 C100 350 118 360 150 361 C182 360 200 350 207 330 C214 311 208 292 192 282 Z" fill="#D97721" />
          <path d="M121 334 C116 359 127 382 150 386 C173 382 184 359 179 334 Z" fill="#D97721" />
          <path d="M124 346 L108 336 L114 359 Z" fill="#D97721" />
          <path d="M176 346 L192 336 L186 359 Z" fill="#D97721" />

          <path d="M122 296 C132 306 139 313 150 317 C161 313 168 306 178 296 C174 319 166 330 150 334 C134 330 126 319 122 296 Z" fill="#F5F0E3" opacity="0.9" />
          <path d="M132 361 C138 369 144 373 150 374 C156 373 162 369 168 361 C164 377 158 384 150 386 C142 384 136 377 132 361 Z" fill="#F5F0E3" opacity="0.9" />

          {/* Long, tapered, anatomical markings so the tiger matches the tail instead of reading like a mascot. */}
          <g fill="#16140F">
            <path d="M104 29 C121 38 134 50 145 67 C128 63 112 59 94 51 C91 43 95 35 104 29 Z" />
            <path d="M196 29 C179 38 166 50 155 67 C172 63 188 59 206 51 C209 43 205 35 196 29 Z" />
            <path d="M89 64 C112 73 128 85 142 104 C122 99 104 95 81 86 C78 78 81 70 89 64 Z" />
            <path d="M211 64 C188 73 172 85 158 104 C178 99 196 95 219 86 C222 78 219 70 211 64 Z" />
            <path d="M80 101 C105 109 124 121 141 142 C119 136 100 132 76 125 C73 116 75 108 80 101 Z" />
            <path d="M220 101 C195 109 176 121 159 142 C181 136 200 132 224 125 C227 116 225 108 220 101 Z" />
            <path d="M79 142 C104 147 125 158 142 178 C120 172 100 169 77 167 C74 159 75 150 79 142 Z" />
            <path d="M221 142 C196 147 175 158 158 178 C180 172 200 169 223 167 C226 159 225 150 221 142 Z" />
            <path d="M89 185 C110 188 128 199 143 217 C125 212 110 211 94 213 C89 206 87 195 89 185 Z" />
            <path d="M211 185 C190 188 172 199 157 217 C175 212 190 211 206 213 C211 206 213 195 211 185 Z" />
            <path d="M98 226 C115 228 130 238 144 253 C128 249 115 249 103 252 C98 246 96 236 98 226 Z" />
            <path d="M202 226 C185 228 170 238 156 253 C172 249 185 249 197 252 C202 246 204 236 202 226 Z" />
            <path d="M107 267 C124 270 138 278 147 290 C132 286 120 286 109 290 C105 283 105 275 107 267 Z" />
            <path d="M193 267 C176 270 162 278 153 290 C168 286 180 286 191 290 C195 283 195 275 193 267 Z" />
            <path d="M120 318 C132 320 141 325 148 333 C137 332 129 333 120 336 C117 330 117 324 120 318 Z" />
            <path d="M180 318 C168 320 159 325 152 333 C163 332 171 333 180 336 C183 330 183 324 180 318 Z" />
            <path d="M143 76 C149 82 152 90 150 99 C146 95 142 89 140 83 Z" />
            <path d="M156 115 C151 123 149 131 151 140 C156 136 159 130 160 122 Z" />
            <path d="M143 155 C149 161 152 169 151 177 C147 173 143 168 140 162 Z" />
            <path d="M157 197 C151 204 149 212 151 219 C156 216 159 210 161 203 Z" />
            <path d="M145 239 C150 245 152 251 150 258 C146 254 143 250 141 244 Z" />
          </g>

          <path d="M48 254 l-9 6 M54 259 l-8 8 M252 254 l9 6 M246 259 l8 8" stroke="#16140F" strokeWidth="4" strokeLinecap="round" />
        </g>
      </svg>
    </motion.div>
  );
}

export default function Ending() {
  return (
    <section
      data-stripe-invert
      className="relative min-h-[92vh] overflow-visible px-6 text-paper"
    >
      {/* Separate background layer: the page-long tail sits above this dark field, while the section copy/tiger sit above the tail. */}
      <div className="absolute inset-0 z-0 bg-ink" />
      <div className="absolute inset-0 z-0 opacity-[0.04] paper-texture" />

      <div className="relative z-10 mx-auto flex min-h-[88vh] w-full max-w-6xl flex-col items-center pt-16 md:pt-24 pb-14">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="grid w-full grid-cols-1 items-start gap-3 md:grid-cols-[1fr_220px_1fr] md:gap-8"
        >
          <p className="font-display text-3xl leading-tight text-center md:text-right md:text-5xl">Life is happening.</p>
          <div aria-hidden="true" />
          <p className="font-display text-3xl leading-tight text-center md:text-left md:text-5xl">Grab it by the tail.</p>
        </motion.div>

        <TigerAtTheEnd />

        <motion.a
          href="/events"
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mt-8 text-tiger-soft text-lg md:text-xl font-medium organic-underline organic-underline-invert"
        >
          see what&rsquo;s happening →
        </motion.a>
      </div>
    </section>
  );
}
