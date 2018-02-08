import * as express from "express";
import { Express } from "express";
import * as path from "path";

const app: Express = express();

app.use(express.static(path.join(__dirname, "../")));

app.listen(3000, () => {
  console.log("Example server running on port 3000!");
});
