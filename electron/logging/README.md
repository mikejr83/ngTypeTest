## Logging

The Electron app allows for the use of the logging methods on the `console` object. This is not ideal as those messages are only sent to the console. While helpful in debug and development environments, a full fledged logging framework needs to be available for production use.

This project chooses to use the Winston logging tools. These tools are configured via the classes in this folder.

The use of the `index.ts` file and a default export within the file allows a very simplistic import into any application file requiring logging support.
