const target = process.env.BACKEND_URL || 'http://localhost:9428';

module.exports = {
  '/uploads': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  },
  '/api': {
    target,
    secure: false,
    changeOrigin: true,
    logLevel: 'debug',
  }
};
