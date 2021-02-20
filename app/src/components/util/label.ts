export const labels: Record<number, string> = {
  1: "zwanzig",
  2: "dreissig",
  3: "fuenfzig",
  4: "sechzig",
  5: "siebzig",
  6: "achtzig",
  7: "neunzig",
  8: "hundert",
  9: "hundertzehn",
  10: "hundertzwanzig",
  11: "hundertdreissig",
  12: "zwanzigEnde",
  13: "dreissigEnde",
  14: "fünfzigEnde",
  15: "sechzigEnde",
  16: "siebzigEnde",
  17: "achtzigEnde",
  18: "neunzigEnde",
  19: "hundertEnde",
  20: "hundertzehnEnde",
  21: "hundertzwanzigEnde",
  22: "hundertdreissigEnde",
  23: "ende",
  24: "spielstrasse",
  25: "spielstrasseEnde",
  26: "ort",
  27: "ortAusgang",
  28: "ortEnde",
  29: "autobahn",
  30: "autobahnEnde",
  31: "zoneZwanzig",
  32: "zoneDreissig",
  33: "zoneZwanzigEnde",
  34: "zoneDreissigEnde",
};

export interface PredictionResult {
  label: string;
  id: number;
  score: number;
}

export const getLabes = (classes: Float32Array, scores: Float32Array) => {
  const res: PredictionResult[] = [];
  scores.forEach((c, i) => {
    if (c >= 0.8)
      res.push({ id: classes[i], label: labels[classes[i]], score: c });
    return c;
  });

  return res;
};
