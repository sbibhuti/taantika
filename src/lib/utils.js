import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function getTenRandomItems(arr) {
  const result = [];
  const len = arr.length;

  // Guard clause if the list has fewer than 10 items
  if (len <= 10) return [...arr];

  // Track indices we have already picked
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
