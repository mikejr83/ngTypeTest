import { WriteOpResult } from "mongodb";

import logger from "../logging";
import { IUser } from "../user/user";
import { getDatabase } from "./";

/**
 * Name of the user's collection
 */
const COLLECTION_NAME = "user";

/**
 * Save a user object.
 *
 * @export
 * @param {IUser} user The user object to save.
 * @returns {Promise<WriteOpResult>} Promise of a save result.
 */
export function saveUser(user: IUser): Promise<WriteOpResult> {
  // Get the database
  return getDatabase().then(async (database) => {
    logger.debug("Got database.", database);

    // Next get the users collection and upsert the user object (update or insert);
    return database.collection<IUser>(COLLECTION_NAME).update(user, user,
      {
        upsert: true
      });
  });
}

/**
 * Loads a user.
 *
 * @export
 * @param {string} username Find the user based on their username.
 * @returns {Promise<IUser>} Promise to resolve a user object.
 */
export async function loadUser(username: string): Promise<IUser> {
  logger.silly("Going to find the user with username:", username);

  // Get the database!
  return getDatabase().then(async (database): Promise<IUser> => {
    // Then get the users collection.
    const usersCollection = await database.collection<IUser>(COLLECTION_NAME);

    // Return a promise that we'll get that user object.
    return new Promise<IUser>((resolve, reject) => {
      // Find one user based on the username.
      usersCollection.findOne({ username }, (err, user) => {
        // If there is an error reject the promise, otherwise resolve the promise with the user object.
        if (err) {
          reject(err);
        } else {
          resolve(user);
        }
      });
    });
  });
}

/**
 * Updates a user based on the username.
 *
 * Note, since the username is the primary identifier for the user the username on the user object may not be the same.
 * @param username The current username of the user object
 * @param user The user object which will update the one for the user.
 */
export async function updateUser(username: string, user: IUser): Promise<WriteOpResult> {
  // Get the database
  return getDatabase().then(async (database) => {
    logger.silly("Got database.");

    // Update the user object based on the username!
    return database.collection<IUser>(COLLECTION_NAME).update({ username }, user);
  });
}
