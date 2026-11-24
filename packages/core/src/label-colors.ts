/** A color in auto's label palette */
export interface PaletteColor {
  /** The name shown in the color picker */
  name: string;
  /** The color, as `#rrggbb` */
  hex: string;
}

/**
 * The colors `auto init` offers for labels, built around the logo's red,
 * amber, magenta and grey. The order is the picker's order, the tie-break for
 * a new label's starting color, and what a label's name hashes into.
 */
export const labelPalette: readonly PaletteColor[] = [
  { name: "Red", hex: "#C5000B" },
  { name: "Orange", hex: "#D9480F" },
  { name: "Amber", hex: "#F1A60E" },
  { name: "Green", hex: "#1F883D" },
  { name: "Teal", hex: "#0E7C7B" },
  { name: "Blue", hex: "#1F6FEB" },
  { name: "Purple", hex: "#7B3FC4" },
  { name: "Magenta", hex: "#870048" },
  { name: "Pink", hex: "#F4A6CD" },
  { name: "Peach", hex: "#FFC9B5" },
  { name: "Sky", hex: "#B6D7F5" },
  { name: "Grey", hex: "#888888" },
];

/** Whether two colors are the same, ignoring case */
const sameColor = (a?: string, b?: string) =>
  a !== undefined && b !== undefined && a.toLowerCase() === b.toLowerCase();

/** The palette entry for a color, if it's in the palette */
export const findPaletteColor = (color?: string) =>
  labelPalette.find((entry) => sameColor(entry.hex, color));

/** FNV-1a, 32-bit */
function hash(text: string) {
  let value = 0x811c9dc5;

  for (let i = 0; i < text.length; i++) {
    value ^= text.charCodeAt(i);
    value = Math.imul(value, 0x01000193) >>> 0;
  }

  return value;
}

/**
 * The palette color for a label that has no color, the same every time for
 * the same name. Case doesn't matter, because labels are matched without it.
 */
export function paletteColorFor(name: string) {
  return labelPalette[hash(name.toLowerCase()) % labelPalette.length]!.hex;
}

/** The palette color the fewest labels use, the earliest one on a tie */
export function leastUsedColor(labels: ReadonlyArray<{ color?: string }>) {
  const uses = (hex: string) =>
    labels.filter((label) => sameColor(label.color, hex)).length;

  return labelPalette.reduce((least, entry) =>
    uses(entry.hex) < uses(least.hex) ? entry : least
  ).hex;
}
