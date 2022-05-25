module.exports = {
  apps: [{
    name: "Finance",
    script: "./server/dist/app.js",
    env_production: {
      NODE_ENV: "production"
    },
    env_development: {
      NODE_ENV: "development"
    },
    exec_mode: 'cluster',
    instances: 'max',
  }]
}