import {
  CategoryScale,
  Chart as ChartJS,
  ChartOptions,
  Filler,
  LinearScale,
  LineElement,
  PointElement,
  ScriptableContext,
  Tooltip,
} from "chart.js";
import { TrendingUp } from "lucide-react";
import Papa from "papaparse";
import { useEffect, useRef, useState } from "react";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

type TimeRange = "1M" | "6M" | "YTD" | "1Y" | "5Y" | "10Y";

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

// Fallback data
const FALLBACK_DATA: GoldPriceData = {
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

const CACHE_KEY = "goldPriceData";
const CACHE_DURATION = 60 * 1000; // 1 minute in milliseconds

const SPREADSHEET_ID = "17l7gUNr1QBWjNxufOTS5A9zDOCw1qQb_s6BWiaieV5E";
const YearlySheetGID = "134202101";
const SixYearSheetGID = "1063350062";
const TenYearSheetGID = "653645493";

export default function StockChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("YTD");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<GoldPriceData>(FALLBACK_DATA);
  const chartRef = useRef<ChartJS<"line">>(null);

  const checkCache = (): GoldPriceData | null => {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const parsedCache = JSON.parse(cached);
    const now = Date.now();

    if (now - parsedCache.timestamp < CACHE_DURATION) {
      return parsedCache;
    }

    localStorage.removeItem(CACHE_KEY);
    return null;
  };

  const parseYearlyData = (yearlyResult: Papa.ParseResult<string[]>) => {
    const yearlyData: { [key: string]: number[] } = {};
    let currentYear = "";

    yearlyResult.data.forEach((row: string[]) => {
      if (row[0].match(/^20\d{2}$/)) {
        currentYear = row[0];
        if (!yearlyData[currentYear]) {
          yearlyData[currentYear] = Array(12).fill(0);
        }
      } else if (
        row[0].match(
          /^(January|February|March|April|May|June|July|August|September|October|November|December)$/
        )
      ) {
        const monthIndex = [
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
        ].indexOf(row[0]);

        if (monthIndex !== -1 && currentYear && row[1]) {
          const price = parseFloat(row[1].replace(/[\s,]/g, ""));
          yearlyData[currentYear][monthIndex] = price;
        }
      }
    });
    return yearlyData;
  };

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

        const yearlyDataUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${YearlySheetGID}#gid=${YearlySheetGID}`;
        const sixYearDataUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${SixYearSheetGID}#gid=${SixYearSheetGID}`;
        const tenYearDataUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&gid=${TenYearSheetGID}#gid=${TenYearSheetGID}`;

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
          complete: (yearlyResult) => {
            newData.yearlyData = parseYearlyData(yearlyResult);

            // Parse six-year data
            Papa.parse(sixYearCSV, {
              header: false,
              complete: (sixYearResult) => {
                const sixYearData = sixYearResult.data
                  .filter((value: unknown) =>
                    (value as string[])[0]?.match(/^20\d{2}$/)
                  )
                  .map((value: unknown) => {
                    const row = value as string[];
                    return {
                      year: row[0],
                      price: parseFloat(row[1]?.replace(/[\s,]/g, "") || "0"),
                    };
                  });
                newData.sixYearData = sixYearData;

                // Parse ten-year data
                Papa.parse(tenYearCSV, {
                  header: false,
                  complete: (tenYearResult) => {
                    const tenYearData = tenYearResult.data
                      .filter((value: unknown) =>
                        (value as string[])[0]?.match(/^20\d{2}$/)
                      )
                      .map((value: unknown) => {
                        const row = value as string[];
                        return {
                          year: row[0],
                          price: parseFloat(
                            row[1]?.replace(/[\s,]/g, "") || "0"
                          ),
                        };
                      });
                    newData.tenYearData = tenYearData;

                    // Save to cache and update state
                    localStorage.setItem(CACHE_KEY, JSON.stringify(newData));
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
        setChartData(FALLBACK_DATA);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!chartData) return;

    const transformedData = transformDataForRange(selectedRange, chartData);
    setStockData(transformedData);
  }, [selectedRange, chartData]);

  const transformDataForRange = (
    range: TimeRange,
    data: GoldPriceData
  ): StockData[] => {
    const result: StockData[] = [];
    const now = new Date();
    const currentYear = now.getFullYear();

    switch (range) {
      case "1M": {
        // Get last month's data from current year
        const currentMonth = now.getMonth();
        const yearData = data.yearlyData[currentYear.toString()] || [];
        const monthNames = [
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

        if (yearData[currentMonth]) {
          result.push({
            date: monthNames[currentMonth],
            price: yearData[currentMonth],
          });
        }
        break;
      }
      case "6M": {
        // Get last 6 months
        const monthNames = [
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
        const currentMonth = now.getMonth();
        const yearData = data.yearlyData[currentYear.toString()] || [];

        for (let i = 5; i >= 0; i--) {
          const monthIndex = currentMonth - i;
          if (monthIndex >= 0 && yearData[monthIndex]) {
            result.push({
              date: monthNames[monthIndex],
              price: yearData[monthIndex],
            });
          }
        }
        break;
      }
      case "YTD": {
        // Year to date
        const monthNames = [
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
        const currentMonth = now.getMonth();
        const yearData = data.yearlyData[currentYear.toString()] || [];

        for (let i = 0; i <= currentMonth; i++) {
          if (yearData[i]) {
            result.push({
              date: monthNames[i],
              price: yearData[i],
            });
          }
        }
        break;
      }
      case "1Y": {
        // Full current year
        const monthNames = [
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
        const yearData = data.yearlyData[currentYear.toString()] || [];

        yearData.forEach((price, index) => {
          if (price > 0) {
            result.push({
              date: monthNames[index],
              price: price,
            });
          }
        });
        break;
      }
      case "5Y": {
        // Last 5 years
        data.sixYearData.slice(-5).forEach((item) => {
          result.push({
            date: item.year,
            price: item.price,
          });
        });
        break;
      }
      case "10Y": {
        // Last 10 years
        data.tenYearData.forEach((item) => {
          result.push({
            date: item.year,
            price: item.price,
          });
        });
        break;
      }
    }

    return result;
  };

  const currentPrice =
    stockData.length > 0 ? stockData[stockData.length - 1].price : 0;
  const firstPrice = stockData.length > 0 ? stockData[0].price : 0;
  const yearChange = currentPrice - firstPrice;
  const yearChangePercent =
    firstPrice > 0 ? (yearChange / firstPrice) * 100 : 0;

  const ranges: TimeRange[] = ["1M", "6M", "YTD", "1Y", "5Y", "10Y"];

  const prices = stockData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const chartDataConfig = {
    labels: stockData.map((d) => d.date),
    datasets: [
      {
        data: prices,
        borderColor: "#D7A836",
        backgroundColor: (context: ScriptableContext<"line">) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 400, 0, 0);
          gradient.addColorStop(0, "rgba(255, 230, 170, 0)");
          gradient.addColorStop(1, "rgba(215, 168, 54, 0.3)");
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 0,
      },
    ],
  };

  const options: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: "index",
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
        ticks: {
          color: "#D1E1FF",
          font: {
            size: 13,
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        min: Math.floor(minPrice * 0.95),
        max: Math.ceil(maxPrice * 1.05),
        grid: {
          color: "#e5e7eb",
          lineWidth: 1,
          drawTicks: false,
        },
        border: {
          display: false,
          dash: [3, 3],
        },
        ticks: {
          display: false,
        },
      },
    },
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-transparent p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-transparent p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-6xl font-light text-white mb-3">
              {currentPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-3xl text-white ml-2">BDT</span>
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span
                className={`text-xl font-normal ${
                  yearChange >= 0 ? "text-green-600" : "text-red-600"
                }`}
              >
                {yearChange >= 0 ? "+" : ""}
                {yearChange.toFixed(2)} ({yearChangePercent.toFixed(2)}%)
              </span>
              <TrendingUp
                className={yearChange >= 0 ? "text-green-600" : "text-red-600"}
                size={20}
              />
              <span className="text-white">
                {selectedRange === "YTD" ? "year to date" : selectedRange}
              </span>
            </div>
            <p className="text-white text-sm">
              Closed:{" "}
              {new Date().toLocaleDateString("en-US", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-4 mb-6">
          {ranges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                selectedRange === range
                  ? "text-blue-600 bg-blue-50 rounded-md"
                  : "text-white hover:text-gray-300"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute right-8 top-2 text-xs text-white">
            {maxPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-white">
            AVG
          </div>
          <div
            className="absolute right-8 bottom-12 text-xs text-gray-400"
            style={{ color: "#D1E1FF" }}
          >
            {minPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </div>

          <div className="h-[500px]">
            <Line ref={chartRef} data={chartDataConfig} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
