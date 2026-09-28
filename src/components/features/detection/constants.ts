import type { ChordQuality } from "./types";

export const LISTENING_TIME = 10000;

export const REQUESTED_SAMPLE_RATE = 44100;

export const FFT_SIZE = 4096;

export const HOP_SIZE = 2048;

export const CHORD_WINDOW_SECONDS = 0.65;

export const CHORD_HOP_SECONDS = 0.25;

export const MIN_FREQUENCY = 55;

export const MAX_FREQUENCY = 3500;

export const MIN_RMS = 0.002;

export const NOTE_NAMES = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
];

export const MAJOR_PROFILE = [
  6.35, 2.23, 3.48, 2.33, 4.38, 4.09, 2.52, 5.19, 2.39, 3.66, 2.29, 2.88,
];

export const MINOR_PROFILE = [
  6.33, 2.68, 3.52, 5.38, 2.6, 3.53, 2.54, 4.75, 3.98, 2.69, 3.34, 3.17,
];

export const MAJOR_INTERVALS = [0, 2, 4, 5, 7, 9, 11];

export const MAJOR_QUALITIES: ChordQuality[] = [
  "major",
  "minor",
  "minor",
  "major",
  "major",
  "minor",
  "major",
];

export const MAJOR_ROMANS = ["I", "ii", "iii", "IV", "V", "vi", "vii"];

export const MINOR_INTERVALS = [0, 2, 3, 5, 7, 8, 10];

export const MINOR_QUALITIES: ChordQuality[] = [
  "minor",
  "minor",
  "major",
  "minor",
  "major",
  "major",
  "major",
];

export const MINOR_ROMANS = ["i", "ii", "III", "iv", "V", "VI", "VII"];
