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
  return getDatabase().then(async (database): Promise<IUser> => {
    const usersCollection = database.collection<IUser>(COLLECTION_NAME);
    const users = await usersCollection.find({ username }).toArray();

    if (users && Array.isArray(users) && users.length > 0) {
      return users[0];
    }
  });
}
