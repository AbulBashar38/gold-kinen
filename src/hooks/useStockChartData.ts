import Papa from "papaparse";
import { useCallback, useEffect, useState } from "react";
import {
  CHART_CACHE_DURATION,
  CHART_CACHE_KEY,
  CHART_FALLBACK_DATA,
  MONTH_NAMES,
  MONTH_NAMES_FULL,
  SPREADSHEET_CONFIG,
  type TimeRange,
} from "../utils/constant";
import { convertToBanglaNumerals } from "../utils/utils";

interface StockData {
  date: string;
  price: number;
}

interface GoldPriceData {
  yearlyData: { [key: string]: number[] };
  threeYearData: { year: string; price: number }[];
  fiveYearData: { year: string; price: number }[];
  sixYearData: { year: string; price: number }[];
  tenYearData: { year: string; price: number }[];
  timestamp?: number;
}

/**
 * Check localStorage cache for gold price data
 */
const checkCache = (): GoldPriceData | null => {
  const cached = localStorage.getItem(CHART_CACHE_KEY);
  if (!cached) return null;

  const parsedCache = JSON.parse(cached);
  const now = Date.now();

  if (now - parsedCache.timestamp < CHART_CACHE_DURATION) {
    return parsedCache;
  }

  localStorage.removeItem(CHART_CACHE_KEY);
  return null;
};

/**
 * Parse yearly data from CSV result
 */
const parseYearlyData = (yearlyResult: Papa.ParseResult<string[]>) => {
  const yearlyData: { [key: string]: number[] } = {};
  let currentYear = "";

  yearlyResult.data.forEach((row: string[]) => {
    if (row[0].match(/^20\d{2}$/)) {
      currentYear = row[0];
      if (!yearlyData[currentYear]) {
        yearlyData[currentYear] = Array(12).fill(0);
      }
    } else if (row[0].match(new RegExp(`^(${MONTH_NAMES_FULL.join("|")})$`))) {
      const monthIndex = MONTH_NAMES_FULL.indexOf(row[0]);

      if (monthIndex !== -1 && currentYear && row[1]) {
        const price = parseFloat(row[1].replace(/[\s,]/g, ""));
        yearlyData[currentYear][monthIndex] = price;
      }
    }
  });
  return yearlyData;
};

/**
 * Parse multi-year data from CSV result
 */
const parseMultiYearData = (
  result: Papa.ParseResult<unknown>,
): { year: string; price: number }[] => {
  return result.data
    .filter((value: unknown) => (value as string[])[0]?.match(/^20\d{2}$/))
    .map((value: unknown) => {
      const row = value as string[];
      return {
        year: row[0],
        price: parseFloat(row[1]?.replace(/[\s,]/g, "") || "0"),
      };
    });
};

/**
 * Build Google Sheets CSV URL
 */
const buildSpreadsheetUrl = (gid: string): string => {
  return `https://docs.google.com/spreadsheets/d/${SPREADSHEET_CONFIG.id}/gviz/tq?tqx=out:csv&gid=${gid}#gid=${gid}`;
};

interface UseStockChartDataReturn {
  stockData: StockData[];
  loading: boolean;
  selectedRange: TimeRange;
  setSelectedRange: (range: TimeRange) => void;
  selectedYear: string;
  setSelectedYear: (year: string) => void;
  availableYears: string[];
}

/**
 * Custom hook for stock chart data fetching and management
 */
