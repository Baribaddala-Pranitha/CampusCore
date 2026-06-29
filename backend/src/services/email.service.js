import nodemailer from "nodemailer";

/**
 * Send a verification email to the user using Gmail SMTP
 * @param {string} toEmail 
 * @param {string} schoolName 
 * @param {string} token 
 */
export const sendVerificationEmail = async (toEmail, schoolName, token) => {
  // Construct the verification link
  const serverUrl = process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;
  const verificationLink = `${serverUrl}/api/auth/verify/${token}`;
  console.log("EMAIL_USER:", process.env.EMAIL_USER);
  console.log("EMAIL_PASS Loaded:", process.env.EMAIL_PASS ? "YES" : "NO");

  try {
    // Create the transporter using service: "gmail"
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify the transporter connection
    try {
      await transporter.verify();
      console.log("✓ Gmail SMTP Connected");
    } catch (verifyError) {
      console.error("❌ Gmail SMTP Connection Verification Failed:", verifyError);
      throw verifyError;
    }

    const mailOptions = {
      from: `"EduManage Support" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Verify Your EduManage Account",
      text: `Welcome to EduManage, ${schoolName}!\n\nPlease verify your email by clicking the following link:\n${verificationLink}\n\nThis link will expire in 24 hours.`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your EduManage Account</title>
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              background-color: #f3f4f6;
              margin: 0;
              padding: 0;
              -webkit-font-smoothing: antialiased;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border-radius: 12px;
              overflow: hidden;
              box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            }
            .header {
              background: linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%);
              padding: 40px 20px;
              text-align: center;
              color: #ffffff;
            }
            .logo {
              font-size: 28px;
              font-weight: bold;
              letter-spacing: 1px;
              margin-bottom: 10px;
            }
            .content {
              padding: 40px 30px;
              color: #374151;
              line-height: 1.6;
            }
            h1 {
              font-size: 22px;
              color: #111827;
              margin-top: 0;
              margin-bottom: 20px;
            }
            p {
              font-size: 16px;
              margin-bottom: 24px;
              color: #4b5563;
            }
            .btn-container {
              text-align: center;
              margin: 35px 0;
            }
            .btn {
              display: inline-block;
              background-color: #7c3aed;
              color: #ffffff !important;
              text-decoration: none;
              padding: 14px 30px;
              border-radius: 8px;
              font-weight: 600;
              font-size: 16px;
              box-shadow: 0 4px 6px rgba(124, 58, 237, 0.2);
              transition: background-color 0.2s;
            }
            .btn:hover {
              background-color: #6d28d9;
            }
            .fallback-container {
              background-color: #f9fafb;
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 15px;
              word-break: break-all;
              font-size: 13px;
              color: #6b7280;
              margin-top: 30px;
            }
            .fallback-title {
              font-weight: 600;
              margin-bottom: 5px;
              color: #4b5563;
            }
            .footer {
              background-color: #f9fafb;
              padding: 20px 30px;
              text-align: center;
              font-size: 12px;
              color: #9ca3af;
              border-top: 1px solid #f3f4f6;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">EduManage</div>
              <div style="font-size: 14px; opacity: 0.9;">School Management System</div>
            </div>
            <div class="content">
              <h1>Welcome to EduManage, ${schoolName}!</h1>
              <p>Thank you for registering. To get started and gain access to your school administration dashboard, please verify your email address by clicking the button below:</p>
              
              <div class="btn-container">
                <a href="${verificationLink}" class="btn" target="_blank">Verify Email Address</a>
              </div>
              
              <p>Please note that this verification link is valid for <strong>24 hours</strong>. If it expires, you can request a new link from the login page.</p>
              
              <div class="fallback-container">
                <div class="fallback-title">If the button doesn't work, copy and paste this URL into your browser:</div>
                <a href="${verificationLink}" style="color: #4f46e5; text-decoration: none;">${verificationLink}</a>
              </div>
            </div>
            <div class="footer">
              &copy; 2026 EduManage. All rights reserved.<br>
              If you did not create this account, please ignore this email.
            </div>
          </div>
        </body>
        </html>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`✓ Verification email sent successfully to ${toEmail}`);
    return info;
  } catch (error) {
    console.error(`❌ Failed to send verification email to ${toEmail}:`, error);
    throw error;
  }
};
