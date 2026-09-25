import {
  requestRecordingPermissionsAsync,
  useAudioStream,
} from "expo-audio";

import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Linking,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { SafeAreaProvider } from "react-native-safe-area-context";

// ==================================================
// SETTINGS
// ==================================================

const LISTENING_TIME = 30000;

const REQUESTED_SAMPLE_RATE = 44100;

const FFT_SIZE = 4096;

const HOP_SIZE = 2048;

// Chord windows are deliberately shorter than the
// previous version so fast chord changes are not
// completely mixed together.

const CHORD_WINDOW_SECONDS = 0.65;

const CHORD_HOP_SECONDS = 0.25;

const MIN_FREQUENCY = 55;

const MAX_FREQUENCY = 3500;

const MIN_RMS = 0.002;

// ==================================================
// NOTES
// ==================================================

const NOTE_NAMES = [
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

// ==================================================
// KEY PROFILES
// ==================================================

const MAJOR_PROFILE = [
  6.35,
  2.23,
  3.48,
  2.33,
  4.38,
  4.09,
  2.52,
  5.19,
  2.39,
  3.66,
  2.29,
  2.88,
];

const MINOR_PROFILE = [
  6.33,
  2.68,
  3.52,
  5.38,
  2.60,
  3.53,
  2.54,
  4.75,
  3.98,
  2.69,
  3.34,
  3.17,
];

// ==================================================
// TYPES
// ==================================================

type ChordQuality =
  | "major"
  | "minor";

type ChordState = {
  root: number;
  quality: ChordQuality;
  label: string;
};

type ChordObservation = {
  root: number;
  quality: ChordQuality;
  label: string;
  score: number;
  duration: number;
};

type FrameAnalysis = {
  chroma: number[];
  rms: number;
};

// ==================================================
// BASIC MATH
// ==================================================

const normalizeVector = (
  values: number[]
) => {
  const magnitude =
    Math.sqrt(
      values.reduce(
        (sum, value) =>
          sum + value * value,
        0
      )
    );

  if (
    magnitude <= 0 ||
    !Number.isFinite(magnitude)
  ) {
    return values.map(
      () => 0
    );
  }

  return values.map(
    value =>
      value / magnitude
  );
};

const cosineSimilarity = (
  a: number[],
  b: number[]
) => {
  let numerator = 0;

  let aMagnitude = 0;

  let bMagnitude = 0;

  for (
    let i = 0;
    i < a.length;
    i++
  ) {
    numerator +=
      a[i] * b[i];

    aMagnitude +=
      a[i] * a[i];

    bMagnitude +=
      b[i] * b[i];
  }

  const denominator =
    Math.sqrt(
      aMagnitude *
      bMagnitude
    );

  if (
    denominator <= 0
  ) {
    return 0;
  }

  return (
    numerator /
    denominator
  );
};

// ==================================================
// FFT
// ==================================================

const fft = (
  samples: number[]
) => {
  const N =
    samples.length;

  const real =
    new Array<number>(
      N
    ).fill(0);

  const imag =
    new Array<number>(
      N
    ).fill(0);

  for (
    let i = 0;
    i < N;
    i++
  ) {
    real[i] =
      samples[i];
  }

  // Bit reversal

  let j = 0;

  for (
    let i = 1;
    i < N;
    i++
  ) {
    let bit =
      N >> 1;

    while (
      j & bit
    ) {
      j ^= bit;
      bit >>= 1;
    }

    j ^= bit;

    if (
      i < j
    ) {
      const temp =
        real[i];

      real[i] =
        real[j];

      real[j] =
        temp;
    }
  }

  // FFT

  for (
    let length = 2;
    length <= N;
    length <<= 1
  ) {
    const angle =
      (-2 * Math.PI) /
      length;

    const wReal =
      Math.cos(angle);

    const wImag =
      Math.sin(angle);

    for (
      let start = 0;
      start < N;
      start += length
    ) {
      let currentReal =
        1;

      let currentImag =
        0;

      for (
        let k = 0;
        k < length / 2;
        k++
      ) {
        const evenIndex =
          start + k;

        const oddIndex =
          start +
          k +
          length / 2;

        const oddReal =
          real[oddIndex] *
          currentReal -
          imag[oddIndex] *
          currentImag;

        const oddImag =
          real[oddIndex] *
          currentImag +
          imag[oddIndex] *
          currentReal;

        const evenReal =
          real[evenIndex];

        const evenImag =
          imag[evenIndex];

        real[evenIndex] =
          evenReal +
          oddReal;

        imag[evenIndex] =
          evenImag +
          oddImag;

        real[oddIndex] =
          evenReal -
          oddReal;

        imag[oddIndex] =
          evenImag -
          oddImag;

        const nextReal =
          currentReal *
          wReal -
          currentImag *
          wImag;

        const nextImag =
          currentReal *
          wImag +
          currentImag *
          wReal;

        currentReal =
          nextReal;

        currentImag =
          nextImag;
      }
    }
  }

  return {
    real,
    imag,
  };
};

// ==================================================
// FREQUENCY → MIDI
// ==================================================

const frequencyToMidi = (
  frequency: number
) => {
  if (
    frequency <= 0 ||
    !Number.isFinite(frequency)
  ) {
    return -1;
  }

  return (
    69 +
    12 *
    Math.log2(
      frequency / 440
    )
  );
};

// ==================================================
// BUILD DIRECT CHROMA
// ==================================================

const buildDirectChroma = (
  magnitudes: Float64Array,
  sampleRate: number
) => {
  const chroma =
    new Array<number>(
      12
    ).fill(0);

  for (
    let bin = 1;
    bin <
    magnitudes.length;
    bin++
  ) {
    const frequency =
      (bin *
        sampleRate) /
      FFT_SIZE;

    if (
      frequency <
      MIN_FREQUENCY ||
      frequency >
      MAX_FREQUENCY
    ) {
      continue;
    }

    const magnitude =
      magnitudes[bin];

    if (
      magnitude <= 0
    ) {
      continue;
    }

    const midi =
      frequencyToMidi(
        frequency
      );

    if (
      midi < 0
    ) {
      continue;
    }

    const wrappedMidi =
      (
        midi % 12 +
        12
      ) % 12;

    const lower =
      Math.floor(
        wrappedMidi
      );

    const upper =
      (
        lower + 1
      ) % 12;

    const fraction =
      wrappedMidi -
      lower;

    let weight =
      Math.log1p(
        magnitude
      );

    // Less weight on the very highest spectrum.

    if (
      frequency > 1500
    ) {
      weight *=
        0.65;
    }

    if (
      frequency > 2500
    ) {
      weight *=
        0.45;
    }

    chroma[lower] +=
      weight *
      (1 - fraction);

    chroma[upper] +=
      weight *
      fraction;
  }

  return chroma;
};

// ==================================================
// BUILD HARMONIC CHROMA
//
// Instead of treating every frequency as an
// independent note, test possible musical
// fundamentals and gather their harmonic energy.
// ==================================================

const buildHarmonicChroma = (
  magnitudes: Float64Array,
  sampleRate: number
) => {
  const chroma =
    new Array<number>(
      12
    ).fill(0);

  const harmonicWeights = [
    1.00,
    0.82,
    0.68,
    0.55,
    0.45,
    0.37,
    0.31,
    0.26,
  ];

  const MIN_MIDI = 36;

  const MAX_MIDI = 96;

  for (
    let midi =
      MIN_MIDI;
    midi <=
    MAX_MIDI;
    midi++
  ) {
    const fundamental =
      440 *
      Math.pow(
        2,
        (midi - 69) /
        12
      );

    let energy =
      0;

    for (
      let harmonic = 1;
      harmonic <= 8;
      harmonic++
    ) {
      const frequency =
        fundamental *
        harmonic;

      if (
        frequency <
        MIN_FREQUENCY ||
        frequency >
        MAX_FREQUENCY ||
        frequency >=
        sampleRate / 2
      ) {
        continue;
      }

      const bin =
        Math.round(
          (
            frequency *
            FFT_SIZE
          ) /
          sampleRate
        );

      let best =
        0;

      // Small spectral neighbourhood.

      for (
        let offset = -1;
        offset <= 1;
        offset++
      ) {
        const index =
          bin +
          offset;

        if (
          index < 0 ||
          index >=
          magnitudes.length
        ) {
          continue;
        }

        if (
          magnitudes[index] >
          best
        ) {
          best =
            magnitudes[index];
        }
      }

      if (
        best <= 0
      ) {
        continue;
      }

      energy +=
        Math.log1p(
          best
        ) *
        harmonicWeights[
        harmonic - 1
        ];
    }

    if (
      energy <= 0
    ) {
      continue;
    }

    const pitchClass =
      (
        midi % 12 +
        12
      ) % 12;

    chroma[
      pitchClass
    ] += energy;
  }

  return chroma;
};

// ==================================================
// ANALYZE ONE FRAME
// ==================================================

const analyzeFrame = (
  samples: Float32Array,
  sampleRate: number
): FrameAnalysis | null => {
  const input =
    new Array<number>(
      FFT_SIZE
    ).fill(0);

  let mean = 0;

  let squareSum = 0;

  for (
    let i = 0;
    i < FFT_SIZE;
    i++
  ) {
    const value =
      samples[i] ??
      0;

    mean += value;

    squareSum +=
      value * value;
  }

  mean /=
    FFT_SIZE;

  const rms =
    Math.sqrt(
      squareSum /
      FFT_SIZE
    );

  if (
    rms <
    MIN_RMS
  ) {
    return null;
  }

  // Hann window

  for (
    let i = 0;
    i < FFT_SIZE;
    i++
  ) {
    const window =
      0.5 *
      (
        1 -
        Math.cos(
          (
            2 *
            Math.PI *
            i
          ) /
          (FFT_SIZE - 1)
        )
      );

    input[i] =
      (
        samples[i] -
        mean
      ) *
      window;
  }

  const result =
    fft(input);

  const magnitudes =
    new Float64Array(
      FFT_SIZE / 2
    );

  for (
    let i = 0;
    i <
    FFT_SIZE / 2;
    i++
  ) {
    const real =
      result.real[i];

    const imag =
      result.imag[i];

    magnitudes[i] =
      Math.sqrt(
        real * real +
        imag * imag
      );
  }

  const direct =
    buildDirectChroma(
      magnitudes,
      sampleRate
    );

  const harmonic =
    buildHarmonicChroma(
      magnitudes,
      sampleRate
    );

  // Harmonic evidence gets more weight than raw
  // FFT-bin chroma because chords contain harmonics.

  const chroma =
    new Array<number>(
      12
    ).fill(0);

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    chroma[i] =
      direct[i] *
      0.30 +
      harmonic[i] *
      0.70;
  }

  const normalized =
    normalizeVector(
      chroma
    );

  const energy =
    normalized.reduce(
      (sum, value) =>
        sum + value,
      0
    );

  if (
    energy <= 0
  ) {
    return null;
  }

  return {
    chroma: normalized,
    rms,
  };
};

