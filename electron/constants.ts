/**
 * Hash of all the events which are fired through out the application.
 *
 * This hash allows strongly typing all the strings which are used to link up
 * emitters and listeners of events.
 */
export const EVENTS = {
  /**
   * EVENTS FIRED AND HANDLED ON THE MAIN ELECTRON APP
   */
  MAIN: {
    /**
     * Configuration has been updated on disk.
     */
    CONFIGURATION_UPDATED: "CONFIGURATION_UPDATED",
    /**
     * Events pertaining to the test functionality.
     */
    TEST: {
      /**
       * Test results have been loaded.
       */
      ON_TEST_RESULTS_LOADED: "MAIN_TEST_ON_TEST_RESULTS_LOADED",
      /**
       * Wikipedia test text has been loaded.
       */
      ON_WIKIPEDIA_LOADED: "MAIN_TEST_TEXT_ON_WIKIPEDIA_LOADED"
    },
    /**
     * The events pertaining to the user.
     */
    USER: {
      /**
       * Request a user to be loaded.
       */
      LOAD: "MAIN_USER_LOAD",
      /**
       * A user was loaded.
       */
      ONLOAD: "MAIN_USER_ONLOAD",
      /**
       * A user was updated (edited and saved)
       */
      ONUPDATED: "MAIN_USER_ONUPDATED",
      /**
       * A user was saved (created)
       */
      SAVE: "MAIN_USER_SAVE",
      /**
       *
       */
      UPDATE: "MAIN_USER_UPDATE"
    }
  },
  /**
   * EVENT FIRED AND HANDLED ON THE UI PROCESS
   */
  RENDERER: {
    /**
     * Configuration events
     */
    CONFIGURATION: {
      /**
       * Request to load configuration.
       */
      LOAD: "RENDERER_CONFIGURATION_LOAD",
      /**
       * Request to save configuration
       */
      SAVE: "RENDERER_CONFIGURATION_SAVE"
    },
    /**
     * Events related to tests
     */
    TEST: {
      /**
       * Request to load test result for a user.
       */
      LOAD_RESULTS_FOR_USER: "RENDERER_TEST_LOAD_RESULTS_FOR_USER",
      /**
       * Request to load wikipedia (test text) for a new test.
       */
      LOAD_WIKIPEDIA: "RENDERER_TEST_LOAD_WIKIPEDIA",
      /**
       * Save a test log (the results of a test)
       */
      LOG: "RENDERER_TEST_LOG"
    }
  }
};

/**
 * Keys related to the configuration object.
 */
export const CONFIGURATION = {
  LAST_USERNAME: "lastUsername",
  LOG_LEVEL: "logLevel",
  SERVE: "serve",
  SHOW_DEBUG_TOOLS: "showDebugTools",
};
