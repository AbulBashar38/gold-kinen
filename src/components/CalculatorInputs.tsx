import {
  convertFromBanglaNumerals,
  convertToBanglaNumerals,
  isValidNumberInput,
} from "../utils/utils";

interface CalculatorInputsProps {
  quantity: string;
  price: string;
  activeTab: "gram" | "bhori";
  onQuantityChange: (value: string) => void;
  onPriceChange: (value: string) => void;
  lang: "en" | "bn";
}

export const CalculatorInputs = ({
  quantity,
  price,
  activeTab,
  onQuantityChange,
  onPriceChange,
  lang,
}: CalculatorInputsProps) => {
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNumberInput(value, lang === "bn")) {
      const cleanValue =
        lang === "bn" ? convertFromBanglaNumerals(value) : value;
      onQuantityChange(cleanValue);
    }
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (isValidNumberInput(value, lang === "bn")) {
      const cleanValue =
        lang === "bn" ? convertFromBanglaNumerals(value) : value;
      onPriceChange(cleanValue);
    }
  };

  const displayQuantity =
    lang === "bn" ? convertToBanglaNumerals(quantity) : quantity;
  const displayPrice = lang === "bn" ? convertToBanglaNumerals(price) : price;

  const quantityLabel =
    lang === "bn"
      ? `পরিমাণ ${activeTab === "bhori" ? "(ভরি)" : "(গ্রাম)"}`
      : `Quantity ${activeTab === "bhori" ? "(Bhori)" : "(Grams)"}`;

  const quantityPlaceholder =
    lang === "bn"
      ? activeTab === "bhori"
        ? "ভরি লিখুন"
        : "গ্রাম লিখুন"
      : `Enter ${activeTab === "bhori" ? "Bhori" : "Grams"}`;

  return (
    <div className="flex flex-col gap-3 sm:gap-8 mb-4">
      <div className="flex-1 w-full">
        <label className="block text-xs sm:text-xl font-medium text-white mb-1 sm:mb-2">
          {quantityLabel}
        </label>
        <input
          type="text"
          value={displayQuantity}
          onChange={handleQuantityChange}
          className="w-full px-2 sm:px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
          placeholder={quantityPlaceholder}
        />
      </div>

      <div className="flex-1 w-full">
        <label className="block text-xs sm:text-xl font-medium text-white mb-1 sm:mb-2">
          {lang === "bn" ? "মূল্য (৳)" : "Price (BDT)"}
        </label>
        <input
          type="text"
          value={displayPrice}
          onChange={handlePriceChange}
          className="w-full px-2 sm:px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
          placeholder={lang === "bn" ? "মূল্য লিখুন" : "Enter value"}
        />
      </div>

      <p className="text-white text-xs sm:text-xl font-medium flex-1">
        {lang === "bn"
          ? "*মূল্যে ভ্যাট অন্তর্ভুক্ত নয়"
          : "*Price is exclusive of VAT"}
      </p>
    </div>
  );
};
