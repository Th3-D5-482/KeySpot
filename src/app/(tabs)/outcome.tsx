import { NOTE_NAMES } from "@/components/features/detection/constants";
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

  const getSemitones = (fromKey?: string, toKey?: string) => {
    const fromIndex = NOTE_NAMES.indexOf(fromKey ?? '');
    const toIndex = NOTE_NAMES.indexOf(toKey ?? '');

    if (fromIndex === -1 || toIndex === -1) {
      return null;
    }

    return (toIndex - fromIndex + NOTE_NAMES.length) % NOTE_NAMES.length;
  };

  return (
    <Screen>
      <OutcomeContent onBackFunction={onBackFunction} originalKey={normalizedOriginalKey} targetKey={normalizedTargetKey} getSemitones={getSemitones} />
    </Screen>
  );
}
