# Notificaciones por WhatsApp (RF-011) — Método gratuito

El sistema usa el enlace oficial y gratuito de WhatsApp **Click to Chat** (`https://wa.me/<número>?text=<mensaje>`).
No requiere cuentas, claves ni pagos.

## Cómo se usa
1. Al crear la orden de taller, escribe el **celular del cliente** (ej. `313 642 2685`).
2. Cuando el equipo esté reparado, marca la orden como **"Listo para Entrega"**.
3. Pulsa el botón verde **"Avisar"** (tarjeta del tablero) o **"Avisar por WhatsApp"** (ficha de la orden).
4. Se abre WhatsApp Web o la app con el mensaje ya escrito → presiona **Enviar**.

## Archivos
- `src/lib/whatsapp.js` — normaliza el número (agrega el indicativo `57` a celulares de 10 dígitos) y arma el mensaje.
- `src/pages/TallerReparaciones.jsx` — botones de aviso.

## Limitación
El envío no es 100 % automático: el usuario debe pulsar "Enviar". Si más adelante quieres envío automático,
hay que usar WhatsApp Business API (Meta) o Twilio desde una función de servidor (son de pago).
