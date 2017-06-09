/*
 * App configuration
 */

// TODO add configuration for proxy usage
// NOTE maybe we should use boolean 'secure' config instead of protocol strings
module.exports = {
  host: process.env.HOST || 'localhost', // local server host
  port: process.env.PORT || 3000, // local server port
  apiProto: process.env.APIPROTO || 'http', // api server (proxy) protocol
};
