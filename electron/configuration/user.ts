/**
 * The definition for a user's configuration
 *
 * @export
 * @interface IUserConfiguration
 */
export interface IUserConfiguration {
  /**
   * Culture code for the user.
   *
   * "en", "es", etc.
   *
   * @type {string}
   * @memberof IUserConfiguration
   */
  culture: string;
  /**
   * Remove non ascii characters from test text.
   *
   * Useful for users which use languages that naturally do not contain such characters.
   *
   * @type {boolean}
   * @memberof IUserConfiguration
   */
  removeNonAsciiCharacters: boolean;
  /**
   * The URL for the Wikipedia wildcard page used to get test text.
   *
   * Users using different languages may want to change this in order to get text in their language.
   *
   * @type {string}
   * @memberof IUserConfiguration
   */
  wikipediaUrl: string;
  /**
   * The number of words to use in the test.
   *
   * @type {number}
   * @memberof IUserConfiguration
   */
  wordCount: number;
}

/**
 * Default configuration for a user.
 */
export const defaultConfiguration: IUserConfiguration = {
  culture: "en",
  removeNonAsciiCharacters: true,
  wikipediaUrl: "http://en.wikipedia.org/wiki/Special:Randompage",
  wordCount: 200
};
