// hooks/useGroupColors.ts

export const groupColors = [
  "#4caf50", // green
  "#ff9800", // orange
  "#2196f3", // blue
  "#f44336", // red
  "#9c27b0", // purple
  "#00bcd4", // cyan
  "#ffc107", // amber
  "#e91e63", // pink
  "#795548", // brown
  "#607d8b", // blue grey
];

let currentIndex = 0;

// Get the next color in a circular way
export const getNextGroupColor = () => {
  const color = groupColors[currentIndex];
  currentIndex = (currentIndex + 1) % groupColors.length; // wrap around
  return color;
};
