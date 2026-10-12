const nodemailer = require("nodemailer");

/**
 * Creates and configures the Nodemailer transporter.
 * Supports:
 * 1. Dedicated SMTP (host, port, user, pass)
 * 2. Service-based SMTP (e.g., Gmail with App Password)
 * 3. Graceful simulated logger fallback when credentials are not yet configured.
 */
function createTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT || 587;
  const user = process.env.SMTP_USER || process.env.EMAIL_USER;
  const pass = process.env.SMTP_PASSWORD || process.env.SMTP_PASS || process.env.EMAIL_PASS;
  const service = process.env.EMAIL_SERVICE || "gmail";

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(port),
      secure: Number(port) === 465,
      auth: { user, pass },
    });
  }

  if (user && pass) {
    return nodemailer.createTransport({
      service,
      auth: { user, pass },
    });
  }

  // Fallback / Simulation mode
  return null;
}

function getTransporter() {
  return createTransporter();
}

const getFromAddress = () => {
  return (
    process.env.EMAIL_FROM ||
    `"Maison·Auré Haute Cuisine" <${process.env.SMTP_USER || process.env.EMAIL_USER || "concierge@maison-aure.com"}>`
  );
};

/**
 * Base email layout wrapper with luxury Maison·Auré aesthetic
 */
function wrapHtmlEmail(title, content) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #0c0d0e;
      color: #e5e5e7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      max-width: 600px;
      margin: 30px auto;
      background: #141618;
      border: 1px solid #2a2d32;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
    }
    .header {
      padding: 40px 30px 24px;
      text-align: center;
      background: linear-gradient(180deg, #1c1f24 0%, #141618 100%);
      border-bottom: 1px solid #26292f;
    }
    .brand-eyebrow {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 4px;
      color: #d4af37;
      margin-bottom: 8px;
      font-weight: 600;
    }
    .brand-title {
      font-family: "Georgia", "Times New Roman", serif;
      font-size: 30px;
      letter-spacing: 2px;
      color: #f7f7f8;
      margin: 0;
      font-weight: 400;
    }
    .brand-tagline {
      font-size: 11px;
      letter-spacing: 2px;
      text-transform: uppercase;
      color: #8a8d93;
      margin-top: 6px;
    }
    .body-content {
      padding: 36px 32px;
      font-size: 14px;
      line-height: 1.7;
      color: #c9cbcf;
    }
    .footer {
      padding: 24px 32px 30px;
      text-align: center;
      border-top: 1px solid #23252a;
      background: #0f1012;
      font-size: 11px;
      color: #6d7077;
      letter-spacing: 0.5px;
    }
    .highlight {
      color: #d4af37;
      font-weight: 600;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      background: rgba(212, 175, 55, 0.12);
      border: 1px solid rgba(212, 175, 55, 0.35);
      border-radius: 20px;
      color: #e6ca65;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="brand-eyebrow">Haute Cuisine Parisienne</div>
      <h1 class="brand-title">M A I S O N · A U R É</h1>
      <div class="brand-tagline">Gastronomie & Art de la Table</div>
    </div>
    <div class="body-content">
      ${content}
    </div>
    <div class="footer">
      <p style="margin: 0 0 6px 0;">Maison·Auré Luxury Dining &middot; 18 Place Vendôme, 75001 Paris</p>
      <p style="margin: 0 0 6px 0;">Concierge Service: reservations@maison-aure.com &middot; +33 1 42 68 55 00</p>
      <p style="margin: 0; color: #4e5056;">This is an automated communication regarding your reservation request.</p>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Generic dispatcher that handles real sending or console logging fallback
 */
async function sendMail({ to, subject, html, text }) {
  const from = getFromAddress();

  const transporter = getTransporter();
  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from,
        to,
        subject,
        html,
        text,
      });
      console.log(`[EmailService] Mail sent to ${to} (MessageID: ${info.messageId})`);
      return { success: true, messageId: info.messageId, simulated: false };
    } catch (error) {
      console.error(`[EmailService] Failed to send email via SMTP to ${to}:`, error.message);
      // Fall through to simulated log
    }
  }

  // Fallback Simulation Mode
  console.log(`
╔══════════════════════════════════════════════════════════════════════╗
║              [MAISON·AURÉ EMAIL SERVICE - SIMULATION]                ║
╠══════════════════════════════════════════════════════════════════════╣
  TO:       ${to}
  FROM:     ${from}
  SUBJECT:  ${subject}
  PREVIEW:  ${text ? text.replace(/\n/g, " ").slice(0, 120) : "HTML content"}...
╚══════════════════════════════════════════════════════════════════════╝
  `);
  return { success: true, simulated: true };
}

/**
 * 1. Send OTP Verification Code to Customer
 */
