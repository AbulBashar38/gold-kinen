import { PRICE_RECOMMENDATIONS } from "../utils/constant";

interface RecommendationButtonsProps {
  price: string;
  onPriceSelect: (price: string) => void;
  lang: "en" | "bn";
}

export const RecommendationButtons = ({
  price,
  onPriceSelect,
  lang,
}: RecommendationButtonsProps) => {
  const priceList = PRICE_RECOMMENDATIONS[lang];

  const handleClick = (value: number) => {
    onPriceSelect(value.toString());
  };

  return (
    <div className="mb-6 sm:mb-14">
      <label className="block text-xs sm:text-xl font-medium text-white mb-2 sm:mb-3">
        {lang === "bn" ? "প্রস্তাবিত মান" : "Recommendation"}
      </label>
      <div className="grid grid-cols-4 gap-2">
        {priceList.map((item) => (
          <button
            key={item.value}
            onClick={() => handleClick(item.value)}
            className={`px-2 py-1.5 md:px-3 md:py-2 text-xs sm:text-lg font-medium transition-colors rounded-full ${
              price === item.value.toString()
                ? "text-blue-600 bg-blue-50"
                : "text-white bg-blue-400 bg-opacity-30 hover:bg-opacity-50"
            }`}
          >
            ৳{item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
