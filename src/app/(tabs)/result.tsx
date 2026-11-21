
import { useLocalSearchParams, useRouter } from "expo-router";

import { parseResultParams } from "@/components/features/detection";
import { ResultContent } from "@/components/result/ResultContent";
import { Screen } from "@/components/Screen";
import { useCallback } from "react";

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

  const backFunction = useCallback(() => {
    router.replace("/home");
  }, [router]);

  const handleDetectAnother = () => {
    router.replace("/home");
  };

  const handleTranspose = () => {
    router.push({
      pathname: "/outcome",
      params: {
        originalKey:
          typeof params.detectedKey === "string"
            ? params.detectedKey
            : Array.isArray(params.detectedKey)
              ? params.detectedKey[0]
              : "C",
        targetKey: "A",
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
