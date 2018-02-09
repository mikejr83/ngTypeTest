### Providers

*NOTE, instead of defining a README.md for each directory set of providers this README.md file will cover the discussion of all providers at the root level*

#### Configuration

The configuration provider is used to handle the coordination of configuration information. Consumers of this provider can load the current configuration and instruct the application to persist the current configuration.

#### Logging

The logging provider is used to provide logging services to all aspects of the client application. This is the only provider which does not use the IPC and Web pattern. This could change with the introduction of some use case where it is necessary to log client messages to the back-end. If this is the case the pattern shown for IPC vs Web could be extended further for handling the aded complexity.

#### Test

This provider, the Test provider, is used for providing the typing test information and functions. **This is not used for unit or e2e testing.** The provider allows for loading a new test and test text, retrieving the list of results for a user, and saving a completed test.

#### User

The user provider is used to provide basic user operations to the application. The registration, updating, and login of users is handled here.
