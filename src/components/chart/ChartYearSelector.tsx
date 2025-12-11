import { convertToBanglaNumerals } from "../../utils/utils";

interface ChartYearSelectorProps {
  selectedYear: string;
  availableYears: string[];
  onYearChange: (year: string) => void;
  lang: "en" | "bn";
}

/**
 * Component for selecting specific year in yearly chart view
 */
export const ChartYearSelector = ({
  selectedYear,
  availableYears,
  onYearChange,
  lang,
}: ChartYearSelectorProps) => {
  return (
    <div className="flex gap-2 md:gap-3 mt-2">
      {availableYears.map((year) => (
        <button
          key={year}
          onClick={() => onYearChange(year)}
          className={`px-2 py-1 md:px-3 md:py-1.5 text-xs md:text-sm font-medium transition-colors rounded-full ${
            selectedYear === year
              ? "bg-white text-blue-600"
              : "bg-blue-400 bg-opacity-30 text-white hover:bg-opacity-50"
          }`}
        >
          {lang === "bn" ? convertToBanglaNumerals(year) : year}
        </button>
      ))}
    </div>
  );
};
