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
    key,
    mode,
    confidence,
    alternative,
    chords,
    progression,
    diatonic,
  } = useLocalSearchParams<{
    returnTo?: string;
    key?: string;
    mode?: string;
    confidence?: string;
    alternative?: string;
    chords?: string;
    progression?: string;
    diatonic?: string;
  }>();
  const [originalKey, setOriginalKey] = useState("C");
  const [targetKey, setTargetKey] = useState("A");
  const [pickerVisible, setPickerVisible] = useState(false);

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
            params: {
              key,
              mode,
              confidence,
              alternative,
              chords,
              progression,
              diatonic,
            },
          });
          return true;
        }
      );

      return () => subscription.remove();
    }, [
      alternative,
      chords,
      confidence,
      diatonic,
      key,
      mode,
      progression,
      returnTo,
      router,
    ])
  );

  return (
    <Screen>
      <TransposePlaceholder originalKey={originalKey} setOriginalKey={setOriginalKey} targetKey={targetKey} setTargetKey={setTargetKey} musicalKeys={NOTE_NAMES} pickerVisible={pickerVisible} setPickerVisible={setPickerVisible} />
    </Screen>
  );
}
