import { useRouter } from "expo-router";
import { Alert } from "react-native";

import { toResultParams, useListenAndDetect } from "@/components/features/detection";
import { ListenPanel } from "@/components/home/ListenPanel";
import { Screen } from "@/components/Screen";

export default function Home() {
  const router = useRouter();
  const { isListening, requestPermissionAndListen } = useListenAndDetect();

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
        pathname: "/screens/result",
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

  return (
    <Screen>
      <ListenPanel isListening={isListening} onListen={handleListen} />
    </Screen>
  );
}
