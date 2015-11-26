var constants = require('redux-persist/constants');
var keyPrefix = constants.keyPrefix;

module.exports = function(persistor, config) {
  var newConfig = config || {};
  var blacklist = newConfig.blacklist || false;
  var whitelist = newConfig.whitelist || false;
  var isFocused = (document.hasFocus) ? document.hasFocus() : true;

  window.addEventListener('focus', function () {
    isFocused = true;
  }, false);

  window.addEventListener('blur', function () {
    isFocused = false;
  }, false);

  window.addEventListener('storage', function (event) {
    if (isFocused) return;
    //|| !event.newValue
    console.log('isFocused::: ', isFocused);
    console.log('handleStorageEvent::: key ', event.key);
    console.log('handleStorageEvent::: oldValue ', event.oldValue);
    console.log('handleStorageEvent::: newValue ', event.newValue);

    if (event.key.indexOf(keyPrefix) === 0) {
      var keySpace = event.key.substr(keyPrefix.length);
      if (whitelist && whitelist.indexOf(keySpace) === -1) { return; }
      if (blacklist && blacklist.indexOf(keySpace) !== -1) { return; }
      // rehydrate storage with the new value
      persistor.rehydrate(keySpace, event.newValue, function (keySpace, newState) {
        // @TODO handle errors?
      });
    }
  }, false);
};
