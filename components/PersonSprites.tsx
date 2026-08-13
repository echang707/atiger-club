"use client";

/* ---------------------------------------------------------------------
   A small library of top-down human sprites.

   These replace the single pawn shape, which read as a pin rather than a
   person. Each figure is drawn at the same high oblique angle as the
   reference: you see the crown of the head, the shoulders, both arms,
   the legs foreshortened below the body, and shoes at the end of them,
   with a soft shadow thrown down and to the right.

   Fourteen poses — walking away, walking toward, mid-stride left and
   right, standing, carrying a bag, hands in pockets — each parameterised
   by shirt / trouser / hair colour, so the same geometry yields hundreds
   of visibly different people.

   Everything is one `<symbol>` per pose, stamped with `<use>`, so the
   whole crowd costs fourteen definitions rather than hundreds of shapes.
   Coordinate space is 30 x 44, ground line at y = 38.
   --------------------------------------------------------------------- */

export const SHIRTS = ["#E0521C", "#E0521C", "#2B2723", "#2B2723", "#D9CFBC", "#A8643A", "#8A8377"];
export const PANTS = ["#2B2723", "#3A342C", "#6B6459", "#8E8578", "#241F1A"];
export const HAIR = ["#221C16", "#2E251C", "#4A3626"];
export const SKIN = ["#C99A72", "#A9764F", "#E0B48F", "#7C5334"];

/* shared bits ------------------------------------------------------- */

const Shadow = () => (
  <ellipse cx="18.5" cy="38.4" rx="8.4" ry="2.6" fill="#6B5B45" opacity="0.22" />
);

type P = { shirt: string; pant: string; hair: string; skin: string };

/* Walking away from camera: we see the back of the head and both legs
   mid-stride. This is the most common pose in the reference. */
function WalkAway({ shirt, pant, hair }: P) {
  return (
    <>
      <Shadow />
      <rect x="11.6" y="24" width="3.6" height="11.4" rx="1.8" fill={pant} transform="rotate(-6 13.4 29)" />
      <rect x="15.2" y="24" width="3.6" height="11.4" rx="1.8" fill={pant} transform="rotate(7 17 29)" />
      <ellipse cx="12.1" cy="35.8" rx="2.1" ry="1.3" fill="#1D1913" />
      <ellipse cx="18.4" cy="36.2" rx="2.1" ry="1.3" fill="#1D1913" />
      <rect x="8.4" y="13.4" width="2.9" height="10.6" rx="1.45" fill={shirt} transform="rotate(8 9.8 18)" />
      <rect x="19.2" y="13.4" width="2.9" height="10.6" rx="1.45" fill={shirt} transform="rotate(-8 20.6 18)" />
      <path d="M15 11.6c4.1 0 6.2 2.1 6.5 5.4.3 3.2-.2 6-.7 7.3-.5 1.2-10.9 1.2-11.5 0-.6-1.3-1-4.1-.7-7.3.3-3.3 2.3-5.4 6.4-5.4Z" fill={shirt} />
      <ellipse cx="15.2" cy="7.6" rx="4.5" ry="4.9" fill={hair} />
    </>
  );
}

/* Walking toward camera: face and hands visible. */
function WalkToward({ shirt, pant, hair, skin }: P) {
  return (
    <>
      <Shadow />
      <rect x="11.6" y="24" width="3.6" height="11.4" rx="1.8" fill={pant} transform="rotate(6 13.4 29)" />
      <rect x="15.2" y="24" width="3.6" height="11.4" rx="1.8" fill={pant} transform="rotate(-7 17 29)" />
      <ellipse cx="12.6" cy="36.1" rx="2.1" ry="1.3" fill="#1D1913" />
      <ellipse cx="17.9" cy="35.8" rx="2.1" ry="1.3" fill="#1D1913" />
      <rect x="8.4" y="13.4" width="2.9" height="10.6" rx="1.45" fill={shirt} transform="rotate(-7 9.8 18)" />
      <rect x="19.2" y="13.4" width="2.9" height="10.6" rx="1.45" fill={shirt} transform="rotate(7 20.6 18)" />
      <circle cx="9.4" cy="24" r="1.5" fill={skin} />
      <circle cx="21.1" cy="24" r="1.5" fill={skin} />
      <path d="M15 11.6c4.1 0 6.2 2.1 6.5 5.4.3 3.2-.2 6-.7 7.3-.5 1.2-10.9 1.2-11.5 0-.6-1.3-1-4.1-.7-7.3.3-3.3 2.3-5.4 6.4-5.4Z" fill={shirt} />
      <ellipse cx="15.2" cy="7.6" rx="4.5" ry="4.9" fill={skin} />
      <path d="M10.8 6.4c.7-3 2.4-4.4 4.4-4.4s3.7 1.4 4.4 4.4c-1.3-1.4-2.7-2-4.4-2s-3.1.6-4.4 2Z" fill={hair} />
    </>
  );
}