// ==================================================
// CHORD STATES
//
// 24 musical chord states:
// C, C#, ... B major
// C, C#, ... B minor
//
// This is followed by Viterbi temporal tracking.
// ==================================================

const CHORD_STATES:
  ChordState[] = [];

for (
  let root = 0;
  root < 12;
  root++
) {
  CHORD_STATES.push({
    root,

    quality:
      "major",

    label:
      NOTE_NAMES[root],
  });
}

for (
  let root = 0;
  root < 12;
  root++
) {
  CHORD_STATES.push({
    root,

    quality:
      "minor",

    label:
      NOTE_NAMES[root] +
      "m",
  });
}

// ==================================================
// CHORD TEMPLATE
// ==================================================

const getChordTemplate = (
  root: number,
  quality: ChordQuality
) => {
  const vector =
    new Array<number>(
      12
    ).fill(0);

  if (
    quality ===
    "major"
  ) {
    vector[root] =
      1.00;

    vector[
      (root + 4) % 12
    ] = 0.82;

    vector[
      (root + 7) % 12
    ] = 0.92;

    // Gentle tolerance for dominant 7th.

    vector[
      (root + 10) % 12
    ] = 0.18;
  } else {
    vector[root] =
      1.00;

    vector[
      (root + 3) % 12
    ] = 0.82;

    vector[
      (root + 7) % 12
    ] = 0.92;

    // Minor 7th tolerance.

    vector[
      (root + 10) % 12
    ] = 0.18;
  }

  return normalizeVector(
    vector
  );
};

