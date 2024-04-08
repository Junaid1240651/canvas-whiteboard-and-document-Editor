const corn = require("cron");
const http = require("http");
const URL = "https://canvas-whiteboard-and-document-editor.onrender.com/api/users/logout";

const job = new cron.CronJob("*/4 * * * *", function () {
  https
    .post(URL, (res) => {
      if (res.statusCode === 200) {
        console.log("GET request sent successfully");
      } else {
        console.log("GET request failed", res.statusCode);
      }
    })
    .on("error", (e) => {
      console.error("Error while sending request", e);
    });
});
module.exports = job;
