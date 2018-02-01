# Project Support (Support folder)

The `support` folder contains any utilities and helpers to get the project up and running. These resources are not required for the actual functioning of the application but are intended to facilitate any of the functions for supporting builds, documentation, etc.

## TypeScript

All the items within this folder should be TypeScript files. A special task, `build-support`, has been created to compile this directory using the `tsconfig.json` file within the directory.

## File Descriptions

| File | Description |
|------|-------------|
| concat-readme.ts | Used to concatenate the `README.md` and `README.doc.md` files into a single markdown file. |
| create-pdf.ts | Used to take a markdown file and turn it into a PDF document. |
| doc-utils.ts | A set of utility functions used to concatenate the markdown files and produce a TOC. |
| tsconfig.json | Since the files here are support only the way they are compiled is a little different than the rest of the project. This config file lets the TypeScript compilation take place a little differently. |


