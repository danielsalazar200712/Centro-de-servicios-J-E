# DIAN Invoicing Scaffold

This document describes the placeholder implementation for electronic invoicing integration with DIAN.

## Files Added
- `src/lib/dianInvoice.js` – Provides `generateInvoice(data)` to create a minimal UBL XML and `sendToDIAN(xml)` to POST to a placeholder endpoint. Replace the URL and request details with the real DIAN API when credentials are available.

## Integration Points
- UI: Add a button in `src/pages/VentasPedidos.jsx` that calls `generateInvoice` and `sendToDIAN`.
- Database: Invoice records are stored in `public.ventas_facturas` (RF-006).

## Next Steps
1. Obtain DIAN credentials and API endpoint.
2. Replace placeholder URL (`https://example.com/dian/submit`).
3. Implement full UBL 2.1 XML generation according to DIAN specifications.
4. Update tests and documentation as needed.
