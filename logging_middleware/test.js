const Log = require("./logger");

async function testLogging() {
  await Log(
    "backend",
    "info",
    "handler",
    "Testing my logging middleware"
  );
}

testLogging();