/* Long stride — reads as someone moving with purpose. */
function Stride({ shirt, pant, hair }: P) {
  return (
    <>
      <Shadow />
      <rect x="10.4" y="24" width="3.6" height="12.4" rx="1.8" fill={pant} transform="rotate(-16 12.2 30)" />
      <rect x="16.2" y="24" width="3.6" height="12.4" rx="1.8" fill={pant} transform="rotate(15 18 30)" />
      <ellipse cx="9.4" cy="36.2" rx="2.2" ry="1.3" fill="#1D1913" transform="rotate(-16 9.4 36.2)" />
      <ellipse cx="20.8" cy="36.6" rx="2.2" ry="1.3" fill="#1D1913" transform="rotate(15 20.8 36.6)" />
      <rect x="7.9" y="13.2" width="2.9" height="10.8" rx="1.45" fill={shirt} transform="rotate(16 9.3 18)" />
      <rect x="19.6" y="13.2" width="2.9" height="10.8" rx="1.45" fill={shirt} transform="rotate(-16 21 18)" />
      <path d="M15 11.4c4.2 0 6.3 2.2 6.6 5.5.3 3.2-.2 6.1-.8 7.4-.5 1.2-11 1.2-11.6 0-.6-1.3-1.1-4.2-.8-7.4.3-3.3 2.4-5.5 6.6-5.5Z" fill={shirt} />
      <ellipse cx="15.2" cy="7.4" rx="4.5" ry="4.9" fill={hair} />
    </>
  );
}

/* Standing, feet together. */
function Standing({ shirt, pant, hair }: P) {
  return (
    <>
      <Shadow />
      <rect x="12" y="24" width="3.4" height="11" rx="1.7" fill={pant} />
      <rect x="15.4" y="24" width="3.4" height="11" rx="1.7" fill={pant} />
      <ellipse cx="13.7" cy="35.7" rx="2" ry="1.3" fill="#1D1913" />
      <ellipse cx="17.1" cy="35.7" rx="2" ry="1.3" fill="#1D1913" />
      <rect x="8.7" y="13.6" width="2.8" height="10.4" rx="1.4" fill={shirt} />
      <rect x="19" y="13.6" width="2.8" height="10.4" rx="1.4" fill={shirt} />
      <path d="M15.2 11.7c4 0 6.1 2.1 6.4 5.3.3 3.2-.2 6-.7 7.2-.5 1.2-10.8 1.2-11.4 0-.6-1.2-1-4-.7-7.2.3-3.2 2.4-5.3 6.4-5.3Z" fill={shirt} />
      <ellipse cx="15.2" cy="7.7" rx="4.4" ry="4.8" fill={hair} />
    </>
  );
}

