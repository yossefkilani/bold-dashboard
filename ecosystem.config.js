// PM2 config for Hostinger VPS/Cloud deployment
module.exports = {
  apps: [
    {
      name: "bold-dashboard",
      script: "node_modules/.bin/next",
      args: "start -p 3000",
      env: {
        NODE_ENV: "production",
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
    },
  ],
};