export const useStockChartData = (
  lang: "en" | "bn",
): UseStockChartDataReturn => {
  const currentYear = new Date().getFullYear();

  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Year");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString(),
  );
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<GoldPriceData>(
    CHART_FALLBACK_DATA as GoldPriceData,
  );
  console.log({ stockData });

  // Available years for yearly tab
  const availableYears = [
    (currentYear - 2).toString(),
    (currentYear - 1).toString(),
    currentYear.toString(),
  ];

  /**
   * Fetch gold price data from Google Sheets
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Check cache first
        const cachedData = checkCache();
        if (cachedData) {
          setChartData(cachedData);
          setLoading(false);
          return;
        }

        const yearlyDataUrl = buildSpreadsheetUrl(
          SPREADSHEET_CONFIG.yearlySheetGID,
        );
        const sixYearDataUrl = buildSpreadsheetUrl(
          SPREADSHEET_CONFIG.sixYearSheetGID,
        );
        const tenYearDataUrl = buildSpreadsheetUrl(
          SPREADSHEET_CONFIG.tenYearSheetGID,
        );

        const [yearlyResponse, sixYearResponse, tenYearResponse] =
          await Promise.all([
            fetch(yearlyDataUrl),
            fetch(sixYearDataUrl),
            fetch(tenYearDataUrl),
          ]);

        if (!yearlyResponse.ok || !sixYearResponse.ok || !tenYearResponse.ok) {
          throw new Error("Failed to fetch data from spreadsheet");
        }

        const [yearlyCSV, sixYearCSV, tenYearCSV] = await Promise.all([
          yearlyResponse.text(),
          sixYearResponse.text(),
          tenYearResponse.text(),
        ]);

        const newData: GoldPriceData = {
          yearlyData: {},
          threeYearData: [],
          fiveYearData: [],
          sixYearData: [],
          tenYearData: [],
          timestamp: Date.now(),
        };

        // Parse yearly data
        Papa.parse(yearlyCSV, {
          header: false,
          complete: (yearlyResult: Papa.ParseResult<string[]>) => {
            newData.yearlyData = parseYearlyData(yearlyResult);

            // Parse six-year data
            Papa.parse(sixYearCSV, {
              header: false,
              complete: (sixYearResult) => {
                newData.sixYearData = parseMultiYearData(sixYearResult);
                // Derive three-year and five-year data from six-year data
                newData.threeYearData = newData.sixYearData.slice(-3);
                newData.fiveYearData = newData.sixYearData.slice(-5);

                // Parse ten-year data
                Papa.parse(tenYearCSV, {
                  header: false,
                  complete: (tenYearResult) => {
                    newData.tenYearData = parseMultiYearData(tenYearResult);

                    // Save to cache and update state
                    localStorage.setItem(
                      CHART_CACHE_KEY,
                      JSON.stringify(newData),
                    );
                    setChartData(newData);
                    setLoading(false);
                  },
                });
              },
            });
          },
        });
      } catch (e) {
        console.error("Error fetching data:", e);
        setChartData(CHART_FALLBACK_DATA as GoldPriceData);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  /**
   * Transform data based on selected range and year
   */
  const transformDataForRange = useCallback(
    (range: TimeRange, year: string, data: GoldPriceData): StockData[] => {
      const result: StockData[] = [];

      switch (range) {
        case "1Year": {
          // Collect all monthly data across years
          const allMonthlyData: { date: Date; price: number; label: string }[] =
            [];

          for (const [year, prices] of Object.entries(data.yearlyData)) {
            prices.forEach((price, index) => {
              if (price > 0) {
                const date = new Date(parseInt(year), index, 1);
                const yearLabel =
                  lang === "bn" ? convertToBanglaNumerals(year) : year;
                allMonthlyData.push({
                  date,
                  price,
                  label: `${MONTH_NAMES[index]} ${yearLabel}`,
                });
              }
            });
          }

          // Sort by date descending (most recent first), take last 12 months, then reverse for chronological order
          allMonthlyData.sort((a, b) => b.date.getTime() - a.date.getTime());
          const last12 = allMonthlyData.slice(0, 12).reverse();

          result.push(
            ...last12.map((item) => ({
              date: item.label,
              price: item.price,
            })),
          );
          break;
        }
        case "3Years": {
          data.threeYearData.forEach((item) => {
            result.push({
              date:
                lang === "bn" ? convertToBanglaNumerals(item.year) : item.year,
              price: item.price,
            });
          });
          break;
        }
        case "5Years": {
          data.fiveYearData.forEach((item) => {
            result.push({
              date:
                lang === "bn" ? convertToBanglaNumerals(item.year) : item.year,
              price: item.price,
            });
          });
          break;
        }
        case "10Years": {
          data.tenYearData.forEach((item) => {
            result.push({
              date:
                lang === "bn" ? convertToBanglaNumerals(item.year) : item.year,
              price: item.price,
            });
          });
          break;
        }
      }

      return result;
    },
    [lang],
  );

  /**
   * Update stock data when selection changes
   */
  useEffect(() => {
    if (!chartData) return;

    const transformedData = transformDataForRange(
      selectedRange,
      selectedYear,
      chartData,
    );
    setStockData(transformedData);
  }, [selectedRange, selectedYear, chartData, transformDataForRange]);

  /**
   * Handle range change with year reset
   */
  const handleRangeChange = useCallback(
    (range: TimeRange) => {
      setSelectedRange(range);
      if (range !== "1Year") {
        setSelectedYear(currentYear.toString());
      }
    },
    [currentYear],
  );

  return {
    stockData,
    loading,
    selectedRange,
    setSelectedRange: handleRangeChange,
    selectedYear,
    setSelectedYear,
    availableYears,
  };
};
