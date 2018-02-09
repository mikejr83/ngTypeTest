# Electron Application

This folder contains all the support files for the Electron/Server-side application. These are actually used at runtime.

## Electron App

The Electron app is managed through `app.ts`. This file handles setting up the Electron application, registering the basic events, and loading the main application page.

### Constants

Every application will have static string values used for configuration or events names. This module exports a two hashes, one for all the event names and one for configuration keys. By using a hash where the values are a string it allows us to "strongly type" those strings so that they will be insured to be the same in all locations which need to reference them.

*Note: For all `README.md` files further down in the directory structure, their root header should be set to two hash signs: ##*
