const NOTE_NAMES = [
  "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B",
];

const MAJOR_PROFILE = [
  6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
];
const MINOR_PROFILE = [
  6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
];
const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];
const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];
const MAJOR_QUALITIES = ["major", "minor", "minor", "major", "major", "minor", "major"];
const MINOR_QUALITIES = ["minor", "minor", "major", "minor", "major", "major", "major"];

const getChordFit = (chord, key, mode) => {
  const intervals = mode === "Major" ? MAJOR_INTERVALS : MINOR_INTERVALS;
  const qualities = mode === "Major" ? MAJOR_QUALITIES : MINOR_QUALITIES;
  const relative = (chord.root - key + 12) % 12;
  const degree = intervals.indexOf(relative);

  if (degree >= 0 && qualities[degree] === chord.quality) {
    let weight = 1.0;
    if (degree === 0) weight = 1.35;
    if (degree === 4) weight = 1.2;
    if (degree === 3 || degree === 5) weight = 1.05;
    return { score: weight, degree, exact: true };
  }

  if (degree >= 0) {
    if (mode === "Minor" && degree === 4 && chord.quality === "major") {
      return { score: 1.1, degree, exact: false };
    }
    return { score: 0.48, degree, exact: false };
  }

  const borrowedIntervals = mode === "Major" ? [1, 3, 6, 8, 10] : [1, 4, 6, 9, 11];
  if (borrowedIntervals.includes(relative)) {
    return { score: 0.18, degree: -1, exact: false };
  }
  return { score: 0, degree: -1, exact: false };
};

const profileCorrelation = (chroma, profile, key) => {
  const rotated = new Array(12);
  for (let i = 0; i < 12; i++) rotated[i] = chroma[(i + key) % 12];
  let chromaMean = 0;
  let profileMean = 0;
  for (let i = 0; i < 12; i++) {
    chromaMean += rotated[i];
    profileMean += profile[i];
  }
  chromaMean /= 12;
  profileMean /= 12;
  let numerator = 0;
  let xVariance = 0;
  let yVariance = 0;
  for (let i = 0; i < 12; i++) {
    const x = rotated[i] - chromaMean;
    const y = profile[i] - profileMean;
    numerator += x * y;
    xVariance += x * x;
    yVariance += y * y;
  }
  const denominator = Math.sqrt(xVariance * yVariance);
  return denominator <= 0 ? 0 : numerator / denominator;
};

const scoreKeyCandidate = (progression, key, mode, globalChroma) => {
  if (progression.length === 0) return 0;
  let totalDuration = 0;
  for (const chord of progression) totalDuration += chord.duration;
  if (totalDuration <= 0) return 0;

  let harmonicFit = 0;
  let exactDuration = 0;
  let tonicDuration = 0;
  let dominantDuration = 0;
  const observedDegrees = new Set();
  let cadenceScore = 0;
  let cadenceOpportunities = 0;
  let endingTonic = 0;
  let openingTonic = 0;

  for (let i = 0; i < progression.length; i++) {
    const chord = progression[i];
    const weight = chord.duration * Math.max(0.35, chord.score);
    const fit = getChordFit(chord, key, mode);
    harmonicFit += weight * fit.score;
    if (fit.exact) {
      exactDuration += chord.duration;
      if (fit.degree >= 0) observedDegrees.add(fit.degree);
    }
    if (
      chord.root === key &&
      ((mode === "Major" && chord.quality === "major") ||
        (mode === "Minor" && chord.quality === "minor"))
    ) {
      tonicDuration += chord.duration;
      if (i === 0) openingTonic = 1;
      if (i === progression.length - 1) endingTonic = 1;
    }
    if (chord.root === (key + 7) % 12) dominantDuration += chord.duration;
  }

  const harmonicFitNormalized = Math.min(1, harmonicFit / (totalDuration * 1.2));
  const exactRatio = exactDuration / totalDuration;
  const tonicRatio = tonicDuration / totalDuration;
  const dominantRatio = dominantDuration / totalDuration;
  const coverage = Math.min(1, observedDegrees.size / 6);

  for (let i = 1; i < progression.length; i++) {
    const previous = progression[i - 1];
    const current = progression[i];
    const transitionWeight = Math.min(previous.duration, current.duration);
    if (transitionWeight <= 0) continue;
    if (previous.root === (key + 7) % 12 && current.root === key) {
      cadenceScore += transitionWeight * 2;
      cadenceOpportunities += transitionWeight;
    }
    if (previous.root === (key + 5) % 12 && current.root === key) {
      cadenceScore += transitionWeight;
      cadenceOpportunities += transitionWeight;
    }
    if (previous.root === (key + 2) % 12 && current.root === (key + 7) % 12) {
      cadenceScore += transitionWeight * 1.2;
      cadenceOpportunities += transitionWeight;
    }
    if (i >= 2) {
      const twoBack = progression[i - 2];
      if (
        twoBack.root === (key + 2) % 12 &&
        previous.root === (key + 7) % 12 &&
        current.root === key
      ) {
        cadenceScore += transitionWeight * 3;
      }
    }
  }

  const normalizedCadence =
    cadenceOpportunities > 0
      ? Math.min(1, cadenceScore / (cadenceOpportunities * 2))
      : 0;

  const profile =
    mode === "Major"
      ? profileCorrelation(globalChroma, MAJOR_PROFILE, key)
      : profileCorrelation(globalChroma, MINOR_PROFILE, key);
  const profileScore = Math.max(0, Math.min(1, (profile + 1) / 2));

  return (
    harmonicFitNormalized * 0.32 +
    exactRatio * 0.14 +
    coverage * 0.14 +
    tonicRatio * 0.16 +
    normalizedCadence * 0.1 +
    profileScore * 0.07 +
    dominantRatio * 0.04 +
    endingTonic * 0.02 +
    openingTonic * 0.01
  );
};

