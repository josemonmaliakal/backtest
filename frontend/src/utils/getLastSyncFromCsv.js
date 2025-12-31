export const getLastSyncFromCsv = (rows) => {
  if (!rows || rows.length === 0) return "—";

  // If already sorted, last row is enough
  const lastRow = rows[rows.length - 1];

  return lastRow.Date || "—";
};
