import {
  TIME_RANGES,
  TIME_RANGE_LABELS,
  type TimeRange,
} from "../../utils/constant";

interface ChartRangeTabsProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  lang: "en" | "bn";
}

/**
 * Component for selecting chart time range (Yearly, 6 Years, 10 Years)
 */
export const ChartRangeTabs = ({
  selectedRange,
  onRangeChange,
  lang,
}: ChartRangeTabsProps) => {
  return (
    <div className="flex gap-2 md:gap-3 lg:gap-4">
      {TIME_RANGES.map((range) => (
        <button
          key={range}
          onClick={() => onRangeChange(range)}
          className={`px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 text-xs md:text-sm font-medium transition-colors rounded-full ${
            selectedRange === range
              ? "text-blue-600 bg-blue-50"
              : "text-white hover:text-gray-300"
          }`}
        >
          {TIME_RANGE_LABELS[range][lang]}
        </button>
      ))}
    </div>
  );
};
