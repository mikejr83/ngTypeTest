/**
 * Get words broken down by the times they appear in the text.
 * @param text Text to split out by words.
 */
export function findWordsCount(text: string): { [word: string]: number } {
  const wordCount = text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/)
    .reduce((map, word, index, array): string => {
      map[word] = (map[word] || 0) + 1;

      return map;
    }, Object.create({}));

  return wordCount;
}

/**
 * Gets the number of words in a string of text.
 *
 * @export
 * @param {string} text
 * @returns {number}
 */
export function findWordCount(text: string): number {
  return splitTextIntoWords(text).length;
}

/**
 * Splits a string of text into individual words.
 *
 * @export
 * @param {string} text Text to break into words
 * @param {boolean} [keepNonAlphaNumeric] Strip non-alphanumeric characters
 * @returns {string[]}
 */
export function splitTextIntoWords(text: string, keepNonAlphaNumeric?: boolean): string[] {
  if (keepNonAlphaNumeric) {
    return text.split(/\s+/);
  } else {
    return text
      .replace(/[^\w\s]/g, "")
      .split(/\s+/);
  }
}
