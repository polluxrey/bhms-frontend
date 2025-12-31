/**
 * Splits an array of fields into chunks of a given size
 * so that each chunk can be rendered as a row.
 *
 * @param {Array} fields - The array of field configs
 * @param {number} size - Number of fields per row (default 3)
 * @returns {Array} Array of field subarrays
 */
export function chunkFields(fields, size = 3) {
  const chunks = [];
  for (let i = 0; i < fields.length; i += size) {
    chunks.push(fields.slice(i, i + size));
  }
  return chunks;
}
