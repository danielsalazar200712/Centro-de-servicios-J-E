/**
 * Generador automático del archivo Word (.docx) a partir de docx/IEEE_830_Centro_de_Servicios_JE.md
 * No requiere dependencias externas: construye el contenedor OpenXML (.docx) válido con estilos, tablas y encabezados SENA.
 * Uso: node docx/generar_docx.mjs
 */
import fs from 'fs';
import path from 'path';
import zlib from 'zlib';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const mdPath = path.join(__dirname, 'IEEE_830_Centro_de_Servicios_JE.md');
const docxPath = path.join(__dirname, 'IEEE_830_Centro_de_Servicios_JE.docx');

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function cleanInlineMarkdown(text) {
  return text
    .replace(/<br\s*\/?>/gi, ' / ')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/`(.*?)`/g, '$1')
    .trim();
}

function createParagraphXml(text, options = {}) {
  const {
    bold = false,
    color = '0D1B15',
    size = 22, // 11pt
    spaceAfter = 120,
    spaceBefore = 0,
    align = 'left',
    shading = null
  } = options;

  const pPr = [
    `<w:spacing w:before="${spaceBefore}" w:after="${spaceAfter}"/>`,
    `<w:jc w:val="${align}"/>`,
    shading ? `<w:shd w:val="clear" w:color="auto" w:fill="${shading}"/>` : ''
  ].join('');

  const rPr = [
    `<w:rFonts w:ascii="Calibri" w:hAnsi="Calibri" w:cs="Calibri"/>`,
    bold ? '<w:b/>' : '',
    `<w:color w:val="${color}"/>`,
    `<w:sz w:val="${size}"/>`,
    `<w:szCs w:val="${size}"/>`
  ].join('');

  return `<w:p><w:pPr>${pPr}</w:pPr><w:r><w:rPr>${rPr}</w:rPr><w:t xml:space="preserve">${escapeXml(
    cleanInlineMarkdown(text)
  )}</w:t></w:r></w:p>`;
}

function createTableXml(rows) {
  if (!rows || rows.length === 0) return '';

  const tblPr = `
    <w:tblPr>
      <w:tblW w:w="5000" w:type="pct"/>
      <w:tblBorders>
        <w:top w:val="single" w:sz="6" w:space="0" w:color="DCE4DF"/>
        <w:left w:val="single" w:sz="6" w:space="0" w:color="DCE4DF"/>
        <w:bottom w:val="single" w:sz="6" w:space="0" w:color="DCE4DF"/>
        <w:right w:val="single" w:sz="6" w:space="0" w:color="DCE4DF"/>
        <w:insideH w:val="single" w:sz="4" w:space="0" w:color="DCE4DF"/>
        <w:insideV w:val="single" w:sz="4" w:space="0" w:color="DCE4DF"/>
      </w:tblBorders>
      <w:tblCellMar>
        <w:top w:w="80" w:type="dxa"/>
        <w:left w:w="120" w:type="dxa"/>
        <w:bottom w:w="80" w:type="dxa"/>
        <w:right w:w="120" w:type="dxa"/>
      </w:tblCellMar>
    </w:tblPr>
  `;

  const trXml = rows
    .map((cols, rowIdx) => {
      const isHeader = rowIdx === 0;
      const cells = cols
        .map((cellText) => {
          const shd = isHeader
            ? '<w:shd w:val="clear" w:color="auto" w:fill="0E3525"/>'
            : '';
          const p = createParagraphXml(cellText, {
            bold: isHeader,
            color: isHeader ? 'FFFFFF' : '1E293B',
            size: 19,
            spaceAfter: 40,
            spaceBefore: 40
          });
          return `<w:tc><w:tcPr>${shd}</w:tcPr>${p}</w:tc>`;
        })
        .join('');
      return `<w:tr>${cells}</w:tr>`;
    })
    .join('');

  return `<w:tbl>${tblPr}${trXml}</w:tbl><w:p/>`;
}

