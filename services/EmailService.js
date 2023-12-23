const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "khialyyasin@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

async function sendEmail(email, message) {
  const info = await transporter.sendMail({
    from: "Yaseen Afridi", // sender address
    to: email, // list of receivers
    subject: "Assalam O Alaikum ", // Subject line
    text: message, // plain text body
  });
}

module.exports = sendEmail;
