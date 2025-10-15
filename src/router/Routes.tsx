import { createBrowserRouter } from "react-router";
import CalculatorPage from "../pages/CalculatorPage";
import ChartPage from "../pages/ChartPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <ChartPage />,
  },
  {
    path: "/calculator",
    element: <CalculatorPage />,
  },
]);
export default router;
