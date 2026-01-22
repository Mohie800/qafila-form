import nodemailer from "nodemailer";

// Email configuration
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not regular password
  },
});

// App owner emails - add your email addresses here
const APP_OWNER_EMAILS = process.env.APP_OWNER_EMAILS?.split(",") || [];

interface SubmissionData {
  id: string;
  designerName: string;
  email: string;
  brandName: string;
  city: string;
  category: string;
  phoneNumber: string;
  storeLink?: string | null;
  fulfillmentMethod: string;
  stockAvailability: string;
  branchCount: number;
}

export async function sendSubmissionNotification(
  submission: SubmissionData,
): Promise<boolean> {
  if (APP_OWNER_EMAILS.length === 0) {
    console.warn("No app owner emails configured. Skipping notification.");
    return false;
  }

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.warn("Gmail credentials not configured. Skipping notification.");
    return false;
  }

  const emailHtml = `
    <!DOCTYPE html>
    <html dir="ltr">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
        .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-top: none; border-radius: 0 0 8px 8px; }
        .field { margin-bottom: 12px; }
        .label { font-weight: bold; color: #555; }
        .value { color: #333; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
        .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 15px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin: 0;">New Vendor Submission</h1>
          <p style="margin: 10px 0 0 0;">A new vendor has submitted their application</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Designer Name:</span>
            <span class="value">${submission.designerName}</span>
          </div>
          <div class="field">
            <span class="label">Brand Name:</span>
            <span class="value">${submission.brandName}</span>
          </div>
          <div class="field">
            <span class="label">Email:</span>
            <span class="value">${submission.email}</span>
          </div>
          <div class="field">
            <span class="label">Phone:</span>
            <span class="value">${submission.phoneNumber}</span>
          </div>
          <div class="field">
            <span class="label">City:</span>
            <span class="value">${submission.city}</span>
          </div>
          <div class="field">
            <span class="label">Category:</span>
            <span class="value">${submission.category}</span>
          </div>
          <div class="field">
            <span class="label">Fulfillment Method:</span>
            <span class="value">${submission.fulfillmentMethod}</span>
          </div>
          <div class="field">
            <span class="label">Stock Availability:</span>
            <span class="value">${submission.stockAvailability}</span>
          </div>
          <div class="field">
            <span class="label">Branch Count:</span>
            <span class="value">${submission.branchCount}</span>
          </div>
          ${
            submission.storeLink
              ? `
          <div class="field">
            <span class="label">Store Link:</span>
            <span class="value"><a href="${submission.storeLink}">${submission.storeLink}</a></span>
          </div>
          `
              : ""
          }
          
          <div class="footer">
            <p>Submission ID: ${submission.id}</p>
            <p>This is an automated notification from Qafila Vendor Portal.</p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
New Vendor Submission

Designer Name: ${submission.designerName}
Brand Name: ${submission.brandName}
Email: ${submission.email}
Phone: ${submission.phoneNumber}
City: ${submission.city}
Category: ${submission.category}
Fulfillment Method: ${submission.fulfillmentMethod}
Stock Availability: ${submission.stockAvailability}
Branch Count: ${submission.branchCount}
${submission.storeLink ? `Store Link: ${submission.storeLink}` : ""}

Submission ID: ${submission.id}

This is an automated notification from Qafila Vendor Portal.
  `;

  try {
    await transporter.sendMail({
      from: `"Qafila Vendor Portal" <${process.env.GMAIL_USER}>`,
      to: APP_OWNER_EMAILS.join(", "),
      subject: `New Vendor Submission: ${submission.brandName}`,
      text: textContent,
      html: emailHtml,
    });

    console.log(
      `Notification email sent successfully to ${APP_OWNER_EMAILS.length} recipients`,
    );
    return true;
  } catch (error) {
    console.error("Failed to send notification email:", error);
    return false;
  }
}
