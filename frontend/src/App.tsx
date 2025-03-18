import { useEffect } from "react";
import {
  useLocation,
  Routes,
  Route,
  Navigate,
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
import AuthPage from "./pages/AuthPage";
import { ThemeProvider } from "./core/ThemeContext";
import { AuthProvider, useAuth } from "./contexts/AuthContext";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

// Composant pour protéger les routes
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

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
    <AuthProvider>
      <ThemeProvider>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/homepage" element={<HomePage />} />
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
    </AuthProvider>
  );
};

export default App;
