/**
 * Format date to Thai format: dd/mmm/yyyy hh:mm
 * @param date - Date object or string
 * @returns Formatted date string in Thai format
 */
export const formatThaiDate = (date: Date | string | undefined): string => {
  if (!date) return "-";

  // If already formatted as Thai string, return it
  if (typeof date === "string" && date.includes("/")) {
    return date;
  }

  const dateObj = typeof date === "string" ? new Date(date) : date;
  if (isNaN(dateObj.getTime())) return "-";

  const dayThai = ["อา", "จ", "อ", "พ", "พฤ", "ศ", "ส"];
  const monthThai = [
    "ม.ค.",
    "ก.พ.",
    "มี.ค.",
    "เม.ย.",
    "พ.ค.",
    "มิ.ย.",
    "ก.ค.",
    "ส.ค.",
    "ก.ย.",
    "ต.ค.",
    "พ.ย.",
    "ธ.ค.",
  ];

  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = monthThai[dateObj.getMonth()];
  const year = dateObj.getFullYear() + 543; // Convert to Buddhist year
  const hours = String(dateObj.getHours()).padStart(2, "0");
  const minutes = String(dateObj.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
};
