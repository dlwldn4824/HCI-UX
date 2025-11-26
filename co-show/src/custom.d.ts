declare module "*.png" {
  const value: string;
  export default value;
}

declare module "*.svg" {
  const value: string;
  export default value;
}

// Temi Android WebView 인터페이스
interface Window {
  temi?: {
    goTo: (location: string) => void;
    speak: (content: string) => void;
  };
}
