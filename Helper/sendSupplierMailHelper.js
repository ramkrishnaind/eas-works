// this function creates html from the template and send mail to the user
// for user authentication on signup or forget password

const handlebars = require("handlebars");
var nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs");
var smtpTransport = require("nodemailer-smtp-transport");

var transporter = nodemailer.createTransport(
  smtpTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    auth: {
      user: "info@vishalconstructioncompany.com",
      pass: "Dzone@4422",
    },
  })
);

const sendMailFunc = require("./sendMail");

function readHTMLFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, { encoding: "utf-8" }, (err, html) => {
            if (err) reject(err);
            resolve(html);
        });
    });
}
async function sendSupplierMail({ filePath, replacements, to, subject, attachments, from }) {
    try {
        let htmlFile = await readHTMLFile(filePath);
        // console.log('html',filePath);
        let template = handlebars.compile(htmlFile);
        let htmlToSend = template(replacements);
        // console.log('replacements', replacements, htmlToSend);
        
        let files = [];
        console.log('attachments is', attachments)
        var templateSender = {
            from,
            to,
            subject,
            html: htmlToSend,
            attachments,
        };
        console.log("Sending Mail", templateSender, '    env is', process.env.NODE_ENV);
        transporter.sendMail(templateSender, function (error, success) {
            if (error) {
                return console.log(error);
            }
            else {
                console.log("Email sent: " + success.response);
            }
            transporter.close();
        });
    } catch (e) {
        console.log("error", e);
    }
}

module.exports = sendSupplierMail;
