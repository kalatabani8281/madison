import { BookingDetails } from '../types';
import { HOST_CONTACT } from '../data/unitData';

/**
 * Generate an authentic, beautifully styled HTML confirmation email
 */
export const generateConfirmationEmailHtml = (booking: BookingDetails): string => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Your Stay at Madison's Cebu is Confirmed!</title>
  <style>
    body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f7f4ec; margin: 0; padding: 24px; color: #1f1b16; }
    .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; border: 1px solid #e2dbcc; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
    .header { background-color: #0f766e; color: #ffffff; padding: 32px 28px; text-align: center; }
    .header h1 { margin: 0 0 6px 0; font-size: 24px; font-weight: 700; letter-spacing: -0.5px; }
    .header p { margin: 0; font-size: 14px; opacity: 0.9; }
    .badge { display: inline-block; background-color: #ccfbf1; color: #115e59; font-weight: 700; font-size: 13px; padding: 4px 12px; border-radius: 999px; margin-top: 12px; }
    .content { padding: 32px 28px; }
    .intro { font-size: 16px; line-height: 1.6; margin-bottom: 24px; color: #37332d; }
    .summary-card { background: #faf8f5; border: 1px solid #ebe5d8; border-radius: 8px; padding: 20px; margin-bottom: 24px; }
    .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px dashed #e2dbcc; font-size: 14px; }
    .summary-row:last-child { border-bottom: none; font-weight: bold; font-size: 16px; color: #0f766e; padding-top: 12px; }
    .details-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
    .detail-item { background: #f7f4ec; padding: 14px; border-radius: 6px; }
    .detail-item small { display: block; font-size: 11px; text-transform: uppercase; color: #78716c; font-weight: 600; margin-bottom: 4px; }
    .detail-item strong { font-size: 15px; color: #1c1917; }
    .instructions { background: #f0fdf4; border-left: 4px solid #16a34a; padding: 16px 20px; border-radius: 4px; margin-bottom: 24px; font-size: 14px; line-height: 1.6; }
    .footer { background: #f5f1e8; padding: 24px; text-align: center; font-size: 13px; color: #78716c; border-top: 1px solid #e7dfd1; }
    .footer a { color: #0f766e; text-decoration: none; font-weight: 600; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>Stay at Madison’s Cebu</h1>
      <p>Cozy stays in Cebu City · Horizons 101</p>
      <div class="badge">Booking Confirmed: ${booking.id}</div>
    </div>
    <div class="content">
      <p class="intro">
        Dear <strong>${booking.guestName}</strong>,<br><br>
        Thank you for reserving your Cebu stay with us! We are thrilled to welcome you to <strong>Horizons 101</strong>. Your reservation is set and our team is preparing a cozy, spotless sanctuary for your arrival.
      </p>

      <div class="details-grid">
        <div class="detail-item">
          <small>Check-in</small>
          <strong>${new Date(booking.checkInDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          <div style="font-size: 12px; color: #57534e; margin-top: 2px;">From 2:00 PM</div>
        </div>
        <div class="detail-item">
          <small>Check-out</small>
          <strong>${new Date(booking.checkOutDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</strong>
          <div style="font-size: 12px; color: #57534e; margin-top: 2px;">Until 12:00 PM Noon</div>
        </div>
        <div class="detail-item">
          <small>Guests</small>
          <strong>${booking.guestCount} Guest${booking.guestCount > 1 ? 's' : ''}</strong>
        </div>
        <div class="detail-item">
          <small>Stay Length</small>
          <strong>${booking.nights} Night${booking.nights > 1 ? 's' : ''}</strong>
        </div>
      </div>

      <div class="summary-card">
        <div style="font-weight: 600; margin-bottom: 12px; color: #1c1917;">Reservation Summary</div>
        <div class="summary-row">
          <span>Base Nightly Rate (2 guests included)</span>
          <span>₱1,750 × ${booking.nights} night${booking.nights > 1 ? 's' : ''}</span>
        </div>
        ${booking.extraGuestFee > 0 ? `
        <div class="summary-row">
          <span>Extra Guest Fee (${booking.guestCount - 2} guest${booking.guestCount - 2 > 1 ? 's' : ''})</span>
          <span>₱${booking.extraGuestFee.toLocaleString('en-PH')}</span>
        </div>` : ''}
        <div class="summary-row">
          <span>Payment Method</span>
          <span>${booking.paymentMethod === 'qr_ph' ? 'QR Ph (GCash/Maya/Bank)' : booking.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Cash Deposit'}</span>
        </div>
        <div class="summary-row">
          <span>Total Amount</span>
          <span>₱${booking.totalPrice.toLocaleString('en-PH')}</span>
        </div>
      </div>

      <div class="instructions">
        <strong>📍 How to Arrive & Check In:</strong><br>
        • <strong>Address:</strong> Horizons 101, 57 General Maxilom Ave, Cebu City.<br>
        • Upon arrival at the lobby, notify reception that you are checking into Stay at Madison's Cebu.<br>
        • Present a valid government ID for all registered guests.<br>
        • Free pool passes and Wi-Fi access codes will be provided upon entry.
      </div>

      <p style="font-size: 14px; color: #57534e; line-height: 1.5;">
        Have questions or need directions? Chat with Madison directly on <a href="${HOST_CONTACT.facebookUrl}" style="color: #0f766e; font-weight: bold;">Facebook Messenger</a> or call/text ${HOST_CONTACT.phone}.
      </p>
    </div>
    <div class="footer">
      <p>© 2026 Stay at Madison’s Cebu · Horizons 101, Cebu City, Philippines</p>
      <p><a href="${HOST_CONTACT.facebookUrl}">Message Host on Facebook ↗</a></p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Send booking confirmation email via Gmail API
 */
export const sendBookingConfirmationEmail = async (
  accessToken: string,
  booking: BookingDetails
): Promise<{ success: boolean; messageId?: string; error?: string }> => {
  try {
    const subject = `Booking Confirmed: Horizons 101 — Stay at Madison's Cebu (${booking.id})`;
    const htmlBody = generateConfirmationEmailHtml(booking);

    // Build RFC 2822 formatted message
    const emailLines = [
      `To: ${booking.guestEmail}`,
      `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
      'MIME-Version: 1.0',
      'Content-Type: text/html; charset=utf-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlBody
    ];

    const rawEmail = emailLines.join('\r\n');
    
    // URL-safe base64 encoding for Gmail API
    const encodedEmail = btoa(unescape(encodeURIComponent(rawEmail)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: encodedEmail })
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error?.message || `Gmail API returned ${response.status}`);
    }

    const data = await response.json();
    return { success: true, messageId: data.id };
  } catch (error: any) {
    console.error('Failed to send confirmation email via Gmail:', error);
    return { success: false, error: error?.message || 'Failed to dispatch email' };
  }
};
