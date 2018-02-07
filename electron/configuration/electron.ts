export interface IElectronConfiguration {
  lastUsername?: string;
  logLevel: string;
  serve: boolean;
  showDebugTools: boolean;
}

export const defaultElectronConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};
