export const labels: Record<number, Ĺabel> = {
  0: {
    value: Number.MAX_SAFE_INTEGER,
    name: "empty",
    image: require(`../../assets/signs/empty.png`),
  },
  1: {
    value: 20,
    name: "zwanzig",
    image: require(`../../assets/signs/zwanzig.png`),
  },
  2: {
    value: 30,
    name: "dreissig",
    image: require(`../../assets/signs/dreissig.png`),
  },
  3: {
    value: 50,
    name: "fuenfzig",
    image: require(`../../assets/signs/fuenfzig.png`),
  },
  4: {
    value: 60,
    name: "sechzig",
    image: require(`../../assets/signs/sechzig.png`),
  },
  5: {
    value: 70,
    name: "siebzig",
    image: require(`../../assets/signs/siebzig.png`),
  },
  6: {
    value: 80,
    name: "achtzig",
    image: require(`../../assets/signs/achtzig.png`),
  },
  7: {
    value: 0,
    name: "neunzig",
    image: null,
  },
  8: {
    value: 100,
    name: "hundert",
    image: require(`../../assets/signs/hundert.png`),
  },
  9: {
    value: 110,
    name: "hundertzehn",
    image: null,
  },
  10: {
    value: 120,
    name: "hundertzwanzig",
    image: require(`../../assets/signs/hundertzwanzig.png`),
  },
  11: {
    value: 130,
    name: "hundertdreissig",
    image: null,
  },
  12: {
    value: -1,
    name: "zwanzigEnde",
    image: null,
  },
  13: {
    value: -1,
    name: "dreissigEnde",
    image: require(`../../assets/signs/dreissigEnde.png`),
  },
  14: {
    value: -1,
    name: "fünfzigEnde",
    image: null,
  },
  15: {
    value: -1,
    name: "sechzigEnde",
    image: require(`../../assets/signs/sechzigEnde.png`),
  },
  16: {
    value: -1,
    name: "siebzigEnde",
    image: require(`../../assets/signs/siebzigEnde.png`),
  },
  17: {
    value: -1,
    name: "achtzigEnde",
    image: require(`../../assets/signs/achtzigEnde.png`),
  },
  18: {
    value: -1,
    name: "neunzigEnde",
    image: null,
  },
  19: {
    value: -1,
    name: "hundertEnde",
    image: null,
  },
  20: {
    value: -1,
    name: "hundertzehnEnde",
    image: null,
  },
  21: {
    value: -1,
    name: "hundertzwanzigEnde",
    image: null,
  },
  22: {
    value: -1,
    name: "hundertdreissigEnde",
    image: null,
  },
  23: {
    value: -1,
    name: "ende",
    image: require(`../../assets/signs/ende.png`),
  },
  24: {
    value: 15,
    name: "spielstrasse",
    image: require(`../../assets/signs/spielstrasse.png`),
  },
  25: {
    value: -1,
    name: "spielstrasseEnde",
    image: require(`../../assets/signs/spielstrasseEnde.png`),
  },
  26: {
    value: 50,
    name: "ort",
    image: require(`../../assets/signs/ort.png`),
  },
  27: {
    value: 100,
    name: "ortAusgang",
    image: require(`../../assets/signs/ortEnde.png`),
  },
  28: {
    value: 100,
    name: "ortEnde",
    image: require(`../../assets/signs/ortEnde.png`),
  },
  29: {
    value: Number.MAX_SAFE_INTEGER,
    name: "autobahn",
    image: require(`../../assets/signs/autobahn.png`),
  },
  30: {
    value: 100,
    name: "autobahnEnde",
    image: require(`../../assets/signs/autobahnEnde.png`),
  },
  31: {
    value: 20,
    name: "zoneZwanzig",
    image: require(`../../assets/signs/zoneZwanzig.png`),
  },
  32: {
    value: 30,
    name: "zoneDreissig",
    image: require(`../../assets/signs/zoneDreissig.png`),
  },
  33: {
    value: -1,
    name: "zoneZwanzigEnde",
    image: require(`../../assets/signs/zoneZwanzigEnde.png`),
  },
  34: {
    value: -1,
    name: "zoneDreissigEnde",
    image: require(`../../assets/signs/zoneDreissigEnde.png`),
  },
};

export interface Ĺabel {
  value: number;
  name: string;
  image: any;
}

export interface PredictionResult {
  label: string;
  id: number;
  score: number;
}

export const getLabels = (classes: Float32Array, scores: Float32Array) => {
  const res: PredictionResult[] = [];
  scores.forEach((c, i) => {
    if (c >= 0.8)
      res.push({ id: classes[i], label: labels[classes[i]].name, score: c });
    return c;
  });

  return res;
};
