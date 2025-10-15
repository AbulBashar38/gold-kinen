import { Calculator } from "lucide-react";
import { useEffect, useState } from "react";

const CalculatorPage = () => {
  const [grams, setGrams] = useState<string>("");
  const [vori, setVori] = useState<string>("");
  const [ana, setAna] = useState<string>("");
  const [roti, setRoti] = useState<string>("");
  const [point, setPoint] = useState<string>("");

  // Derived states
  const gramsValue = grams === "" ? 0 : parseFloat(grams);
  const voriValue = vori === "" ? 0 : parseInt(vori);
  const anaValue = ana === "" ? 0 : parseInt(ana);
  const rotiValue = roti === "" ? 0 : parseInt(roti);
  const pointValue = point === "" ? 0 : parseInt(point);

  // Replace individual result states with a single object state
  const [traditionalResults, setTraditionalResults] = useState<{
    vori: number;
    ana: number;
    roti: number;
    point: number;
  }>({ vori: 0, ana: 0, roti: 0, point: 0 });
  const [gramsResult, setGramsResult] = useState<string>("0 grams");
  const [priceGrams, setPriceGrams] = useState<string>("");
  const [amount, setAmount] = useState<string>("0");
  const [lastChanged, setLastChanged] = useState<"grams" | "amount">("grams");

  // Dummy price per gram
  const PRICE_PER_GRAM = 100;

  useEffect(() => {
    if (lastChanged === "grams") {
      if (priceGrams !== "") {
        const gramsValue = parseFloat(priceGrams);
        if (!isNaN(gramsValue)) {
          setAmount((gramsValue * PRICE_PER_GRAM).toFixed(2));
        }
      } else {
        setAmount("0");
      }
    } else if (lastChanged === "amount") {
      if (amount !== "") {
        const amountValue = parseFloat(amount);
        if (!isNaN(amountValue)) {
          setPriceGrams((amountValue / PRICE_PER_GRAM).toFixed(4));
        }
      } else {
        setPriceGrams("");
      }
    }
  }, [priceGrams, amount, lastChanged]);

  const GRAMS_PER_VORI = 11.664;
  const ANA_PER_VORI = 16;
  const ROTI_PER_ANA = 6;
  const POINT_PER_ROTI = 10;
  const GRAMS_PER_POINT =
    GRAMS_PER_VORI / (ANA_PER_VORI * ROTI_PER_ANA * POINT_PER_ROTI);

  const convertGramsToTraditional = () => {
    let remainingGrams = gramsValue;
    const totalVori = Math.floor(remainingGrams / GRAMS_PER_VORI);
    remainingGrams -= totalVori * GRAMS_PER_VORI;

    const totalAna = Math.floor(
      remainingGrams / (GRAMS_PER_VORI / ANA_PER_VORI)
    );
    remainingGrams -= totalAna * (GRAMS_PER_VORI / ANA_PER_VORI);

    const totalRoti = Math.floor(
      remainingGrams / (GRAMS_PER_VORI / (ANA_PER_VORI * ROTI_PER_ANA))
    );
    remainingGrams -=
      totalRoti * (GRAMS_PER_VORI / (ANA_PER_VORI * ROTI_PER_ANA));

    const totalPoint = Math.round(remainingGrams / GRAMS_PER_POINT);

    // Update the single state object
    setTraditionalResults({
      vori: totalVori,
      ana: totalAna,
      roti: totalRoti,
      point: totalPoint,
    });
  };

  const convertTraditionalToGrams = () => {
    const totalPoints =
      voriValue * ANA_PER_VORI * ROTI_PER_ANA * POINT_PER_ROTI +
      anaValue * ROTI_PER_ANA * POINT_PER_ROTI +
      rotiValue * POINT_PER_ROTI +
      pointValue;
    const totalGrams = totalPoints * GRAMS_PER_POINT;
    setGramsResult(`${totalGrams.toFixed(4)} grams`);
  };

  return (
    <main className="w-full min-h-screen bg-yellow-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-700">
          Gold Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Convert Grams to Traditional Units */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-yellow-300">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
              Grams to Traditional Units
            </h2>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Grams
              </label>
              <input
                type="text"
                value={grams}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "" || /^\d*\.?\d*$/.test(value)) {
                    setGrams(value);
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter grams"
              />
            </div>
            <button
              onClick={convertGramsToTraditional}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Convert
            </button>
            <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-300">
              <div className="grid grid-cols-2 gap-4">
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <label className="block text-xs text-gray-500">Vori</label>
                  <span className="text-gray-800 font-semibold">
                    {traditionalResults.vori}
                  </span>
                </div>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <label className="block text-xs text-gray-500">Ana</label>
                  <span className="text-gray-800 font-semibold">
                    {traditionalResults.ana}
                  </span>
                </div>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <label className="block text-xs text-gray-500">Roti</label>
                  <span className="text-gray-800 font-semibold">
                    {traditionalResults.roti}
                  </span>
                </div>
                <div className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                  <label className="block text-xs text-gray-500">Point</label>
                  <span className="text-gray-800 font-semibold">
                    {traditionalResults.point}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Convert Traditional Units to Grams */}
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-yellow-300">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
              Traditional Units to Grams
            </h2>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vori
                </label>
                <input
                  type="text"
                  value={vori}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setVori(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ana (0-15)
                </label>
                <input
                  type="text"
                  value={ana}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setAna(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-15"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Roti (0-5)
                </label>
                <input
                  type="text"
                  value={roti}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setRoti(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Point (0-9)
                </label>
                <input
                  type="text"
                  value={point}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d+$/.test(value)) {
                      setPoint(value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0-9"
                />
              </div>
            </div>
            <button
              onClick={convertTraditionalToGrams}
              className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition-colors"
            >
              Convert
            </button>
            <div className="mt-4 p-3 bg-yellow-50 rounded-md border border-yellow-300">
              <div className="px-3 py-2 border border-gray-300 rounded-md bg-white">
                <label className="block text-xs text-gray-500">Grams</label>
                <span className="text-gray-800 font-semibold">
                  {gramsResult}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Price Calculator */}
      <div className="mt-12">
        <h1 className="text-4xl font-bold text-center mb-8 text-yellow-700">
          Price Calculator
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md border-2 border-yellow-300">
            <h2 className="text-2xl font-semibold mb-4 text-yellow-800">
              Calculate Price
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grams
                </label>
                <input
                  type="text"
                  value={priceGrams}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setPriceGrams(value);
                      setLastChanged("grams");
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter grams"
                />
              </div>
              <Calculator className="text-yellow-600" size={24} />
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Amount
                </label>
                <input
                  type="text"
                  value={amount}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      setAmount(value);
                      setLastChanged("amount");
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter amount"
                />
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Price per gram: ${PRICE_PER_GRAM}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CalculatorPage;
