TODO
- Tie node brightness to actual audio amplitude universally (envelope/LFO/velocity/etc.) for smooth fades.
- Revisit "Sequence LFOs" design: consider moving to sequence overlap/density feature instead of LFO; use long envelopes and staggered sequence passes.
- Define clean overlap model: staggered sequence instances with long fade-in/out, overlap count or stagger interval, and wrap behavior.
- Decide whether to drive slow fades via envelope controls (Sustain/Gate) or a dedicated per-sequence envelope.
