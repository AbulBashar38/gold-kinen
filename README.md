# Gold Kinen - Gold Price Calculator

> ⚠️ **IMPORTANT NOTICE**
>
> This is the **legacy/live version** of the application. The code in this branch is **NOT refactored** and contains duplicate code, hardcoded values, and lacks proper separation of concerns.
>
> **👉 Highly recommended to use the refactored code from the [`refector-code`](https://github.com/AbulBashar38/gold-kinen/tree/refector-code) branch.**
>
> The refactored version includes:
>
> - ✅ Proper component splitting
> - ✅ Custom hooks for business logic
> - ✅ Centralized utilities and constants
> - ✅ Environment variable support
> - ✅ Better code organization and maintainability

---

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

3. Start the development server:

```bash
npm run dev
```

> **Note:** This version has hardcoded API URLs and spreadsheet IDs. For environment variable support, switch to the `refector-code` branch.

## 📁 Project Structure

```
src/
├── pages/               # Page components
│   ├── CalculatorPage.tsx        # Full calculator with unit conversion
│   ├── ChartPage.tsx             # English chart page
│   ├── ChartPageBangla.tsx       # Bangla chart page
│   └── OnlyCalculator.tsx        # Simple calculator (supports lang prop)
├── router/              # Routing configuration
│   └── Routes.tsx                # App routes definition
├── StockChart.tsx       # Chart component with data fetching
├── App.tsx              # Root component
├── main.tsx             # App entry point
└── index.css            # Global styles
```

## 🧩 Pages & Components

### Pages

| Page              | Route                     | Description                                    |
| ----------------- | ------------------------- | ---------------------------------------------- |
| `ChartPage`       | `/`                       | English gold price chart                       |
| `ChartPageBangla` | `/bangla-chart`           | Bangla gold price chart                        |
| `CalculatorPage`  | `/calculator`             | Full calculator with vori/ana/roti/point units |
| `OnlyCalculator`  | `/only-calculator`        | Simple gram/bhori calculator (English)         |
| `OnlyCalculator`  | `/only-calculator-bangla` | Simple gram/bhori calculator (Bangla)          |

### Components

| Component        | Description                                                |
| ---------------- | ---------------------------------------------------------- |
| `StockChart`     | Main chart component with data fetching from Google Sheets |
| `OnlyCalculator` | Calculator with bidirectional quantity/price calculation   |
| `CalculatorPage` | Advanced calculator with traditional unit conversions      |

## 🌐 Language Support

The app supports two languages:

- **English** (`lang="en"`)
- **Bangla** (`lang="bn"`)

Language is passed as a prop to components, enabling:

- Proper numeral display (English: 0-9, Bangla: ০-৯)
- Localized labels and text
- Custom font (Hind Siliguri) for Bangla text

## ⚠️ Known Issues (Legacy Code)

- Hardcoded API URLs and spreadsheet IDs
- Duplicate utility functions across files (`convertToBanglaNumerals`, etc.)
- No separation of concerns (business logic mixed with UI)
- No custom hooks for reusable logic
- Separate page files for English/Bangla versions

**Solution:** Switch to the [`refector-code`](https://github.com/AbulBashar38/gold-kinen/tree/refector-code) branch for the improved version.

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
