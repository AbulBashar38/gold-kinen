// Gold calculator constants
export const GRAMS_PER_BHORI = 11.66;

// API endpoints (from environment variables)
export const MARKET_PRICE_API = import.meta.env.VITE_MARKET_PRICE_API || "";

// Default recommendation price amounts (in BDT)
export const PRICE_RECOMMENDATIONS: {
  en: { value: number; label: string }[];
  bn: { value: number; label: string }[];
} = {
  en: [
    { value: 500, label: "500" },
    { value: 1000, label: "1000" },
    { value: 5000, label: "5000" },
    { value: 6000, label: "6000" },
  ],
  bn: [
    { value: 500, label: "৫০০" },
    { value: 1000, label: "১০০০" },
    { value: 5000, label: "৫০০০" },
    { value: 6000, label: "৬০০০" },
  ],
};

// Unit types
export const UNIT_TYPES = {
  GRAM: "gram",
  BHORI: "bhori",
} as const;

export type UnitType = (typeof UNIT_TYPES)[keyof typeof UNIT_TYPES];

// Chart constants
export const CHART_CACHE_KEY = "goldPriceData";
export const CHART_CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

// Google Spreadsheet configuration (from environment variables)
export const SPREADSHEET_CONFIG = {
  id: import.meta.env.VITE_SPREADSHEET_ID || "",
  yearlySheetGID: import.meta.env.VITE_YEARLY_SHEET_GID || "",
  sixYearSheetGID: import.meta.env.VITE_SIX_YEAR_SHEET_GID || "",
  tenYearSheetGID: import.meta.env.VITE_TEN_YEAR_SHEET_GID || "",
};

export type TimeRange = "Yearly" | "6Years" | "10Years";

export const TIME_RANGES: TimeRange[] = ["Yearly", "6Years", "10Years"];

export const TIME_RANGE_LABELS: Record<TimeRange, { en: string; bn: string }> =
  {
    Yearly: { en: "Yearly", bn: "বার্ষিক" },
    "6Years": { en: "6 Years", bn: "৬ বছর" },
    "10Years": { en: "10 Years", bn: "১০ বছর" },
  };

export const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const MONTH_NAMES_FULL = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Chart fallback data
export const CHART_FALLBACK_DATA = {
  yearlyData: {
    "2025": [142741.72, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "2024": [
      112402.4, 110653.4, 114034.8, 119596.62, 119503.34, 118314.02, 120039.7,
      127898.54, 138660.72, 143476.3, 143476.3, 140537.98,
    ],
    "2023": [
      93428.64, 93428.64, 97627.68, 99144.0, 98410.4, 98410.4, 100742.4,
      101208.8, 101208.8, 102841.2, 109867.2, 111003.2,
    ],
  },
  sixYearData: [
    { year: "2019", price: 59186.16 },
    { year: "2020", price: 76341.0 },
    { year: "2021", price: 74300.0 },
    { year: "2022", price: 91912.0 },
    { year: "2023", price: 111003.2 },
    { year: "2024", price: 143476.3 },
    { year: "2025", price: 142741.72 },
  ],
  tenYearData: [
    { year: "2014", price: 48400.66 },
    { year: "2015", price: 44521.0 },
    { year: "2016", price: 47118.06 },
    { year: "2017", price: 50155.0 },
    { year: "2018", price: 52248.46 },
    { year: "2019", price: 59186.16 },
    { year: "2020", price: 76341.0 },
    { year: "2021", price: 74300.0 },
    { year: "2022", price: 91912.0 },
    { year: "2023", price: 111003.2 },
    { year: "2024", price: 143476.3 },
    { year: "2025", price: 142741.72 },
  ],
};
