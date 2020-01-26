const proxy = require('http-proxy-middleware');

module.exports = function setupProxy(app) {
  app.use(
    '/api',
    proxy({
      target: 'http://localhost:4001',
      changeOrigin: true,
      /* pathRewrite: {
        '^/api/': '/',
      }, */
    }),
  );
};
