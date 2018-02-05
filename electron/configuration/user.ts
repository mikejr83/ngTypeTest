export interface IUserConfiguration {
  culture: string;
  removeNonAsciiCharacters: boolean;
  wikipediaUrl: string;
  wordCount: number;
}

export const defaultConfiguration: IUserConfiguration = {
  culture: "en",
  removeNonAsciiCharacters: true,
  wikipediaUrl: "http://en.wikipedia.org/wiki/Special:Randompage",
  wordCount: 200
};
