import { UnitType } from "../utils/constant";

interface CalculatorTabsProps {
  activeTab: UnitType;
  onTabChange: (tab: UnitType) => void;
  lang: "en" | "bn";
}

export const CalculatorTabs = ({
  activeTab,
  onTabChange,
  lang,
}: CalculatorTabsProps) => {
  const tabs = [
    {
      id: "gram" as const,
      labelEn: "Gram",
      labelBn: "গ্রাম",
    },
    {
      id: "bhori" as const,
      labelEn: "Bhori",
      labelBn: "ভরি",
    },
  ];

  return (
    <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-3">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={`px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 text-xs md:text-sm font-medium transition-colors rounded-full ${
            activeTab === tab.id
              ? "text-blue-600 bg-blue-50"
              : "text-white hover:text-gray-300"
          }`}
        >
          {lang === "bn" ? tab.labelBn : tab.labelEn}
        </button>
      ))}
    </div>
  );
};
