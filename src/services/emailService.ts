/* eslint-disable max-len */
import nodemailer from "nodemailer";

interface WelcomeEmailData {
  name: string;
  email: string;
  password: string;
}

interface ResetPasswordEmailData {
  name: string;
  email: string;
  token: string;
}

const translations = {
  greeting: "Hello",
  emailLabel: "E-mail",
  passwordLabel: "Password",
  footerTeam: "Apogea Wiki Team",
  footerMessage: "Best regards,",
  buttonText: "Reset your password",
  recoverPassword: "Password Reset",
  resetPasswordSubject: "Password Reset",
  welcomeSubject: "Welcome to Apogea Wiki",
  footerLinks: "Official Website | Contact",
  welcomeMessage: "Your account has been successfully created and is ready to use.",
  resetPasswordMessage: "You requested to reset your password. Click the button below to proceed.",
  warningMessage: "⚠️ Please login and change your password as soon as possible to ensure your account security.",
};

export const sendWelcomeEmail = async (data: WelcomeEmailData) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { emailLabel, buttonText, footerTeam, footerLinks, passwordLabel, footerMessage, welcomeSubject, welcomeMessage, warningMessage } = translations;

  const welcomeEmailTemplate = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${welcomeSubject}</title>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Manrope', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-width: 250px;
            }
            .content {
                color: #333333;
                line-height: 1.6;
            }
            .content h1 {
                font-size: 24px;
                color: #333;
            }
            .content p {
                margin: 10px 0;
            }
            .button-container {
                text-align: center;
            }
            .cta-button {
                display: inline-block;
                margin-top: 20px;
                margin-bottom: 40px;
                padding: 12px 20px;
                background-color: #00A8E1;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                width: 250px;
                text-align: center;
            }
            .cta-button:hover {
                background-color: #1A2163;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="/logo.png" alt="Logo Apogea Wiki">
            </div>
            <div class="content">
                <h1>${welcomeSubject}, ${data.name}!</h1>
                <p>${welcomeMessage}</p>
                <p><strong>${emailLabel}:</strong> ${data.email}</p>
                <p><strong>${passwordLabel}:</strong> ${data.password}</p>
                <p><strong>${warningMessage}</strong></p>
                <div class="button-container">
                    <a href="https://apogea.wiki.com/sign-in" class="cta-button">${buttonText}</a>
                </div>
            </div>
            <div class="footer">
                <p>${footerMessage}</p>
                <p><strong>${footerTeam}</strong></p>
                <p><a href="https://apogea.wiki.com">${footerLinks.split(" | ")[0]}</a> | <a href="mailto:contact@apogea.wiki.com">${footerLinks.split(" | ")[1]}</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: data.email,
    subject: welcomeSubject,
    html: welcomeEmailTemplate,
    from: `"Apogea Wiki" <${process.env.EMAIL_FROM}>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendResetPasswordEmail = async (data: ResetPasswordEmailData) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetLink = `https://apogea.wiki.com/reset-password?token=${data.token}`;

  const { buttonText, footerTeam, footerLinks, footerMessage, warningMessage, resetPasswordSubject, resetPasswordMessage } = translations;

  const resetEmailTemplate = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${resetPasswordSubject}</title>
        <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;600&display=swap" rel="stylesheet">
        <style>
            body {
                font-family: 'Manrope', Arial, sans-serif;
                margin: 0;
                padding: 0;
                background-color: #f4f4f4;
            }
            .container {
                max-width: 600px;
                margin: 20px auto;
                background: #ffffff;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 20px;
            }
            .header img {
                max-width: 250px;
            }
            .content {
                color: #333333;
                line-height: 1.6;
            }
            .content h1 {
                font-size: 24px;
                color: #333;
            }
            .content p {
                margin: 10px 0;
            }
            .button-container {
                text-align: center;
            }
            .cta-button {
                display: inline-block;
                margin-top: 20px;
                margin-bottom: 40px;
                padding: 12px 20px;
                background-color: #00A8E1;
                color: #ffffff;
                text-decoration: none;
                border-radius: 5px;
                font-weight: bold;
                width: 250px;
                text-align: center;
            }
            .cta-button:hover {
                background-color: #1A2163;
            }
            .footer {
                margin-top: 20px;
                text-align: center;
                font-size: 14px;
                color: #333;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <img src="/logo.png" alt="Logo Apogea Wiki">
            </div>
            <div class="content">
                <h1>${resetPasswordSubject}, ${data.name}!</h1>
                <p>${resetPasswordMessage}</p>
                <a href="${resetLink}" class="cta-button">${buttonText}</a>
                <p>${warningMessage}</p>
            </div>
            <div class="footer">
                <p>${footerMessage}</p>
                <p><strong>${footerTeam}</strong></p>
                <p><a href="https://apogea.wiki.com">${footerLinks.split(" | ")[0]}</a> | <a href="mailto:contact@apogea.wiki.com">${footerLinks.split(" | ")[1]}</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: data.email,
    html: resetEmailTemplate,
    subject: resetPasswordSubject,
    from: `"Apogea Wiki" <${process.env.EMAIL_FROM}>`,
  };

  await transporter.sendMail(mailOptions);
};
