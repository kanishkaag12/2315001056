const axios = require("axios");

const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiYXVkIjoiaHR0cDovLzIwLjI0NC41Ni4xNDQvZXZhbHVhdGlvbi1zZXJ2aWNlIiwiZW1haWwiOiJrYW5pc2hrYS5hZ2Fyd2FsX2NzMjNAZ2xhLmFjLmluIiwiZXhwIjoxNzgxMDc1NDc4LCJpYXQiOjE3ODEwNzQ1NzgsImlzcyI6IkFmZm9yZCBNZWRpY2FsIFRlY2hub2xvZ2llcyBQcml2YXRlIExpbWl0ZWQiLCJqdGkiOiI1ZDk1YTVmYi1mZGQ5LTQzYzQtOTBkZC1jOGU4OWJiMDBhYWMiLCJsb2NhbGUiOiJlbi1JTiIsIm5hbWUiOiJrYW5pc2hrYSBhZ2Fyd2FsIiwic3ViIjoiODRmODVlMjgtZTY1MS00ZTZjLTlkMDItNGNhY2MyZmE2NTVjIn0sImVtYWlsIjoia2FuaXNoa2EuYWdhcndhbF9jczIzQGdsYS5hYy5pbiIsIm5hbWUiOiJrYW5pc2hrYSBhZ2Fyd2FsIiwicm9sbE5vIjoiMjMxNTAwMTA1NiIsImFjY2Vzc0NvZGUiOiJSUHNnWXQiLCJjbGllbnRJRCI6Ijg0Zjg1ZTI4LWU2NTEtNGU2Yy05ZDAyLTRjYWNjMmZhNjU1YyIsImNsaWVudFNlY3JldCI6Ik1QZnJRZGZnZEtmVEVCZmgifQ.1ZI8eMiuyD8yRajG6WK-OLY2bVk4ECdgUOZ2nyQGMbc";

const weights = {
  Placement: 3,
  Result: 2,
  Event: 1,
};

async function main() {
  try {
    const res = await axios.get(
      "http://4.224.186.213/evaluation-service/notifications",
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`,
        },
      }
    );

    const notifications = res.data.notifications;

    const ranked = notifications.map((n) => {
      const ageHours =
        (Date.now() - new Date(n.Timestamp).getTime()) /
        (1000 * 60 * 60);

      const score = weights[n.Type] * 100 - ageHours;

      return { ...n, score };
    });

    ranked.sort((a, b) => b.score - a.score);

    const top10 = ranked.slice(0, 10);

    console.log("\nTOP 10 PRIORITY NOTIFICATIONS\n");

    console.table(
      top10.map((n) => ({
        Type: n.Type,
        Message: n.Message,
        Timestamp: n.Timestamp,
        Score: n.score.toFixed(2),
      }))
    );
  } catch (err) {
    console.error(
      "ERROR:",
      err.response?.status,
      err.response?.data || err.message
    );
  }
}

main();