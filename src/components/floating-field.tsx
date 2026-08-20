/**
 * Ambient floating background: a few softly drifting orbs and a slow-moving
 * particle layer. Pure CSS animation, GPU-friendly transforms, decorative only.
 */
const orbs = [
  { size: 360, left: "10%", top: "10%", delay: "0s", duration: "22s", opacity: 0.26 },
  { size: 280, left: "70%", top: "4%", delay: "-6s", duration: "27s", opacity: 0.2 },
  { size: 300, left: "54%", top: "48%", delay: "-12s", duration: "31s", opacity: 0.18 },
  { size: 200, left: "20%", top: "62%", delay: "-3s", duration: "25s", opacity: 0.18 },
];

const particles = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 7.3 + 4) % 96}%`,
  top: `${(i * 13.7 + 9) % 92}%`,
  delay: `-${(i * 1.7) % 18}s`,
  duration: `${16 + ((i * 3) % 12)}s`,
  size: i % 3 === 0 ? 4 : 3,
}));

export function FloatingField() {
  return (
    <div aria-hidden className="floating-field" data-testid="floating-field">
      <span className="aurora-sweep" />
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