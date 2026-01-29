import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatToTitleCase(text: string): string {
  // Convert the text to lowercase and replace underscores with spaces
  const normalizedText = text.toLowerCase().replace(/_/g, ' ');

  // Split the string into words, capitalize the first letter of each word
  const titleCaseText = normalizedText.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return titleCaseText;
}