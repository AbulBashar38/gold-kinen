import { CalculatorTabs } from '../components/CalculatorTabs';
import { PriceDisplay } from '../components/PriceDisplay';
import { RecommendationButtons } from '../components/RecommendationButtons';
import { CalculatorInputs } from '../components/CalculatorInputs';
import { useCalculatorLogic } from '../hooks/useCalculatorLogic';

interface OnlyCalculatorProps {
  lang: 'en' | 'bn';
}

/**
 * OnlyCalculator Component
 * 
 * Main calculator page component that combines:
 * - Tabs for switching between gram and bhori units
 * - Price display based on market rates
 * - Recommendation buttons for quick price selection
 * - Bidirectional quantity/price input fields
 * 
 * @param lang - Language setting ('en' for English, 'bn' for Bangla)
 */
const OnlyCalculator = ({ lang }: OnlyCalculatorProps) => {
  const {
    activeTab,
    quantity,
    price,
    pricePerGram,
    pricePerBhori,
    handleQuantityChange,
    handlePriceChange,
    handleTabChange,
    handlePriceSelect,
  } = useCalculatorLogic();

  return (
    <main
      className={`w-full h-full bg-transparent p-2 ${
        lang === 'bn' ? 'font-hind' : ''
      } bg-transparent`}
    >
      <CalculatorTabs
        activeTab={activeTab}
        onTabChange={handleTabChange}
        lang={lang}
      />

      <PriceDisplay
        pricePerGram={pricePerGram}
        pricePerBhori={pricePerBhori}
        activeTab={activeTab}
        lang={lang}
      />

      <RecommendationButtons
        price={price}
        onPriceSelect={handlePriceSelect}
        lang={lang}
      />

      <CalculatorInputs
        quantity={quantity}
        price={price}
        activeTab={activeTab}
        onQuantityChange={handleQuantityChange}
        onPriceChange={handlePriceChange}
        lang={lang}
      />
    </main>
  );
};

export default OnlyCalculator;
