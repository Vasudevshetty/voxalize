// utils/dataHelpers.js

export const getNumericFields = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  const sample = data[0];
  return Object.keys(sample).filter((key) => typeof sample[key] === "number");
};

export const getCategoricalFields = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];
  const sample = data[0];
  return Object.keys(sample).filter((key) => typeof sample[key] === "string");
};
