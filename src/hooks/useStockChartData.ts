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
  result: Papa.ParseResult<unknown>
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
  lang: "en" | "bn"
): UseStockChartDataReturn => {
  const currentYear = new Date().getFullYear();

  const [selectedRange, setSelectedRange] = useState<TimeRange>("Yearly");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<GoldPriceData>(
    CHART_FALLBACK_DATA as GoldPriceData
  );

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
          SPREADSHEET_CONFIG.yearlySheetGID
        );
        const sixYearDataUrl = buildSpreadsheetUrl(
          SPREADSHEET_CONFIG.sixYearSheetGID
        );
        const tenYearDataUrl = buildSpreadsheetUrl(
          SPREADSHEET_CONFIG.tenYearSheetGID
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

                // Parse ten-year data
                Papa.parse(tenYearCSV, {
                  header: false,
                  complete: (tenYearResult) => {
                    newData.tenYearData = parseMultiYearData(tenYearResult);

                    // Save to cache and update state
                    localStorage.setItem(
                      CHART_CACHE_KEY,
                      JSON.stringify(newData)
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
        case "Yearly": {
          const yearData = data.yearlyData[year] || [];
          yearData.forEach((price, index) => {
            if (price > 0) {
              result.push({
                date: MONTH_NAMES[index],
                price: price,
              });
            }
          });
          break;
        }
        case "6Years": {
          data.sixYearData.forEach((item) => {
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
    [lang]
  );

  /**
   * Update stock data when selection changes
   */
  useEffect(() => {
    if (!chartData) return;

    const transformedData = transformDataForRange(
      selectedRange,
      selectedYear,
      chartData
    );
    setStockData(transformedData);
  }, [selectedRange, selectedYear, chartData, transformDataForRange]);

  /**
   * Handle range change with year reset
   */
  const handleRangeChange = useCallback(
    (range: TimeRange) => {
      setSelectedRange(range);
      if (range !== "Yearly") {
        setSelectedYear(currentYear.toString());
      }
    },
    [currentYear]
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
