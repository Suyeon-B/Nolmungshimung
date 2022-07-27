const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    // "/api",
    // createProxyMiddleware({
    //   target: `//${process.env.REACT_APP_SERVER_IP}`,
    //   changeOrigin: true,
    // })
    "/place-api",
    createProxyMiddleware({
      target: "//maps.googleapis.com/maps/api/place",
      changeOrigin: true,
      pathRewrite: { "^/place-api": "" },
    })
  );
};
