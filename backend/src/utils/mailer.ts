import nodemailer from "nodemailer";
import * as QRCode from "qrcode";

export const sendBookingEmail = async (
  email: string,
  bookingId: string,
  eventDetails: {
    name: string;
    date: Date;
    venue: string;
    seats: number;
    type: string;
  }
) => {
  try {
    // For development, we'll use Ethereal Mail if no SMTP is provided
    let transporter;
    
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });
    } else {
      // Fallback to Ethereal Mail
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    }

    // Generate QR Code
    const qrCodeDataUrl = await QRCode.toDataURL(bookingId);
  console.log(qrCodeDataUrl)
    const mailOptions = {
      from: '"Eventia Tickets" <tickets@eventia.com>',
      to: email,
      subject: `Your Ticket for ${eventDetails.name}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
          <h1 style="color: #333; text-align: center;">Your Event Ticket</h1>
          <hr />
          <div style="margin-top: 20px;">
            <p><strong>Event:</strong> ${eventDetails.name}</p>
            <p><strong>Date:</strong> ${new Date(eventDetails.date).toLocaleDateString()}</p>
            <p><strong>Venue:</strong> ${eventDetails.venue}</p>
            <p><strong>Seats:</strong> ${eventDetails.seats} (${eventDetails.type})</p>
          </div>
          <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <p style="margin-bottom: 20px; color: #666;">Present this QR code at the entrance</p>
            <img src="${qrCodeDataUrl}" alt="Booking QR Code" style="width: 200px; height: 200px;" />
            <p style="margin-top: 10px; font-size: 12px; color: #999;">Booking ID: ${bookingId}</p>
          </div>
          <footer style="margin-top: 30px; text-align: center; font-size: 12px; color: #aaa;">
            <p>&copy; 2026 Eventia. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    
    if (!process.env.SMTP_HOST) {
      console.log("Preview URL: " + nodemailer.getTestMessageUrl(info));
    }
    
    return info;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};
