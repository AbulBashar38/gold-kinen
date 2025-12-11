import { convertToBanglaNumerals } from "../utils/utils";

interface PriceDisplayProps {
  pricePerGram: number;
  pricePerBhori: number;
  activeTab: "gram" | "bhori";
  lang: "en" | "bn";
}

export const PriceDisplay = ({
  pricePerGram,
  pricePerBhori,
  activeTab,
  lang,
}: PriceDisplayProps) => {
  const currentPrice = activeTab === "bhori" ? pricePerBhori : pricePerGram;
  const formattedPrice = currentPrice.toFixed(2);
  const displayPrice =
    lang === "bn" ? convertToBanglaNumerals(formattedPrice) : formattedPrice;
  const unit =
    activeTab === "bhori"
      ? lang === "bn"
        ? "/ভরি"
        : "/Bhori"
      : lang === "bn"
      ? "/গ্রাম"
      : "/Gram";
  const currency = lang === "bn" ? "টাকা" : "BDT";

  return (
    <div className="text-center mb-6 sm:mb-8">
      <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 sm:mb-2 break-words">
        {currency} {displayPrice}
        {unit}
      </p>
      <p className="text-xs sm:text-lg text-gray-300">
        {lang === "bn" ? "আজকের 22k মার্কেট প্রাইস" : "22k Market price today"}
      </p>
    </div>
  );
};
