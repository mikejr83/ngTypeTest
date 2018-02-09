/**
 * Utility class for defining words within the text.
 *
 * Used primarily in the UI to define where bad words appear within the user's entered text.
 *
 * @export
 * @interface ITextWord
 */
export interface ITextWord {
  /**
   * The text of the word.
   *
   * @type {string}
   * @memberof ITextWord
   */
  word: string;
  /**
   * The start index of the word within the text.
   *
   * @type {number}
   * @memberof ITextWord
   */
  start: number;
  /**
   * REDUNDANT
   *
   * The ending index of where the word is located in the text.
   *
   * @type {number}
   * @memberof ITextWord
   */
  end: number;
}
