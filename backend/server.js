require("dotenv").config();
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
// const bodyparser = require("body-parser");
const serverless = require("serverless-http");

const app = express();

app.use(
  cors({
    origin: "https://alraheemtechnologies.online",
  })
);

app.use(express.json());


// Nodemailer Transport
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSWORD,
  },
});

// Routes
app.get("/", (req, res) => {
  // res.json({ success: true, message: "Server is running." });
  res.send("Server is running.");
});

app.post("/send-email", async (req, res) => {
  const { name, email, phone, message } = req.body;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL,
      to: process.env.TOEMAIL,
      subject: "New Quote Request",
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nMessage: ${message}`,
    });

    res.json({ success: true, message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Email sending failed." });
  }
});
const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Local server running on http://localhost:${PORT}`));

// ✅ Export for Vercel
module.exports = app;
// module.exports.handler = serverless(app);

// ✅ Local dev (optional)
// if (process.env.LOCAL === "true") {
//   const PORT = process.env.PORT || 5000;
//   app.listen(PORT, () => console.log(`Local server running on http://localhost:${PORT}`));
// }
