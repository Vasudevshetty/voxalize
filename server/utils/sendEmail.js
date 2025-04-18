const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, resetURL, username) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const html = `
    <div style="font-family: Arial, sans-serif; color: #333">
      <h2>Hello ${username},</h2>
      <p>You requested to reset your password. Click the button below:</p>
      <a href="${resetURL}" style="display: inline-block; background: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn't request this, just ignore this email.</p>
      <br />
      <p>Thanks,<br/>Team</p>
    </div>
  `;

  await transporter.sendMail({
    from: `"DB Agent Auth" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

module.exports = sendEmail;
