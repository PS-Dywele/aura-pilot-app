/**
 * Ambient floating background: a few softly drifting orbs and a slow-moving
 * particle layer. Pure CSS animation, GPU-friendly transforms, decorative only.
 */
const orbs = [
  { size: 320, left: "8%", top: "12%", delay: "0s", duration: "22s", opacity: 0.1 },
  { size: 220, left: "72%", top: "6%", delay: "-6s", duration: "27s", opacity: 0.08 },
  { size: 260, left: "56%", top: "58%", delay: "-12s", duration: "31s", opacity: 0.07 },
  { size: 160, left: "18%", top: "68%", delay: "-3s", duration: "25s", opacity: 0.07 },
];

const particles = Array.from({ length: 14 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 96}%`,
  top: `${(i * 13.7 + 9) % 92}%`,
  delay: `-${(i * 1.7) % 18}s`,
  duration: `${16 + ((i * 3) % 12)}s`,
  size: i % 3 === 0 ? 3 : 2,
}));

export function FloatingField() {
  return (
    <div aria-hidden className="floating-field" data-testid="floating-field">
      {orbs.map((o, i) => (
        <span
          key={`orb-${i}`}
          className="floating-orb"
          style={{
            width: o.size,
            height: o.size,
            left: o.left,
            top: o.top,
            animationDelay: o.delay,
            animationDuration: o.duration,
            opacity: o.opacity,
          }}
        />
      ))}
      {particles.map((p, i) => (
        <span
          key={`p-${i}`}
          className="floating-particle"
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
            animationDelay: p.delay,
            animationDuration: p.duration,
          }}
        />
      ))}
    </div>
  );
}