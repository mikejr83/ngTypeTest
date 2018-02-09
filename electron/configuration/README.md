## Configuration

Application configuration is handled in several ways. The app can pull configuration from configuration files, configuration tied to a specific user, and through the launch of the application on the CLI.

### Root Module

Contains the default export for this "namespace". It is the configuration for the application.

### CLI

The `cli.ts` file exports a module to get settings from the CLI and configure them on the configuration object.

### Electron

The electron module in configuration contains all the functionality to manage configuration of the Electron application. This is a meta-level configuration. These configurations are applicable to all users.

The module exports methods for loading and saving this configuration.

### User

The user module in the configuration section is used for setting up the definition of configurations for specific users. Also contains a default set of configuration values.

### Web

The web module provides functions for loading and saving configurations while the application is running from a web server. This is necessary because the manner in which the configuration is saved differs between the two.



