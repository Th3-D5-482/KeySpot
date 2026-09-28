import { NOTE_NAMES } from "./constants";
import { cosineSimilarity, normalizeVector } from "./math";
import type { ChordObservation, ChordQuality, ChordState } from "./types";

export const CHORD_STATES: ChordState[] = [
  ...NOTE_NAMES.map((name, root) => ({
    root,
    quality: "major" as const,
    label: name,
  })),
  ...NOTE_NAMES.map((name, root) => ({
    root,
    quality: "minor" as const,
    label: `${name}m`,
  })),
];

const getChordTemplate = (root: number, quality: ChordQuality) => {
  const vector = new Array<number>(12).fill(0);

  if (quality === "major") {
    vector[root] = 1.0;
    vector[(root + 4) % 12] = 0.82;
    vector[(root + 7) % 12] = 0.92;
    vector[(root + 10) % 12] = 0.18;
  } else {
    vector[root] = 1.0;
    vector[(root + 3) % 12] = 0.82;
    vector[(root + 7) % 12] = 0.92;
    vector[(root + 10) % 12] = 0.18;
  }

  return normalizeVector(vector);
};

const chordEmission = (chroma: number[], state: ChordState) => {
  const template = getChordTemplate(state.root, state.quality);
  const cosine = cosineSimilarity(chroma, template);
  const thirdInterval = state.quality === "major" ? 4 : 3;
  const root = chroma[state.root];
  const third = chroma[(state.root + thirdInterval) % 12];
  const fifth = chroma[(state.root + 7) % 12];
  let chordEnergy = root + third + fifth;
  chordEnergy = Math.min(1, chordEnergy);
  const outsideEnergy = Math.max(0, 1 - chordEnergy);

  return (
    cosine * 2.0 +
    root * 0.75 +
    third * 0.45 +
    fifth * 0.5 -
    outsideEnergy * 0.45
  );
};

const chordTransition = (previous: ChordState, current: ChordState) => {
  let score = -0.55;

  if (
    previous.root === current.root &&
    previous.quality === current.quality
  ) {
    return 1.35;
  }

  if (previous.root === current.root) {
    score += 0.3;
  }

  const interval = (current.root - previous.root + 12) % 12;

  if (interval === 5 || interval === 7) {
    score += 0.55;
  }

  if (interval === 2 || interval === 10) {
    score += 0.2;
  }

  if (interval === 3 || interval === 9 || interval === 4 || interval === 8) {
    score += 0.08;
  }

  return score;
};

export const trackChordSequence = (observations: number[][]) => {
  const stateCount = CHORD_STATES.length;

  if (observations.length === 0) {
    return [];
  }

  const scores: number[][] = new Array(observations.length);
  const backPointers: number[][] = new Array(observations.length);

  scores[0] = new Array<number>(stateCount);
  backPointers[0] = new Array<number>(stateCount).fill(-1);

  for (let state = 0; state < stateCount; state++) {
    scores[0][state] = chordEmission(observations[0], CHORD_STATES[state]);
  }

  for (let t = 1; t < observations.length; t++) {
    scores[t] = new Array<number>(stateCount);
    backPointers[t] = new Array<number>(stateCount);

    for (let current = 0; current < stateCount; current++) {
      let bestScore = -Infinity;
      let bestPrevious = 0;
      const emission = chordEmission(observations[t], CHORD_STATES[current]);

      for (let previous = 0; previous < stateCount; previous++) {
        const candidate =
          scores[t - 1][previous] +
          chordTransition(CHORD_STATES[previous], CHORD_STATES[current]) +
          emission;

        if (candidate > bestScore) {
          bestScore = candidate;
          bestPrevious = previous;
        }
      }

      scores[t][current] = bestScore;
      backPointers[t][current] = bestPrevious;
    }
  }

  let bestFinal = 0;
  let bestFinalScore = -Infinity;

  for (let state = 0; state < stateCount; state++) {
    if (scores[observations.length - 1][state] > bestFinalScore) {
      bestFinalScore = scores[observations.length - 1][state];
      bestFinal = state;
    }
  }

  const path = new Array<number>(observations.length);
  path[observations.length - 1] = bestFinal;

  for (let t = observations.length - 1; t > 0; t--) {
    path[t - 1] = backPointers[t][path[t]];
  }

  return path.map((state) => CHORD_STATES[state]);
};

export const mergeChordSequence = (
  sequence: ChordState[],
  duration: number
) => {
  const result: ChordObservation[] = [];

  for (const chord of sequence) {
    const previous = result[result.length - 1];

    if (
      previous &&
      previous.root === chord.root &&
      previous.quality === chord.quality
    ) {
      previous.duration += duration;
    } else {
      result.push({
        root: chord.root,
        quality: chord.quality,
        label: chord.label,
        score: 0,
        duration,
      });
    }
  }

  return result;
};
