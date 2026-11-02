import { NOTE_NAMES } from "@/components/features/detection/constants";
import { Screen } from "@/components/Screen";
import { TransposePlaceholder } from "@/components/transpose/TransposePlaceholder";
import { useBackFunction } from "@/hooks/useBackFunction";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { BackHandler } from "react-native";

export default function Transpose() {
  const router = useRouter();
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
  const [pickerVisible, setPickerVisible] = useState(false);

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

  const navigateBack = useCallback(() => {
    if (returnTo === "result") {
      router.replace({
        pathname: "/(tabs)/result",
        params: resultParams,
      });
    } else {
      router.back();
    }
  }, [returnTo, router, resultParams]);
  const backFunction = useBackFunction(navigateBack);

  useFocusEffect(
    useCallback(() => {
      if (returnTo !== "result") {
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
    }, [returnTo, backFunction])
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
        pickerVisible={pickerVisible}
        setPickerVisible={setPickerVisible}
        showBackButton={returnTo === "result"}
        onBackFunction={backFunction}
        onCalculate={onCalculate}
      />
    </Screen>
  );
}
