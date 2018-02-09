import * as fs from "fs-extra";
import { Db } from "mongodb";
import * as path from "path";
import * as tingodb from "tingodb";

import logger from "../logging";

/**
 * The db connection is cached and left open for the life of the application
 */
let dbConnection: any;
/**
 * The actual DB connection that is analogous to the MongoDB driver object.
 */
let db: Db;

/**
 * Get's a database connection and opens a database.
 *
 * @export
 * @returns {Promise<Db>}
 */
export async function getDatabase(): Promise<Db> {
  // If there isn't a current connection it will be created.
  if (!dbConnection) {
    logger.debug("DB hasn't been created. Creating it");
    // Load up the tingodb driver.
    const engine = tingodb({});
    // Provide a path to where our data will be located. THIS IS A FOLDER.
    const dataPath = path.join(__dirname, "../../data");
    // Check to see if there is anything going on at this path.
    if (!await fs.exists(dataPath)) {
      // Whoa, the path didn't exist; create the directory.
      logger.debug("Making data path...", dataPath);
      await fs.mkdirp(dataPath);
    }

    // Create the connection.
    dbConnection = new engine.Db(dataPath, {});
  }

  // At this point we should assume that our driver module has instaniated
  // a way for us to get at the MongoDB-ish Db object.
  return new Promise<Db>((resolve, reject) => {
    // If we've cached the db object just return it.
    if (db) {
      resolve(db);
    } else {
      // Need to open up a connection to the database. Do it to it.
      dbConnection.open((err, database) => {
        logger.silly("Database opened has finished.");
        if (err) {
          logger.error("Error while trying to open the database.");
          throw err;
        } else {
          // The callback has given us a good Db object.
          // Resolve the promise with the database object after caching it locally.
          db = database;
          resolve(db);
        }
      });
    }
  });
}
