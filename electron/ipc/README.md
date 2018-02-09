## Inter-Process Communications

Inter-process communication occurs in Electron when the renderer process, the process hosting the client application, talks to the behind the scenes main process, the Electron process. This process to process communication allows the web app to perform long running tasks outside of the renderering thread. This keeps the UI responsive. It also allows the code to be logically split between a server and client architecture. This means that in this solution a web application can be hosted within the renderer process and with very little change be hosted on a standard application server.

### Root

The default export of this "namespace" is a function to register the IPC listeners for each of the individual modules.

### Configuration

The configuration module handles all the IPC messaging for configuration related functions. The loading and saving of configuration is handled through this module. 

### Test

IPC listeners related to the testing functionality. This module includes the listeners for getting test text, saving test results, and retrieving results for a user.
