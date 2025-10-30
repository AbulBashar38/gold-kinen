import { useEffect, useState } from "react";

const OnlyCalculator = () => {
  const [activeTab, setActiveTab] = useState<"gram" | "bhori">("gram");
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"quantity" | "price">(
    "quantity"
  );

  // Dummy prices (can be updated dynamically if needed)
  const PRICE_PER_BHORI = 216260.0;
  const PRICE_PER_GRAM = 18547.0;

  const currentPricePerUnit =
    activeTab === "bhori" ? PRICE_PER_BHORI : PRICE_PER_GRAM;

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
          setQuantity((priceValue / currentPricePerUnit).toFixed(4));
        }
      } else {
        setQuantity("");
      }
    }
  }, [quantity, price, lastChanged, currentPricePerUnit]);

  return (
    <main className="w-full h-full">
      <div className="bg-transparent p-4 sm:p-6 md:p-8 rounded-lg shadow-lg border-2 border-yellow-300">
        {/* Tabs */}
        <div className="flex justify-center mb-6 sm:mb-8 gap-2 sm:gap-3">
          <button
            onClick={() => setActiveTab("gram")}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform ${
              activeTab === "gram"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md shadow-yellow-200 scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            }`}
          >
            Gram
          </button>
          <button
            onClick={() => setActiveTab("bhori")}
            className={`px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-bold text-sm sm:text-base md:text-lg transition-all duration-300 transform ${
              activeTab === "bhori"
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-white shadow-md shadow-yellow-200 scale-105"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
            }`}
          >
            Bhori
          </button>
        </div>

        {/* Price Display */}
        <div className="text-center mb-6 sm:mb-8">
          <p className="text-xl sm:text-2xl md:text-3xl font-bold text-yellow-800 mb-1 sm:mb-2 break-words">
            BDT{" "}
            {activeTab === "bhori"
              ? PRICE_PER_BHORI.toFixed(2) + "/Bhori"
              : PRICE_PER_GRAM.toFixed(2) + "/Gram"}
          </p>
          <p className="text-xs sm:text-sm text-gray-600">
            22k Market price today
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col sm:flex-row items-end gap-2 sm:gap-4 mb-4">
          <div className="flex-1 w-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Quantity
            </label>
            <input
              type="text"
              value={quantity}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setQuantity(value);
                  setLastChanged("quantity");
                }
              }}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
              placeholder={`Enter ${activeTab === "bhori" ? "Bhori" : "Grams"}`}
            />
          </div>

          <div className="flex-1 w-full">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
              Price (BDT)
            </label>
            <input
              type="text"
              value={price}
              onChange={(e) => {
                const value = e.target.value;
                if (value === "" || /^\d*\.?\d*$/.test(value)) {
                  setPrice(value);
                  setLastChanged("price");
                }
              }}
              className="w-full px-2 sm:px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 text-sm sm:text-base"
              placeholder="Enter price"
            />
          </div>
        </div>
      </div>
    </main>
  );
};

export default OnlyCalculator;
