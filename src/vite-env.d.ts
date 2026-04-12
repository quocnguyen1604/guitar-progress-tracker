/// <reference types="vite/client" />

declare global {
  interface Window {
    appApi: {
      getStatus: () => Promise<{
        mode: "development" | "production";
        electron: string;
        node: string;
        chrome: string;
      }>;
    };
  }
}

export {};
