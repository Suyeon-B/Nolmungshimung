const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `${window.location.protocol}//${window.location.hostname}:8443`,
      changeOrigin: true,
    })
  );
};
