import { createBrowserRouter } from "react-router";
import CalculatorPage from "../pages/CalculatorPage";
import ChartPage from "../pages/ChartPage";
import ChartPageBangla from "../pages/ChartPageBangla";
import OnlyCalculator from "../pages/OnlyCalculator";
import OnlyCalculatorBangla from "../pages/OnlyCalculatorBangla";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChartPage />,
  },
  {
    path: "/bangla-chart",
    element: <ChartPageBangla />,
  },
  {
    path: "/calculator",
    element: <CalculatorPage />,
  },
  {
    path: "/only-calculator",
    element: <OnlyCalculator />,
  },
  {
    path: "/only-calculator-bangla",
    element: <OnlyCalculatorBangla />,
  },
]);
export default router;
