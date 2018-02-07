import { HighlightTag } from "angular-text-input-highlight";

import { ITestText } from "./testText";

export interface ITestResult {
  info: ITestText;
  enteredText: string;
  badWords: HighlightTag[];
  start: Date;
  end: Date;
  username: string;
}
