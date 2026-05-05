// ─── Primitive helpers ───────────────────────────────────────────────────────
const _blue = (a: number) => `rgba(100,200,255,${a})`;
const _dark = (a: number) => `rgba(10,12,20,${a})`;
const _gold = (a: number) => `rgba(255,208,96,${a})`;
const _text = (a: number) => `rgba(232,244,255,${a})`;
const _white = (a: number) => `rgba(255,255,255,${a})`;

// ─── Colors ──────────────────────────────────────────────────────────────────
export const colors = {
  // Solid
  primary: "#64C8FF" as const,
  gold: "#FFD060" as const,
  textLight: "#E8F4FF" as const,
  white: "#ffffff" as const,
  muted: "#888888" as const,

  // Primary (blue) with alpha
  primaryA07: _blue(0.07),
  primaryA08: _blue(0.08),
  primaryA10: _blue(0.1),
  primaryA12: _blue(0.12),
  primaryA15: _blue(0.15),
  primaryA18: _blue(0.18),
  primaryA20: _blue(0.2),
  primaryA25: _blue(0.25),
  primaryA30: _blue(0.3),
  primaryA35: _blue(0.35),
  primaryA50: _blue(0.5),
  primaryA90: _blue(0.9),

  // Gold with alpha
  goldA60: _gold(0.6),

  // Text with alpha
  textLightA45: _text(0.45),

  // White with alpha
  whiteA04: _white(0.04),
  whiteA10: _white(0.1),
  whiteA20: _white(0.2),

  // Backgrounds
  bgPage: "#0a1428" as const,
  bgPanel: "#0D1525" as const,
  bgCard: _dark(0.78),
  bgCardStrong: _dark(0.82),
  bgTabBar: "rgba(6,14,32,0.97)",
  bgTimeControl: "rgba(10,20,40,0.85)",
  bgOverlay: "rgba(0,0,0,0.45)",

  // Map overlays
  fogFill: "rgba(180,200,230,0.62)",
  hexStroke: _blue(0.25),
  boundaryStroke: "rgba(65,115,215,0.85)",

  // Misc
  shadow: "#000000" as const,
} as const;

// ─── Spacing ─────────────────────────────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
} as const;

// ─── Border radius ───────────────────────────────────────────────────────────
export const radius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 14,
  full: 9999,
} as const;

// ここからちゃんとデザインに沿って整理し直す

export const colorTokens = {
  primary: "#1A40A8",
  primaryForeground: "#3769F0",
  secondary: "#3769F0",
  tertiary: "#EDF2FF",
  foreground: "#3D3D3D",
  background: "#FFFFFF",
  accent: "#F0379D",
  blueShadow: "#466ACC",
} as const;

export const fontSize = {
  maximum: 24,
  large: 16,
  minimum: 10,
} as const;

export const shadowStyles = {
  tabIcon: {
    shadowColor: colorTokens.blueShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
  }
}