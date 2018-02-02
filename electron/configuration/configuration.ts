export interface IConfiguration {
  logLevel: string;
  serve: boolean;
  showDebugTools: boolean;
}

export const defaultConfiguration: IConfiguration = {
  logLevel: "info",
  serve: false,
  showDebugTools: false
};
