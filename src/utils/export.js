/**
 * Utility functions for exporting data
 */

/**
 * Flatten a nested object structure for CSV export
 * @param {Object} obj - The object to flatten
 * @param {String} prefix - The prefix for nested keys
 * @returns {Object} - Flattened object
 */
const flattenObject = (obj, prefix = "") => {
  return Object.keys(obj).reduce((acc, key) => {
    const pre = prefix.length ? `${prefix}_` : "";

    if (
      typeof obj[key] === "object" &&
      obj[key] !== null &&
      !Array.isArray(obj[key]) &&
      Object.keys(obj[key]).length > 0
    ) {
      Object.assign(acc, flattenObject(obj[key], `${pre}${key}`));
    } else if (Array.isArray(obj[key])) {
      // For arrays, we'll join the values with a delimiter
      acc[`${pre}${key}`] = obj[key]
        .map((item) => {
          if (typeof item === "object") {
            return JSON.stringify(item);
          }
          return item;
        })
        .join(" | ");
    } else {
      acc[`${pre}${key}`] = obj[key];
    }

    return acc;
  }, {});
};

/**
 * Convert data to CSV format
 * @param {Array} data - Array of objects to convert
 * @returns {String} - CSV string
 */
const convertToCSV = (data) => {
  const flattenedData = data.map((item) => flattenObject(item));

  // Get all unique keys from the flattened data
  const allKeys = new Set();
  flattenedData.forEach((item) => {
    Object.keys(item).forEach((key) => allKeys.add(key));
  });

  const headers = Array.from(allKeys);

  // Build CSV string
  let csvContent = headers.join(",") + "\n";

  flattenedData.forEach((item) => {
    const row = headers.map((header) => {
      // Handle commas and quotes in the data
      const cell = item[header] !== undefined ? String(item[header]) : "";
      if (cell.includes(",") || cell.includes('"') || cell.includes("\n")) {
        return `"${cell.replace(/"/g, '""')}"`;
      }
      return cell;
    });

    csvContent += row.join(",") + "\n";
  });

  return csvContent;
};

/**
 * Export data to CSV file
 * @param {Array} data - Array of objects to export
 * @param {String} filename - Name of the file (without extension)
 */
export const exportToCSV = (data, filename) => {
  if (!data || data.length === 0) {
    console.error("No data to export");
    return;
  }

  const csvContent = convertToCSV(data);

  // Create blob and download link
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  // Create download link and trigger click
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `${filename}.csv`);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Format date for display
 * @param {Number} timestamp - Timestamp to format
 * @returns {String} - Formatted date string
 */
export const formatDate = (timestamp) => {
  if (!timestamp) return "";

  const date = new Date(timestamp);
  return date.toLocaleDateString();
};
