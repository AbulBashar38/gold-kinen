import { createBrowserRouter } from "react-router";
import CalculatorPage from "../pages/CalculatorPage";
import ChartPage from "../pages/ChartPage";
import ChartPageBangla from "../pages/ChartPageBangla";
import OnlyCalculator from "../pages/OnlyCalculator";

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
    element: <OnlyCalculator lang="en" />,
  },
  {
    path: "/only-calculator-bangla",
    element: <OnlyCalculator lang="bn" />,
  },
]);
export default router;
