/**
 * Convert English numerals to Bangla numerals
 * @param str - Input string with English digits
 * @returns String with Bangla numerals
 */
export const convertToBanglaNumerals = (str: string): string => {
  return str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
};

/**
 * Convert Bangla numerals to English numerals
 * @param str - Input string with Bangla digits
 * @returns String with English numerals
 */
export const convertFromBanglaNumerals = (str: string): string => {
  const banglaToEnglish: Record<string, string> = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => banglaToEnglish[d] ?? d);
};

/**
 * Validate if input is a valid number (supports both English and Bangla numerals)
 * @param value - Input value to validate
 * @returns Boolean indicating if value is valid
 */
export const isValidNumberInput = (
  value: string,
  isBangla: boolean = false
): boolean => {
  if (value === "") return true;
  if (isBangla) {
    return /^[০-৯\d]*\.?[০-৯\d]*$/.test(value);
  }
  return /^\d*\.?\d*$/.test(value);
};

/**
 * Format number with proper precision
 * @param num - Number to format
 * @param decimals - Number of decimal places
 * @returns Formatted number as string
 */
export const formatNumber = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals);
};

/**
 * Calculate price from quantity
 * @param quantity - Quantity value
 * @param pricePerUnit - Price per unit
 * @returns Calculated price
 */
export const calculatePrice = (
  quantity: number,
  pricePerUnit: number
): string => {
  if (!isFinite(pricePerUnit) || pricePerUnit === 0) return "";
  return formatNumber(quantity * pricePerUnit);
};

/**
 * Calculate quantity from price
 * @param price - Price value
 * @param pricePerUnit - Price per unit
 * @returns Calculated quantity
 */
export const calculateQuantity = (
  price: number,
  pricePerUnit: number
): string => {
  if (!isFinite(pricePerUnit) || pricePerUnit === 0) return "";
  return formatNumber(price / pricePerUnit, 4);
};

/**
 * Format number with Bangla numerals and locale formatting
 * @param num - Number to format
 * @returns Formatted string with Bangla numerals
 */
export const formatBanglaNumber = (num: number): string => {
  return convertToBanglaNumerals(num.toLocaleString("en-US"));
};

/**
 * Format currency value based on language
 * @param value - Number to format
 * @param lang - Language code ('en' or 'bn')
 * @param decimals - Number of decimal places (optional)
 * @returns Formatted currency string
 */
export const formatCurrency = (
  value: number,
  lang: "en" | "bn",
  decimals: number = 2
): string => {
  if (lang === "bn") {
    return formatBanglaNumber(value);
  }
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};