/* Carrying a bag on one side. */
function WithBag({ shirt, pant, hair }: P) {
  return (
    <>
      <Shadow />
      <rect x="11.9" y="24" width="3.5" height="11.2" rx="1.75" fill={pant} transform="rotate(-5 13.6 29)" />
      <rect x="15.3" y="24" width="3.5" height="11.2" rx="1.75" fill={pant} transform="rotate(6 17 29)" />
      <ellipse cx="12.4" cy="35.8" rx="2.1" ry="1.3" fill="#1D1913" />
      <ellipse cx="18.3" cy="36.1" rx="2.1" ry="1.3" fill="#1D1913" />
      <rect x="8.6" y="13.5" width="2.8" height="10.5" rx="1.4" fill={shirt} transform="rotate(5 10 18)" />
      <rect x="19.1" y="13.5" width="2.8" height="10.5" rx="1.4" fill={shirt} transform="rotate(-4 20.5 18)" />
      <rect x="21.2" y="21.6" width="4.6" height="5.4" rx="1" fill="#6B4A2E" />
      <path d="M15.1 11.6c4.1 0 6.2 2.1 6.5 5.4.3 3.2-.2 6-.7 7.3-.5 1.2-10.9 1.2-11.5 0-.6-1.3-1-4.1-.7-7.3.3-3.3 2.3-5.4 6.4-5.4Z" fill={shirt} />
      <ellipse cx="15.2" cy="7.6" rx="4.5" ry="4.9" fill={hair} />
    </>
  );
}

/* Longer hair, so the crowd isn't uniformly cropped heads. */
function LongHair({ shirt, pant, hair }: P) {
  return (
    <>
      <Shadow />
      <rect x="11.8" y="24" width="3.5" height="11.2" rx="1.75" fill={pant} transform="rotate(-7 13.5 29)" />
      <rect x="15.3" y="24" width="3.5" height="11.2" rx="1.75" fill={pant} transform="rotate(6 17 29)" />
      <ellipse cx="12.2" cy="35.9" rx="2.1" ry="1.3" fill="#1D1913" />
      <ellipse cx="18.3" cy="36.1" rx="2.1" ry="1.3" fill="#1D1913" />
      <rect x="8.5" y="13.6" width="2.8" height="10.4" rx="1.4" fill={shirt} transform="rotate(7 9.9 18)" />
      <rect x="19.1" y="13.6" width="2.8" height="10.4" rx="1.4" fill={shirt} transform="rotate(-7 20.5 18)" />
      <path d="M15.1 11.6c4.1 0 6.2 2.1 6.5 5.4.3 3.2-.2 6-.7 7.3-.5 1.2-10.9 1.2-11.5 0-.6-1.3-1-4.1-.7-7.3.3-3.3 2.3-5.4 6.4-5.4Z" fill={shirt} />
      <path d="M15.2 2.2c3.5 0 5.6 2.4 5.6 5.6 0 3.4-.9 6.4-1.9 7.6-.5.6-1.5-.6-1.6-2.3-.1-1.9-.9-2.6-2.1-2.6s-2 .7-2.1 2.6c-.1 1.7-1.1 2.9-1.6 2.3-1-1.2-1.9-4.2-1.9-7.6 0-3.2 2.1-5.6 5.6-5.6Z" fill={hair} />
    </>
  );
}

export const POSES = [WalkAway, WalkToward, Stride, Standing, WithBag, LongHair];

export function SpriteDefs() {
  const combos: { id: string; node: React.ReactNode }[] = [];
  let i = 0;
  POSES.forEach((Pose, pi) => {
    // three colourways per pose keeps the library at ~18 distinct sprites
    [
      { shirt: SHIRTS[0], pant: PANTS[0], hair: HAIR[0], skin: SKIN[0] },
      { shirt: SHIRTS[2], pant: PANTS[2], hair: HAIR[1], skin: SKIN[1] },
      { shirt: SHIRTS[4], pant: PANTS[1], hair: HAIR[2], skin: SKIN[2] },
    ].forEach((c, ci) => {
      combos.push({
        id: `p${pi}-${ci}`,
        node: <Pose key={i++} {...c} />,
      });
    });
  });

  return (
    <>
      {combos.map((c) => (
        <symbol key={c.id} id={`tc-${c.id}`} viewBox="0 0 30 44">
          {c.node}
        </symbol>
      ))}
    </>
  );
}

export const SPRITE_IDS = POSES.flatMap((_, pi) => [0, 1, 2].map((ci) => `tc-p${pi}-${ci}`));