async function sendReservationOtpEmail({ to, name, otp, expiresInMinutes = 10 }) {
  const subject = `Your Verification Code: ${otp} — Maison·Auré Table Reservation`;
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Verification Required</span>
      <h2 style="font-family: Georgia, serif; font-size: 24px; color: #f2f2f3; margin: 16px 0 8px;">
        Table Reservation Security Code
      </h2>
      <p style="margin: 0; color: #9da0a7;">
        Dear <strong style="color: #ffffff;">${name || "Guest"}</strong>, please verify your email address to confirm your table inquiry with our Maitre D'.
      </p>
    </div>

    <div style="background: #1b1e22; border: 1px dashed #d4af37; border-radius: 12px; padding: 24px; text-align: center; margin: 28px 0;">
      <div style="font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #a1a4ac; margin-bottom: 8px;">
        One-Time Verification Passcode
      </div>
      <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 700; letter-spacing: 10px; color: #d4af37; margin: 6px 0;">
        ${otp}
      </div>
      <div style="font-size: 12px; color: #7f828a; margin-top: 8px;">
        Valid for <strong style="color: #e5e5e7;">${expiresInMinutes} minutes</strong>. Do not share this passcode with anyone.
      </div>
    </div>

    <p style="color: #9da0a7; font-size: 13px;">
      Once entered, your booking request will be instantly registered in our concierge reservation system for priority table assignment.
    </p>

    <div style="margin-top: 24px; padding-top: 20px; border-top: 1px solid #25282f; font-size: 12px; color: #6b6e76;">
      If you did not request a reservation at Maison·Auré, you can safely disregard this message.
    </div>
  `;

  const text = `Dear ${name},\n\nYour Maison·Auré reservation verification code is: ${otp}\n\nThis code is valid for ${expiresInMinutes} minutes.\n\nBest regards,\nMaison·Auré Concierge`;

  return sendMail({ to, subject, html: wrapHtmlEmail(subject, content), text });
}

/**
 * 2. Send Acknowledgment when OTP is verified and request is submitted to admin
 */
async function sendReservationReceivedEmail({ to, name, customId, date, time, guests }) {
  const subject = `Table Request Received [${customId}] — Maison·Auré`;
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Inquiry Received</span>
      <h2 style="font-family: Georgia, serif; font-size: 24px; color: #f2f2f3; margin: 16px 0 8px;">
        Your Table Request is in Review
      </h2>
      <p style="margin: 0; color: #9da0a7;">
        Dear <strong style="color: #ffffff;">${name}</strong>, thank you for choosing Maison·Auré. Your reservation request has been verified and delivered to our Concierge.
      </p>
    </div>

    <div style="background: #191c20; border: 1px solid #282b31; border-radius: 12px; padding: 20px 24px; margin: 24px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Reference Code</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 14px; font-weight: 700; color: #d4af37;">${customId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Date</td>
          <td style="padding: 8px 0; text-align: right; color: #ffffff;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Seating Time</td>
          <td style="padding: 8px 0; text-align: right; color: #ffffff;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Party Size</td>
          <td style="padding: 8px 0; text-align: right; color: #ffffff;">${guests} ${guests === 1 ? "Guest" : "Guests"}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Status</td>
          <td style="padding: 8px 0; text-align: right;"><span style="color: #eab308; font-weight: 600;">Pending Confirmation</span></td>
        </tr>
      </table>
    </div>

    <p style="color: #9da0a7; font-size: 13px;">
      Our Maitre D' is reviewing table assignments for your requested time. You will receive an official confirmation notice once your table has been confirmed.
    </p>
  `;

  const text = `Dear ${name},\n\nYour reservation request [${customId}] for ${guests} guests on ${date} at ${time} has been received and is pending concierge confirmation.\n\nMaison·Auré Concierge`;

  return sendMail({ to, subject, html: wrapHtmlEmail(subject, content), text });
}

/**
 * 3. Send Confirmation Email when Admin Confirms the Reservation
 */
