## Repository

The *repository* folder contains modules for data repository actions. These modules deal with connecting to a data store and performing CRUD operations.

### Root

The default module for this folder contains the basic ability to connect to the data-store. This project uses a data-store which mimics MongoDB. The API for the external module is exactly the same as the MongoDB driver for NodeJS. This allows this example to easily switch over to using MongoDB.

### Test-Results *(test-results)*

The *testResults* module contains the operations for working with test result objects. It supports saving/logging a new result to the data store. It also provides functionality for loading a user's results.

### User

The *user* module contains the data store operations for user objects. This includes loading, creating, updating.
