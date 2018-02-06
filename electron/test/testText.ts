export enum TestTextLocation {
  Wikipedia,
  Other
}

export interface ITestText {
  paragraphs: string[];
  textLocationType: TestTextLocation;
  locationDescription: string;
}
