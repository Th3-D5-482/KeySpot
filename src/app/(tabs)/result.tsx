import { useLocalSearchParams, useRouter } from "expo-router";

import { parseResultParams } from "@/components/features/detection";
import { ResultContent } from "@/components/result/ResultContent";
import { Screen } from "@/components/Screen";

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

  const DetectAnotherFunction = () => {
    router.replace("/(tabs)/home");
  };

  const TransposeFunction = () => {
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

  const BackFunction = () => {
    router.back();
  };

  return (
    <Screen>
      <ResultContent
        detectedKey={detectedKey}
        detectedMode={detectedMode}
        confidenceValue={confidenceValue}
        diatonicChords={diatonicChords}
        detectedChords={detectedChords}
        onDetectAnother={DetectAnotherFunction}
        onTranpose={TransposeFunction}
        onBack={BackFunction}
      />
    </Screen>
  );
}
