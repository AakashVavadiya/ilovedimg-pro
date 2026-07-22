import React from "react";
import { formatCompactNumber } from "@/lib/utils";

interface HoverValueProps {
  value: number;
  isCurrency?: boolean;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimalPlaces?: number;
}

export function HoverValue({
  value,
  isCurrency = false,
  prefix = "",
  suffix = "",
  className = "",
  decimalPlaces
}: HoverValueProps) {
  if (value === undefined || value === null || isNaN(value)) {
    return <span className={className}>0</span>;
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  
  // For the compact display
  let compactText = "";
  if (isCurrency) {
    const currencyPrefix = prefix || "";
    compactText = `${sign}${currencyPrefix}${formatCompactNumber(absValue)}`;
  } else {
    compactText = `${sign}${prefix}${formatCompactNumber(absValue)}${suffix}`;
  }

  // For the full tooltip title
  let fullTooltip = "";
  const formatOptions: Intl.NumberFormatOptions = {};
  if (decimalPlaces !== undefined) {
    formatOptions.minimumFractionDigits = decimalPlaces;
    formatOptions.maximumFractionDigits = decimalPlaces;
  } else {
    formatOptions.maximumFractionDigits = 2;
  }
  const formattedFull = absValue.toLocaleString("en-IN", formatOptions);
  
  if (isCurrency) {
    const currencyPrefix = prefix || "";
    fullTooltip = `${sign}${currencyPrefix}${formattedFull}`;
  } else {
    fullTooltip = `${sign}${prefix}${formattedFull}${suffix}`;
  }

  return (
    <span title={fullTooltip} className={className}>
      {compactText}
    </span>
  );
}
