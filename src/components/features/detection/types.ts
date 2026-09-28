export type ChordQuality = "major" | "minor";

export type MusicalMode = "Major" | "Minor";

export type ChordState = {
  root: number;
  quality: ChordQuality;
  label: string;
};

export type ChordObservation = {
  root: number;
  quality: ChordQuality;
  label: string;
  score: number;
  duration: number;
};

export type FrameAnalysis = {
  chroma: number[];
  rms: number;
};

export type DiatonicChord = {
  degree: string;
  label: string;
};

export type AnalysisResult = {
  key: string;
  mode: MusicalMode;
  confidence: number;
  alternative: string;
  observedChords: string[];
  progression: string[];
  diatonicChords: string[];
};
