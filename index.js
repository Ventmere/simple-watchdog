const child_process = require("child_process");
const axios = require("axios");
const mailgun = require("mailgun-js");

const { URL, CMD, MAIL_TO, MAILGUN_DOMAIN, MAILGUN_API_KEY } = process.env;

const SLEEP_SECS = 30;
const ERROR_SLEEP_SECS = 60;

async function exec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (error, stdout, stderr) => {
      if (error) {
        return reject(error);
      }
      return resolve({
        stdout,
        stderr
      });
    });
  });
}

async function check(url) {
  return axios.get(url, {
    timeout: 1000
  });
}

async function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function sendMail(to, subject, msg) {
  const mg = mailgun({ apiKey: MAILGUN_API_KEY, domain: MAILGUN_DOMAIN });
  var data = {
    from: "B2 Watchdog <b2watchdog@mg.reactwebdesign.com>",
    to,
    subject,
    text: msg
  };

  return mg.messages().send(data);
}

async function main() {
  for (;;) {
    try {
      await check(URL);
      await sleep(SLEEP_SECS * 1000);
    } catch (err) {
      console.error(`error: ${err.message}`);
      await sendMail(
        MAIL_TO,
        `Watchdog check: ${err.message}`,
        `Watch url: ${URL}`
      );
      const res = await exec(CMD);
      console.log("stdout:");
      console.log(res.stdout);
      console.log("\n\n\n");
      console.log("stderr:");
      console.log(res.stdout);
      await sleep(ERROR_SLEEP_SECS * 1000);
    }
  }
}

main().catch(err => console.log(`fatal: ${err.message}`));
