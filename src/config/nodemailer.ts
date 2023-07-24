import nodemailer from 'nodemailer';
import ejs from 'ejs';
import * as path from 'path';
import * as process from "process";

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  auth: {
    user: process.env.MAILER_FROM,
    pass: process.env.MAILER_SECRET,
  },
});

export const renderTemplate = async (
  relativePath: string,
  data?: ejs.Data,
): Promise<string> => {
  return await ejs.renderFile(
    path.join(__dirname, '../../views/mailers', relativePath),
    data,
  );
};
