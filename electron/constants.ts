export const EVENTS = {
  /**
   * EVENTS FIRED AND HANDLED ON THE MAIN ELECTRON APP
   */
  MAIN: {
    CONFIGURATION_UPDATED: "CONFIGURATION_UPDATED",
    USER: {
      LOAD: "MAIN_USER_LOAD",
      ONLOAD: "MAIN_USER_ONLOAD",
      SAVE: "MAIN_USER_SAVE"
    }
  },
  /**
   * EVENT FIRED AND HANDLED ON THE UI PROCESS
   */
  RENDERER: {

  }
};

export const CONFIGURATION = {
  LAST_USERNAME: "lastUsername",
  LOG_LEVEL: "logLevel",
  SERVE: "serve",
  SHOW_DEBUG_TOOLS: "showDebugTools"
}
