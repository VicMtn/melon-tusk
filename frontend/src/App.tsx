import { useEffect } from "react";
import {
  useLocation,
  Routes,
  Route,
} from "react-router-dom";
import { IStaticMethods } from "flyonui/flyonui";
import MainLayout from "./core/MainLayout";
import HomePage from "./pages/HomePage";
import Markets from "./pages/Markets";
import Watchlist from "./pages/Watchlist";
import Assets from "./pages/Assets";
import Transactions from "./pages/Transactions";
import Profile from "./pages/Profile";
import Faq from "./pages/Faq";
import NotFound from "./pages/errors/NotFound";
import Settings from "./pages/Settings";
import { ThemeProvider } from "./core/ThemeContext";

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
    <ThemeProvider>
          <Routes>
            <Route element={<MainLayout />}>
              <Route index element={<HomePage />} />
              <Route path="/markets" element={<Markets />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
    </ThemeProvider>
  );
};

export default App;
