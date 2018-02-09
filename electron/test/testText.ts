/**
 * Flag for identifying where text was retrieved for the test.
 */
export enum TestTextLocation {
  /**
   * Test text was pulled from Wikipedia.
   */
  Wikipedia,
  /**
   * Test text was pulled from the ether?
   */
  Other
}

/**
 * Structure of the test.
 *
 * The object includes information regarding the paragraph breakdown of the
 * text. Where the text was pulled is included as well.
 *
 * @export
 * @interface ITestText
 */
export interface ITestText {
  /**
   * The paragraphs of text which will appear on the test.
   *
   * @type {string[]}
   * @memberof ITestText
   */
  paragraphs: string[];
  /**
   * Flag indicating where the text was retrieved.
   *
   * @type {TestTextLocation}
   * @memberof ITestText
   */
  textLocationType: TestTextLocation;
  /**
   * In most cases it will be the URL of where the text was found.
   *
   * Could describe the location of odd scenarios (I found it in a book).
   *
   * @type {string}
   * @memberof ITestText
   */
  locationDescription: string;
}
