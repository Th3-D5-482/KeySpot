import { useLocalSearchParams, useRouter } from "expo-router";

import { ResultContent } from "@/components/result/ResultContent";
import { Screen } from "@/components/Screen";
import { parseResultParams } from "@/features/detection";

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

  return (
    <Screen>
      <ResultContent
        detectedKey={detectedKey}
        detectedMode={detectedMode}
        confidenceValue={confidenceValue}
        diatonicChords={diatonicChords}
        detectedChords={detectedChords}
        onDetectAnother={() => {
          router.replace("/(tabs)/home");
        }}
      />
    </Screen>
  );
}
