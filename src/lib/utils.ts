import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCompactNumber(value: number): string {
  if (value === undefined || value === null || isNaN(value)) return "0";
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  let formatted = "";
  let suffix = "";
  
  if (absValue >= 1000000000) {
    suffix = "B";
    formatted = (absValue / 1000000000).toFixed(1);
  } else if (absValue >= 1000000) {
    suffix = "M";
    formatted = (absValue / 1000000).toFixed(1);
  } else if (absValue >= 1000) {
    suffix = "K";
    formatted = (absValue / 1000).toFixed(1);
  } else {
    return value.toString();
  }
  
  // Remove trailing .0 if present
  if (formatted.endsWith(".0")) {
    formatted = formatted.substring(0, formatted.length - 2);
  }
  
  return `${sign}${formatted}${suffix}`;
}

export function formatCompactCurrency(value: number): string {
  return formatCompactNumber(value);
}
