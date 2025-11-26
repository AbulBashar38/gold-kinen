import { useEffect, useState } from "react";

// Function to convert English numerals to Bangla numerals
const convertToBanglaNumerals = (str: string) => {
  return str.replace(/\d/g, (d) => "০১২৩৪৫৬৭৮৯"[parseInt(d)]);
};

// Function to convert Bangla numerals to English numerals
const convertFromBanglaNumerals = (str: string) => {
  const banglaToEnglish: { [key: string]: string } = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };
  return str.replace(/[০-৯]/g, (d) => banglaToEnglish[d]);
};

interface OnlyCalculatorProps {
  lang: "en" | "bn";
}

const OnlyCalculator = ({ lang }: OnlyCalculatorProps) => {
  const [activeTab, setActiveTab] = useState<"gram" | "bhori">("gram");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"quantity" | "price">(
    "quantity"
  );

  // API test states
  const [marketPrice, setMarketPrice] = useState<string>("");
  const [mpLoading, setMpLoading] = useState<boolean>(false);

  // grams per vori/bhori conversion (approx)
  const GRAMS_PER_BHORI = 11.66;

  // derive price per gram from market API when available, else fallback
  const marketPriceFloat = marketPrice ? parseFloat(marketPrice) : NaN;
  const pricePerGram = !isNaN(marketPriceFloat) ? marketPriceFloat : 0;
  const pricePerBhori = pricePerGram * GRAMS_PER_BHORI;

  const currentPricePerUnit =
    activeTab === "bhori" ? pricePerBhori : pricePerGram;

  useEffect(() => {
    if (lastChanged === "quantity") {
      if (quantity !== "") {
        const quantityValue = parseFloat(quantity);
        if (!isNaN(quantityValue)) {
          setPrice((quantityValue * currentPricePerUnit).toFixed(2));
        }
      } else {
        setPrice("");
      }
    } else if (lastChanged === "price") {
      if (price !== "") {
        const priceValue = parseFloat(price);
        if (!isNaN(priceValue)) {
          // Avoid division by zero / Infinity when current unit price is 0 or invalid
          if (!isFinite(currentPricePerUnit) || currentPricePerUnit === 0) {
            setQuantity("");
          } else {
            setQuantity((priceValue / currentPricePerUnit).toFixed(4));
          }
        }
      } else {
        setQuantity("");
      }
    }
  }, [quantity, price, lastChanged, currentPricePerUnit]);

  // Fetch market price on mount (GET)
  useEffect(() => {
    const fetchMarketPrice = async () => {
      setMpLoading(true);
      try {
        const res = await fetch("https://goldprice.gktechbd.com/market-price");
        const json = await res.json();
        if (json?.success && json?.data) {
          setMarketPrice(json.data.market_price || "");
        }
      } catch (e) {
        console.error("Failed to fetch market price:", e);
      } finally {
        setMpLoading(false);
      }
    };

    fetchMarketPrice();
  }, []);
  // console.log({ marketPrice });
  const transparent = true;

  const priceList =
    lang === "en"
      ? [500, 1000, 5000, 6000]
      : [
          { value: 500, label: "৫০০" },
          { value: 1000, label: "১০০০" },
          { value: 5000, label: "৫০০০" },
          { value: 6000, label: "৬০০০" },
        ];
  return (
    <main
      className={`w-full h-full bg-transparent p-2 ${
        lang === "bn" ? "font-hind" : ""
      } ${
        transparent
          ? "bg-transparent"
          : "bg-gradient-to-br from-[#4786FF] to-[#2B5099]"
      }`}
    >
      {/* Tabs */}
      <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-3">
        <button
          onClick={() => setActiveTab("gram")}
          className={`px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 text-xs md:text-sm font-medium transition-colors rounded-full ${
            activeTab === "gram"
              ? "text-blue-600 bg-blue-50"
              : "text-white hover:text-gray-300"
          }`}
        >
          {lang === "bn" ? "গ্রাম" : "Gram"}
        </button>
        <button
          onClick={() => setActiveTab("bhori")}
          className={`px-2 py-1.5 md:px-3 md:py-2 lg:px-4 lg:py-2 text-xs md:text-sm font-medium transition-colors rounded-full ${
            activeTab === "bhori"
              ? "text-blue-600 bg-blue-50"
              : "text-white hover:text-gray-300"
          }`}
        >
          {lang === "bn" ? "ভরি" : "Bhori"}
        </button>
      </div>

      {/* Price Display */}
      <div className="text-center mb-6 sm:mb-8">
        <p className="text-xl sm:text-2xl md:text-4xl font-bold text-white mb-1 sm:mb-2 break-words">
          {lang === "bn" ? "টাকা" : "BDT"}{" "}
          {activeTab === "bhori"
            ? lang === "bn"
              ? convertToBanglaNumerals(pricePerBhori.toFixed(2)) + "/ভরি"
              : pricePerBhori.toFixed(2) + "/Bhori"
            : lang === "bn"
            ? convertToBanglaNumerals(pricePerGram.toFixed(2)) + "/গ্রাম"
            : pricePerGram.toFixed(2) + "/Gram"}
        </p>
        <p className="text-xs sm:text-lg text-gray-300">
          {lang === "bn"
            ? "আজকের 22k মার্কেট প্রাইস"
            : "22k Market price today"}
        </p>
      </div>

      {/* Recommendation */}
      <div className="mb-6 sm:mb-14">
        <label className="block text-xs sm:text-xl font-medium text-white mb-2 sm:mb-3">
          {lang === "bn" ? "প্রস্তাবিত মান" : "Recommendation"}
        </label>
        <div className="grid grid-cols-4 gap-2">
          {lang === "en"
            ? priceList.map((amount) => (
                <button
                  key={amount}
                  onClick={() => {
                    setPrice(amount.toString());
                    setLastChanged("price");
                  }}
                  className={`px-2 py-1.5 md:px-3 md:py-2 text-xs sm:text-lg font-medium transition-colors rounded-full ${
                    price === amount.toString()
                      ? "text-blue-600 bg-blue-50"
                      : "text-white bg-blue-400 bg-opacity-30 hover:bg-opacity-50"
                  }`}
                >
                  ৳{amount}
                </button>
              ))
            : priceList.map((item) => (
                <button
                  key={item.value}
                  onClick={() => {
                    setPrice(item.value.toString());
                    setLastChanged("price");
                  }}
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

      {/* Inputs */}
      <div className="flex flex-col  items-end gap-3 sm:gap-8 mb-4  ">
        <div className="flex-1 w-full">
          <label className="block text-xs sm:text-xl font-medium text-white mb-1 sm:mb-2">
            {lang === "bn" ? "পরিমাণ" : "Quantity"}
          </label>
          <input
            type="text"
            value={lang === "bn" ? convertToBanglaNumerals(quantity) : quantity}
            onChange={(e) => {
              const value = e.target.value;
              if (lang === "en") {
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setQuantity(value);
                  setLastChanged("quantity");
                }
              } else {
                if (value === "" || /^[০-৯\d]*\.?[০-৯\d]*$/.test(value)) {
                  setQuantity(convertFromBanglaNumerals(value));
                  setLastChanged("quantity");
                }
              }
            }}
            className="w-full px-2 sm:px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            placeholder={
              lang === "bn"
                ? activeTab === "bhori"
                  ? "ভরি লিখুন"
                  : "গ্রাম লিখুন"
                : `Enter ${activeTab === "bhori" ? "Bhori" : "Grams"}`
            }
          />
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs sm:text-xl font-medium text-white mb-1 sm:mb-2">
            {lang === "bn" ? "মূল্য (৳)" : "Price (BDT)"}
          </label>
          <input
            type="text"
            value={lang === "bn" ? convertToBanglaNumerals(price) : price}
            onChange={(e) => {
              const value = e.target.value;
              if (lang === "en") {
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPrice(value);
                  setLastChanged("price");
                }
              } else {
                if (value === "" || /^[০-৯\d]*\.?[০-৯\d]*$/.test(value)) {
                  setPrice(convertFromBanglaNumerals(value));
                  setLastChanged("price");
                }
              }
            }}
            className="w-full px-2 sm:px-3 py-2 border border-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
            placeholder={lang === "bn" ? "মূল্য লিখুন" : "Enter value"}
          />
        </div>
      </div>
    </main>
  );
};

export default OnlyCalculator;
