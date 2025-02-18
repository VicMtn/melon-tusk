import { useEffect } from "react";
import {
  useLocation,
  Routes,
  Route
} from "react-router-dom";
import { IStaticMethods } from "flyonui/flyonui";
import MainLayout from "./core/MainLayout";
import HomePage from "./pages/HomePage";
import Markets from "./pages/Markets";
import Watchlist from "./pages/Watchlist";
import Assets from "./pages/Assets";
import ProfitLosses from "./pages/ProfitLosses";
import Transactions from "./pages/Transactions";
import NotFound from "./pages/errors/notfound";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

const App: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const loadFlyonui = async () => {
      await import("flyonui/flyonui");

      window.HSStaticMethods.autoInit();
    };

    loadFlyonui();
  }, [location.pathname]);

  return (
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/assets" element={<Assets />} />
          <Route path="/profit-losses" element={<ProfitLosses />} />
          <Route path="/transactions" element={<Transactions />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

export default App;