function markdownToWordXmlBody(mdContent) {
  const lines = mdContent.split(/\r?\n/);
  const bodyElements = [];
  let currentTable = [];
  let inCodeBlock = false;

  const flushTable = () => {
    if (currentTable.length > 0) {
      bodyElements.push(createTableXml(currentTable));
      currentTable = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (line.startsWith('```')) {
      flushTable();
      inCodeBlock = !inCodeBlock;
      continue;
    }

    if (inCodeBlock) {
      bodyElements.push(
        createParagraphXml(rawLine, {
          bold: false,
          color: '0E3525',
          size: 18,
          spaceAfter: 40,
          shading: 'F5F7F5'
        })
      );
      continue;
    }

    // Tablas Markdown
    if (line.startsWith('|') && line.endsWith('|')) {
      const cells = line
        .slice(1, -1)
        .split('|')
        .map((c) => c.trim());
      // Omitir fila separadora | :--- | :--- |
      if (cells.every((c) => /^:?-{2,}:?$/.test(c))) {
        continue;
      }
      currentTable.push(cells);
      continue;
    } else {
      flushTable();
    }

    if (!line || line === '---') {
      continue;
    }

    if (line.startsWith('# ')) {
      bodyElements.push(
        createParagraphXml(line.substring(2), {
          bold: true,
          color: '0E3525',
          size: 36, // 18pt
          spaceBefore: 240,
          spaceAfter: 160
        })
      );
    } else if (line.startsWith('## ')) {
      bodyElements.push(
        createParagraphXml(line.substring(3), {
          bold: true,
          color: '0E3525',
          size: 28, // 14pt
          spaceBefore: 220,
          spaceAfter: 120
        })
      );
    } else if (line.startsWith('### ')) {
      bodyElements.push(
        createParagraphXml(line.substring(4), {
          bold: true,
          color: '144933',
          size: 24, // 12pt
          spaceBefore: 180,
          spaceAfter: 100
        })
      );
    } else if (line.startsWith('#### ')) {
      bodyElements.push(
        createParagraphXml(line.substring(5), {
          bold: true,
          color: '1E293B',
          size: 22,
          spaceBefore: 140,
          spaceAfter: 80
        })
      );
    } else if (line.startsWith('- ')) {
      bodyElements.push(
        createParagraphXml(`•  ${line.substring(2)}`, {
          bold: false,
          color: '1E293B',
          size: 21,
          spaceAfter: 80
        })
      );
    } else {
      bodyElements.push(
        createParagraphXml(line, {
          bold: false,
          color: '1E293B',
          size: 21,
          spaceAfter: 120
        })
      );
    }
  }

  flushTable();
  return bodyElements.join('\n');
}

// Empaquetador ZIP mínimo sin dependencias externas para generar .docx (OpenXML)
function createZipBuffer(files) {
  const localFileHeaders = [];
  const centralDirHeaders = [];
  let offset = 0;

  // CRC32 Table
  const crcTable = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    crcTable[n] = c;
  }

  function crc32(buf) {
    let crc = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      crc = crcTable[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
    }
    return (crc ^ 0xffffffff) >>> 0;
  }

  for (const file of files) {
    const nameBuf = Buffer.from(file.name, 'utf8');
    const uncompressedBuf = Buffer.from(file.content, 'utf8');
    const compressedBuf = zlib.deflateRawSync(uncompressedBuf);
    const crc = crc32(uncompressedBuf);

    const localHeader = Buffer.alloc(30 + nameBuf.length);
    localHeader.writeUInt32LE(0x04034b50, 0); // signature
    localHeader.writeUInt16LE(20, 4); // version needed
    localHeader.writeUInt16LE(0, 6); // flags
    localHeader.writeUInt16LE(8, 8); // compression method (deflate)
    localHeader.writeUInt16LE(0, 10); // mod time
    localHeader.writeUInt16LE(0, 12); // mod date
    localHeader.writeUInt32LE(crc, 14);
    localHeader.writeUInt32LE(compressedBuf.length, 18);
    localHeader.writeUInt32LE(uncompressedBuf.length, 22);
    localHeader.writeUInt16LE(nameBuf.length, 26);
    localHeader.writeUInt16LE(0, 28);
    nameBuf.copy(localHeader, 30);

    localFileHeaders.push(localHeader, compressedBuf);

    const centralHeader = Buffer.alloc(46 + nameBuf.length);
    centralHeader.writeUInt32LE(0x02014b50, 0);
    centralHeader.writeUInt16LE(20, 4);
    centralHeader.writeUInt16LE(20, 6);
    centralHeader.writeUInt16LE(0, 8);
    centralHeader.writeUInt16LE(8, 10);
    centralHeader.writeUInt16LE(0, 12);
    centralHeader.writeUInt16LE(0, 14);
    centralHeader.writeUInt32LE(crc, 16);
    centralHeader.writeUInt32LE(compressedBuf.length, 20);
    centralHeader.writeUInt32LE(uncompressedBuf.length, 24);
    centralHeader.writeUInt16LE(nameBuf.length, 28);
    centralHeader.writeUInt16LE(0, 30);
    centralHeader.writeUInt16LE(0, 32);
    centralHeader.writeUInt16LE(0, 34);
    centralHeader.writeUInt16LE(0, 36);
    centralHeader.writeUInt32LE(0, 38);
    centralHeader.writeUInt32LE(offset, 42);
    nameBuf.copy(centralHeader, 46);

    centralDirHeaders.push(centralHeader);
    offset += localHeader.length + compressedBuf.length;
  }

  const centralDirBuf = Buffer.concat(centralDirHeaders);
  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4);
  eocd.writeUInt16LE(0, 6);
  eocd.writeUInt16LE(files.length, 8);
  eocd.writeUInt16LE(files.length, 10);
  eocd.writeUInt32LE(centralDirBuf.length, 12);
  eocd.writeUInt32LE(offset, 16);
  eocd.writeUInt16LE(0, 20);

  return Buffer.concat([...localFileHeaders, centralDirBuf, eocd]);
}

function buildDocx() {
  const mdContent = fs.readFileSync(mdPath, 'utf8');
  const bodyXml = markdownToWordXmlBody(mdContent);

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
</Relationships>`;

  const documentXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${bodyXml}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440" w:header="720" w:footer="720" w:gutter="0"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const zipBuf = createZipBuffer([
    { name: '[Content_Types].xml', content: contentTypesXml },
    { name: '_rels/.rels', content: relsXml },
    { name: 'word/_rels/document.xml.rels', content: wordRelsXml },
    { name: 'word/document.xml', content: documentXml }
  ]);

  fs.writeFileSync(docxPath, zipBuf);
  console.log(`Archivo Word generado exitosamente: ${docxPath} (${zipBuf.length} bytes)`);
}

buildDocx();
