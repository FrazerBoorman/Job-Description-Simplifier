import ExcelJS from "exceljs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(
  __dirname,
  "0F - Spreadsheet - Master - 02.01.2026 - January Test.xlsx"
);

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(templatePath);

const ws = workbook.getWorksheet("Checklists");
if (!ws) {
  throw new Error("Checklists sheet not found.");
}

function cellValueToText(value) {
  if (value == null) return "";
  if (typeof value === "object") {
    if (value.text) return String(value.text).trim();
    if (Array.isArray(value.richText)) {
      return value.richText.map((part) => part.text || "").join("").trim();
    }
    if (value.formula != null) {
      if (value.result != null) return String(value.result).trim();
      return "";
    }
  }
  return String(value).trim();
}

function findChecklistSections(sheet) {
  const headings = [];
  const MAX_SCAN = 2000;
  for (let r = 1; r <= MAX_SCAN; r++) {
    const v = sheet.getCell(`B${r}`).value;
    const s = cellValueToText(v).toUpperCase();
    if (s && s.includes("CHECKLIST")) {
      headings.push({ row: r, title: s });
    }
  }
  const sections = [];
  for (let i = 0; i < headings.length; i++) {
    const h = headings[i];
    const next = headings[i + 1];
    const startRow = h.row + 1;
    const endRow = next ? next.row - 1 : MAX_SCAN;
    sections.push({ startRow, endRow });
  }
  if (!sections.length) {
    throw new Error("No checklist sections found.");
  }
  return sections;
}

const sections = findChecklistSections(ws);
const rows = new Set();
for (const section of sections) {
  for (let r = section.startRow; r <= section.endRow; r++) {
    rows.add(r);
  }
}

for (const row of rows) {
  const priceFormula = `IF(C${row}="","",XLOOKUP(C${row},ProductTable[Product],ProductTable[ Price ],0))`;
  const linkFormula = `IF(C${row}="","",XLOOKUP(C${row},ProductTable[Product],ProductTable[Notes],0))`;
  ws.getCell(`F${row}`).value = { formula: priceFormula };
  ws.getCell(`J${row}`).value = { formula: linkFormula };
}

await workbook.xlsx.writeFile(templatePath);
console.log(`Updated formulas in ${templatePath}`);
