// Minimal crypto shim for React Native
// Ensures global.crypto exists and getRandomValues is available.
import 'react-native-get-random-values';

if (typeof global.crypto !== 'object' || !global.crypto) {
  global.crypto = {};
}

// react-native-get-random-values patches getRandomValues globally.
// This guard keeps things idempotent.
if (typeof global.crypto.getRandomValues !== 'function') {
  // No-op: the import above should polyfill it. Leaving guard for safety.
}
