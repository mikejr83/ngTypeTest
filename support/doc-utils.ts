import * as fs from "fs";
import * as glob from "glob";
import * as _ from "lodash";
import * as toc from "markdown-toc";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as stream from "stream";
import * as StreamConcat from "stream-concat";
import * as through from "through";

export const header = `
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet">
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.12.0/styles/github.min.css" crossorigin="anonymous">
<script
src="https://code.jquery.com/jquery-3.2.1.min.js"
integrity="sha256-hwg4gsxgFZhOsEEamdOYGBf13FyQuiTwlAQgxVSNgt4="
crossorigin="anonymous"></script>
<style type="text/css">
  body {
    font-family: 'Open Sans', sans-serif;
  }
</style>`;

export function loadFileList(basePath: string): string[] {
  // Look for all the markdown files that have a suffix of doc.md.
  let files = glob.sync(path.join(basePath, "**/*.md"), {
    ignore: [
      "node_modules/**"
    ],
    nosort: true
  });

  files = _.filter(files, (file, index) => {
    return file.toUpperCase() !== "README.MD" && file.toUpperCase() !== "LICENSE.MD";
  });

  files.push("LICENSE.md");

  return files;
}

async function concatenateBuffers(combinedStream: StreamConcat): Promise<string> {
  // return a promise to hand back a concatenated string
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    // When the stream has data push the chunk onto an array for concatenation
    combinedStream
      .on("data", (data) => {
        chunks.push(data);
      })
      .on("end", () => {
        // When we're at the end of the stream that means we've read everything so that all the chunks should be available. Concatenate the chunks and hand back the realized string.
        // Note, we've been assuming that everything is UTF-8 so far.
        const concatBuffer = Buffer.concat(chunks);
        resolve(concatBuffer.toString());
      });
  });
}

export async function concatenateReadmeFiles(basePath?: string, outputPath?: string, insertTOC?: boolean, callback?: any): Promise<void> {
  outputPath = outputPath || "./.tmp/README.md";
  // Need to get the list of files that will be concatenated.
  const files = loadFileList(basePath || "./");

  console.log("found the following:", files);  // tslint:disable-line

  let fileIndex = 0;

  /**
   * This function handles getting the next stream which should be concatenated.
   */
  const nextStream = () => {
    // If the index is at the length of the array of files to concatenate then we're done!
    if (fileIndex === files.length) {
      return null;
    }

    // Get the path of the file based on the index. Increment the index.
    const filePath = path.resolve(files[fileIndex++]);
    console.log('Reading ' + filePath); // tslint:disable-line

    // Create a stream to read the file's data
    const readStream = fs.createReadStream(filePath);

    // return a stream where the file's data is piped to the queue for processing.
    return readStream.pipe(through(function (this: any, data: any) { //tslint:disable-line
      this.queue(data + "\n\n");
    }));
  };

  // Create the stream concatenation object.
  const combinedStream = new StreamConcat(nextStream);

  // Use a function to encapsalte the process of concatenating the buffers of each stream into a single concatenated output.
  let combinedMarkdown: string = await concatenateBuffers(combinedStream);

  // If we're going to add a TOC to this markdown then use the TOC pacakge to create a TOC and insert it.
  if (insertTOC) {
    combinedMarkdown = toc.insert(combinedMarkdown);
  }

  // return a promise to create the PDF.
  return new Promise<void>((resolve, reject) => {
    // Make a temp directory
    mkdirp("./.tmp", (err: Error) => {
      // check for the error, if there is one stop
      if (err) {
        console.error("Error creating directory ./.tmp", err); // tslint:disable-line
        process.exit(1);
      }

      // Write out the combined markdown to the temp folder
      fs.writeFile(outputPath || "./.tmp/README.md", combinedMarkdown, () => {
        console.log("Concatenated README files into " + (outputPath || "./.tmp/README.md")); // tslint:disable-line
        if (callback && typeof callback === "function") {
          try {
            callback();
          } catch (err) {
            // stub
          }
        }
        resolve();
      });
    });
  });
}
