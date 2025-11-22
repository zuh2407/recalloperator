const nodemailer = require('nodemailer');

// Create Gmail transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

const sendRecallEmail = async (to, productName, customerName, refundAmount) => {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f4f7; color: #333; margin: 0; padding: 0; }
        .container { width: 100%; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #e11d48 0%, #be123c 100%); padding: 30px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 24px; text-transform: uppercase; letter-spacing: 2px; }
        .content { padding: 40px 30px; }
        .alert-badge { background-color: #fee2e2; color: #991b1b; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
        h2 { color: #1f2937; font-size: 20px; margin-top: 0; }
        p { line-height: 1.6; color: #4b5563; }
        .product-box { background-color: #fee2e2; border-left: 4px solid #e11d48; padding: 15px; margin: 20px 0; border-radius: 4px; }
        .product-name { font-weight: bold; color: #991b1b; font-size: 18px; }
        .refund-box { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center; }
        .refund-amount { font-size: 32px; font-weight: bold; margin: 10px 0; }
        .action-list { background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0; }
        .action-item { display: flex; align-items: center; margin: 10px 0; }
        .action-icon { background-color: #10b981; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px; font-weight: bold; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .ai-badge { background-color: #6366f1; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; display: inline-block; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ SAFETY ALERT</h1>
        </div>
        <div class="content">
          <div class="alert-badge">🚨 URGENT: Product Recall Notice</div>
          
          <h2>Dear ${customerName},</h2>
          <p>Our <strong>AI-powered Safety System</strong> has detected a <strong>CRITICAL RISK</strong> (Score ≥8) with a product you recently purchased.</p>
          
          <div class="product-box">
            <p style="margin:0; font-size:12px; text-transform:uppercase; color:#7f1d1d;">⚠️ AFFECTED PRODUCT</p>
            <div class="product-name">${productName}</div>
          </div>

          <div class="refund-box">
            <p style="margin:0; font-size:14px; opacity:0.9;">✅ AUTOMATIC REFUND PROCESSED</p>
            <div class="refund-amount">$${(refundAmount / 100).toFixed(2)}</div>
            <p style="margin:0; font-size:13px; opacity:0.9;">Your refund will be credited to your account shortly</p>
          </div>

          <div class="action-list">
            <p style="margin-top:0; font-weight:bold; color:#1f2937;">✅ Actions Taken by AI:</p>
            <div class="action-item">
              <div class="action-icon">✓</div>
              <span>Refund of $${(refundAmount / 100).toFixed(2)} initiated automatically</span>
            </div>
            <div class="action-item">
              <div class="action-icon">✓</div>
              <span>Product marked as recalled in our system</span>
            </div>
            <div class="action-item">
              <div class="action-icon">✓</div>
              <span>Safety team notified for investigation</span>
            </div>
          </div>

          <p><strong>⚠️ IMMEDIATE ACTION REQUIRED:</strong></p>
          <p>Please <strong>DISCARD THIS PRODUCT IMMEDIATELY</strong>. Do not consume or use it. Your safety is our top priority.</p>
          
          <p style="color:#6b7280; font-size:14px; margin-top:30px;">If you have any questions, please contact our customer support team.</p>
        </div>
        <div class="footer">
          <p>🤖 This is an automated message from the <strong>AI Safety System</strong></p>
          <div class="ai-badge">POWERED BY AUTONOMOUS AI</div>
          <p style="margin-top:10px;"><strong>ZuhairStore</strong> Customer Safety Team</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: '"ZuhairStore Safety AI 🛡️" <' + process.env.GMAIL_USER + '>',
    to: to,
    subject: `🚨 URGENT: Product Recall - ${productName} - Refund Processed`,
    text: `URGENT RECALL: ${productName}. Risk Score ≥8 detected. Refund of $${(refundAmount / 100).toFixed(2)} processed automatically. Please discard immediately.`,
    html: htmlContent,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`[Gmail] ✅ Email sent to ${to} - Message ID: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Gmail] ❌ Error:', error.message);
    return { success: false, error: error.message };
  }
};

module.exports = { sendRecallEmail };
