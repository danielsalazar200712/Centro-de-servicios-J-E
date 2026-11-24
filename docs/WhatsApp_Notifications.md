# WhatsApp Notifications Scaffold

This document outlines the placeholder implementation for sending WhatsApp notifications when a workshop order is ready for pickup.

## Files Added
- `src/lib/whatsapp.js` – Provides `sendOrderReady(orderId, phoneNumber)` using Twilio WhatsApp API.

## Integration Points
- UI: Call `sendOrderReady` from the order status update flow (e.g., in `src/pages/TallerReparaciones.jsx`) when the order status changes to `listo`.
- Environment Variables (add to `.env.example`):
  - `VITE_WA_ACCOUNT_SID`
  - `VITE_WA_AUTH_TOKEN`
  - `VITE_WA_FROM` (e.g., `whatsapp:+14155238886`)

## Next Steps
1. Register a Twilio account and obtain the above credentials.
2. Add the credentials to `.env` (do not commit the real values).
3. Hook the function into the order status update UI and display a success/failure toast.
4. Write tests for the notification flow.
