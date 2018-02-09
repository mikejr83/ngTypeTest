## Angular Application *(app)*

The Angular application is contained within the `app/` folder. 

The folder is broken down into folders containing components, directives, and providers. The main application modules are included here as well.

#### Application Component

In the `app.component.ts` file the `ApplicationComponent` is defined. This is the root of the Angular application. The component's view contains the upper application menu and the Angular router output.

#### Application Module

The `AppModule` imports all the components and declarations for the application.

Within the `app.module.ts` is the collection of all the providers used by the Angular application. Since this application could be run inside Electron or via a web application server this file handles building up the special array of providers which change based on where the application is run. This array of providers define the abstract class for a provider and then sets up the class to use as its instance. Depending on the operating scope the instance class to use change between IPC and Web classes.

 