module.exports = (token) => {
  return `
    <div style="
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: auto;
      padding: 20px;
      background: #f8fafc;
      border-radius: 10px;
    ">
      
      <div style="
        background: #004AC6;
        padding: 20px;
        border-radius: 10px 10px 0 0;
        text-align: center;
      ">
        <h1 style="color:white; margin:0;">
          Logistic-Hub
        </h1>
      </div>

      <div style="
        background:white;
        padding:30px;
        border-radius:0 0 10px 10px;
      ">
        <h2 style="color:#111827;">
          Reset Your Password
        </h2>

        <p style="color:#4b5563; font-size:16px;">
          We received a request to reset your password.
          Click the button below to create a new password.
        </p>

        <div style="text-align:center; margin:30px 0;">
          <a 
            href="${process.env.FRONTEND_URL}/reset-password/${token}"
            style="
              background:#004AC6;
              color:white;
              padding:12px 25px;
              text-decoration:none;
              border-radius:6px;
              font-size:16px;
              display:inline-block;
            "
          >
            Reset Password
          </a>
        </div>

        <p style="color:#6b7280; font-size:14px;">
          This link will expire soon. If you did not request a password reset,
          you can safely ignore this email.
        </p>

        <hr style="border:none;border-top:1px solid #e5e7eb;">

        <p style="
          color:#9ca3af;
          font-size:13px;
          text-align:center;
        ">
          © ${new Date().getFullYear()} Logistic-Hub. All rights reserved.
        </p>

      </div>
    </div>
  `;
};