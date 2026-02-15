const BY_OPERATOR_CODES = new Set(["25", "29", "33", "44"]);

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Нормализует ввод телефона к E.164 (BY): +375291234567
 * Поддерживает: +375..., 375..., 80..., 29...
 */
export function normalizeBYPhone(value) {
  const digits = onlyDigits(value);
  if (!digits) return "";

  // 8029XXXXXXX -> +37529XXXXXXX
  if (digits.length === 11 && digits.startsWith("80")) {
    return `+375${digits.slice(2)}`;
  }

  // 37529XXXXXXX -> +37529XXXXXXX
  if (digits.length === 12 && digits.startsWith("375")) {
    return `+${digits}`;
  }

  // 29XXXXXXX -> +37529XXXXXXX
  if (digits.length === 9) {
    return `+375${digits}`;
  }

  // Fallback
  if (value && String(value).trim().startsWith("+")) return `+${digits}`;
  return `+${digits}`;
}

export function isValidBYPhone(value) {
  const normalized = normalizeBYPhone(value);
  const digits = onlyDigits(normalized);

  if (digits.length !== 12) return false; // 375 + 9 digits
  if (!digits.startsWith("375")) return false;

  const operator = digits.slice(3, 5);
  if (!BY_OPERATOR_CODES.has(operator)) return false;

  return true;
}

export function formatBYPhone(value) {
  const digits = onlyDigits(value);

  let d = digits;
  if (d.startsWith("80") && d.length <= 11) {
    d = `375${d.slice(2)}`;
  } else if (d.startsWith("375")) {
    d = d;
  } else if (d.length <= 9) {
    d = `375${d}`;
  }

  const cc = d.slice(0, 3);
  const op = d.slice(3, 5);
  const p1 = d.slice(5, 8);
  const p2 = d.slice(8, 10);
  const p3 = d.slice(10, 12);

  let out = `+${cc}`;
  if (op) out += ` (${op}`;
  if (op && op.length === 2) out += `)`;
  if (p1) out += ` ${p1}`;
  if (p2) out += `-${p2}`;
  if (p3) out += `-${p3}`;

  return out;
}

