import * as fs from "fs-extra";
import * as markdownpdf from "markdown-pdf";
import * as path from "path";
import * as through from "through";

import * as docUtils from "./doc-utils";

/**
 * Builds a PDF of all markdown files within the project.
 *
 * @returns
 */
async function buildPdf() {
  try {
    /**
     * Get all the markdown files. Name of function is a misnomer, it actually grabs ** /*.md.
     * Undefined is passed in for each of the path parameters. This defaults the paths to the
     * root of the project directory (assuming that this is where this module was executed from)
     * and outputs a temp file to ./.tmp/ (again assuming the root of the project is where
     * things are run),
     */
    await docUtils.concatenateReadmeFiles(undefined, undefined, true, false);
  } catch (e) {
    console.error("Unable to concatenate the readme files!", e); // tslint:disable-line
    return;
  }

  // Use the temp readme file that was output in the temporary location to build a PDF using
  // this handy module!
  markdownpdf({})
    .from("./.tmp/README.md")
    .to("./docs/readme.pdf", () => {
      console.log("Readme documentation created at " + path.resolve("./docs/readme.pdf")); // tslint:disable-line
    });
}

// Make a single readme file
buildPdf();
