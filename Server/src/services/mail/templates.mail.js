// * Verification Mail Template
const VERIFICATION_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <!-- Using base64 logo as fallback if server image doesn't load -->
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Verify Your Email ✨</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">Welcome to {COMPANY.name}! To begin your journey with us, please verify your email address using the code below:</p>
    
    <!-- Verification Code Box -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
        <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">{verificationCode}</span>
      </div>
    </div>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">This verification code will expire in 10 minutes</li>
        <li style="margin: 10px 0;">Enter this code on the verification page to activate your account</li>
        <li style="margin: 10px 0;">Keep this code confidential and do not share it with anyone</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">If you didn't create an account with us, please contact our security team immediately at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">We're excited to have you join our community!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Reset Password Success Mail Template
const RESET_PASSWORD_SUCCESS_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Password Reset Successful - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Password Reset Successful ✓</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">Your account password has been successfully reset. Your account security is important to us, and we're here to help keep your information safe.</p>
    
    <!-- Success Icon -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.success.gradient}; color: white; width: 70px; height: 70px; line-height: 70px; border-radius: 50%; display: inline-block; font-size: 32px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
        ✓
      </div>
    </div>
    
    <!-- Security Recommendations Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">🔐 Security Recommendations:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Create a strong, unique password with a mix of characters</li>
        <li style="margin: 10px 0;">Enable two-factor authentication for enhanced security</li>
        <li style="margin: 10px 0;">Regularly update your security credentials</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">Important: If you did not initiate this password reset, please contact our security team immediately at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for helping us maintain the security of your account. We're here if you need any assistance!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Reset Password Request Mail Template
const RESET_PASSWORD_REQUEST_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Reset Your Password 🔑</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">We received a request to reset your password for your account at {COMPANY.name}. To complete the process, please click the button below:</p>
    
    <!-- Reset Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{resetURL}" style="display: inline-block; background: {COMPANY.COLORS.primary.gradient}; color: white; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); font-size: 16px;">Reset Password</a>
    </div>
    
    <!-- Alternative Link -->
    <p style="font-size: 14px; color: #4a5568; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 14px; color: #4a5568; text-align: center; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 10px 0;">
      <a href="{resetURL}" style="color: {COMPANY.TYPOGRAPHY.primary}; text-decoration: none;">{resetURL}</a>
    </p>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">This link will expire in 10 minutes</li>
        <li style="margin: 10px 0;">For security reasons, this link can only be used once</li>
        <li style="margin: 10px 0;">Create a strong password that you don't use for other websites</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">If you didn't request a password reset, please ignore this email or contact our security team at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for using {COMPANY.name}!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Welcome Mail Template
const WELCOME_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Welcome to {COMPANY.name}! 🎉</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">Thank you for joining {COMPANY.name}! Your account has been successfully created and is now ready to use.</p>
    
    <!-- Success Icon -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.success.gradient}; color: white; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; display: inline-block; font-size: 40px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
        ✓
      </div>
    </div>
    
    <!-- Get Started Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{COMPANY.url}/dashboard" style="display: inline-block; background: {COMPANY.COLORS.primary.gradient}; color: white; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); font-size: 16px;">Get Started</a>
    </div>
    
    <!-- Features Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">Here's what you can do with your new account:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Access your personalized dashboard</li>
        <li style="margin: 10px 0;">Manage your security settings</li>
        <li style="margin: 10px 0;">Enable two-factor authentication for enhanced security</li>
        <li style="margin: 10px 0;">Update your profile information</li>
      </ul>
    </div>
    
    <!-- Security Tips Box -->
    <div style="background: linear-gradient(to right, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid #F59E0B;">
      <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 500;">🔐 Security Tip: We recommend enabling two-factor authentication for an extra layer of security.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">We're excited to have you on board! If you have any questions, our support team is here to help.</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SUPPORT.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * 2 Factor Authentication Mail Template
const TWO_FACTOR_VERIFICATION_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication Code - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Two-Factor Authentication Code 🔐</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">You've requested to sign in to your account. For added security, please use the verification code below:</p>
    
    <!-- Verification Code Box -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 20px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
        <span style="color: white; font-size: 32px; font-weight: bold; letter-spacing: 8px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">{verificationCode}</span>
      </div>
    </div>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">This verification code will expire in 5 minutes</li>
        <li style="margin: 10px 0;">Enter this code on the verification page to complete your sign-in</li>
        <li style="margin: 10px 0;">Keep this code confidential and do not share it with anyone</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">If you didn't request a password reset, please ignore this email or contact our security team at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for helping us keep your account secure!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * 2 Factor Authentication Enabled Mail Template
