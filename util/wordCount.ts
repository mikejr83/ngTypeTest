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

export function findWordCount(text: string): number {
  return splitTextIntoWords(text).length;
}

export function splitTextIntoWords(text: string): string[] {
  return text
    .replace(/[^\w\s]/g, "")
    .split(/\s+/);
}
