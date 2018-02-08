(function (root, factory) {
  module.exports = factory(root);
}(this, function (root) {
  if (!this.require) {
    console.warn("This page is not running an in environment where \"require\" is available.");
    this.require = function require(packageName) {
      console.warn("Required package, " + packageName + " cannot be loaded in this fashion!");
    };

    return false;
  } else {
    return true;
  }
}))
