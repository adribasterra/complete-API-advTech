module.exports = {
  apps: [{
    name: "at-loyalty-pre",
    script: "yarn azure",
    env: {
      NODE_ENV: "azure",
      NTBA_FIX_319: 1,
      PORT: 8054
    },
    error_file: './pm2-logs/at-loyalty-pre-err.log',
    out_file: './pm2-logs/at-loyalty-pre-output.log'
  }]
}
