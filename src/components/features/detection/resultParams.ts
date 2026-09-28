import type { AnalysisResult } from "./types";

export const toResultParams = (result: AnalysisResult) => ({
  key: result.key,
  mode: result.mode,
  confidence: result.confidence.toFixed(1),
  alternative: result.alternative,
  chords: result.observedChords.join(","),
  progression: result.progression.join("|"),
  diatonic: result.diatonicChords.join(","),
});

export const parseResultParams = (params: {
  key?: string | string[];
  mode?: string | string[];
  confidence?: string | string[];
  chords?: string | string[];
  diatonic?: string | string[];
}) => {
  const detectedKey = typeof params.key === "string" ? params.key : "?";
  const detectedMode = typeof params.mode === "string" ? params.mode : "?";
  const confidenceValue =
    typeof params.confidence === "string" ? params.confidence : "0";
  const detectedChords =
    typeof params.chords === "string" && params.chords.length > 0
      ? params.chords.split(",")
      : [];
  const diatonicChords =
    typeof params.diatonic === "string" && params.diatonic.length > 0
      ? params.diatonic.split(",").map((item) => {
          const [degree, chord] = item.split(":");
          return { degree, chord };
        })
      : [];

  return {
    detectedKey,
    detectedMode,
    confidenceValue,
    detectedChords,
    diatonicChords,
  };
};
