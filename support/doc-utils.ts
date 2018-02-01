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

export function loadFileList(basePath: string, includeFrameworkDocs: boolean) {
  const files = glob.sync(path.join(basePath, "**/*.md"), {
    ignore: [
      "node_modules/**"
    ],
    nosort: true
  });

  const dontLookForRootReadme = path.resolve(basePath) === path.resolve("./") && files[0].toUpperCase() === "README.md".toUpperCase();

  if (!dontLookForRootReadme && fs.existsSync("./README.md")) {
    files.splice(0, 0, path.resolve("./README.md"));
  }

  let frameworkFiles: string[] = [];

  if (includeFrameworkDocs) {
    frameworkFiles = glob.sync(path.join(__dirname, "../**/*.md"), {
      ignore: [
        path.join(__dirname, "../node_modules/**")
      ],
      nosort: true
    });
  }

  return files.concat(frameworkFiles);
}

async function concatenateBuffers(combinedStream: StreamConcat): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const chunks: any[] = [];
    combinedStream
      .on("data", (data) => {
        chunks.push(data);
      })
      .on("end", () => {
        const concatBuffer = Buffer.concat(chunks);
        resolve(concatBuffer.toString());
      });
  });
}

export async function concatenateReadmeFiles(basePath?: string, outputPath?: string, includeFrameworkDocs?: boolean, insertTOC?: boolean, callback?: any): Promise<void> {
  outputPath = outputPath || "./.tmp/README.md";
  const files = loadFileList(basePath || "./", includeFrameworkDocs === undefined ? false : includeFrameworkDocs);

  let fileIndex = 0;

  const nextStream = () => {
    if (fileIndex === files.length) {
      return null;
    }

    const filePath = path.resolve(files[fileIndex++]);
    console.log('Reading ' + filePath); // tslint:disable-line

    const readStream = fs.createReadStream(filePath);

    return readStream.pipe(through(function (this: any, data: any) { //tslint:disable-line
      this.queue(data + "\n\n");
    }));
  };

  const combinedStream = new StreamConcat(nextStream);

  let combinedMarkdown: string = await concatenateBuffers(combinedStream);

  if (insertTOC) {
    combinedMarkdown = toc.insert(combinedMarkdown);
  }

  return new Promise<void>((resolve, reject) => {
    mkdirp("./.tmp", (err: Error) => {
      if (err) {
        console.error("Error creating directory ./.tmp"); // tslint:disable-line
        process.exit(1);
      }

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
