const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: `http://${process.env.REACT_APP_SERVER_IP}:8443`,
      changeOrigin: true,
    })
  );
};
