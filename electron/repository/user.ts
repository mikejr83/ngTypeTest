import { WriteOpResult } from "mongodb";

import logger from "../logging";
import { IUser } from "../user/user";
import { getDatabase } from "./";

const COLLECTION_NAME = "user";

export function saveUser(user: IUser): Promise<WriteOpResult> {
  return getDatabase().then(async (database) => {
    logger.debug("Got database.", database);

    return database.collection<IUser>(COLLECTION_NAME).update(user, user,
      {
        upsert: true
      });
  });
}

export async function loadUser(username: string): Promise<IUser> {
  logger.silly("Going to find the user with username:", username);

  return getDatabase().then(async (database): Promise<IUser> => {
    const usersCollection = await database.collection<IUser>(COLLECTION_NAME);

    return new Promise<IUser>((resolve, reject) => {
      usersCollection.findOne({ username }, (err, user) => {
        resolve(user);
      });
    });
  });
}
