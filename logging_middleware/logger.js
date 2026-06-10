require("dotenv").config();
const axios = require("axios");

async function Log(stack, level, packageName, message) {
  try {
    console.log(process.env.LOG_TOKEN.substring(0, 20));
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: packageName,
        message,

        email: process.env.EMAIL,
        name: process.env.NAME,
        rollNo: process.env.ROLLNO,
        accessCode: process.env.ACCESS_CODE,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET
    },
      {
        headers: {
          Authorization: `Bearer ${process.env.LOG_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Log sent:", response.data);
  } catch (error) {
    console.error(
      "Log failed:",
      error.response?.data || error.message
    );
  }
}

module.exports = Log;