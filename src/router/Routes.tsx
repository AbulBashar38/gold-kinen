import { createBrowserRouter } from "react-router";
import CalculatorPage from "../pages/CalculatorPage";
import ChartPage from "../pages/ChartPage";
import OnlyCalculator from "../pages/OnlyCalculator";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChartPage />,
  },
  {
    path: "/calculator",
    element: <CalculatorPage />,
  },
  {
    path: "/only-calculator",
    element: <OnlyCalculator />,
  },
]);
export default router;
