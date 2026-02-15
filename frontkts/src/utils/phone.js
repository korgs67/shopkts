const BY_OPERATOR_CODES = new Set(["25", "29", "33", "44"]);

function onlyDigits(value) {
  return String(value || "").replace(/\D/g, "");
}

/**
 * Нормализует ввод телефона к E.164 для BY: +375291234567
 * Поддерживает:
 * - +375 (29) 123-45-67
 * - 375291234567
 * - 80291234567
 * - 291234567
 */
export function normalizeBYPhone(value) {
  const digits = onlyDigits(value);
  if (!digits) return "";

  // 8029XXXXXXX -> 37529XXXXXXX
  if (digits.length === 11 && digits.startsWith("80")) {
    const rest = digits.slice(2); // 9 digits
    return `+375${rest}`;
  }

  // 37529XXXXXXX
  if (digits.length === 12 && digits.startsWith("375")) {
    return `+${digits}`;
  }

  // 29XXXXXXX
  if (digits.length === 9) {
    return `+375${digits}`;
  }

  // already has plus but we removed it -> assume digits are correct
  if (digits.length >= 10 && value.trim().startsWith("+")) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

export function isValidBYPhone(value) {
  const n = normalizeBYPhone(value);
  const digits = onlyDigits(n);

  // +375 + 9 digits
  if (digits.length !== 12) return false;
  if (!digits.startsWith("375")) return false;

  const operator = digits.slice(3, 5);
  if (!BY_OPERATOR_CODES.has(operator)) return false;

  return true;
}

export function formatBYPhone(value) {
  const digits = onlyDigits(value);

  // We format only Belarus numbers; otherwise return original
  let d = digits;
  if (d.startsWith("80") && d.length <= 11) {
    // 80 + 9 digits
    d = `375${d.slice(2)}`;
  } else if (d.startsWith("375")) {
    d = d;
  } else if (d.length <= 9) {
    d = `375${d}`;
  }

  // d: 375291234567 (up to 12)
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

