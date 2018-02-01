import * as fs from "fs-extra";
import * as markdownpdf from "markdown-pdf";
import * as path from "path";
import * as through from "through";

import * as docUtils from "./doc-utils";

async function buildPdf() {
  try {
    await docUtils.concatenateReadmeFiles(undefined, undefined, true, false);
  } catch (e) {
    console.error("Unable to concatenate the readme files!", e); // tslint:disable-line
    return;
  }

  markdownpdf({})
    .from("./.tmp/README.md")
    .to("./docs/readme.pdf", () => {
      console.log("Readme documentation created at " + path.resolve("./docs/readme.pdf")); // tslint:disable-line
    });
}

// Make a single readme file
buildPdf();
