[![Angular Logo](./logo-angular.jpg)](https://angular.io/) [![Electron Logo](./logo-electron.jpg)](https://electron.atom.io/)


[![Make a pull request][prs-badge]][prs]
[![License](http://img.shields.io/badge/Licence-MIT-brightgreen.svg)](LICENSE.md)

# Introduction

This application is a proof-of-concept showing an advanced application running within an Electron framework with the capability to run within a standalone web application server. The boilerplate starting point for this application begins with the work done in the [angular-electron](https://github.com/maximegris/angular-electron) repository.

The POC demonstrates a typing test application. Upon opening the application a user is presented with a simple login option. Providing an email which is present in the system will "authenticate" them. The form will also switch to user creation where a user can enter their name and email.

Authenticated users can take tests, review their previous tests, and change configuration options.

### Tech Stack

Currently runs with:

- Angular v5.2.0
- Angular-CLI v1.6.4
- Bootstrap 4
- Electron v1.7.8
- Electron Builder v19.45.4
- TypeDoc

With this sample, you can :

- Run your app in a local development environment with Electron & Hot reload
- Run your app in a production environment
- Package your app into an executable file for Linux, Windows & Mac

## POC Considerations

Note this is a POC. There will be many gaps here as this project is intended to show a manner in which one can build an application which can be deployed to Electron or a web application server. Here are the gaps and considerations regarding this typing test and the features presented:

### General

This solution was setup to run via TravisCI. In this repository that is not configured. Karma and Protractor are configured for unit and e2e tests but those tests have not been written for lack of time.

### Front-End

The front end is an Angular (5) application. Angular offers a whole host of very neat things that can be done. This POC isn't intended to demonstrate all the functionality within Angular. This application makes use of forms, components, and directives. The UI scheme is built around Bootstrap 4.

* Form validation - The application checks for required status but doesn't validate that an email is an email, etc. This would be an easy addition.
* Real User Authentication - Routes don't provide "real" security. Sending the current request back to the main page when no active user exists is needed and shouldn't be a huge task to implement.
* Configuration Robust-ness - The configuration page is done just for some basic demo flair. The linking of certain configuration options would be advised, i.e. when the user changes their locale the Wikipedia URI would adjust accordingly (if not already modified).
* Translations - These were just pulled from Google Translate. Spanish (es) was chosen at random. More translated languages and better (human) translations would make any end version better.

### Back-End 

In general the back-end for this POC is very simple. It handles the CRUD operations requested by the UI. Business logic is still handled in the Angular providers. As this POC evolved some of the functionality is stuck into an *electron* folder. This is a misnomer. The breaking out of models and data interfaces should be done to further enhance the maintanability and readibility of the code.

Testing on the backend is fairly non-existstent. This isn't do to lack of capability but more a lack of time. The karma configuration could be duplicated and adjusted for running tests in TypeScript and in the context of an application server instead of a client web application.

#### Electron

The front-end web application communicates to the Electron process via IPC events. Events provide for the dreaded spegetti code that a `goto` syntax provides. This is a large area where clean up would need to take place.

#### ExpressJS

The back-end for the web version of this POC is ExpressJS. The implementation of the application server for this example is very bare-bones. Error handling, logging, etc are not handled. This is basic, but time consuming, functionality that can be added without much difficulty.

### Project Structure

Most of the boilerplate code for the original Angular-Electron was changed. Some of the NPM scripting was changed. A thorough cataloging of all the functionality needs to be done. The number of tasks is getting unweildy. A task runner like Grunt or Gulp to help fire off these tasks may make the process of producing assets a bit easier.

This structure was designed to build out a standalone-Electron application. NSIS can be plugged into this process. It was intended to do this but time constraints prevented it. The process for generating the standalone version of the Electron application is a little less fleshed out at the moment.

## Getting Started

Clone this repository locally :

``` bash
git clone https://github.com/maximegris/angular-electron.git
```

Install dependencies with npm :

``` bash
npm install
```

There is an issue with `yarn` and `node_modules` that are only used in electron on the backend when the application is built by the packager. Please use `npm` as dependencies manager. *There are manual ways around this but at this time no scripted approach for bypassing this issue exists*

## To build for development

- **in a terminal window** -> npm start  

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Electron window and "Developer Tools" is open.  
The Angular component contains an example of Electron and NodeJS native lib import. See [Use NodeJS Native libraries](#use-nodejs-native-libraries) charpter if you want to import other native libraries in your project.  
You can desactivate "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## To build for production

- Using development variables (environments/index.ts) :  `npm run electron:dev`
- Using production variables (environments/index.prod.ts) :  `npm run electron:prod`

Your built files are in the /dist folder.

## Included Commands

|Command|Description|
|--|--|
|`npm run web` | Start the ExpressJS web server. *Open a browser to http://localhost:3000/ for the application.* |
|~~`npm run start:web`~~| ~~Execute the app in the browser~~ |
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**Your application is optimised. Only the files of /dist folder are included in the executable.**

## Use NodeJS Native libraries

Actually Angular-Cli doesn't seem to be able to import nodeJS native libs or electron libs at compile time (Webpack error). This is (one of) the reason why webpack.config was ejected of ng-cli.
If you need to use NodeJS native libraries, you **MUST** add it manually in the file `webpack.config.js` in root folder :

```javascript
  "externals": {
    "electron": 'require(\'electron\')',
    "child_process": 'require(\'child_process\')',
    "fs": 'require(\'fs\')'
    ...
  },
```

Notice that all NodeJS v7 native libs are already added in this sample. Feel free to remove those you don't need.

## Browser mode

This POC can be run in the browser in two different manners.

The boilerplate codebase allowed for development in a browser:

> Maybe you want to execute the application in the browser (WITHOUT HOT RELOAD ACTUALLY...) ? You can do it with `npm run start:web`.  
>Note that you can't use Electron or NodeJS native libraries in this case. Please check `providers/electron.service.ts` to watch how conditional import of electron/Native libraries is done.

With the move to a hybrid structure where the app can run standalone in Electron and in Express this functionality is more or less deprecated.

To run the application in the browser start the application in the following manner:

``` bash
npm run web
```

This runs the Webpack compilation for development and spins up the ExpressJS server to host the backend application end-points. The NPM scripts behind running the commands to put the application into this state do not support hot-reloading at the moment. Changes to the web application, the client-side application, will be picked up by Webpack and recompiled. The web browser will not automatically refresh as would happen under the normal Electron development mode. The same holds true for changes to the ExpressJS application, changes made to the `.ts` files will not cause an auto compilation or reload of the ExpressJS server.

## Execute E2E tests

You can find end-to-end tests in /e2e folder.

You can run tests with the command lines below : 
- **in a terminal window** -> First, start a web server on port 4200 : `npm run start:web`  
- **in another terminal window** -> Then, launch Protractor (E2E framework): `npm run e2e`

# Contributors 

This project was built off of a boilerplate Angular & Electron app: [https://github.com/maximegris/angular-electron](https://github.com/maximegris/angular-electron)

[<img alt="Maxime GRIS" src="https://avatars2.githubusercontent.com/u/10827551?v=3&s=117" width="117">](https://github.com/maximegris) |
:---:
|[Maxime GRIS](https://github.com/maximegris)|

[build-badge]: https://travis-ci.org/maximegris/angular-electron.svg?branch=master
[build]: https://travis-ci.org/maximegris/angular-electron.svg?branch=master
[dependencyci-badge]: https://dependencyci.com/github/maximegris/angular-electron/badge
[dependencyci]: https://dependencyci.com/github/maximegris/angular-electron
[license-badge]: https://img.shields.io/badge/license-Apache2-blue.svg?style=flat
[license]: https://github.com/maximegris/angular-electron/blob/master/LICENSE.md
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[github-watch-badge]: https://img.shields.io/github/watchers/maximegris/angular-electron.svg?style=social
[github-watch]: https://github.com/maximegris/angular-electron/watchers
[github-star-badge]: https://img.shields.io/github/stars/maximegris/angular-electron.svg?style=social
[github-star]: https://github.com/maximegris/angular-electron/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20angular-electron!%20https://github.com/maximegris/angular-electron%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/maximegris/angular-electron.svg?style=social
