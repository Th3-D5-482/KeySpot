import { NOTE_NAMES } from "@/components/features/detection/constants";
import { Screen } from "@/components/Screen";
import { TransposePlaceholder } from "@/components/transpose/TransposePlaceholder";
import { useBackFunction } from "@/hooks/useBackFunction";
import {
  useFocusEffect,
  useIsFocused,
  useLocalSearchParams,
  useRouter,
} from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { BackHandler } from "react-native";

export default function Transpose() {
  const router = useRouter();
  const isFocused = useIsFocused();
  const {
    returnTo,
    detectedKey,
    mode,
    confidence,
    alternative,
    chords,
    progression,
    diatonic,
  } = useLocalSearchParams();
  const [originalKey, setOriginalKey] = useState("C");
  const [targetKey, setTargetKey] = useState("A");
  const showBackButton = isFocused && returnTo === "result";

  const resultParams = useMemo(
    () => ({
      detectedKey,
      mode,
      confidence,
      alternative,
      chords,
      progression,
      diatonic,
    }),
    [
      detectedKey,
      mode,
      confidence,
      alternative,
      chords,
      progression,
      diatonic,
    ]
  );

  useFocusEffect(
    useCallback(() => {
      if (returnTo !== "result") {
        return;
      }

      return () => router.setParams({ returnTo: undefined });
    }, [returnTo, router])
  );

  const navigateBack = useCallback(() => {
    if (showBackButton) {
      router.replace({
        pathname: "/(tabs)/result",
        params: resultParams,
      });
    } else {
      router.back();
    }
  }, [showBackButton, router, resultParams]);
  const backFunction = useBackFunction(navigateBack);

  useFocusEffect(
    useCallback(() => {
      if (!showBackButton) {
        return;
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          backFunction();
          return true;
        }
      );

      return () => subscription.remove();
    }, [showBackButton, backFunction])
  );

  const onCalculate = () => {
    router.push({
      pathname: "/(tabs)/outcome",
      params: {
        originalKey,
        targetKey,
      },
    });
  };

  return (
    <Screen>
      <TransposePlaceholder
        originalKey={originalKey}
        setOriginalKey={setOriginalKey}
        targetKey={targetKey}
        setTargetKey={setTargetKey}
        musicalKeys={NOTE_NAMES}
        showBackButton={showBackButton}
        onBackFunction={backFunction}
        onCalculate={onCalculate}
      />
    </Screen>
  );
}
