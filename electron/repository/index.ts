import * as fs from "fs-extra";
import { Db } from "mongodb";
import * as path from "path";
import * as tingodb from "tingodb";

import logger from "../logging";

let dbConnection: any;
let db: Db;

export async function getDatabase(): Promise<Db> {
  if (!dbConnection) {
    logger.debug("DB hasn't been created. Creating it");
    const engine = tingodb({});
    const dataPath = path.join(__dirname, "../../data");
    if (!await fs.exists(dataPath)) {
      logger.debug("Making data path...", dataPath);
      await fs.mkdirp(dataPath);
    }
    dbConnection = new engine.Db(dataPath, {});
  }

  return new Promise<Db>((resolve, reject) => {
    if (db) {
      resolve(db);
    } else {
      dbConnection.open((err, database) => {
        logger.silly("Database opened has finished.");
        if (err) {
          logger.error("Error while trying to open the database.");
          throw err;
        } else {
          db = database;
          resolve(db);
        }
      });
    }
  });
}
