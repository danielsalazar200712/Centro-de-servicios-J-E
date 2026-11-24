# Directrices del Proyecto: Centro de Servicios J&E (SENA ADSO - Ficha 3386122)

## Sincronización Obligatoria del Documento IEEE 830 (`docx/`)

Este proyecto mantiene su **Especificación de Requisitos de Software (SRS - IEEE 830)** viva dentro de la carpeta `docx/`:
- **Documento Maestro Editable:** `docx/IEEE_830_Centro_de_Servicios_JE.md`
- **Documento Microsoft Word (`.docx`):** `docx/IEEE_830_Centro_de_Servicios_JE.docx`
- **Generador Automático Word:** `docx/generar_docx.mjs` (o `npm run docs:sync`)

### Regla para Gemini / Antigravity:
1. **Cada vez que el proyecto cambie** (nuevos módulos, cambios en formularios, estética, rutas, requisitos funcionales/no funcionales o backend), **debes editar automáticamente** `docx/IEEE_830_Centro_de_Servicios_JE.md` para mantener el documento IEEE 830 alineado con el sistema real, y ejecutar `node docx/generar_docx.mjs` para actualizar `docx/IEEE_830_Centro_de_Servicios_JE.docx`.
2. **Cada vez que el usuario modifique `docx/IEEE_830_Centro_de_Servicios_JE.md`**, debes aplicar los cambios correspondientes en el sistema y ejecutar `node docx/generar_docx.mjs`.