const TWO_FACTOR_ENABLED_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Two-Factor Authentication Enabled - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Two-Factor Authentication Enabled ✅</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">You have successfully enabled two-factor authentication for your account. Your account is now protected with an additional layer of security.</p>
    
    <!-- Success Icon -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.success.gradient}; color: white; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; display: inline-block; font-size: 40px; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);">
        ✓
      </div>
    </div>
    
    <!-- Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">What this means for you:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Each time you sign in, you'll need to enter a verification code</li>
        <li style="margin: 10px 0;">Your account is now protected against unauthorized access even if your password is compromised</li>
        <li style="margin: 10px 0;">You can manage your two-factor authentication settings from your account security page</li>
      </ul>
    </div>
    
    <!-- Backup Codes Reminder -->
    <div style="background: linear-gradient(to right, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid #F59E0B;">
      <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 500;">🔑 Important: Make sure to save your backup codes in a secure location. You'll need them if you lose access to your authentication device.</p>
    </div>
    
    <!-- Account Management Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{COMPANY.url}/account/security" style="display: inline-block; background: {COMPANY.COLORS.primary.gradient}; color: white; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); font-size: 16px;">Manage Security Settings</a>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">If you did not enable two-factor authentication for your account, please contact our security team immediately at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for taking steps to secure your account!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Account Locked Mail Template
