---
description: Sincronización obligatoria del documento IEEE 830 en la carpeta docx/ cada vez que cambie el proyecto
---

# Regla de Sincronización Automática IEEE 830 (`docx/`)

Cada vez que el usuario solicite agregar, modificar o eliminar una funcionalidad, módulo, vista, requisito, modelo de datos o integración de backend en el proyecto **Centro de Servicios J&E** (o cuando el usuario modifique el documento IEEE 830):

1. **Actualizar el documento maestro editable:**
   Debes editar `docx/IEEE_830_Centro_de_Servicios_JE.md` para reflejar los cambios en:
   - La tabla de **Ficha del Documento e Historial de Revisiones** (incrementando la revisión y fecha).
   - La sección de **Requisitos Funcionales (`RF`)**, **Requisitos No Funcionales (`RNF`)** o **Interfaces** correspondiente.
   - La **Matriz de Trazabilidad y Arquitectura de Componentes** en la Sección 4.

2. **Regenerar el archivo Microsoft Word (`.docx`):**
   Inmediatamente después de editar `docx/IEEE_830_Centro_de_Servicios_JE.md`, debes ejecutar:
   ```powershell
   node docx/generar_docx.mjs
   ```
   para que el archivo `docx/IEEE_830_Centro_de_Servicios_JE.docx` quede 100% actualizado y listo para abrir en Microsoft Word o subir a GitHub.

3. **Sincronización inversa (Del documento al código):**
   Si el usuario edita o agrega un requisito dentro de `docx/IEEE_830_Centro_de_Servicios_JE.md`, debes implementar dicho cambio en el código fuente (`src/`) y regenerar `docx/IEEE_830_Centro_de_Servicios_JE.docx`.
