export function formatNumber(
  num: number | null | undefined,
  suffix = ''
): string {
  if (num === null || num === undefined) return '0' + suffix;
  // Nếu là số nguyên, hiển thị không có phần thập phân
  if (Number.isInteger(num)) return num + suffix;
  // Nếu là số thập phân, loại bỏ số 0 dư ở cuối
  return parseFloat(num.toString()).toString() + suffix;
}