async function sendReservationConfirmedEmail({
  to,
  name,
  customId,
  date,
  time,
  guests,
  tableNumber,
  notes,
}) {
  const subject = `Reservation Confirmed [${customId}] — Maison·Auré Haute Cuisine`;
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge" style="background: rgba(46, 125, 50, 0.2); border-color: rgba(76, 175, 80, 0.4); color: #81c784;">
        Booking Confirmed
      </span>
      <h2 style="font-family: Georgia, serif; font-size: 26px; color: #f2f2f3; margin: 16px 0 8px;">
        We Look Forward to Hosting You
      </h2>
      <p style="margin: 0; color: #a1a4ac;">
        Dear <strong style="color: #ffffff;">${name}</strong>, it is our distinct pleasure to confirm your dining reservation at Maison·Auré.
      </p>
    </div>

    <div style="background: #191c20; border: 1px solid #282b31; border-radius: 12px; padding: 22px 26px; margin: 26px 0;">
      <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Booking Reference</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; font-size: 15px; font-weight: 700; color: #d4af37;">${customId}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Date of Service</td>
          <td style="padding: 8px 0; text-align: right; color: #ffffff; font-weight: 600;">${date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Seating Time</td>
          <td style="padding: 8px 0; text-align: right; color: #d4af37; font-weight: 600;">${time}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Guests</td>
          <td style="padding: 8px 0; text-align: right; color: #ffffff;">${guests} ${guests === 1 ? "Guest" : "Guests"}</td>
        </tr>
        ${
          tableNumber
            ? `
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Assigned Table</td>
          <td style="padding: 8px 0; text-align: right; font-family: monospace; color: #ffffff;">Table ${tableNumber}</td>
        </tr>
        `
            : ""
        }
        ${
          notes
            ? `
        <tr>
          <td style="padding: 8px 0; color: #7f828a; text-transform: uppercase; letter-spacing: 1px; font-size: 11px;">Special Notes</td>
          <td style="padding: 8px 0; text-align: right; color: #b5b8be; font-style: italic;">${notes}</td>
        </tr>
        `
            : ""
        }
      </table>
    </div>

    <div style="background: rgba(212, 175, 55, 0.05); border: 1px solid rgba(212, 175, 55, 0.2); border-radius: 10px; padding: 18px 20px; margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 600; color: #d4af37; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
        Dining Guidelines
      </div>
      <p style="margin: 0; font-size: 12px; color: #a1a4ac; line-height: 1.6;">
        &bull; <strong>Dress Code:</strong> Elegant evening attire. Athletic wear and beachwear are not permitted.<br>
        &bull; <strong>Punctuality:</strong> Tables are held for 15 minutes past the reserved seating time.<br>
        &bull; <strong>Dietary Needs:</strong> Our culinary team has noted your preferences. Please inform your captain upon arrival.
      </p>
    </div>

    <p style="font-size: 13px; color: #9da0a7; text-align: center; margin: 0;">
      Should your schedule change, please notify our Concierge at least 24 hours in advance.
    </p>
  `;

  const text = `Dear ${name},\n\nYour reservation [${customId}] at Maison·Auré has been CONFIRMED for ${date} at ${time} for ${guests} guests.\n${
    tableNumber ? `Table: ${tableNumber}\n` : ""
  }\nWe look forward to welcoming you!\n\nMaison·Auré Concierge`;

  return sendMail({ to, subject, html: wrapHtmlEmail(subject, content), text });
}

/**
 * 4. Send Thank You / Completed Email when Admin marks reservation as Completed
 */
async function sendReservationCompletedEmail({ to, name, customId, date }) {
  const subject = `Thank You for Dining with Us — Maison·Auré`;
  const content = `
    <div style="text-align: center; margin-bottom: 24px;">
      <span class="badge">Gratitude & Memories</span>
      <h2 style="font-family: Georgia, serif; font-size: 26px; color: #f2f2f3; margin: 16px 0 8px;">
        A Heartfelt Thank You
      </h2>
      <p style="margin: 0; color: #a1a4ac;">
        Dear <strong style="color: #ffffff;">${name}</strong>,
      </p>
    </div>

    <p style="font-size: 14px; line-height: 1.8; color: #c9cbcf; margin-bottom: 20px;">
      Thank you for gracing <strong>Maison·Auré</strong> with your presence on <strong>${date}</strong> (Reference: <span style="font-family: monospace; color: #d4af37;">${customId}</span>).
    </p>

    <p style="font-size: 14px; line-height: 1.8; color: #c9cbcf; margin-bottom: 20px;">
      It was an absolute privilege for Chef Laurent Mercier and our entire dining room team to craft this evening's culinary journey for you. We sincerely hope each course and pairing brought you joy and lingering memories.
    </p>

    <div style="background: #191c20; border: 1px solid #282b31; border-radius: 12px; padding: 22px; text-align: center; margin: 28px 0;">
      <p style="font-size: 13px; color: #d4af37; font-weight: 600; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 8px 0;">
        Share Your Experience
      </p>
      <p style="font-size: 12px; color: #8d9097; margin: 0 0 16px 0; line-height: 1.6;">
        Your impressions guide our pursuit of perfection. We would be honored to hear your thoughts on your evening.
      </p>
      <div style="display: inline-block; padding: 10px 24px; background: #d4af37; color: #0c0d0e; font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; border-radius: 20px;">
        A Votre Service
      </div>
    </div>

    <p style="font-size: 13px; color: #9da0a7; text-align: center; margin: 0;">
      We look forward to the honor of welcoming you back to Maison·Auré in the near future.
    </p>
  `;

  const text = `Dear ${name},\n\nThank you for dining with us at Maison·Auré on ${date} [${customId}].\n\nIt was an honor hosting you, and we look forward to welcoming you back soon!\n\nWarm regards,\nChef Laurent Mercier & The Maison·Auré Team`;

  return sendMail({ to, subject, html: wrapHtmlEmail(subject, content), text });
}

module.exports = {
  sendReservationOtpEmail,
  sendReservationReceivedEmail,
  sendReservationConfirmedEmail,
  sendReservationCompletedEmail,
};
