
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

  const handleRoutey = () => {
    router.push("/(tabs)/routey");
  }

  return (
    <Screen>
      <ResultContent
        detectedKey={detectedKey}
        detectedMode={detectedMode}
        confidenceValue={confidenceValue}
        diatonicChords={diatonicChords}
        detectedChords={detectedChords}
        onDetectAnother={handleDetectAnother}
        onRoutey={handleRoutey}
        onBack={backFunction}
      />
    </Screen>
  );
}
