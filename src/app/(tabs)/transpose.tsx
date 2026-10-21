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
  } = useLocalSearchParams();
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

  const backFunction = () => {
    if (returnTo === "result") {
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
    } else {
      router.back();
    }
  };

  return (
    <Screen>
      <TransposePlaceholder originalKey={originalKey} setOriginalKey={setOriginalKey} targetKey={targetKey} setTargetKey={setTargetKey} musicalKeys={NOTE_NAMES} pickerVisible={pickerVisible} setPickerVisible={setPickerVisible} onBackFunction={backFunction} />
    </Screen>
  );
}
