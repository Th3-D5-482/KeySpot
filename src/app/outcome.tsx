import { NOTE_NAMES } from "@/components/features/detection/constants";
import { OutcomeContent } from "@/components/outcome/OutcomeContent";
import { Screen } from "@/components/Screen";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback } from "react";
import { useBackFunction } from "@/hooks/useBackFunction";

type GuitarOption = {
  shapeKey: string;
  fret: number;
};

export default function Outcome() {
  const router = useRouter();
  const { originalKey, targetKey } = useLocalSearchParams();

  const normalizedOriginalKey = Array.isArray(originalKey)
    ? originalKey[0]
    : originalKey;

  const normalizedTargetKey = Array.isArray(targetKey)
    ? targetKey[0]
    : targetKey;

  const returnToTranspose = useCallback(() => {
    router.replace("/(tabs)/transpose");
  }, [router]);
  const onBackFunction = useBackFunction(undefined, returnToTranspose);

  const getSemitones = (fromKey?: string, toKey?: string) => {
    const fromIndex = NOTE_NAMES.indexOf(fromKey ?? "");
    const toIndex = NOTE_NAMES.indexOf(toKey ?? "");

    if (fromIndex === -1 || toIndex === -1) return null;

    return (toIndex - fromIndex + NOTE_NAMES.length) % NOTE_NAMES.length;
  };

  const getGuitarOptions = (
    key?: string,
    maxFret = 5
  ): GuitarOption[] => {
    const targetIndex = NOTE_NAMES.indexOf(key ?? "");

    if (targetIndex === -1) return [];

    return Array.from({ length: maxFret }, (_, index) => {
      const fret = index + 1;
      const shapeIndex =
        (targetIndex - fret + NOTE_NAMES.length) % NOTE_NAMES.length;

      return {
        shapeKey: NOTE_NAMES[shapeIndex],
        fret,
      };
    });
  };

  const getOrdinalSuffix = (value: number | null) => {
    if (value === null) return "";

    const lastTwoDigits = Math.abs(value) % 100;

    if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return "th";

    switch (Math.abs(value) % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return (
    <Screen>
      <OutcomeContent
        onBackFunction={onBackFunction}
        originalKey={normalizedOriginalKey}
        targetKey={normalizedTargetKey}
        getSemitones={getSemitones}
        getGuitarOptions={getGuitarOptions}
        getOrdinalSuffix={getOrdinalSuffix}
      />
    </Screen>
  );
}