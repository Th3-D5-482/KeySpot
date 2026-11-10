import { OutcomeContent } from "@/components/outcome/OutcomeContent";
import { Screen } from "@/components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";

export default function Outcome() {
  const router = useRouter();
  const onBackFunction = useCallback(() => {
    router.replace("/(tabs)/transpose");
  }, [router]);
  const { originalKey, targetKey } = useLocalSearchParams();
  const normalizedOriginalKey = Array.isArray(originalKey) ? originalKey[0] : originalKey;
  const normalizedTargetKey = Array.isArray(targetKey) ? targetKey[0] : targetKey;

  return (
    <Screen>
      <OutcomeContent onBackFunction={onBackFunction} originalKey={normalizedOriginalKey} targetKey={normalizedTargetKey} />
    </Screen>
  );
}
