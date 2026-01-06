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
import { useRef } from "react";
import { Line } from "react-chartjs-2";
import { ChartLoading, ChartRangeTabs, ChartYearSelector } from "./chart";
import { useStockChartData } from "../hooks/useStockChartData";
import { formatBanglaNumber } from "../utils/utils";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip
);

interface StockChartProps {
  lang: "en" | "bn";
}

/**
 * Build chart data configuration
 */
const buildChartDataConfig = (prices: number[], labels: string[]) => ({
  labels,
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
});

/**
 * Build chart options configuration
 */
const buildChartOptions = (
  minPrice: number,
  maxPrice: number,
  lang: "en" | "bn"
): ChartOptions<"line"> => ({
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
      enabled: true,
      backgroundColor: "rgba(255, 255, 255, 0.95)",
      titleColor: "#1f2937",
      bodyColor: "#1f2937",
      borderColor: "#D7A836",
      borderWidth: 1,
      padding: 12,
      displayColors: false,
      callbacks: {
        title: (context) => context[0].label,
        label: (context) => {
          const value = context.parsed.y;
          return lang === "bn"
            ? `৳ ${formatBanglaNumber(value)}`
            : `৳ ${value.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`;
        },
      },
    },
  },
  scales: {
    x: {
      grid: { display: false },
      border: { display: false },
      ticks: {
        color: "#D1E1FF",
        font: { size: 14 },
        autoSkip: true,
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
        display: true,
        color: "#D1E1FF",
        font: { size: 14 },
        maxTicksLimit: window.innerWidth < 640 ? 4 : 5,
        callback: (value) => {
          return lang === "bn"
            ? `৳ ${formatBanglaNumber(value as number)}`
            : `৳ ${(value as number).toLocaleString()}`;
        },
      },
    },
  },
});

export default function StockChart({ lang }: StockChartProps) {
  // Set to true for transparent background, false for gradient background
  const transparent = true;

  const chartRef = useRef<ChartJS<"line">>(null);

  const {
    stockData,
    loading,
    selectedRange,
    setSelectedRange,
    selectedYear,
    setSelectedYear,
    availableYears,
  } = useStockChartData(lang);

  if (loading) {
    return <ChartLoading transparent={transparent} />;
  }

  const prices = stockData.map((d) => d.price);
  const labels = stockData.map((d) => d.date);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const chartDataConfig = buildChartDataConfig(prices, labels);
  const options = buildChartOptions(minPrice, maxPrice, lang);

  const containerClass = `box-border w-full h-full ${
    lang === "bn" ? "font-hind" : ""
  } ${
    transparent
      ? "bg-transparent"
      : "bg-gradient-to-br from-[#4786FF] to-[#2B5099]"
  }`;

  return (
    <div className={containerClass}>
      <div className="w-full h-full">
        <div className="flex flex-col items-center gap-2 mb-2 md:mb-3">
          <ChartRangeTabs
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
            lang={lang}
          />

          {selectedRange === "Yearly" && (
            <ChartYearSelector
              selectedYear={selectedYear}
              availableYears={availableYears}
              onYearChange={setSelectedYear}
              lang={lang}
            />
          )}
        </div>

        <div className="w-full aspect-[3/2]">
          <Line ref={chartRef} data={chartDataConfig} options={options} />
        </div>
      </div>
    </div>
  );
}
