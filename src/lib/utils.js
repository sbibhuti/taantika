import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTenRandomItems(arr) {
  const result = [];
  const len = arr.length;

  if (len <= 10) return [...arr];

  const seenIndices = new Set();

  while (result.length < 10) {
    const randomIndex = Math.floor(Math.random() * len);

    if (!seenIndices.has(randomIndex)) {
      seenIndices.add(randomIndex);
      result.push(arr[randomIndex]);
    }
  }

  return result;
}

export function timeFormatter(dateString) {
  const date = new Date(dateString * 1000);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  return formatted;
}

export function divideAndFormat(input) {
  if (typeof input === "number" && !isNaN(input)) {
    return (input / 100).toFixed(2);
  }
  return 0;
}