const detectKey = (progression, globalChroma, majorsOnly) => {
  const candidates = [];
  for (let key = 0; key < 12; key++) {
    candidates.push({
      key,
      mode: "Major",
      score: scoreKeyCandidate(progression, key, "Major", globalChroma),
    });
    if (!majorsOnly) {
      candidates.push({
        key,
        mode: "Minor",
        score: scoreKeyCandidate(progression, key, "Minor", globalChroma),
      });
    }
  }
  candidates.sort((a, b) => b.score - a.score);
  const best = candidates[0];
  const second = candidates[1];
  return {
    key: NOTE_NAMES[best.key],
    mode: best.mode,
    score: best.score,
    alternative: `${NOTE_NAMES[second.key]} ${second.mode}`,
    top: candidates.slice(0, 4).map((c) => `${NOTE_NAMES[c.key]} ${c.mode} ${c.score.toFixed(3)}`),
  };
};

const chord = (name, duration = 1) => {
  const quality = name.endsWith("m") && name.length > 1 && name[name.length - 1] === "m" && !name.endsWith("#")
    ? "minor"
    : name.endsWith("m")
      ? "minor"
      : "major";
  const rootName = quality === "minor" ? name.slice(0, -1) : name;
  const root = NOTE_NAMES.indexOf(rootName);
  if (root < 0) throw new Error("bad chord " + name);
  return { root, quality, label: name, score: 0.75, duration };
};

const chromaFromProgression = (progression) => {
  const chroma = new Array(12).fill(0);
  for (const c of progression) {
    const third = (c.root + (c.quality === "minor" ? 3 : 4)) % 12;
    const fifth = (c.root + 7) % 12;
    chroma[c.root] += c.duration * 1.2;
    chroma[third] += c.duration * 1.0;
    chroma[fifth] += c.duration * 1.0;
  }
  const mag = Math.sqrt(chroma.reduce((s, v) => s + v * v, 0));
  return chroma.map((v) => v / mag);
};

const cases = [
  ["C D Em (user example)", ["C", "D", "Em"]],
  ["start on Em then C D G", ["Em", "C", "D", "G"]],
  ["G C D Em", ["G", "C", "D", "Em"]],
  ["only Em", ["Em"]],
  ["D# Fm Gm G# A# Cm", ["D#", "Fm", "Gm", "G#", "A#", "Cm"]],
  ["Am Dm E (true A minor)", ["Am", "Dm", "E"]],
  ["lots of Em then G", ["Em", "Em", "Em", "G"]],
];

for (const [title, names] of cases) {
  const progression = names.map((n) => chord(n));
  const chroma = chromaFromProgression(progression);
  const current = detectKey(progression, chroma, false);
  const majorsOnly = detectKey(progression, chroma, true);
  let remap = { ...current };
  if (remap.mode === "Minor") {
    const minorIndex = NOTE_NAMES.indexOf(remap.key);
    remap = {
      ...remap,
      key: NOTE_NAMES[(minorIndex + 3) % 12],
      mode: "Major",
    };
  }
  console.log("\n" + title);
  console.log("  current     :", current.key, current.mode, "| alt", current.alternative);
  console.log("  majors-only :", majorsOnly.key, majorsOnly.mode, "| alt", majorsOnly.alternative);
  console.log("  remap-minor :", remap.key, remap.mode);
  console.log("  current top :", current.top.join(" · "));
  console.log("  major top   :", majorsOnly.top.join(" · "));
}
