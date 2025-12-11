# Gold Kinen - Gold Price Calculator

A React-based gold price calculator application with support for both English and Bangla languages. The app allows users to calculate gold prices in different units (gram/bhori) and displays historical gold price charts.

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/AbulBashar38/gold-kinen.git
cd gold-kinen
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:

```env
# API Configuration
VITE_MARKET_PRICE_API=

# Google Spreadsheet Configuration
VITE_SPREADSHEET_ID=
VITE_YEARLY_SHEET_GID=
VITE_SIX_YEAR_SHEET_GID=
VITE_TEN_YEAR_SHEET_GID=
```

4. Start the development server:

```bash
npm run dev
```

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── chart/          # Chart-related components
│   │   ├── ChartLoading.tsx      # Loading spinner for chart
│   │   ├── ChartRangeTabs.tsx    # Time range tabs (Yearly/6Years/10Years)
│   │   ├── ChartYearSelector.tsx # Year selection buttons
│   │   └── index.ts              # Barrel export
│   ├── CalculatorInputs.tsx      # Quantity and price input fields
│   ├── CalculatorTabs.tsx        # Gram/Bhori unit tabs
│   ├── PriceDisplay.tsx          # Market price display component
│   ├── RecommendationButtons.tsx # Quick price selection buttons
│   └── StockChart.tsx            # Main chart component
├── hooks/               # Custom React hooks
│   ├── useCalculatorLogic.ts     # Calculator business logic
│   └── useStockChartData.ts      # Chart data fetching & management
├── pages/               # Page components
│   └── OnlyCalculator.tsx        # Main calculator page
├── router/              # Routing configuration
│   └── Routes.tsx                # App routes definition
├── utils/               # Utility functions and constants
│   ├── constant.ts               # App constants and configuration
│   └── utils.ts                  # Helper functions
├── App.tsx              # Root component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## 🧩 Components

### Calculator Components

| Component               | Description                                                        |
| ----------------------- | ------------------------------------------------------------------ |
| `OnlyCalculator`        | Main calculator page with language support (`lang` prop)           |
| `CalculatorTabs`        | Toggle between Gram and Bhori units                                |
| `CalculatorInputs`      | Input fields for quantity and price with bidirectional calculation |
| `PriceDisplay`          | Displays current market price with proper formatting               |
| `RecommendationButtons` | Quick selection buttons for common price amounts                   |

### Chart Components

| Component           | Description                                               |
| ------------------- | --------------------------------------------------------- |
| `StockChart`        | Main chart component displaying gold price history        |
| `ChartRangeTabs`    | Tabs for selecting time range (Yearly, 6 Years, 10 Years) |
| `ChartYearSelector` | Year selection for yearly view                            |
| `ChartLoading`      | Loading spinner while fetching chart data                 |

## 🪝 Custom Hooks

### `useCalculatorLogic`

Manages calculator state and business logic:

- Market price fetching from API
- Bidirectional calculation (quantity ↔ price)
- Unit conversion (gram/bhori)
- Input validation

```typescript
const {
  marketPrice,
  loading,
  unit,
  setUnit,
  quantity,
  price,
  handleQuantityChange,
  handlePriceChange,
  setPrice,
} = useCalculatorLogic(lang);
```

### `useStockChartData`

Handles chart data fetching and transformation:

- Fetches data from Google Sheets
- Caches data in localStorage (1 minute)
- Transforms data based on selected time range
- Supports fallback data

```typescript
const {
  stockData,
  loading,
  selectedRange,
  setSelectedRange,
  selectedYear,
  setSelectedYear,
  availableYears,
} = useStockChartData(lang);
```

## 🛠️ Utilities

### `utils.ts`

| Function                                 | Description                                    |
| ---------------------------------------- | ---------------------------------------------- |
| `convertToBanglaNumerals(str)`           | Converts English numerals to Bangla (০-৯)      |
| `convertFromBanglaNumerals(str)`         | Converts Bangla numerals to English            |
| `isValidNumberInput(value, lang)`        | Validates numeric input for both languages     |
| `formatNumber(num, decimals)`            | Formats number with specified decimal places   |
| `calculatePrice(quantity, pricePerUnit)` | Calculates total price from quantity           |
| `calculateQuantity(price, pricePerUnit)` | Calculates quantity from price                 |
| `formatBanglaNumber(num)`                | Formats number with Bangla numerals and locale |
| `formatCurrency(value, lang, decimals)`  | Formats currency based on language             |

### `constant.ts`

| Constant                | Description                               |
| ----------------------- | ----------------------------------------- |
| `GRAMS_PER_BHORI`       | Conversion factor (11.66 grams per bhori) |
| `MARKET_PRICE_API`      | API endpoint for market price             |
| `PRICE_RECOMMENDATIONS` | Quick price selection options             |
| `UNIT_TYPES`            | Available unit types (gram/bhori)         |
| `SPREADSHEET_CONFIG`    | Google Sheets configuration               |
| `TIME_RANGES`           | Available chart time ranges               |
| `TIME_RANGE_LABELS`     | Localized labels for time ranges          |
| `CHART_FALLBACK_DATA`   | Fallback data when API fails              |

## 🌐 Language Support

The app supports two languages:

- **English** (`lang="en"`)
- **Bangla** (`lang="bn"`)

Language is passed as a prop to components, enabling:

- Proper numeral display (English: 0-9, Bangla: ০-৯)
- Localized labels and text
- Custom font (Hind Siliguri) for Bangla text

## 📊 Data Sources

- **Market Price**: Fetched from configured API endpoint
- **Historical Data**: Fetched from Google Sheets (CSV format)
  - Yearly data (monthly prices)
  - 6-year historical data
  - 10-year historical data

## 🔧 Tech Stack

- **React** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Chart.js** - Chart visualization
- **react-chartjs-2** - React wrapper for Chart.js
- **papaparse** - CSV parsing
- **React Router** - Routing

## 📜 Scripts

| Script            | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start development server |
| `npm run build`   | Build for production     |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
