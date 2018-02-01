# ngTyping Test

A typing test written in Angular.IO and demonstrated in Electron.

## Overview

This application presents a demonstration of the use of TypeScript, Angular.IO, and Electron. The use of these three technologies together allows a developer to rapidly prototype and build out an application that can run on various OSes by harnessing the power of NodeJS and Electron. Semi-native packages can be created for Windows, MacOS, and Linux distributions with simple commands.

This demo shows the application running in an Electron environment. The Electron environment is nothing more than a specially constructed version of a browser window, specifically one built around Chromium, that runs the "web-application" locally. With considerations during the development of the application it could also be hosted on a standard web-server. This gives the solution an added level of flexibility, those desiring an application that can run offline have an option for the Electron hosted version while thin-clients have the option of using the hosted version. The development and deployment of this type of application benefits from the aspect that very little code changes are required across each version.

---

This documentation will cover the techical level of this demonstration. 

## Main Project

The root folder for this project contains a number of configuration files for building the project. Focusing on each of these files would require an in-depth discussion of the technology used to operate this project. Instead of covering each file in a detailed manner this documentation will ennumerate and briefly describe what their function as opposed to a detailed analysis of the contents of the files.

### Configuration Files

|File|Description|
|----|-----------|
| **.angular-cli.json** | Used for the configuration of the Angular-CLI. This configuration file is used to describe the project to the Angular-CLI for building, etc. |
| **.editorconfig** | This file is used to describe basic IDE editor settings which should allow the code to be stylisticaly consistent across developer and IDEs. |
| **.gitignore** | Files to be ignored by source control are listed here. |
| **.travis.yml** | CI buil configuration. |
| **electron-builder.json** | Configuration for the Electron application and build. |
| **karma.config.js** | Unit test configuration. |
| **package-lock.json** | Used by NPM to resolve dependencies in a quick format. Helps insure that anyone consuming this project gets the same dependencies. |
| **package.json** | Used to describe the project. Basic NPM configuration. |
| **postcss.config.js** | Configures... |
| **protractor.config.js** | E2E test configuration |
| **tsconfig.json** | TypeScript compilation configuration. |
| **tslint.json** | Configuration for TSLint (linting for TypeScript). |
| **webpack.config.js** | Webpack configuration. |

### Electron Files

It would be wise to note here that there is a single file for the Electron application included in the root of the project. The `main.ts` file is the base entry point for the Electron application. It is used to configure the events to be handled by the Electron application sub-system and handle creating the window which is displayed.

### Other Files and Folders

Each folder will contain a root `README.md` file. These files are handled via the GitHub documentation engine such that if you visit any of the folders via the GitHub website they will be displayed for that folder at the top of the page. This project is intended to do the same. Additional files, `README.doc.md` files will be included in order to provide supplemental technical information about the contents of the folder.

