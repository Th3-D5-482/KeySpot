import { analyzeFrame } from "./chroma";
import { mergeChordSequence, trackChordSequence } from "./chords";
import {
  CHORD_HOP_SECONDS,
  CHORD_WINDOW_SECONDS,
  FFT_SIZE,
  HOP_SIZE,
  NOTE_NAMES,
} from "./constants";
import { detectKey, getDiatonicChords } from "./keys";
import { normalizeVector } from "./math";
import type { AnalysisResult, FrameAnalysis } from "./types";

export const analyzeRecording = (
  buffers: Float32Array[],
  sampleRate: number
): AnalysisResult | null => {
  if (buffers.length === 0) {
    console.log("No audio was captured.");
    return null;
  }

  let totalSamples = 0;

  for (const buffer of buffers) {
    totalSamples += buffer.length;
  }

  const audio = new Float32Array(totalSamples);
  let position = 0;

  for (const buffer of buffers) {
    audio.set(buffer, position);
    position += buffer.length;
  }

  console.log("================================");
  console.log("KEYSPOT AUDIO");
  console.log("Sample rate:", sampleRate);
  console.log("Samples:", audio.length);
  console.log("Seconds:", (audio.length / sampleRate).toFixed(2));
  console.log("================================");

  const frames: FrameAnalysis[] = [];

  for (let start = 0; start + FFT_SIZE <= audio.length; start += HOP_SIZE) {
    const frame = audio.slice(start, start + FFT_SIZE);
    const analysis = analyzeFrame(frame, sampleRate);

    if (analysis) {
      frames.push(analysis);
    }
  }

  if (frames.length < 5) {
    console.log("Not enough usable musical audio was captured.");
    return null;
  }

  console.log("Analysis frames:", frames.length);

  const globalChroma = new Array<number>(12).fill(0);
  let totalFrameWeight = 0;

  for (const frame of frames) {
    const weight = Math.min(1.5, Math.max(0.25, frame.rms * 30));

    for (let i = 0; i < 12; i++) {
      globalChroma[i] += frame.chroma[i] * weight;
    }

    totalFrameWeight += weight;
  }

  if (totalFrameWeight > 0) {
    for (let i = 0; i < 12; i++) {
      globalChroma[i] /= totalFrameWeight;
    }
  }

  const normalizedGlobal = normalizeVector(globalChroma);
  const frameSeconds = HOP_SIZE / sampleRate;
  const windowFrames = Math.max(
    3,
    Math.round(CHORD_WINDOW_SECONDS / frameSeconds)
  );
  const hopFrames = Math.max(1, Math.round(CHORD_HOP_SECONDS / frameSeconds));
  const windowObservations: number[][] = [];

  for (
    let start = 0;
    start + windowFrames <= frames.length;
    start += hopFrames
  ) {
    const averaged = new Array<number>(12).fill(0);
    let totalWeight = 0;

    for (let i = start; i < start + windowFrames; i++) {
      const frame = frames[i];
      const weight = Math.min(1.5, Math.max(0.3, frame.rms * 30));

      for (let note = 0; note < 12; note++) {
        averaged[note] += frame.chroma[note] * weight;
      }

      totalWeight += weight;
    }

    if (totalWeight <= 0) {
      continue;
    }

    for (let note = 0; note < 12; note++) {
      averaged[note] /= totalWeight;
    }

    windowObservations.push(normalizeVector(averaged));
  }

  console.log("Chord observations:", windowObservations.length);

  const sequence = trackChordSequence(windowObservations);

  if (sequence.length === 0) {
    console.log("No chords could be identified.");
    return null;
  }

  const chordDuration =
    windowObservations.length > 1 ? CHORD_HOP_SECONDS : CHORD_WINDOW_SECONDS;

  let progression = mergeChordSequence(sequence, chordDuration);

  progression = progression.filter((chord, index) => {
    if (chord.duration >= 0.3) {
      return true;
    }

    const previous = progression[index - 1];
    const next = progression[index + 1];

    if (
      previous &&
      previous.root === chord.root &&
      previous.quality === chord.quality
    ) {
      return false;
    }

    if (
      next &&
      next.root === chord.root &&
      next.quality === chord.quality
    ) {
      return false;
    }

    return true;
  });

  console.log("================================");
  console.log("CHORD SEQUENCE");

  progression.forEach((chord, index) => {
    console.log(index + 1, chord.label, chord.duration.toFixed(2), "sec");
  });

  console.log("================================");

  progression = progression.map((chord) => ({
    ...chord,
    score: 0.75,
  }));

  const result = detectKey(progression, normalizedGlobal);
  const keyIndex = NOTE_NAMES.indexOf(result.key);
  const diatonicChords = getDiatonicChords(keyIndex, result.mode).slice(0, 6);
  const observedChords = Array.from(
    new Set(progression.map((chord) => chord.label))
  );

  console.log("================================");
  console.log("FINAL KEY:", result.key, result.mode);
  console.log("CONFIDENCE:", result.confidence.toFixed(1) + "%");
  console.log(
    "ALTERNATIVE:",
    result.alternative.key,
    result.alternative.mode
  );
  console.log("CHORDS:", observedChords.join(" → "));
  console.log(
    "EXPECTED:",
    diatonicChords
      .map((chord) => chord.degree + "=" + chord.label)
      .join(" | ")
  );
  console.log("================================");

  return {
    key: result.key,
    mode: result.mode,
    confidence: result.confidence,
    alternative: `${result.alternative.key} ${result.alternative.mode}`,
    observedChords,
    progression: progression.map((chord) => chord.label),
    diatonicChords: diatonicChords.map(
      (chord) => `${chord.degree}:${chord.label}`
    ),
  };
};
