import { WriteOpResult } from "mongodb";

import logger from "../logging";
import { ITestResult } from "../test/result";
import { getDatabase } from "./";

/**
 * Test Results collection name.
 */
const COLLECTION_NAME = "testResult";

/**
 * Saves a test result object
 *
 * @export
 * @param {ITestResult} result The test result to save.
 * @returns Promise that the save completed.
 */
export async function saveTestResult(result: ITestResult) {
  // Get a Db object...
  return getDatabase().then(async (db) => {
    // Get the test results collection.
    const resultsCollection = await db.collection<ITestResult>(COLLECTION_NAME);

    try {
      // Attempt to insert the new test result.
      const insertResult = await resultsCollection.insert(result);
      logger.info("Wrote test result!");
    } catch (e) {
      // Whoops.
      logger.error("Error trying to save test result!", e);
    }
  });
}

/**
 * Loads test results.
 *
 * @export
 * @param {string} [username] If provided filters the test results to a specific user.
 * @returns {Promise<ITestResult[]>} Promise for test results.
 */
export async function loadTestResults(username?: string): Promise<ITestResult[]> {
  // Grab a connection to the database.
  const db = await getDatabase();

  // Get the test results collection.
  const resultsCollection = await db.collection<ITestResult>(COLLECTION_NAME);

  // Return a promise that we will send back test results.
  return new Promise<ITestResult[]>((resolve, reject) => {
    // Query test results and get an array of results.
    resultsCollection.find({ username }).toArray((error, queryResults: ITestResult[]) => {
      // Reject the promise if we have an error otherwise resolve it with the results.
      if (error) {
        reject(error);
      } else {
        resolve(queryResults);
      }
    });
  }).catch((e) => {
    // Whoops.
    logger.error("Unable to query for test results!", e);
    // Even in an error condition hand back an empty array.
    return [];
  });
}
