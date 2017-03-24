var path = require('path'),
    rootPath = path.normalize(__dirname + '/..'),
    env = process.env.NODE_ENV || 'development';

var config = {
  development: {
    root: rootPath,
    app: {
      name: 'beauty'
    },
    port: process.env.PORT || 9898,
    db: 'mongodb://localhost/beauty-dev'
  },

  test: {
    root: rootPath,
    app: {
      name: 'beauty'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/beauty-test'
  },

  production: {
    root: rootPath,
    app: {
      name: 'beauty'
    },
    port: process.env.PORT || 3000,
    db: 'mongodb://localhost/beauty-production'
  }
};

module.exports = config[env];
