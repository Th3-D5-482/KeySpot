import { FFT_SIZE, MAX_FREQUENCY, MIN_FREQUENCY, MIN_RMS } from "./constants";
import { fft } from "./fft";
import { normalizeVector } from "./math";
import type { FrameAnalysis } from "./types";

const frequencyToMidi = (frequency: number) => {
  if (frequency <= 0 || !Number.isFinite(frequency)) {
    return -1;
  }

  return 69 + 12 * Math.log2(frequency / 440);
};

const buildDirectChroma = (
  magnitudes: Float64Array,
  sampleRate: number
) => {
  const chroma = new Array<number>(12).fill(0);

  for (let bin = 1; bin < magnitudes.length; bin++) {
    const frequency = (bin * sampleRate) / FFT_SIZE;

    if (frequency < MIN_FREQUENCY || frequency > MAX_FREQUENCY) {
      continue;
    }

    const magnitude = magnitudes[bin];

    if (magnitude <= 0) {
      continue;
    }

    const midi = frequencyToMidi(frequency);

    if (midi < 0) {
      continue;
    }

    const wrappedMidi = ((midi % 12) + 12) % 12;
    const lower = Math.floor(wrappedMidi);
    const upper = (lower + 1) % 12;
    const fraction = wrappedMidi - lower;

    let weight = Math.log1p(magnitude);

    if (frequency > 1500) {
      weight *= 0.65;
    }

    if (frequency > 2500) {
      weight *= 0.45;
    }

    chroma[lower] += weight * (1 - fraction);
    chroma[upper] += weight * fraction;
  }

  return chroma;
};

const buildHarmonicChroma = (
  magnitudes: Float64Array,
  sampleRate: number
) => {
  const chroma = new Array<number>(12).fill(0);
  const harmonicWeights = [1.0, 0.82, 0.68, 0.55, 0.45, 0.37, 0.31, 0.26];
  const MIN_MIDI = 36;
  const MAX_MIDI = 96;

  for (let midi = MIN_MIDI; midi <= MAX_MIDI; midi++) {
    const fundamental = 440 * Math.pow(2, (midi - 69) / 12);
    let energy = 0;

    for (let harmonic = 1; harmonic <= 8; harmonic++) {
      const frequency = fundamental * harmonic;

      if (
        frequency < MIN_FREQUENCY ||
        frequency > MAX_FREQUENCY ||
        frequency >= sampleRate / 2
      ) {
        continue;
      }

      const bin = Math.round((frequency * FFT_SIZE) / sampleRate);
      let best = 0;

      for (let offset = -1; offset <= 1; offset++) {
        const index = bin + offset;

        if (index < 0 || index >= magnitudes.length) {
          continue;
        }

        if (magnitudes[index] > best) {
          best = magnitudes[index];
        }
      }

      if (best <= 0) {
        continue;
      }

      energy += Math.log1p(best) * harmonicWeights[harmonic - 1];
    }

    if (energy <= 0) {
      continue;
    }

    const pitchClass = ((midi % 12) + 12) % 12;
    chroma[pitchClass] += energy;
  }

  return chroma;
};

export const analyzeFrame = (
  samples: Float32Array,
  sampleRate: number
): FrameAnalysis | null => {
  const input = new Array<number>(FFT_SIZE).fill(0);
  let mean = 0;
  let squareSum = 0;

  for (let i = 0; i < FFT_SIZE; i++) {
    const value = samples[i] ?? 0;
    mean += value;
    squareSum += value * value;
  }

  mean /= FFT_SIZE;
  const rms = Math.sqrt(squareSum / FFT_SIZE);

  if (rms < MIN_RMS) {
    return null;
  }

  for (let i = 0; i < FFT_SIZE; i++) {
    const window = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (FFT_SIZE - 1)));
    input[i] = (samples[i] - mean) * window;
  }

  const result = fft(input);
  const magnitudes = new Float64Array(FFT_SIZE / 2);

  for (let i = 0; i < FFT_SIZE / 2; i++) {
    const real = result.real[i];
    const imag = result.imag[i];
    magnitudes[i] = Math.sqrt(real * real + imag * imag);
  }

  const direct = buildDirectChroma(magnitudes, sampleRate);
  const harmonic = buildHarmonicChroma(magnitudes, sampleRate);
  const chroma = new Array<number>(12).fill(0);

  for (let i = 0; i < 12; i++) {
    chroma[i] = direct[i] * 0.3 + harmonic[i] * 0.7;
  }

  const normalized = normalizeVector(chroma);
  const energy = normalized.reduce((sum, value) => sum + value, 0);

  if (energy <= 0) {
    return null;
  }

  return {
    chroma: normalized,
    rms,
  };
};
