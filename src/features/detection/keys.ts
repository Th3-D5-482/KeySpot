import {
  MAJOR_INTERVALS,
  MAJOR_PROFILE,
  MAJOR_QUALITIES,
  MINOR_INTERVALS,
  MINOR_PROFILE,
  MINOR_QUALITIES,
  NOTE_NAMES,
} from "./constants";
import type { ChordObservation, ChordQuality, MusicalMode } from "./types";

export const getDiatonicChords = (key: number, mode: MusicalMode) => {
  if (mode === "Major") {
    const intervals = [0, 2, 4, 5, 7, 9, 11];
    const qualities: ChordQuality[] = [
      "major",
      "minor",
      "minor",
      "major",
      "major",
      "minor",
      "major",
    ];
    const romans = ["I", "ii", "iii", "IV", "V", "vi", "vii"];

    return intervals.map((interval, index) => {
      const root = (key + interval) % 12;
      const quality = qualities[index];
      const suffix = quality === "minor" ? "m" : "";

      return {
        degree: romans[index],
        label: NOTE_NAMES[root] + suffix,
      };
    });
  }

  const relativeMajorKey = (key + 3) % 12;
  const intervals = [0, 2, 4, 5, 7, 9, 11];
  const qualities: ChordQuality[] = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "major",
  ];
  const romans = ["I", "ii", "iii", "IV", "V", "vi", "vii"];

  return intervals.map((interval, index) => {
    const root = (relativeMajorKey + interval) % 12;
    const quality = qualities[index];
    const suffix = quality === "minor" ? "m" : "";

    return {
      degree: romans[index],
      label: NOTE_NAMES[root] + suffix,
    };
  });
};

const getChordFit = (
  chord: ChordObservation,
  key: number,
  mode: MusicalMode
) => {
  const intervals = mode === "Major" ? MAJOR_INTERVALS : MINOR_INTERVALS;
  const qualities = mode === "Major" ? MAJOR_QUALITIES : MINOR_QUALITIES;
  const relative = (chord.root - key + 12) % 12;
  const degree = intervals.indexOf(relative);

  if (degree >= 0 && qualities[degree] === chord.quality) {
    let weight = 1.0;

    if (degree === 0) {
      weight = 1.35;
    }

    if (degree === 4) {
      weight = 1.2;
    }

    if (degree === 3 || degree === 5) {
      weight = 1.05;
    }

    return {
      score: weight,
      degree,
      exact: true,
    };
  }

  if (degree >= 0) {
    if (mode === "Minor" && degree === 4 && chord.quality === "major") {
      return {
        score: 1.1,
        degree,
        exact: false,
      };
    }

    return {
      score: 0.48,
      degree,
      exact: false,
    };
  }

  const borrowedIntervals =
    mode === "Major" ? [1, 3, 6, 8, 10] : [1, 4, 6, 9, 11];

  if (borrowedIntervals.includes(relative)) {
    return {
      score: 0.18,
      degree: -1,
      exact: false,
    };
  }

  return {
    score: 0,
    degree: -1,
    exact: false,
  };
};

const profileCorrelation = (
  chroma: number[],
  profile: number[],
  key: number
) => {
  const rotated = new Array<number>(12);

  for (let i = 0; i < 12; i++) {
    rotated[i] = chroma[(i + key) % 12];
  }

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

  if (denominator <= 0) {
    return 0;
  }

  return numerator / denominator;
};

const scoreKeyCandidate = (
  progression: ChordObservation[],
  key: number,
  mode: MusicalMode,
  globalChroma: number[]
) => {
  if (progression.length === 0) {
    return 0;
  }

  let totalDuration = 0;

  for (const chord of progression) {
    totalDuration += chord.duration;
  }

  if (totalDuration <= 0) {
    return 0;
  }

  let harmonicFit = 0;
  let exactDuration = 0;
  let tonicDuration = 0;
  let dominantDuration = 0;
  const observedDegrees = new Set<number>();
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

      if (fit.degree >= 0) {
        observedDegrees.add(fit.degree);
      }
    }

    if (
      chord.root === key &&
      ((mode === "Major" && chord.quality === "major") ||
        (mode === "Minor" && chord.quality === "minor"))
    ) {
      tonicDuration += chord.duration;

      if (i === 0) {
        openingTonic = 1;
      }

      if (i === progression.length - 1) {
        endingTonic = 1;
      }
    }

    if (chord.root === (key + 7) % 12) {
      dominantDuration += chord.duration;
    }
  }

  const harmonicFitNormalized = Math.min(
    1,
    harmonicFit / (totalDuration * 1.2)
  );
  const exactRatio = exactDuration / totalDuration;
  const tonicRatio = tonicDuration / totalDuration;
  const dominantRatio = dominantDuration / totalDuration;
  const coverage = Math.min(1, observedDegrees.size / 6);

  for (let i = 1; i < progression.length; i++) {
    const previous = progression[i - 1];
    const current = progression[i];
    const transitionWeight = Math.min(previous.duration, current.duration);

    if (transitionWeight <= 0) {
      continue;
    }

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

export const detectKey = (
  progression: ChordObservation[],
  globalChroma: number[]
) => {
  const candidates: {
    key: number;
    mode: MusicalMode;
    score: number;
  }[] = [];

  for (let key = 0; key < 12; key++) {
    candidates.push({
      key,
      mode: "Major",
      score: scoreKeyCandidate(progression, key, "Major", globalChroma),
    });

    candidates.push({
      key,
      mode: "Minor",
      score: scoreKeyCandidate(progression, key, "Minor", globalChroma),
    });
  }

  candidates.sort((a, b) => b.score - a.score);

  const best = candidates[0];
  const second = candidates[1];
  const margin = Math.max(0, best.score - second.score);
  const confidence = Math.min(99, Math.max(1, 50 + margin * 220));

  return {
    key: NOTE_NAMES[best.key],
    mode: best.mode,
    score: best.score,
    confidence,
    alternative: {
      key: NOTE_NAMES[second.key],
      mode: second.mode,
      score: second.score,
    },
  };
};
