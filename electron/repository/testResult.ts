import { WriteOpResult } from "mongodb";

import logger from "../logging";
import { ITestResult } from "../test/result";
import { getDatabase } from "./";

const COLLECTION_NAME = "testResult";

export async function saveTestResult(result: ITestResult) {
  return getDatabase().then(async (db) => {
    const resultsCollection = await db.collection<ITestResult>(COLLECTION_NAME);

    try {
      const insertResult = await resultsCollection.insert(result);
      logger.info("Wrote test result!");
    } catch (e) {
      logger.error("Error trying to save test result!", e);
    }
  });
}
