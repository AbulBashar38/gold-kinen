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

type TimeRange = "5D" | "1M" | "6M" | "YTD" | "12M" | "5Y";

interface StockData {
  date: string;
  price: number;
}

const generateStockData = (range: TimeRange): StockData[] => {
  const data: StockData[] = [];
  const now = new Date();
  let basePrice = 3186.63;

  switch (range) {
    case "5D": {
      for (let i = 0; i < 5; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - (4 - i));

        const volatility = 0.02;
        const trend = 0.0005;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date: d.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
    case "1M": {
      for (let i = 0; i < 30; i++) {
        const d = new Date(now);
        d.setDate(d.getDate() - (29 - i));

        const volatility = 0.015;
        const trend = 0.0003;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date:
            i % 5 === 0
              ? d.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })
              : "",
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
    case "6M": {
      const months: string[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        months.push(
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );
      }

      for (let i = 0; i < 180; i++) {
        const monthIndex = Math.floor(i / 30);

        const volatility = 0.015;
        const trend = 0.0003;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date: i % 30 === 0 ? months[monthIndex] : "",
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
    case "YTD": {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      const daysSinceStart = Math.floor(
        (now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24)
      );

      const months: string[] = [];
      for (let i = 0; i <= now.getMonth(); i++) {
        const d = new Date(now.getFullYear(), i, 1);
        months.push(
          d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
        );
      }

      const pointsPerMonth = Math.floor(daysSinceStart / (now.getMonth() + 1));
      for (let i = 0; i < daysSinceStart; i++) {
        const monthIndex = Math.floor(i / (pointsPerMonth || 1));

        const volatility = 0.015;
        const trend = 0.0003;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date:
            i % (pointsPerMonth || 1) === 0 && monthIndex < months.length
              ? months[monthIndex]
              : "",
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
    case "12M": {
      const months: string[] = [];
      for (let i = 11; i >= 0; i--) {
        const d = new Date(now);
        d.setMonth(d.getMonth() - i);
        months.push(d.toLocaleDateString("en-US", { month: "short" }));
      }

      for (let i = 0; i < 360; i++) {
        const monthIndex = Math.floor(i / 30);

        const volatility = 0.015;
        const trend = 0.0003;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date: i % 30 === 0 ? months[monthIndex] : "",
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
    case "5Y": {
      const years: string[] = [];
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        years.push(year.toString());
      }

      for (let i = 0; i < 1825; i++) {
        const yearIndex = Math.floor(i / 365);

        const volatility = 0.015;
        const trend = 0.0003;
        const randomChange = (Math.random() - 0.5) * volatility;
        basePrice = basePrice * (1 + trend + randomChange);

        data.push({
          date: i % 365 === 0 ? years[yearIndex] : "",
          price: Number(basePrice.toFixed(2)),
        });
      }
      break;
    }
  }

  return data;
};

export default function StockChart() {
  const [selectedRange, setSelectedRange] = useState<TimeRange>("YTD");
  const [stockData, setStockData] = useState<StockData[]>([]);
  const chartRef = useRef<ChartJS<"line">>(null);

  useEffect(() => {
    setStockData(generateStockData(selectedRange));
  }, [selectedRange]);

  const currentPrice = 3372.43;
  const yearChange = 185.8;
  const yearChangePercent = 5.83;

  const ranges: TimeRange[] = ["5D", "1M", "6M", "YTD", "12M", "5Y"];

  const prices = stockData.map((d) => d.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  // const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  const chartData = {
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
          color: "#9ca3af",
          font: {
            size: 13,
          },
          autoSkip: false,
          maxRotation: 0,
          minRotation: 0,
        },
      },
      y: {
        min: Math.floor(minPrice),
        max: Math.ceil(maxPrice),
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

  return (
    <div className="w-full min-h-screen bg-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-6xl font-light text-gray-900 mb-3">
              {currentPrice.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="text-3xl text-gray-400 ml-2">USD</span>
            </h1>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl text-green-600 font-normal">
                +{yearChange.toFixed(2)} ({yearChangePercent}%)
              </span>
              <TrendingUp className="text-green-600" size={20} />
              <span className="text-gray-500">year to date</span>
            </div>
            <p className="text-gray-400 text-sm">
              Closed: 30 Oct, 5:59 am GMT+6
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
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <div className="relative">
          <div className="absolute right-8 top-2 text-xs text-gray-400">
            {maxPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </div>
          <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-400">
            AVG
          </div>
          <div className="absolute right-8 bottom-12 text-xs text-gray-400">
            {minPrice.toLocaleString("en-US", { maximumFractionDigits: 1 })}
          </div>

          <div className="h-[500px]">
            <Line ref={chartRef} data={chartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
}
