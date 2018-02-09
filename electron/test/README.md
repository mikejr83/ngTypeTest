## Test

The *test* folder contains all the modules relating to the **Test** object. This includes the definition for the object structure as well as various other supporting objects.

### Result

The `ITestResult` interface defined in *result.ts` defines the structure of a test result.

### Test Text Info

The file *testText.ts* is the module which exports an enumeration and interface for the test info. The enumeration, `TestTextLocation`, details where the test text was pulled. This is useful when introducing more places which could provide test text examples. The `ITestText` interface is used to define the text used for testing the user. 

### Word

The *word* module provides a utility interface for identifying error'd words within the text.
