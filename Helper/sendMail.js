// helper function that sends mail to user

var nodemailer = require("nodemailer");

// async function sendMail({ from = `<${process.env.SUPPORT_EMAIL}>`, to, bcc, subject = "", html, text }) {
async function sendMail({
  from = `ramkrisgbaindalkar@gmail.com`,
  to,
  bcc,
  subject = "",
  html,
  text,
}) {
  try {
    let mailOptions = { subject, from };
    if (to) mailOptions.to = to;
    else if (bcc) mailOptions.bcc = bcc;
    else
      throw {
        error: true,
        status: false,
        message: "Invalid data, email required",
      };

    if (text) mailOptions.text = text;
    else if (html) mailOptions.html = html;
    else
      throw {
        error: true,
        status: false,
        message: "Invalid data, data required",
      };

    // let user = process.env.SUPPORT_EMAIL,
    //   pass = process.env.SUPPORT_PASS;
    let user = process.env.FROM_EMAIL,
      pass = process.env.FROM_PASSWORD;
    if (!user || !pass) {
      throw {
        error: true,
        status: false,
        message: "Support email and password required",
        adminError: true,
      };
    }
    let auth = { user, pass };
    console.log("auth is", auth);
    let smtpTrans = nodemailer.createTransport({
      service: "gmail",
      auth,
    });

    let info = await smtpTrans.sendMail(mailOptions);

    console.log("Message sent:", info.messageId);
    return info;
  } catch (e) {
    console.log("Send Email error", e);
    return e;
  }
}
module.exports = sendMail;
