/**
 * 3x3x3 cube of 27 blocks, pure CSS 3D (spec: design handoff README "Hero cube").
 * Every element between the perspective stage and the faces MUST keep
 * transform-style: preserve-3d, or the scene collapses to a flat rectangle.
 */

const BLOCK = 58;
const LATTICE = 62;
const HALF = BLOCK / 2;
const PULSE_DISTANCE = 38;
const PULSE_DURATION_S = 4.8;
const PULSE_STAGGER_S = 0.42;
const AXIS = [-1, 0, 1] as const;

// Fixed shading per direction is what makes the blocks read as solids.
const FACES: ReadonlyArray<{ transform: string; color: string }> = [
  { transform: `rotateX(90deg) translateZ(${HALF}px)`, color: "#6A6359" },
  { transform: `translateZ(${HALF}px)`, color: "#514B43" },
  { transform: `rotateY(90deg) translateZ(${HALF}px)`, color: "#433E38" },
  { transform: `rotateY(-90deg) translateZ(${HALF}px)`, color: "#3A352F" },
  { transform: `rotateY(180deg) translateZ(${HALF}px)`, color: "#302C27" },
  { transform: `rotateX(-90deg) translateZ(${HALF}px)`, color: "#26221E" },
];

interface Block {
  name: string;
  home: string;
  animation: string | undefined;
  keyframes: string | undefined;
}

const BLOCKS: Block[] = AXIS.flatMap((x) =>
  AXIS.flatMap((y) =>
    AXIS.map((z): Block => {
      const name = `pl${x + 1}${y + 1}${z + 1}`;
      const home = `translate3d(${x * LATTICE}px, ${y * LATTICE}px, ${z * LATTICE}px)`;
      const len = Math.hypot(x, y, z);
      if (len === 0) return { name, home, animation: undefined, keyframes: undefined };
      const out = (v: number) => `${(v * LATTICE + (v / len) * PULSE_DISTANCE).toFixed(2)}px`;
      const delay = -(3 - (Math.abs(x) + Math.abs(y) + Math.abs(z))) * PULSE_STAGGER_S;
      return {
        name,
        home,
        animation: `${name} ${PULSE_DURATION_S}s ease-in-out ${delay.toFixed(2)}s infinite`,
        keyframes: `@keyframes ${name}{0%,100%{transform:${home}}50%{transform:translate3d(${out(x)}, ${out(y)}, ${out(z)})}}`,
      };
    }),
  ),
);

const PULSE_CSS = BLOCKS.map((b) => b.keyframes)
  .filter(Boolean)
  .join("\n");

export default function HeroCube() {
  return (
    <div
      className="relative flex h-[340px] items-center justify-center [perspective:1500px] [perspective-origin:50%_45%]"
      aria-hidden
    >
      <style>{PULSE_CSS}</style>
      <div className="absolute h-[300px] w-[300px] animate-cube-glow rounded-full bg-[radial-gradient(circle,#C98A6A_0%,rgba(201,138,106,0)_68%)] blur-[12px]" />
      <div className="relative h-[186px] w-[186px] animate-cube-spin [transform-style:preserve-3d]">
        {BLOCKS.map((b) => (
          <div
            key={b.name}
            className="absolute top-1/2 left-1/2 [transform-style:preserve-3d]"
            style={{
              width: BLOCK,
              height: BLOCK,
              margin: `-${HALF}px 0 0 -${HALF}px`,
              transform: b.home,
              animation: b.animation,
            }}
          >
            {FACES.map((f) => (
              <div
                key={f.transform}
                className="absolute top-0 left-0 rounded-[5px] [backface-visibility:hidden] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]"
                style={{ width: BLOCK, height: BLOCK, background: f.color, transform: f.transform }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
