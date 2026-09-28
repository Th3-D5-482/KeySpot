export const normalizeVector = (values: number[]) => {
  const magnitude = Math.sqrt(
    values.reduce((sum, value) => sum + value * value, 0)
  );

  if (magnitude <= 0 || !Number.isFinite(magnitude)) {
    return values.map(() => 0);
  }

  return values.map((value) => value / magnitude);
};

export const cosineSimilarity = (a: number[], b: number[]) => {
  let numerator = 0;
  let aMagnitude = 0;
  let bMagnitude = 0;

  for (let i = 0; i < a.length; i++) {
    numerator += a[i] * b[i];
    aMagnitude += a[i] * a[i];
    bMagnitude += b[i] * b[i];
  }

  const denominator = Math.sqrt(aMagnitude * bMagnitude);

  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
};
