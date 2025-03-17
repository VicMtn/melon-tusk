/// <reference types="vite/client" />

// Déclaration pour FlyonUI
interface Window {
  HSStaticMethods: {
    autoInit: () => void;
    Chart: new (element: HTMLElement, config: any) => {
      destroy: () => void;
      update: () => void;
    };
  };
}
