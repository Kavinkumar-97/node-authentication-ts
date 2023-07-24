import { transporter, renderTemplate } from '@config/nodemailer';
import { IUser } from '@models/user';

export const sendForgotPasswordEmail = async (user: IUser, token: string) => {
  const htmlContent = await renderTemplate('/forgot-password.ejs', {
    user,
    token,
  });

  await transporter.sendMail({
    from: process.env.MAILER_FROM,
    to: user.email,
    subject: 'Reset your password on Node Authentication',
    html: htmlContent,
  });
};
