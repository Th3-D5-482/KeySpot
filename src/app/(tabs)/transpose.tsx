import { NOTE_NAMES } from "@/components/features/detection/constants";
import { Screen } from "@/components/Screen";
import { TransposePlaceholder } from "@/components/transpose/TransposePlaceholder";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useState } from "react";
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

  const resultParams = {
    detectedKey,
    mode,
    confidence,
    alternative,
    chords,
    progression,
    diatonic,
  };

  useFocusEffect(
    useCallback(() => {
      if (returnTo !== "result") {
        return;
      }

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        () => {
          router.replace({
            pathname: "/(tabs)/result",
            params: resultParams,
          });
          return true;
        }
      );

      return () => subscription.remove();
    }, [returnTo, router, detectedKey, mode, confidence, alternative, chords, progression, diatonic])
  );

  const backFunction = () => {
    if (returnTo === "result") {
      router.replace({
        pathname: "/(tabs)/result",
        params: resultParams,
      });
    } else {
      router.back();
    }
  };

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
        onBackFunction={backFunction}
        onCalculate={onCalculate}
      />
    </Screen>
  );
}
