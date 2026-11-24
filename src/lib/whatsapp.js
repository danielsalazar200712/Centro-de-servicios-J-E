// WhatsApp Notification Scaffold
// Placeholder implementation using Twilio WhatsApp API.
// Replace with real credentials and endpoint when ready.

/**
 * Sends a WhatsApp message notifying that an order is ready for pickup.
 * @param {string} orderId - Identifier of the order.
 * @param {string} phoneNumber - Customer phone number in international format (e.g., +573001234567).
 * @returns {Promise<object>} Result of the API call.
 */
export async function sendOrderReady(orderId, phoneNumber) {
  const accountSid = process.env.VITE_WA_ACCOUNT_SID;
  const authToken = process.env.VITE_WA_AUTH_TOKEN;
  const from = process.env.VITE_WA_FROM; // e.g., 'whatsapp:+14155238886'

  if (!accountSid || !authToken || !from) {
    throw new Error('WhatsApp credentials are not set in environment variables');
  }

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const body = new URLSearchParams({
    From: from,
    To: `whatsapp:${phoneNumber}`,
    Body: `✅ Su orden ${orderId} está lista para recoger. Gracias por su compra!`,
  });

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`WhatsApp API error ${response.status}: ${errText}`);
  }
  return await response.json();
}

export default { sendOrderReady };
