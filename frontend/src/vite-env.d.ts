/// <reference types="vite/client" />

// Declaration for FlyonUI
interface Window {
  HSStaticMethods: {
    autoInit: () => void;
    Chart: new (element: HTMLElement, config: any) => {
      destroy: () => void;
      update: () => void;
    };
  };
}
