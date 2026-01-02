import ExcelJS from "exceljs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promises as fs } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const templatePath = path.join(
  __dirname,
  "0F - Spreadsheet - Master - 02.01.2026 - January Test.xlsx"
);
const outputPath = path.join(__dirname, "verify-template-output.xlsx");

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

function pickStyledCell(sheet) {
  for (let r = 1; r <= 200; r++) {
    const row = sheet.getRow(r);
    for (let c = 1; c <= 20; c++) {
      const cell = row.getCell(c);
      const fill = cell.fill;
      const font = cell.font;
      if (fill && fill.type && font && (font.name || font.bold || font.size)) {
        return {
          address: cell.address,
          fill,
          font
        };
      }
    }
  }
  return null;
}

function pickMergedRange(sheet) {
  const merges = sheet.model && Array.isArray(sheet.model.merges) ? sheet.model.merges : [];
  return merges.length ? merges[0] : null;
}

function pickColumnWidth(sheet) {
  for (let c = 1; c <= 26; c++) {
    const column = sheet.getColumn(c);
    if (column.width && column.width > 0) {
      return { column: c, width: column.width };
    }
  }
  return null;
}

function pickDataValidation(sheet) {
  const model = sheet.dataValidations && sheet.dataValidations.model ? sheet.dataValidations.model : {};
  const entries = Object.values(model);
  for (const entry of entries) {
    if (entry && entry.sqref && String(entry.sqref).includes("C")) {
      return entry;
    }
  }
  return entries[0] || null;
}

function pickFormulaCells(sheet) {
  const targets = [];
  for (let r = 4; r <= 2000; r++) {
    const priceCell = sheet.getCell(`F${r}`);
    const linkCell = sheet.getCell(`J${r}`);
    if (priceCell.value && priceCell.value.formula) {
      targets.push({ address: priceCell.address, formula: priceCell.value.formula });
    }
    if (linkCell.value && linkCell.value.formula) {
      targets.push({ address: linkCell.address, formula: linkCell.value.formula });
    }
    if (targets.length >= 2) {
      break;
    }
  }
  return targets;
}

function applyFormulaPatch(sheet) {
  const MAX_SCAN = 2000;
  for (let r = 4; r <= MAX_SCAN; r++) {
    const priceFormula = `IF(C${r}="","",XLOOKUP(C${r},ProductTable[Product],ProductTable[ Price ],0))`;
    const linkFormula = `IF(C${r}="","",XLOOKUP(C${r},ProductTable[Product],ProductTable[Notes],0))`;
    sheet.getCell(`F${r}`).value = { formula: priceFormula };
    sheet.getCell(`J${r}`).value = { formula: linkFormula };
  }
}

const workbook = new ExcelJS.Workbook();
await workbook.xlsx.readFile(templatePath);

const sheet = workbook.getWorksheet("Checklists");
if (!sheet) {
  throw new Error("Checklists sheet not found.");
}

applyFormulaPatch(sheet);

const styledCell = pickStyledCell(sheet);
const mergedRange = pickMergedRange(sheet);
const columnWidth = pickColumnWidth(sheet);
const dataValidation = pickDataValidation(sheet);
const formulaCells = pickFormulaCells(sheet);

if (!styledCell || !mergedRange || !columnWidth || !dataValidation || !formulaCells.length) {
  throw new Error("Template inspection failed: missing styled cell, merge, width, validation, or formula sample.");
}

let writeRow = null;
for (let r = 4; r <= 2000; r++) {
  const text = cellValueToText(sheet.getCell(`C${r}`).value);
  if (!text) {
    writeRow = r;
    break;
  }
}

if (!writeRow) {
  throw new Error("No empty checklist rows available for write test.");
}

sheet.getCell(`C${writeRow}`).value = "Regression Test Product";
sheet.getCell(`G${writeRow}`).value = 2;
sheet.getCell(`K${writeRow}`).value = "Regression note.";

await workbook.xlsx.writeFile(outputPath);

const reread = new ExcelJS.Workbook();
await reread.xlsx.readFile(outputPath);
const outSheet = reread.getWorksheet("Checklists");
if (!outSheet) {
  throw new Error("Checklists sheet missing after write.");
}

const outStyledCell = outSheet.getCell(styledCell.address);
const styledMatch =
  JSON.stringify(outStyledCell.fill) === JSON.stringify(styledCell.fill) &&
  JSON.stringify(outStyledCell.font) === JSON.stringify(styledCell.font);
if (!styledMatch) {
  throw new Error(`Styled cell mismatch at ${styledCell.address}.`);
}

const outMerges = outSheet.model && Array.isArray(outSheet.model.merges) ? outSheet.model.merges : [];
if (!outMerges.includes(mergedRange)) {
  throw new Error(`Merged range missing: ${mergedRange}.`);
}

const outColumn = outSheet.getColumn(columnWidth.column);
if (!outColumn.width || outColumn.width !== columnWidth.width) {
  throw new Error(`Column width mismatch for column ${columnWidth.column}.`);
}

const outValidations = outSheet.dataValidations && outSheet.dataValidations.model
  ? Object.values(outSheet.dataValidations.model)
  : [];
const validationStillPresent = outValidations.some((entry) => entry.sqref === dataValidation.sqref);
if (!validationStillPresent) {
  throw new Error("Data validation range missing after write.");
}

for (const formulaCell of formulaCells) {
  const outCell = outSheet.getCell(formulaCell.address);
  if (!outCell.value || outCell.value.formula !== formulaCell.formula) {
    throw new Error(`Formula mismatch at ${formulaCell.address}.`);
  }
}

await fs.unlink(outputPath);
console.log("Template verification passed.");
