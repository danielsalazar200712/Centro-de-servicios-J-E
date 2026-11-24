// Notificaciones por WhatsApp (método gratuito "Click to Chat" - wa.me)
// No requiere cuentas, claves ni pagos: abre WhatsApp (Web o App) con el
// mensaje ya escrito y el usuario solo presiona "Enviar". (RF-011)

/**
 * Normaliza un teléfono colombiano al formato internacional sin "+".
 * Ej: "313 642 2685" -> "573136422685"
 * @param {string} telefono
 * @returns {string|null} número normalizado o null si no es válido
 */
export function normalizarTelefono(telefono) {
  if (!telefono) return null;
  let digits = String(telefono).replace(/\D/g, '');
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.length === 10 && digits.startsWith('3')) digits = `57${digits}`; // celular Colombia
  if (digits.length < 10 || digits.length > 15) return null;
  return digits;
}

/**
 * Construye el enlace wa.me con el mensaje codificado.
 * @param {string} telefono
 * @param {string} mensaje
 * @returns {string|null}
 */
export function crearEnlaceWhatsApp(telefono, mensaje) {
  const numero = normalizarTelefono(telefono);
  if (!numero) return null;
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

/**
 * Mensaje estándar cuando una orden de taller queda "Listo para Entrega".
 * @param {object} orden
 * @returns {string}
 */
export function mensajeOrdenLista(orden) {
  const nombre = (orden?.propietario || 'cliente').split(' ')[0];
  const equipo = [orden?.tipoEquipo, orden?.marca, orden?.modelo].filter(Boolean).join(' ');
  return (
    `Hola ${nombre}, le saludamos del *Centro de Servicios J&E*.\n\n` +
    `Su equipo *${equipo || 'en reparación'}* (orden ${orden?.id}) ya está *listo para recoger*. ✅\n\n` +
    `Puede pasar por él en nuestro horario de atención. ¡Gracias por confiar en nosotros!`
  );
}

/**
 * Enlace listo para notificar que la orden está lista para entrega.
 * @param {object} orden
 * @returns {string|null}
 */
export function enlaceOrdenLista(orden) {
  return crearEnlaceWhatsApp(orden?.telefono, mensajeOrdenLista(orden));
}
