export const toTimestamp = (dateStr) => {
  if (!dateStr) return 0;

  // Handles YYYY-MM-DD
  const d = new Date(dateStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
};
