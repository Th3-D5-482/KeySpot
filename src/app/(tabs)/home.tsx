import { useRouter } from "expo-router";
import { Alert, Animated } from "react-native";

import { toResultParams, useListenAndDetect } from "@/components/features/detection";
import { ListenPanel } from "@/components/home/ListenPanel";
import { Screen } from "@/components/Screen";
import { useEffect, useRef } from "react";

export default function Home() {
  const router = useRouter();
  const { isListening, requestPermissionAndListen } = useListenAndDetect();

  const firstPulse = useRef(new Animated.Value(0)).current;
  const secondPulse = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isListening) {
      firstPulse.setValue(0);
      secondPulse.setValue(0);
      return;
    }

    const createPulse = (
      value: Animated.Value,
      phase: number
    ) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(phase),

          Animated.timing(value, {
            toValue: 1,
            duration: 1400,
            useNativeDriver: true,
          }),

          Animated.timing(value, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),

          Animated.delay(700 - phase),
        ])
      );

    const firstAnimation = createPulse(firstPulse, 0);
    const secondAnimation = createPulse(secondPulse, 700);

    firstAnimation.start();
    secondAnimation.start();

    return () => {
      firstAnimation.stop();
      secondAnimation.stop();
    };
  }, [isListening, firstPulse, secondPulse]);

  const handleListen = async () => {
    try {
      const outcome = await requestPermissionAndListen();

      if (outcome.status === "cancelled") {
        return;
      }

      if (outcome.status === "empty") {
        Alert.alert(
          "No Music Detected",
          "KeySpot couldn't hear enough music to identify the key. Please play a song or chord progression and try again."
        );
        return;
      }

      router.push({
        pathname: "/(tabs)/result",
        params: toResultParams(outcome.result),
      });
    } catch (error) {
      console.error("Analysis error:", error);
      Alert.alert(
        "Analysis Error",
        error instanceof Error
          ? error.message
          : "KeySpot could not analyse the recording."
      );
    }
  };

  const handleTranspose = () => {
    router.push('/(tabs)/transpose');
  }

  return (
    <Screen>
      <ListenPanel isListening={isListening}
        onListen={handleListen}
        onTranspose={handleTranspose}
        firstPulse={firstPulse}
        secondPulse={secondPulse}
      />
    </Screen>
  );
}