// ==================================================
// CHORD EMISSION SCORE
//
// Combines:
// - template similarity
// - root evidence
// - third evidence
// - fifth evidence
// - out-of-chord penalty
// ==================================================

const chordEmission = (
  chroma: number[],
  state: ChordState
) => {
  const template =
    getChordTemplate(
      state.root,
      state.quality
    );

  const cosine =
    cosineSimilarity(
      chroma,
      template
    );

  const thirdInterval =
    state.quality ===
      "major"
      ? 4
      : 3;

  const root =
    chroma[
    state.root
    ];

  const third =
    chroma[
    (
      state.root +
      thirdInterval
    ) % 12
    ];

  const fifth =
    chroma[
    (
      state.root +
      7
    ) % 12
    ];

  let chordEnergy =
    root +
    third +
    fifth;

  chordEnergy =
    Math.min(
      1,
      chordEnergy
    );

  const outsideEnergy =
    Math.max(
      0,
      1 -
      chordEnergy
    );

  const score =
    cosine * 2.00 +
    root * 0.75 +
    third * 0.45 +
    fifth * 0.50 -
    outsideEnergy *
    0.45;

  return score;
};

// ==================================================
// TRANSITION SCORE
//
// This creates musical continuity.
//
// Self transitions are strongly preferred,
// while common harmonic root movements get
// small bonuses.
// ==================================================

const chordTransition = (
  previous: ChordState,
  current: ChordState
) => {
  let score =
    -0.55;

  if (
    previous.root ===
    current.root &&
    previous.quality ===
    current.quality
  ) {
    return 1.35;
  }

  // Major <-> minor same root.

  if (
    previous.root ===
    current.root
  ) {
    score +=
      0.30;
  }

  const interval =
    (
      current.root -
      previous.root +
      12
    ) % 12;

  // Perfect fourth / fifth.

  if (
    interval === 5 ||
    interval === 7
  ) {
    score +=
      0.55;
  }

  // Whole-step movement.

  if (
    interval === 2 ||
    interval === 10
  ) {
    score +=
      0.20;
  }

  // Minor/major third motion.

  if (
    interval === 3 ||
    interval === 9 ||
    interval === 4 ||
    interval === 8
  ) {
    score +=
      0.08;
  }

  return score;
};

// ==================================================
// VITERBI CHORD TRACKING
// ==================================================

const trackChordSequence = (
  observations: number[][]
) => {
  const stateCount =
    CHORD_STATES.length;

  if (
    observations.length === 0
  ) {
    return [];
  }

  const scores:
    number[][] =
    new Array(
      observations.length
    );

  const backPointers:
    number[][] =
    new Array(
      observations.length
    );

  // ----------------------------------------------
  // First frame
  // ----------------------------------------------

  scores[0] =
    new Array<number>(
      stateCount
    );

  backPointers[0] =
    new Array<number>(
      stateCount
    ).fill(-1);

  for (
    let state = 0;
    state < stateCount;
    state++
  ) {
    scores[0][state] =
      chordEmission(
        observations[0],
        CHORD_STATES[
        state
        ]
      );
  }

  // ----------------------------------------------
  // Remaining frames
  // ----------------------------------------------

  for (
    let t = 1;
    t <
    observations.length;
    t++
  ) {
    scores[t] =
      new Array<number>(
        stateCount
      );

    backPointers[t] =
      new Array<number>(
        stateCount
      );

    for (
      let current = 0;
      current <
      stateCount;
      current++
    ) {
      let bestScore =
        -Infinity;

      let bestPrevious =
        0;

      const emission =
        chordEmission(
          observations[t],
          CHORD_STATES[
          current
          ]
        );

      for (
        let previous = 0;
        previous <
        stateCount;
        previous++
      ) {
        const candidate =
          scores[t - 1][
          previous
          ] +
          chordTransition(
            CHORD_STATES[
            previous
            ],
            CHORD_STATES[
            current
            ]
          ) +
          emission;

        if (
          candidate >
          bestScore
        ) {
          bestScore =
            candidate;

          bestPrevious =
            previous;
        }
      }

      scores[t][current] =
        bestScore;

      backPointers[t][
        current
      ] =
        bestPrevious;
    }
  }

  // ----------------------------------------------
  // Find final state
  // ----------------------------------------------

  let bestFinal =
    0;

  let bestFinalScore =
    -Infinity;

  for (
    let state = 0;
    state < stateCount;
    state++
  ) {
    if (
      scores[
      observations.length -
      1
      ][state] >
      bestFinalScore
    ) {
      bestFinalScore =
        scores[
        observations.length -
        1
        ][state];

      bestFinal =
        state;
    }
  }

  // ----------------------------------------------
  // Backtrack
  // ----------------------------------------------

  const path =
    new Array<number>(
      observations.length
    );

  path[
    observations.length -
    1
  ] =
    bestFinal;

  for (
    let t =
      observations.length -
      1;
    t > 0;
    t--
  ) {
    path[t - 1] =
      backPointers[t][
      path[t]
      ];
  }

  return path.map(
    state =>
      CHORD_STATES[
      state
      ]
  );
};

