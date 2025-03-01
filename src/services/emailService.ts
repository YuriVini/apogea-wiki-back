/* eslint-disable max-len */
import nodemailer from "nodemailer";

interface WelcomeEmailData {
  name: string;
  email: string;
  locale: string;
  password: string;
}

type Locale = "br" | "es" | "fr" | "us";

interface ResetPasswordEmailData {
  name: string;
  email: string;
  token: string;
  locale: Locale;
}

interface FlightIssueEmailData {
  name: string;
  email: string;
  locale: string;
  fileName?: string;
  signedFileUrl: string;
  protocolNumber: string;
}

const translations = {
  us: {
    emailLabel: "Email",
    passwordLabel: "Password",
    footerTeam: "iKlaim Team",
    flightIssueGreeting: "Hello",
    footerMessage: "Best regards,",
    buttonText: "Reset your password",
    welcomeSubject: "Welcome to iKlaim",
    recoverPassword: "Password Recovery",
    footerLinks: "Official Site | Contact",
    flightIssueButtonText: "Download file",
    flightIssueTitle: "Flight Issue Created",
    resetPasswordSubject: "Password Recovery",
    flightIssueProtocolLabel: "Protocol Number",
    flightIssueSubject: "Your claim has been created successfully",
    flightIssueCongratsMessage: "Your claim was created successfully.",
    flightIssueDownloadMessage: "Here is your signed document available for download:",
    welcomeMessage: "Your account has been created successfully and is ready to be used.",
    resetPasswordMessage: "You have requested to reset your password. Click the button below to proceed.",
    warningMessage: "⚠️ Please log in and change your password as soon as possible to ensure the security of your account.",
  },
  br: {
    emailLabel: "E-mail",
    passwordLabel: "Senha",
    flightIssueGreeting: "Olá",
    footerTeam: "Equipe iKlaim",
    footerMessage: "Atenciosamente,",
    buttonText: "Redefinir sua senha",
    welcomeSubject: "Bem-vindo à iKlaim",
    footerLinks: "Site Oficial | Contato",
    recoverPassword: "Redefinição de Senha",
    flightIssueButtonText: "Baixar arquivo",
    flightIssueTitle: "Reivindicação Criada",
    resetPasswordSubject: "Redefinição de Senha",
    flightIssueProtocolLabel: "Número de Protocolo",
    flightIssueSubject: "Sua reivindicação foi criada com sucesso",
    flightIssueCongratsMessage: "Sua reivindicação foi criada com sucesso.",
    welcomeMessage: "Sua conta foi criada com sucesso e está pronta para ser utilizada.",
    flightIssueDownloadMessage: "Aqui está o documento assinado disponível para download:",
    resetPasswordMessage: "Você solicitou a redefinição de sua senha. Clique no botão abaixo para prosseguir.",
    warningMessage: "⚠️ Por favor, faça login e altere sua senha o mais breve possível para garantir a segurança da sua conta.",
  },
  es: {
    passwordLabel: "Contraseña",
    footerTeam: "Equipo iKlaim",
    flightIssueGreeting: "Hola",
    footerMessage: "Atentamente,",
    emailLabel: "Correo electrónico",
    flightIssueTitle: "Reclamación Creada",
    welcomeSubject: "¡Bienvenido a iKlaim!",
    buttonText: "Restablecer tu contraseña",
    footerLinks: "Sitio Oficial | Contacto",
    flightIssueButtonText: "Descargar archivo",
    recoverPassword: "Recuperación de Contraseña",
    flightIssueProtocolLabel: "Número de Protocolo",
    resetPasswordSubject: "Recuperación de Contraseña",
    flightIssueSubject: "Tu reclamación se ha creado con éxito",
    flightIssueCongratsMessage: "Tu reclamación se ha creado con éxito.",
    welcomeMessage: "Tu cuenta ha sido creada con éxito y está lista para usarse.",
    flightIssueDownloadMessage: "Aquí está el documento firmado disponible para descargar:",
    resetPasswordMessage: "Has solicitado restablecer tu contraseña. Haz clic en el botón a continuación para continuar.",
    warningMessage: "⚠️ Por favor, inicia sesión y cambia tu contraseña lo antes posible para garantizar la seguridad de tu cuenta.",
  },
  fr: {
    emailLabel: "Email",
    footerTeam: "Équipe iKlaim",
    passwordLabel: "Mot de passe",
    footerMessage: "Cordialement,",
    flightIssueGreeting: "Bonjour",
    flightIssueTitle: "Réclamation Créée",
    welcomeSubject: "Bienvenue sur iKlaim",
    footerLinks: "Site officiel | Contact",
    buttonText: "Réinitialiser votre mot de passe",
    flightIssueProtocolLabel: "Numéro de protocole",
    flightIssueButtonText: "Télécharger le fichier",
    recoverPassword: "Réinitialisation de mot de passe",
    resetPasswordSubject: "Réinitialisation de mot de passe",
    flightIssueSubject: "Votre réclamation a été créée avec succès",
    flightIssueCongratsMessage: "Votre réclamation a été créée avec succès.",
    welcomeMessage: "Votre compte a été créé avec succès et est prêt à être utilisé.",
    flightIssueDownloadMessage: "Voici votre document signé disponible au téléchargement :",
    resetPasswordMessage: "Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer.",
    warningMessage: "⚠️ Veuillez vous connecter et changer votre mot de passe dès que possible pour garantir la sécurité de votre compte.",
  },
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

  const { emailLabel, buttonText, footerTeam, footerLinks, passwordLabel, footerMessage, welcomeSubject, welcomeMessage, warningMessage } =
    translations[data.locale as keyof typeof translations];

  const welcomeEmailTemplate = `
    <!DOCTYPE html>
    <html lang="${data.locale === "br" ? "pt-BR" : data.locale}">
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
                <img src="https://iklaim.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.0dee9f31.png&w=3840&q=75&dpl=dpl_5mh7hh8WHcXqNqtkRYGWT7hjk9RS" alt="Logo iKlaim">
            </div>
            <div class="content">
                <h1>${welcomeSubject}, ${data.name}!</h1>
                <p>${welcomeMessage}</p>
                <p><strong>${emailLabel}:</strong> ${data.email}</p>
                <p><strong>${passwordLabel}:</strong> ${data.password}</p>
                <p><strong>${warningMessage}</strong></p>
                <div class="button-container">
                    <a href="https://iklaim.com/sign-in" class="cta-button">${buttonText}</a>
                </div>
            </div>
            <div class="footer">
                <p>${footerMessage}</p>
                <p><strong>${footerTeam}</strong></p>
                <p><a href="https://iklaim.com">${footerLinks.split(" | ")[0]}</a> | <a href="mailto:contact@iklaim.com">${footerLinks.split(" | ")[1]}</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: data.email,
    subject: welcomeSubject,
    html: welcomeEmailTemplate,
    from: `"iKlaim" <${process.env.EMAIL_FROM}>`,
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

  const resetLink = `https://iklaim.com/${data.locale}/reset-password?token=${data.token}`;

  const { buttonText, footerTeam, footerLinks, footerMessage, warningMessage, resetPasswordSubject, resetPasswordMessage } = translations[data.locale as keyof typeof translations];

  const resetEmailTemplate = `
    <!DOCTYPE html>
    <html lang="${data.locale === "br" ? "pt-BR" : data.locale}">
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
                <img src="https://iklaim.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.0dee9f31.png&w=3840&q=75&dpl=dpl_5mh7hh8WHcXqNqtkRYGWT7hjk9RS" alt="Logo iKlaim">
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
                <p><a href="https://iklaim.com">${footerLinks.split(" | ")[0]}</a> | <a href="mailto:contact@iklaim.com">${footerLinks.split(" | ")[1]}</a></p>
            </div>
        </div>
    </body>
    </html>
  `;

  const mailOptions = {
    to: data.email,
    html: resetEmailTemplate,
    subject: resetPasswordSubject,
    from: `"iKlaim" <${process.env.EMAIL_FROM}>`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendFlightIssueEmail = async (data: FlightIssueEmailData) => {
  const transporter = nodemailer.createTransport({
    secure: true,
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const {
    footerTeam,
    footerLinks,
    footerMessage,
    flightIssueTitle,
    flightIssueSubject,
    flightIssueGreeting,
    flightIssueButtonText,
    flightIssueProtocolLabel,
    flightIssueDownloadMessage,
    flightIssueCongratsMessage,
  } = translations[data.locale as keyof typeof translations];

  // Template HTML de exemplo
  const flightIssueEmailTemplate = `
      <!DOCTYPE html>
      <html lang="${data.locale === "br" ? "pt-BR" : data.locale}">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${flightIssueSubject}</title>
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
                  <img src="https://iklaim.com/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Flogo.0dee9f31.png&w=3840&q=75&dpl=dpl_5mh7hh8WHcXqNqtkRYGWT7hjk9RS" alt="Logo iKlaim">
              </div>
              <div class="content">
                  <h1>${flightIssueTitle}</h1>
                  <p>${flightIssueGreeting} <strong>${data.name}</strong>,</p>
                  <p>${flightIssueCongratsMessage}</p>
                  <p><strong>${flightIssueProtocolLabel}:</strong> ${data.protocolNumber}</p>
                  <p>${flightIssueDownloadMessage}</p>
                  <div class="button-container">
                    <a href="${data.signedFileUrl}" class="cta-button" download="${data.fileName ?? ""}">
                      ${flightIssueButtonText}
                    </a>
                  </div>
              </div>
              <div class="footer">
                  <p>${footerMessage}</p>
                  <p><strong>${footerTeam}</strong></p>
                  <p>
                    <a href="https://iklaim.com">${footerLinks.split(" | ")[0]}</a> | 
                    <a href="mailto:contact@iklaim.com">${footerLinks.split(" | ")[1]}</a>
                  </p>
              </div>
          </div>
      </body>
      </html>
    `;

  const mailOptions = {
    to: data.email,
    subject: flightIssueSubject,
    html: flightIssueEmailTemplate,
    from: `"iKlaim" <${process.env.EMAIL_FROM}>`,
  };

  await transporter.sendMail(mailOptions);
};
