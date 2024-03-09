const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
const awsServerlessExpress = require("aws-serverless-express");
const serverlessHttp = require("serverless-http");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  message: string;
}

app.post("/send-email", async (req, res) => {
  const { name, email, phone, message }: ContactForm = req.body;
  const msg = {
    to: "dhakalbishal930@gmail.com",
    from: "lightwebx@gmail.com",
    subject: "Message from Contact Form",
    html: `<b>Name</b>: ${name}<br>
            <b>Email</b>: ${email}<br>
            <b>Phone</b>: ${phone}<br>
            <b>Message</b>: ${message}`,
  };

  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  try {
    await sgMail.send(msg);
    res.json({ message: "Email sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending email" });
  }
});

const handler = serverlessHttp(app);

const startServer = async () => {
  app.listen(3000, () => {
    console.log("listening on port 3000!");
  });
};

startServer();

module.exports.handler = (event, context, callback) => {
  const response = handler(event, context, callback);
  return response;
};
