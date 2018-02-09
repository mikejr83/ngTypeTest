/**
 * This module is a simple interface into the docUtils module for concatenating all
 * the markdown files into a readme file. This markdown is used by the typedoc
 * task to create a default landing page of text for the project.
 */

import * as docUtils from "./doc-utils";

docUtils.concatenateReadmeFiles(undefined, "./.tmp/README-TOC.md", false, true);
