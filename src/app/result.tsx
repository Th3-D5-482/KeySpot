
import { useLocalSearchParams, useRouter } from "expo-router";

import { parseResultParams } from "@/components/features/detection";
import { ResultContent } from "@/components/result/ResultContent";
import { Screen } from "@/components/Screen";
import { useBackFunction } from "@/hooks/useBackFunction";

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

  const backFunction = useBackFunction();

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