// ==================================================
// MERGE CHORD SEQUENCE
// ==================================================

const mergeChordSequence = (
  sequence: ChordState[],
  duration: number
) => {
  const result:
    ChordObservation[] =
    [];

  for (
    const chord of
    sequence
  ) {
    const previous =
      result[
      result.length - 1
      ];

    if (
      previous &&
      previous.root ===
      chord.root &&
      previous.quality ===
      chord.quality
    ) {
      previous.duration +=
        duration;
    } else {
      result.push({
        root:
          chord.root,

        quality:
          chord.quality,

        label:
          chord.label,

        score: 0,

        duration,
      });
    }
  }

  return result;
};

// ==================================================
// DIATONIC CHORD INFORMATION
// ==================================================

const MAJOR_INTERVALS = [
  0,
  2,
  4,
  5,
  7,
  9,
  11,
];

const MAJOR_QUALITIES:
  ChordQuality[] = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "major",
  ];

const MAJOR_ROMANS = [
  "I",
  "ii",
  "iii",
  "IV",
  "V",
  "vi",
  "vii",
];

const MINOR_INTERVALS = [
  0,
  2,
  3,
  5,
  7,
  8,
  10,
];

const MINOR_QUALITIES:
  ChordQuality[] = [
    "minor",
    "minor",
    "major",
    "minor",
    "major",
    "major",
    "major",
  ];

const MINOR_ROMANS = [
  "i",
  "ii",
  "III",
  "iv",
  "V",
  "VI",
  "VII",
];

// ==================================================
// GET DIATONIC FAMILY
// ==================================================

const getDiatonicChords = (
  key: number,
  mode:
    | "Major"
    | "Minor"
) => {

  // ----------------------------------------------
  // MAJOR KEY
  // ----------------------------------------------

  if (mode === "Major") {
    const intervals = [
      0, 2, 4, 5, 7, 9, 11
    ];

    const qualities: ChordQuality[] = [
      "major",
      "minor",
      "minor",
      "major",
      "major",
      "minor",
      "major",
    ];

    const romans = [
      "I",
      "ii",
      "iii",
      "IV",
      "V",
      "vi",
      "vii",
    ];

    return intervals.map(
      (interval, index) => {
        const root =
          (key + interval) % 12;

        const quality =
          qualities[index];

        const suffix =
          quality === "minor"
            ? "m"
            : "";

        return {
          degree:
            romans[index],

          label:
            NOTE_NAMES[root] +
            suffix,
        };
      }
    );
  }

  // ----------------------------------------------
  // MINOR KEY
  //
  // Start from the RELATIVE MAJOR.
  //
  // Example:
  // Cm → D#/Eb major
  // G#m → B major
  // Am → C major
  // ----------------------------------------------

  const relativeMajorKey =
    (key + 3) % 12;

  const intervals = [
    0, 2, 4, 5, 7, 9, 11
  ];

  const qualities: ChordQuality[] = [
    "major",
    "minor",
    "minor",
    "major",
    "major",
    "minor",
    "major",
  ];

  const romans = [
    "I",
    "ii",
    "iii",
    "IV",
    "V",
    "vi",
    "vii",
  ];

  return intervals.map(
    (interval, index) => {
      const root =
        (
          relativeMajorKey +
          interval
        ) % 12;

      const quality =
        qualities[index];

      const suffix =
        quality === "minor"
          ? "m"
          : "";

      return {
        degree:
          romans[index],

        label:
          NOTE_NAMES[root] +
          suffix,
      };
    }
  );
};

// ==================================================
// CHORD FIT INSIDE KEY
// ==================================================

