import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!user || !pass) {
      console.log(`[Email Service - Simulated] To: ${to} | Subject: ${subject}`);
      console.log(`[Email Service - Note] EMAIL_USER / EMAIL_PASS not configured in .env. Email was logged rather than sent.`);
      return { success: true, simulated: true };
    }

    const transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || "gmail",
      host: process.env.EMAIL_HOST || "smtp.gmail.com",
      port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
      secure: process.env.EMAIL_SECURE === "false" ? false : true,
      auth: {
        user,
        pass,
      },
    });

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || `"Tasky Team" <${user}>`,
      to,
      subject,
      text: text || "",
      html,
    });

    console.log(`[Email Service - Success] Message sent to ${to}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("[Email Service - Error]", error.message);
    return { success: false, error: error.message };
  }
};

export const getPasswordResetEmailTemplate = ({ resetUrl, userEmail }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .content { padding: 36px 32px; color: #334155; line-height: 1.6; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background: #4f46e5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2); }
    .footer { padding: 24px 32px; background-color: #f1f5f9; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
    .link-alt { word-break: break-all; color: #4f46e5; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tasky</h1>
    </div>
    <div class="content">
      <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">Password Reset Request</h2>
      <p>Hello,</p>
      <p>We received a request to reset the password for your account associated with <strong>${userEmail}</strong>.</p>
      <p>Click the button below to choose a new password. This link will expire in <strong>1 hour</strong>.</p>
      <div class="btn-container">
        <a href="${resetUrl}" class="btn" target="_blank">Reset Password</a>
      </div>
      <p style="font-size: 13px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${resetUrl}" class="link-alt">${resetUrl}</a></p>
      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">If you didn't request a password reset, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Tasky Management Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
};

export const getTeamInvitationEmailTemplate = ({ inviteUrl, inviterName, role, title, email }) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>You're Invited to Join Tasky</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0; }
    .container { max-width: 580px; margin: 40px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%); padding: 32px; text-align: center; color: #ffffff; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .content { padding: 36px 32px; color: #334155; line-height: 1.6; }
    .badge { display: inline-block; background-color: #e0e7ff; color: #4338ca; font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 9999px; margin-bottom: 16px; }
    .btn-container { text-align: center; margin: 32px 0; }
    .btn { background: #4f46e5; color: #ffffff !important; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; box-shadow: 0 2px 4px rgba(79, 70, 229, 0.2); }
    .footer { padding: 24px 32px; background-color: #f1f5f9; text-align: center; color: #64748b; font-size: 13px; border-top: 1px solid #e2e8f0; }
    .link-alt { word-break: break-all; color: #4f46e5; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Tasky</h1>
    </div>
    <div class="content">
      <div class="badge">Team Invitation</div>
      <h2 style="margin-top: 0; color: #0f172a; font-size: 20px;">You've Been Invited to Join the Team!</h2>
      <p>Hello,</p>
      <p><strong>${inviterName || "Your Team Admin"}</strong> has invited you to join the Tasky workspace as <strong>${title || "Team Member"}</strong> (Role: <em>${role}</em>).</p>
      <p>Click the button below to accept the invitation and activate your account. You can sign in using Google or create a password.</p>
      <div class="btn-container">
        <a href="${inviteUrl}" class="btn" target="_blank">Accept Invitation & Join Team</a>
      </div>
      <p style="font-size: 13px; color: #64748b;">If the button above doesn't work, copy and paste this link into your browser:</p>
      <p><a href="${inviteUrl}" class="link-alt">${inviteUrl}</a></p>
      <p style="font-size: 13px; color: #64748b; margin-top: 24px;">This invitation link will expire in 48 hours.</p>
    </div>
    <div class="footer">
      &copy; ${new Date().getFullYear()} Tasky Management Platform. All rights reserved.
    </div>
  </div>
</body>
</html>
  `;
};
