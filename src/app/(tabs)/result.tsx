
import { useLocalSearchParams, useRouter } from "expo-router";

import { ResultContent } from "@/components/result/ResultContent";
import { Screen } from "@/components/Screen";

const firstValue = (value: unknown) =>
  Array.isArray(value) ? value[0] : value;

const parseValue = (value: unknown) => {
  const first = firstValue(value);
  if (typeof first !== "string") return first;

  try {
    return JSON.parse(first);
  } catch {
    return first;
  }
};

const parseResultParams = (params: Record<string, unknown>) => {
  const confidence = firstValue(params.confidence);

  return {
    detectedKey: firstValue(params.detectedKey),
    detectedMode: firstValue(params.mode),
    confidenceValue:
      confidence === undefined ? "" : String(confidence),
    detectedChords: parseValue(params.chords),
    diatonicChords: parseValue(params.diatonic),
  };
};

export default function Result() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const {
    detectedKey,
    detectedMode,
    confidenceValue,
    detectedChords,
    diatonicChords,
  } = parseResultParams(params);

  const backFunction = () => router.back();

  const handleDetectAnother = () => {
    router.replace("/(tabs)/home");
  };

  const handleTranspose = () => {
    router.push({
      pathname: "/(tabs)/transpose",
      params: {
        returnTo: "result",
        detectedKey: params.detectedKey,
        mode: params.mode,
        confidence: params.confidence,
        alternative: params.alternative,
        chords: params.chords,
        progression: params.progression,
        diatonic: params.diatonic,
      },
    });
  };

  return (
    <Screen>
      <ResultContent
        detectedKey={detectedKey}
        detectedMode={detectedMode}
        confidenceValue={confidenceValue}
        diatonicChords={diatonicChords}
        detectedChords={detectedChords}
        onDetectAnother={handleDetectAnother}
        onTranpose={handleTranspose}
        onBack={backFunction}
      />
    </Screen>
  );
}
