const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    // "/api",
    // createProxyMiddleware({
    //   target: `https://${process.env.REACT_APP_SERVER_IP}:8443`,
    //   changeOrigin: true,
    // })
    "/place-api",
    createProxyMiddleware({
      target: "https://maps.googleapis.com/maps/api/place",
      changeOrigin: true,
      pathRewrite: { "^/place-api": "" },
    })
  );
};