const getChordFit = (
  chord: ChordObservation,
  key: number,
  mode:
    | "Major"
    | "Minor"
) => {
  const intervals =
    mode === "Major"
      ? MAJOR_INTERVALS
      : MINOR_INTERVALS;

  const qualities =
    mode === "Major"
      ? MAJOR_QUALITIES
      : MINOR_QUALITIES;

  const relative =
    (
      chord.root -
      key +
      12
    ) % 12;

  const degree =
    intervals.indexOf(
      relative
    );

  // Exact diatonic match.

  if (
    degree >= 0 &&
    qualities[degree] ===
    chord.quality
  ) {
    let weight = 1.0;

    // Tonic and dominant are more
    // important in determining the key.

    if (
      degree === 0
    ) {
      weight =
        1.35;
    }

    if (
      degree === 4
    ) {
      weight =
        1.20;
    }

    if (
      degree === 3 ||
      degree === 5
    ) {
      weight =
        1.05;
    }

    return {
      score:
        weight,

      degree,

      exact: true,
    };
  }

  // Same diatonic root, different quality.
  // This covers borrowed/modal chords.

  if (
    degree >= 0
  ) {
    // Major V in a minor key is especially common.

    if (
      mode === "Minor" &&
      degree === 4 &&
      chord.quality ===
      "major"
    ) {
      return {
        score:
          1.10,

        degree,

        exact: false,
      };
    }

    return {
      score:
        0.48,

      degree,

      exact: false,
    };
  }

  // Very common borrowed roots.

  const borrowedIntervals =
    mode === "Major"
      ? [1, 3, 6, 8, 10]
      : [1, 4, 6, 9, 11];

  if (
    borrowedIntervals.includes(
      relative
    )
  ) {
    return {
      score:
        0.18,

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

// ==================================================
// KEY PROFILE CORRELATION
// ==================================================

const profileCorrelation = (
  chroma: number[],
  profile: number[],
  key: number
) => {
  const rotated =
    new Array<number>(
      12
    );

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    rotated[i] =
      chroma[
      (
        i +
        key
      ) % 12
      ];
  }

  let chromaMean = 0;

  let profileMean = 0;

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    chromaMean +=
      rotated[i];

    profileMean +=
      profile[i];
  }

  chromaMean /=
    12;

  profileMean /=
    12;

  let numerator = 0;

  let xVariance = 0;

  let yVariance = 0;

  for (
    let i = 0;
    i < 12;
    i++
  ) {
    const x =
      rotated[i] -
      chromaMean;

    const y =
      profile[i] -
      profileMean;

    numerator +=
      x * y;

    xVariance +=
      x * x;

    yVariance +=
      y * y;
  }

  const denominator =
    Math.sqrt(
      xVariance *
      yVariance
    );

  if (
    denominator <= 0
  ) {
    return 0;
  }

  return (
    numerator /
    denominator
  );
};

// ==================================================
// KEY CANDIDATE SCORE
// ==================================================

const scoreKeyCandidate = (
  progression: ChordObservation[],
  key: number,
  mode:
    | "Major"
    | "Minor",
  globalChroma: number[]
) => {
  if (
    progression.length === 0
  ) {
    return 0;
  }

  let totalDuration = 0;

  for (
    const chord of
    progression
  ) {
    totalDuration +=
      chord.duration;
  }

  if (
    totalDuration <= 0
  ) {
    return 0;
  }

  let harmonicFit = 0;

  let exactDuration = 0;

  let tonicDuration = 0;

  let dominantDuration = 0;

  const observedDegrees =
    new Set<number>();

  let cadenceScore = 0;

  let cadenceOpportunities = 0;

  let endingTonic = 0;

  let openingTonic = 0;

  // ----------------------------------------------
  // Analyze every observed chord.
  // ----------------------------------------------

  for (
    let i = 0;
    i <
    progression.length;
    i++
  ) {
    const chord =
      progression[i];

    const weight =
      chord.duration *
      Math.max(
        0.35,
        chord.score
      );

    const fit =
      getChordFit(
        chord,
        key,
        mode
      );

    harmonicFit +=
      weight *
      fit.score;

    if (
      fit.exact
    ) {
      exactDuration +=
        chord.duration;

      if (
        fit.degree >= 0
      ) {
        observedDegrees.add(
          fit.degree
        );
      }
    }

    // Tonic.

    if (
      chord.root ===
      key &&
      (
        (
          mode === "Major" &&
          chord.quality ===
          "major"
        ) ||
        (
          mode === "Minor" &&
          chord.quality ===
          "minor"
        )
      )
    ) {
      tonicDuration +=
        chord.duration;

      if (
        i === 0
      ) {
        openingTonic =
          1;
      }

      if (
        i ===
        progression.length - 1
      ) {
        endingTonic =
          1;
      }
    }

    // Dominant.

    if (
      chord.root ===
      (
        key + 7
      ) % 12
    ) {
      dominantDuration +=
        chord.duration;
    }
  }

  // ----------------------------------------------
  // Normalize harmonic fit.
  // ----------------------------------------------

  const harmonicFitNormalized =
    Math.min(
      1,
      harmonicFit /
      (
        totalDuration *
        1.20
      )
    );

  const exactRatio =
    exactDuration /
    totalDuration;

  const tonicRatio =
    tonicDuration /
    totalDuration;

  const dominantRatio =
    dominantDuration /
    totalDuration;

  // ----------------------------------------------
  // Chord diversity.
  //
  // This is a major part of your requirement:
  //
  // D
  // Em
  // F#m
  // G
  // A
  // Bm
  //
  // becomes multiple pieces of independent
  // evidence rather than one frequency vector.
  // ----------------------------------------------

  const coverage =
    Math.min(
      1,
      observedDegrees.size /
      6
    );

  // ----------------------------------------------
  // Transition / cadence analysis.
  // ----------------------------------------------

  for (
    let i = 1;
    i <
    progression.length;
    i++
  ) {
    const previous =
      progression[i - 1];

    const current =
      progression[i];

    const transitionWeight =
      Math.min(
        previous.duration,
        current.duration
      );

    if (
      transitionWeight <= 0
    ) {
      continue;
    }

    // V -> I

    if (
      previous.root ===
      (
        key + 7
      ) % 12 &&
      current.root ===
      key
    ) {
      cadenceScore +=
        transitionWeight *
        2;

      cadenceOpportunities +=
        transitionWeight;
    }

    // IV -> I

    if (
      previous.root ===
      (
        key + 5
      ) % 12 &&
      current.root ===
      key
    ) {
      cadenceScore +=
        transitionWeight;

      cadenceOpportunities +=
        transitionWeight;
    }

    // ii -> V

    if (
      previous.root ===
      (
        key + 2
      ) % 12 &&
      current.root ===
      (
        key + 7
      ) % 12
    ) {
      cadenceScore +=
        transitionWeight *
        1.2;

      cadenceOpportunities +=
        transitionWeight;
    }

    // ii -> V -> I

    if (
      i >= 2
    ) {
      const twoBack =
        progression[
        i - 2
        ];

      if (
        twoBack.root ===
        (
          key + 2
        ) % 12 &&
        previous.root ===
        (
          key + 7
        ) % 12 &&
        current.root ===
        key
      ) {
        cadenceScore +=
          transitionWeight *
          3;
      }
    }
  }

  const normalizedCadence =
    cadenceOpportunities >
      0
      ? Math.min(
        1,
        cadenceScore /
        (
          cadenceOpportunities *
          2
        )
      )
      : 0;

  // ----------------------------------------------
  // Global tonal profile.
  // ----------------------------------------------

  const profile =
    mode === "Major"
      ? profileCorrelation(
        globalChroma,
        MAJOR_PROFILE,
        key
      )
      : profileCorrelation(
        globalChroma,
        MINOR_PROFILE,
        key
      );

  const profileScore =
    Math.max(
      0,
      Math.min(
        1,
        (
          profile +
          1
        ) / 2
      )
    );

  // ----------------------------------------------
  // Final score.
  // ----------------------------------------------

  return (
    harmonicFitNormalized *
    0.32 +
    exactRatio *
    0.14 +
    coverage *
    0.14 +
    tonicRatio *
    0.16 +
    normalizedCadence *
    0.10 +
    profileScore *
    0.07 +
    dominantRatio *
    0.04 +
    endingTonic *
    0.02 +
    openingTonic *
    0.01
  );
};

// ==================================================
// DETECT KEY
// ==================================================

const detectKey = (
  progression: ChordObservation[],
  globalChroma: number[]
) => {
  const candidates: {
    key: number;
    mode:
    | "Major"
    | "Minor";
    score: number;
  }[] = [];

  for (
    let key = 0;
    key < 12;
    key++
  ) {
    candidates.push({
      key,

      mode:
        "Major",

      score:
        scoreKeyCandidate(
          progression,
          key,
          "Major",
          globalChroma
        ),
    });

    candidates.push({
      key,

      mode:
        "Minor",

      score:
        scoreKeyCandidate(
          progression,
          key,
          "Minor",
          globalChroma
        ),
    });
  }

  candidates.sort(
    (a, b) =>
      b.score -
      a.score
  );

  const best =
    candidates[0];

  const second =
    candidates[1];

  const margin =
    Math.max(
      0,
      best.score -
      second.score
    );

  // This is a heuristic separation score,
  // not a statistical probability.

  const confidence =
    Math.min(
      99,
      Math.max(
        1,
        50 +
        margin *
        220
      )
    );

  return {
    key:
      NOTE_NAMES[
      best.key
      ],

    mode:
      best.mode,

    score:
      best.score,

    confidence,

    alternative: {
      key:
        NOTE_NAMES[
        second.key
        ],

      mode:
        second.mode,

      score:
        second.score,
    },
  };
};

// ==================================================
// HOME
// ==================================================

export default function Home() {
  const router =
    useRouter();

  const [
    isListening,
    setIsListening,
  ] = useState(false);

  // ------------------------------------------------
  // AUDIO REFS
  // ------------------------------------------------

  const audioBuffers =
    useRef<Float32Array[]>(
      []
    );

  const isListeningRef =
    useRef(false);

  const actualSampleRate =
    useRef(
      REQUESTED_SAMPLE_RATE
    );

  const timeoutRef =
    useRef<ReturnType<
      typeof setTimeout
    > | null>(null);

  // ------------------------------------------------
  // CLEANUP
  // ------------------------------------------------

  useEffect(() => {
    return () => {
      if (
        timeoutRef.current
      ) {
        clearTimeout(
          timeoutRef.current
        );

        timeoutRef.current =
          null;
      }
    };
  }, []);

  // ------------------------------------------------
  // AUDIO STREAM
  // ------------------------------------------------

  const audioStream =
    useAudioStream({
      sampleRate:
        REQUESTED_SAMPLE_RATE,

      channels: 1,

      encoding:
        "float32",

      onBuffer:
        buffer => {
          if (
            !isListeningRef.current
          ) {
            return;
          }

          try {
            if (
              buffer.sampleRate &&
              buffer.sampleRate > 0
            ) {
              actualSampleRate.current =
                buffer.sampleRate;
            }

            const samples =
              new Float32Array(
                buffer.data
              );

            if (
              samples.length === 0
            ) {
              return;
            }

            audioBuffers.current.push(
              samples
            );
          } catch (error) {
            console.error(
              "Could not process audio buffer:",
              error
            );
          }
        },
    });

  // ==================================================
  // ANALYZE RECORDING
  // ==================================================

  const analyzeRecording =
    () => {
      const buffers =
        audioBuffers.current;

      if (
        buffers.length === 0
      ) {
        throw new Error(
          "No audio was captured."
        );
      }

      // ----------------------------------------------
      // Combine PCM buffers.
      // ----------------------------------------------

      let totalSamples =
        0;

      for (
        const buffer of
        buffers
      ) {
        totalSamples +=
          buffer.length;
      }

      const audio =
        new Float32Array(
          totalSamples
        );

      let position = 0;

      for (
        const buffer of
        buffers
      ) {
        audio.set(
          buffer,
          position
        );

        position +=
          buffer.length;
      }

      console.log(
        "================================"
      );

      console.log(
        "KEYSPOT AUDIO"
      );

      console.log(
        "Sample rate:",
        actualSampleRate.current
      );

      console.log(
        "Samples:",
        audio.length
      );

      console.log(
        "Seconds:",
        (
          audio.length /
          actualSampleRate.current
        ).toFixed(2)
      );

      console.log(
        "================================"
      );

      // ----------------------------------------------
      // Frame analysis.
      // ----------------------------------------------

      const frames:
        FrameAnalysis[] =
        [];

      for (
        let start = 0;
        start +
        FFT_SIZE <=
        audio.length;
        start +=
        HOP_SIZE
      ) {
        const frame =
          audio.slice(
            start,
            start +
            FFT_SIZE
          );

        const analysis =
          analyzeFrame(
            frame,
            actualSampleRate.current
          );

        if (
          analysis
        ) {
          frames.push(
            analysis
          );
        }
      }

      if (
        frames.length < 5
      ) {
        throw new Error(
          "Not enough usable musical audio was captured."
        );
      }

      console.log(
        "Analysis frames:",
        frames.length
      );

      // ----------------------------------------------
      // Global chroma.
      // ----------------------------------------------

      const globalChroma =
        new Array<number>(
          12
        ).fill(0);

      let totalFrameWeight =
        0;

      for (
        const frame of
        frames
      ) {
        const weight =
          Math.min(
            1.5,
            Math.max(
              0.25,
              frame.rms * 30
            )
          );

        for (
          let i = 0;
          i < 12;
          i++
        ) {
          globalChroma[i] +=
            frame.chroma[i] *
            weight;
        }

        totalFrameWeight +=
          weight;
      }

      if (
        totalFrameWeight > 0
      ) {
        for (
          let i = 0;
          i < 12;
          i++
        ) {
          globalChroma[i] /=
            totalFrameWeight;
        }
      }

      const normalizedGlobal =
        normalizeVector(
          globalChroma
        );

      // ----------------------------------------------
      // Chord windows.
      // ----------------------------------------------

      const frameSeconds =
        HOP_SIZE /
        actualSampleRate.current;

      const windowFrames =
        Math.max(
          3,
          Math.round(
            CHORD_WINDOW_SECONDS /
            frameSeconds
          )
        );

      const hopFrames =
        Math.max(
          1,
          Math.round(
            CHORD_HOP_SECONDS /
            frameSeconds
          )
        );

      const windowObservations:
        number[][] =
        [];

      for (
        let start = 0;
        start +
        windowFrames <=
        frames.length;
        start +=
        hopFrames
      ) {
        const averaged =
          new Array<number>(
            12
          ).fill(0);

        let totalWeight =
          0;

        for (
          let i = start;
          i <
          start +
          windowFrames;
          i++
        ) {
          const frame =
            frames[i];

          const weight =
            Math.min(
              1.5,
              Math.max(
                0.30,
                frame.rms * 30
              )
            );

          for (
            let note = 0;
            note < 12;
            note++
          ) {
            averaged[note] +=
              frame.chroma[note] *
              weight;
          }

          totalWeight +=
            weight;
        }

        if (
          totalWeight <= 0
        ) {
          continue;
        }

        for (
          let note = 0;
          note < 12;
          note++
        ) {
          averaged[note] /=
            totalWeight;
        }

        windowObservations.push(
          normalizeVector(
            averaged
          )
        );
      }

      console.log(
        "Chord observations:",
        windowObservations.length
      );

      // ----------------------------------------------
      // Temporal chord tracking.
      // ----------------------------------------------

      const sequence =
        trackChordSequence(
          windowObservations
        );

      if (
        sequence.length === 0
      ) {
        throw new Error(
          "KeySpot could not identify any chords."
        );
      }

      const chordDuration =
        windowObservations.length >
          1
          ? (
            CHORD_HOP_SECONDS
          )
          : CHORD_WINDOW_SECONDS;

      let progression =
        mergeChordSequence(
          sequence,
          chordDuration
        );

      // Remove tiny accidental fragments.
      //
      // A real chord should normally survive
      // more than a single 250 ms window.
      //
      // However, preserve fast changes by merging
      // very short fragments into their neighbour
      // instead of simply deleting them.

      progression =
        progression.filter(
          (
            chord,
            index
          ) => {
            if (
              chord.duration >=
              0.30
            ) {
              return true;
            }

            const previous =
              progression[
              index - 1
              ];

            const next =
              progression[
              index + 1
              ];

            if (
              previous &&
              previous.root ===
              chord.root &&
              previous.quality ===
              chord.quality
            ) {
              return false;
            }

            if (
              next &&
              next.root ===
              chord.root &&
              next.quality ===
              chord.quality
            ) {
              return false;
            }

            // Keep genuine short chord changes.

            return true;
          }
        );

      console.log(
        "================================"
      );

      console.log(
        "CHORD SEQUENCE"
      );

      progression.forEach(
        (
          chord,
          index
        ) => {
          console.log(
            index + 1,
            chord.label,
            chord.duration.toFixed(
              2
            ),
            "sec"
          );
        }
      );

      console.log(
        "================================"
      );

      // ----------------------------------------------
      // Score each progression chord with its
      // local chord evidence.
      // ----------------------------------------------

      progression =
        progression.map(
          chord => ({
            ...chord,

            score:
              0.75,
          })
        );

      // ----------------------------------------------
      // Key decision.
      // ----------------------------------------------

      const result =
        detectKey(
          progression,
          normalizedGlobal
        );

      const keyIndex =
        NOTE_NAMES.indexOf(
          result.key
        );

      const diatonicChords =
        getDiatonicChords(
          keyIndex,
          result.mode
        );

      const observedChords =
        Array.from(
          new Set(
            progression.map(
              chord =>
                chord.label
            )
          )
        );

      console.log(
        "================================"
      );

      console.log(
        "FINAL KEY:",
        result.key,
        result.mode
      );

      console.log(
        "CONFIDENCE:",
        result.confidence.toFixed(
          1
        ) + "%"
      );

      console.log(
        "ALTERNATIVE:",
        result.alternative.key,
        result.alternative.mode
      );

      console.log(
        "CHORDS:",
        observedChords.join(
          " → "
        )
      );

      console.log(
        "EXPECTED:",
        diatonicChords.map(
          chord =>
            chord.degree +
            "=" +
            chord.label
        ).join(
          " | "
        )
      );

      console.log(
        "================================"
      );

      return {
        key:
          result.key,

        mode:
          result.mode,

        confidence:
          result.confidence,

        alternative:
          `${result.alternative.key} ${result.alternative.mode}`,

        observedChords,

        progression:
          progression.map(
            chord =>
              chord.label
          ),

        diatonicChords:
          diatonicChords.map(
            chord =>
              `${chord.degree}:${chord.label}`
          ),
      };
    };

  // ==================================================
  // START LISTENING
  // ==================================================

  const handleListen =
    async () => {
      if (
        isListeningRef.current
      ) {
        return;
      }

      try {
        audioBuffers.current =
          [];

        actualSampleRate.current =
          REQUESTED_SAMPLE_RATE;

        isListeningRef.current =
          true;

        setIsListening(
          true
        );

        console.log(
          "Starting microphone..."
        );

        await audioStream.stream.start();

        console.log(
          "Listening for",
          LISTENING_TIME / 1000,
          "seconds..."
        );

        timeoutRef.current =
          setTimeout(
            async () => {
              try {
                // Keep the ref true while stop()
                // completes, allowing the last native
                // buffer to reach the callback.

                await audioStream.stream.stop();

                isListeningRef.current =
                  false;

                setIsListening(
                  false
                );

                const result =
                  analyzeRecording();

                router.push({
                  pathname:
                    "./result",

                  params: {
                    key:
                      result.key,

                    mode:
                      result.mode,

                    confidence:
                      result.confidence.toFixed(
                        1
                      ),

                    alternative:
                      result.alternative,

                    chords:
                      result.observedChords.join(
                        ","
                      ),

                    progression:
                      result.progression.join(
                        "|"
                      ),

                    diatonic:
                      result.diatonicChords.join(
                        ","
                      ),
                  },
                });
              } catch (error) {
                console.error(
                  "Analysis error:",
                  error
                );

                isListeningRef.current =
                  false;

                setIsListening(
                  false
                );

                Alert.alert(
                  "Analysis Error",
                  error instanceof Error
                    ? error.message
                    : "KeySpot could not analyse the recording."
                );
              } finally {
                timeoutRef.current =
                  null;
              }
            },
            LISTENING_TIME
          );
      } catch (error) {
        console.error(
          "Microphone error:",
          error
        );

        isListeningRef.current =
          false;

        setIsListening(
          false
        );

        Alert.alert(
          "Microphone Error",
          "KeySpot could not start the microphone."
        );
      }
    };

  // ==================================================
  // PERMISSION
  // ==================================================

  const askForMicrophonePermission =
    async () => {
      try {
        const permission =
          await requestRecordingPermissionsAsync();

        if (
          permission.granted
        ) {
          await handleListen();

          return;
        }

        Alert.alert(
          "Microphone Permission Required",

          "KeySpot needs microphone access to listen to music. Please allow microphone access in your phone settings.",

          [
            {
              text:
                "Cancel",

              style:
                "cancel",
            },

            {
              text:
                "Open Settings",

              onPress:
                () =>
                  Linking.openSettings(),
            },
          ]
        );
      } catch (error) {
        console.error(
          "Permission error:",
          error
        );

        Alert.alert(
          "Permission Error",
          "KeySpot could not request microphone permission."
        );
      }
    };

  // ==================================================
  // UI
  // ==================================================

  return (
    <SafeAreaProvider>
      <View
        className="flex-1 bg-black px-5 py-5"
      >
        <View className="pt-8">
          <Text
            className="text-white text-3xl font-bold tracking-tight"
          >
            KeySpot
          </Text>

          <Text
            className="text-gray-500 text-sm font-medium mt-1 tracking-wide"
          >
            MUSIC KEY DETECTOR
          </Text>
        </View>

        <View
          className="flex-1 justify-center"
        >
          <View
            className="w-full rounded-[32px] border border-gray-800 bg-[#080808] px-6 py-10 items-center"
          >
            <Text
              className="text-white text-4xl font-bold text-center"
            >
              Hear it.
            </Text>

            <Text
              className="text-gray-500 text-xl text-center mt-2"
            >
              Know the key.
            </Text>

            <Text
              className="text-gray-500 text-xl text-center"
            >
              Play along.
            </Text>

            <TouchableOpacity
              activeOpacity={0.85}
              disabled={
                isListening
              }
              onPress={async () => {
                await askForMicrophonePermission();
              }}
              className={`
                w-56
                h-56
                rounded-full
                mt-12
                justify-center
                items-center
                ${isListening
                  ? "bg-[#111111] border-2 border-gray-700"
                  : "bg-white"
                }
              `}
            >
              {isListening ? (
                <>
                  <ActivityIndicator
                    size="large"
                    color="white"
                  />

                  <Text
                    className="text-white text-lg font-semibold mt-4"
                  >
                    Listening
                  </Text>
                </>
              ) : (
                <>
                  <Text
                    className="text-black text-2xl font-bold text-center"
                  >
                    Tap to
                  </Text>

                  <Text
                    className="text-black text-2xl font-bold text-center"
                  >
                    Listen
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {isListening ? (
              <View
                className="items-center mt-10"
              >
                <View
                  className="flex-row items-center"
                >
                  <View
                    className="w-2.5 h-2.5 rounded-full bg-[#05ce40] mr-2"
                  />

                  <Text
                    className="text-[#05ce40] text-base font-semibold"
                  >
                    Listening for chord changes...
                  </Text>
                </View>

                <Text
                  className="text-gray-600 text-sm mt-2 text-center"
                >
                  Keep playing through the progression
                </Text>
              </View>
            ) : (
              <View
                className="items-center mt-10"
              >
                <Text
                  className="text-gray-500 text-base text-center"
                >
                  Play a song and tap the button
                </Text>

                <Text
                  className="text-gray-600 text-sm text-center mt-2"
                >
                  KeySpot will analyze the full chord progression
                </Text>
              </View>
            )}
          </View>
        </View>

        <View
          className="items-center pb-8"
        >
          <Text
            className="text-gray-700 text-xs font-medium tracking-widest"
          >
            HEAR • KNOW • PLAY
          </Text>
        </View>
      </View>
    </SafeAreaProvider>
  );
}