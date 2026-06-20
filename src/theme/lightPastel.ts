export const LIGHT_PASTEL = {
  background: "#F7F3E9",
  paper: "#FFFDF8",
  paperWarm: "#FFF8EE",
  mint: "#DDF2D2",
  green: "#62AA78",
  greenStrong: "#397D54",
  greenText: "#2D6F4D",
  greenSoft: "#E4F3DD",
  yellow: "#FFE6B8",
  blue: "#DCE9F7",
  peach: "#F7DDBF",
  pink: "#F5D9D5",
  border: "rgba(255,255,255,0.82)",
  line: "#E8DFC9",
  shadow: "#817661",
} as const;

export const LIGHT_PASTEL_CARD_SHADOW = {
  shadowColor: LIGHT_PASTEL.shadow,
  shadowOffset: { width: 0, height: 5 },
  shadowOpacity: 0.09,
  shadowRadius: 12,
  elevation: 2,
} as const;
