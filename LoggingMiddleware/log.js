const axios = require('axios');
require('dotenv').config();

const LOG_ENDPOINT = "http://20.244.56.144/evaluation-service/logs";
const validStacks = ["backend", "frontend"];
const validLevels = ["debug", "info", "warn", "error", "fatal"];
const validPackages = [
  "cache", "controller", "cron_job", "db", "domain", "handler",
  "repository", "route", "service", "api", "component", "hook",
  "page", "state", "style", "auth", "config", "middleware", "utils"
];

function Log(stack, level, pkg, message) {
  try {
    if (!validStacks.includes(stack) || !validLevels.includes(level) || !validPackages.includes(pkg)) {
      console.warn("Invalid log parameters");
      return;
    }

    axios.post(LOG_ENDPOINT, {
      stack, level, package: pkg, message
    }, {
      headers: {
        Authorization: `Bearer ${process.env.LOG_API_KEY}`,
      }
    }).catch(err => {
      console.error("Logging failed", err.message);
    });
  } catch (err) {
    console.error("Log function error:", err.message);
  }
}

module.exports = { Log };
