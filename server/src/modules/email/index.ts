import { dynamicsObject } from "@/interfaces";
import readHTMLFile from "../../utils/readHTMLFile";
import handlebars from 'handlebars';

const { createTransport } = require('nodemailer');

export default function(src: string, data: dynamicsObject, whom: string | string[] | any, title: string) {
  const send = (_err: Error, html: string) => {
    const template = handlebars.compile(html);
    sendMail(template(data), whom, title);
  };
  readHTMLFile(src, send);
};

function sendMail(html: string, email: string | string[], title: string) {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const options = {
    from: `"${process.env.PROJECT_NAME}" <${process.env.EMAIL_CURRENT_LOGIN}>`,
    to: email,
    subject: title,
    text: title,
    html,
  }
  
  transporter.sendMail(options).catch((err: Error) => {
    console.log(err);
  });
}