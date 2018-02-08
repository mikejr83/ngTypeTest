import * as bodyParser from "body-parser";
import * as express from "express";
import { Express, Request, Response } from "express";
import * as morgan from "morgan";
import * as path from "path";

import { IElectronConfiguration, loadConfiguration } from "../electron/configuration/electron";
import { IUserConfiguration } from "../electron/configuration/user";
import { loadWebConfiguration, saveLocalConfiguration } from "../electron/configuration/web";

import { loadUser, saveUser } from "../electron/repository/user";


import { loadFromWikipedia } from "../util/wikipedia";

import { saveTestResult, loadTestResults } from "../electron/repository/testResult";
import { ITestResult } from "../electron/test/result";
import { ITestText } from "../electron/test/testText";
import { IUser } from "../electron/user/user";

const app: Express = express();

app.use(express.static(path.join(__dirname, "../../")));

app.use(morgan("tiny"));
app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Example server running on port 3000!"); // tslint:disable-line
});

app.get("/appConfiguration", (req: Request, res: Response) => {
  const config = loadWebConfiguration();
  res.send(config);
});

app.post("/appConfiguration", (req: Request, res: Response) => {
  const configToSave = req.body as IElectronConfiguration;

  if (configToSave) {
    const config = loadWebConfiguration();

    saveLocalConfiguration(config, configToSave);

    const loadedConfig = loadWebConfiguration();
    res.send(loadedConfig);
  } else {
    res.sendStatus(204);
  }
});

app.get("/test", async (req: Request, res: Response) => {
  const username: string = req.params.username as string;

  const results = await loadTestResults(username);

  res.send(results);
});

app.put("/test", async (req: Request, res: Response) => {
  const result: ITestResult = req.body as ITestResult;
  try {
    saveTestResult(result);
  } catch (e) {
    console.error(e);
  }
});

app.post("/test/text", async (req: Request, res: Response) => {
  let testText: ITestText;

  try {
    testText = await loadFromWikipedia(req.body as IUserConfiguration);
  } catch (e) {
    console.error(e);
  }

  res.send(testText);
});

app.get("/user", async (req: Request, res: Response) => {
  const email = req.query.email;

  let user: IUser;
  if (email) {
    user = await loadUser(email);
  } else {
    //
  }

  res.send(user);
});

app.post("/user", async (req: Request, res: Response) => {
  const user: IUser = req.body as IUser;

  const result = await saveUser(user);

  let loadedUser: IUser;

  try {
    loadedUser = await loadUser(user.username);
  } catch (e) {
    console.error(e);
  }
});

app.put("/user", async (req: Request, res: Response) => {
  if (req.body === undefined) {
    res.sendStatus(500);
  } else {
    const user: IUser = req.body as IUser;

    if (user) {
      await saveUser(user);

      const loadedUser = await loadUser(user.username);

      res.send(loadedUser);
    } else {
      res.sendStatus(500).send("Send me a user");
    }
  }
});


