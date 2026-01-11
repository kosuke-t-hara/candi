export type GAParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
  }
}

export const gaEvent = (name: string, params: GAParams = {}) => {
  if (typeof window === "undefined") return;
  if (!window.gtag) return;
  window.gtag("event", name, params);
};
