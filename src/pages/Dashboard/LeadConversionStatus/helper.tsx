export const LeadConversionData = (data: Record<string, number>) => {
  return Object?.values(data).sort((a, b) => b - a);
};

export const categoriesData = (data: Record<string, number>) => {
  return Object?.keys(data).sort((keyA, keyB) => data[keyB] - data[keyA]);
};