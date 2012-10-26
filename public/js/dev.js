/*
 * Dev console access.
 */
define([
  // dependencies
  'jQuery',
  'Underscore',
  'mps',
  'rpc'
], function ($, _, mps, rpc) {
  window.mps = mps;
  window.rpc = rpc;
});
