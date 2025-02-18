import { useEffect } from 'react';
import { useLocation, Routes, Route } from 'react-router-dom';
import { IStaticMethods } from 'flyonui/flyonui';
import MainLayout from './pages/mainLayout';

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const location = useLocation();

  useEffect(() => {
    const loadFlyonui = async () => {
      await import('flyonui/flyonui');

      window.HSStaticMethods.autoInit();
    };

    loadFlyonui();
  }, [location.pathname]);

  return (
      <MainLayout />
  );
}

export default App;
