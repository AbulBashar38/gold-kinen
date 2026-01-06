import { useEffect, useState } from "react";
import {
  GRAMS_PER_BHORI,
  MARKET_PRICE_API,
  UNIT_TYPES,
} from "../utils/constant";
import { calculatePrice, calculateQuantity } from "../utils/utils";

export const useCalculatorLogic = () => {
  const [activeTab, setActiveTab] = useState<"gram" | "bhori">(UNIT_TYPES.GRAM);
  const [quantity, setQuantity] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [lastChanged, setLastChanged] = useState<"quantity" | "price">(
    "quantity"
  );
  const [marketPrice, setMarketPrice] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Calculate prices
  const marketPriceFloat = marketPrice ? parseFloat(marketPrice) : NaN;
  const pricePerGram = !isNaN(marketPriceFloat) ? marketPriceFloat : 0;
  const pricePerBhori = pricePerGram * GRAMS_PER_BHORI;
  const currentPricePerUnit =
    activeTab === "bhori" ? pricePerBhori : pricePerGram;

  // Bidirectional calculation effect
  useEffect(() => {
    if (lastChanged === "quantity") {
      if (quantity !== "") {
        const quantityValue = parseFloat(quantity);
        if (!isNaN(quantityValue)) {
          setPrice(calculatePrice(quantityValue, currentPricePerUnit));
        }
      } else {
        setPrice("");
      }
    } else if (lastChanged === "price") {
      if (price !== "") {
        const priceValue = parseFloat(price);
        if (!isNaN(priceValue)) {
          setQuantity(calculateQuantity(priceValue, currentPricePerUnit));
        }
      } else {
        setQuantity("");
      }
    }
  }, [quantity, price, lastChanged, currentPricePerUnit]);

  // Fetch market price on mount
  useEffect(() => {
    const fetchMarketPrice = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(MARKET_PRICE_API);
        const data = await response.json();

        if (response.ok && data?.market_price) {
          setMarketPrice(data.market_price);
        } else {
          throw new Error("Failed to fetch market price");
        }
      } catch (error) {
        console.error("Failed to fetch market price:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMarketPrice();
  }, []);

  const handleQuantityChange = (value: string) => {
    setQuantity(value);
    setLastChanged("quantity");
  };

  const handlePriceChange = (value: string) => {
    setPrice(value);
    setLastChanged("price");
  };

  const handleTabChange = (tab: "gram" | "bhori") => {
    setActiveTab(tab);
  };

  const handlePriceSelect = (selectedPrice: string) => {
    setPrice(selectedPrice);
    setLastChanged("price");
  };

  return {
    activeTab,
    quantity,
    price,
    pricePerGram,
    pricePerBhori,
    isLoading,
    handleQuantityChange,
    handlePriceChange,
    handleTabChange,
    handlePriceSelect,
  };
};