const ACCOUNT_LOCKED_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Account Security Alert - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.error.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Account Security Alert ⚠️</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">We've detected unusual activity on your account. For your security, we've temporarily locked your account.</p>
    
    <!-- Alert Icon -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: {COMPANY.COLORS.error.gradient}; color: white; width: 80px; height: 80px; line-height: 80px; border-radius: 50%; display: inline-block; font-size: 40px; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);">
        ⚠️
      </div>
    </div>
    
    <!-- Details Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(239, 68, 68, 0.2);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">Details:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Time of detection: {detectionTime}</li>
        <li style="margin: 10px 0;">Reason: {lockReason}</li>
        <li style="margin: 10px 0;">IP Address: {ipAddress}</li>
        <li style="margin: 10px 0;">Device: {deviceInfo}</li>
      </ul>
    </div>
    
    <!-- Action Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{unlockURL}" style="display: inline-block; background: {COMPANY.COLORS.primary.gradient}; color: white; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); font-size: 16px;">Unlock My Account</a>
    </div>
    
    <!-- Alternative Link -->
    <p style="font-size: 14px; color: #4a5568; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 14px; color: #4a5568; text-align: center; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 10px 0;">
      <a href="{unlockURL}" style="color: {COMPANY.TYPOGRAPHY.primary}; text-decoration: none;">{unlockURL}</a>
    </p>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">What to do next:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Click the button above to verify your identity and unlock your account</li>
        <li style="margin: 10px 0;">Change your password immediately after unlocking your account</li>
        <li style="margin: 10px 0;">Enable two-factor authentication if you haven't already</li>
        <li style="margin: 10px 0;">Review your recent account activity for any unauthorized actions</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(245, 158, 11, 0.05), rgba(245, 158, 11, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid #F59E0B;">
      <p style="color: #92400E; font-size: 14px; margin: 0; font-weight: 500;">If you did not attempt to access your account from this location, please contact our security team immediately at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: #92400E; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for your patience while we work to keep your account secure.</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Backup Codes Mail Template
const BACKUP_CODES_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Backup Codes - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Your Backup Codes 🔑</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">You've successfully enabled two-factor authentication for your account. Here are your backup codes that you can use if you lose access to your authentication device:</p>
    
    <!-- Backup Codes Box -->
    <div style="text-align: center; margin: 35px 0;">
      <div style="background: #f3f4f6; padding: 25px; border-radius: 12px; display: inline-block; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); text-align: left; width: 80%;">
        {backupCodes}
      </div>
    </div>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0; font-weight: 600;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">Each backup code can only be used once</li>
        <li style="margin: 10px 0;">Store these codes in a secure location</li>
        <li style="margin: 10px 0;">You can generate new backup codes at any time from your account settings</li>
        <li style="margin: 10px 0;">These codes will allow you to access your account if you lose your authentication device</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">Keep these codes confidential. Anyone with access to these codes could potentially access your account. If you believe your codes have been compromised, please generate new ones immediately.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for enhancing the security of your account!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;

// * Verify Mail Request Without RefreshToken Mail Template
const VERIFY_MAIL_REQUEST_MAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Your Password - {COMPANY.name}</title>
</head>
<body style="font-family: {COMPANY.TYPOGRAPHY.fontFamily}; line-height: {COMPANY.TYPOGRAPHY.lineHeight}; color: #2d3748; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f7fafc;">
  <!-- Header Section -->
  <div style="background: {COMPANY.COLORS.primary.gradient}; padding: 35px; text-align: center; border-radius: 15px 15px 0 0; box-shadow: 0 4px 6px rgba(0,0,0,0.2);">
    <img src="{COMPANY.logoBase64}" alt="{COMPANY.name} Logo" style="width: 120px; height: auto; margin-bottom: 20px;">
    <h1 style="color: white; margin: 0; font-size: 28px; text-shadow: 2px 2px 4px rgba(0,0,0,0.2);">Reset Your Password 🔑</h1>
  </div>
  
  <!-- Content Section -->
  <div style="background: {COMPANY.COLORS.background.gradient}; padding: 40px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
    <p style="font-size: 16px; color: #4a5568;">Dear {username},</p>
    <p style="font-size: 16px; color: #4a5568;">We received a request to reset your password for your account at {COMPANY.name}. To complete the process, please click the button below:</p>
    
    <!-- Reset Button -->
    <div style="text-align: center; margin: 35px 0;">
      <a href="{verifyMailURL}" style="display: inline-block; background: {COMPANY.COLORS.primary.gradient}; color: white; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3); font-size: 16px;">Verify Email</a>
    </div>
    
    <!-- Alternative Link -->
    <p style="font-size: 14px; color: #4a5568; text-align: center;">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 14px; color: #4a5568; text-align: center; word-break: break-all; background-color: #f3f4f6; padding: 12px; border-radius: 6px; margin: 10px 0;">
      <a href="{verifyMailURL}" style="color: {COMPANY.TYPOGRAPHY.primary}; text-decoration: none;">{verifyMailURL}</a>
    </p>
    
    <!-- Important Information Box -->
    <div style="background: linear-gradient(to right, rgba(99, 102, 241, 0.08), rgba(79, 70, 229, 0.08)); padding: 25px; border-radius: 12px; margin: 25px 0; border: 1px solid rgba(99, 102, 241, 0.1);">
      <p style="color: #4a5568; margin: 0;">Important Information:</p>
      <ul style="color: #4a5568; margin: 15px 0;">
        <li style="margin: 10px 0;">This link will expire in 10 minutes</li>
        <li style="margin: 10px 0;">For security reasons, this link can only be used once</li>
        <li style="margin: 10px 0;">Create a strong password that you don't use for other websites</li>
      </ul>
    </div>
    
    <!-- Warning Box -->
    <div style="background: linear-gradient(to right, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.1)); padding: 20px; border-radius: 10px; border-left: 4px solid {COMPANY.COLORS.error.main};">
      <p style="color: {COMPANY.COLORS.error.dark}; font-size: 14px; margin: 0;">If you didn't request a password reset, please ignore this email or contact our security team at <a href="mailto:{COMPANY.DEPARTMENTS.SECURITY.email}" style="color: {COMPANY.COLORS.error.dark}; font-weight: bold;">{COMPANY.DEPARTMENTS.SECURITY.email}</a>.</p>
    </div>
    
    <!-- Closing -->
    <p style="color: #4a5568; margin-top: 35px;">Thank you for using {COMPANY.name}!</p>
    <p style="color: #4a5568;">Best regards,<br><span style="color: {COMPANY.TYPOGRAPHY.primary}; font-weight: 600;">{COMPANY.DEPARTMENTS.SECURITY.signature}</span></p>
  </div>
  
  <!-- Footer Section -->
  <div style="text-align: center; margin-top: 25px; padding: 20px; background: linear-gradient(to right, rgba(99, 102, 241, 0.03), rgba(79, 70, 229, 0.03)); border-radius: 10px;">
    <p style="color: #4a5568; font-weight: 600; font-size: 14px; margin-bottom: 15px;">{COMPANY.slogan}</p>
    
    <!-- Social Media Links -->
    <div style="margin-top: 20px; text-align: center;">
      <a href="{COMPANY.SOCIALS.FACEBOOK.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.FACEBOOK.iconBase64}" alt="Facebook" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.X.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.X.iconBase64}" alt="Twitter" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.LINKEDIN.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.LINKEDIN.iconBase64}" alt="LinkedIn" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.INSTAGRAM.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.INSTAGRAM.iconBase64}" alt="Instagram" style="width: 24px; height: 24px;"></a>
      <a href="{COMPANY.SOCIALS.YOUTUBE.url}" style="text-decoration: none; margin: 0 10px;"><img src="{COMPANY.SOCIALS.YOUTUBE.iconBase64}" alt="YouTube" style="width: 24px; height: 24px;"></a>
    </div>
    
    <!-- Legal Links -->
    <div style="margin-top: 15px; text-align: center;">
      <a href="{COMPANY.PRIVACY_POLICY_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Privacy Policy</a>
      <a href="{COMPANY.TERMS_OF_SERVICE_PAGE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Terms of Service</a>
      <a href="{COMPANY.UNSUBSCRIBE}" style="color: #6b7280; text-decoration: none; margin: 0 10px; font-size: 12px;">Unsubscribe</a>
    </div>
    
    <!-- Company Info -->
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.headquarter_address}</p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 5px;">
      Contact us: <a href="mailto:{COMPANY.contact_email}" style="color: #6b7280;">{COMPANY.contact_email}</a>
    </p>
    <p style="color: #6b7280; font-size: 12px; margin-top: 15px;">{COMPANY.COPYRIGHT}</p>
  </div>
</body>
</html>
`;


export {
  VERIFICATION_MAIL_TEMPLATE,
  RESET_PASSWORD_SUCCESS_MAIL_TEMPLATE,
  RESET_PASSWORD_REQUEST_MAIL_TEMPLATE,
  WELCOME_MAIL_TEMPLATE,
  TWO_FACTOR_VERIFICATION_MAIL_TEMPLATE,
  TWO_FACTOR_ENABLED_MAIL_TEMPLATE,
  ACCOUNT_LOCKED_MAIL_TEMPLATE,
  BACKUP_CODES_MAIL_TEMPLATE,
  VERIFY_MAIL_REQUEST_MAIL_TEMPLATE
};