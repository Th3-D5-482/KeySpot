import {
  requestRecordingPermissionsAsync,
  useAudioStream,
} from "expo-audio";
import { useEffect, useRef, useState } from "react";
import { Alert, Linking } from "react-native";

import { analyzeRecording } from "./analyzeRecording";
import { LISTENING_TIME, REQUESTED_SAMPLE_RATE } from "./constants";
import type { AnalysisResult } from "./types";

export type ListenOutcome =
  | { status: "success"; result: AnalysisResult }
  | { status: "empty" }
  | { status: "cancelled" };

export const useListenAndDetect = () => {
  const [isListening, setIsListening] = useState(false);
  const audioBuffers = useRef<Float32Array[]>([]);
  const isListeningRef = useRef(false);
  const actualSampleRate = useRef(REQUESTED_SAMPLE_RATE);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, []);

  const audioStream = useAudioStream({
    sampleRate: REQUESTED_SAMPLE_RATE,
    channels: 1,
    encoding: "float32",
    onBuffer: (buffer) => {
      if (!isListeningRef.current) {
        return;
      }

      try {
        if (buffer.sampleRate && buffer.sampleRate > 0) {
          actualSampleRate.current = buffer.sampleRate;
        }

        const samples = new Float32Array(buffer.data);

        if (samples.length === 0) {
          return;
        }

        audioBuffers.current.push(samples);
      } catch (error) {
        console.error("Could not process audio buffer:", error);
      }
    },
  });

  const startListening = async (): Promise<ListenOutcome> => {
    if (isListeningRef.current) {
      return { status: "cancelled" };
    }

    try {
      audioBuffers.current = [];
      actualSampleRate.current = REQUESTED_SAMPLE_RATE;
      isListeningRef.current = true;
      setIsListening(true);

      console.log("Starting microphone...");
      await audioStream.stream.start();
      console.log("Listening for", LISTENING_TIME / 1000, "seconds...");

      return await new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            await audioStream.stream.stop();
            isListeningRef.current = false;
            setIsListening(false);

            const result = analyzeRecording(
              audioBuffers.current,
              actualSampleRate.current
            );

            resolve(
              result ? { status: "success", result } : { status: "empty" }
            );
          } catch (error) {
            isListeningRef.current = false;
            setIsListening(false);
            reject(error);
          } finally {
            timeoutRef.current = null;
          }
        }, LISTENING_TIME);
      });
    } catch (error) {
      console.error("Microphone error:", error);
      isListeningRef.current = false;
      setIsListening(false);
      Alert.alert(
        "Microphone Error",
        "KeySpot could not start the microphone."
      );
      return { status: "cancelled" };
    }
  };

  const requestPermissionAndListen = async (): Promise<ListenOutcome> => {
    try {
      const permission = await requestRecordingPermissionsAsync();

      if (permission.granted) {
        return await startListening();
      }

      Alert.alert(
        "Microphone Permission Required",
        "KeySpot needs microphone access to listen to music. Please allow microphone access in your phone settings.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );

      return { status: "cancelled" };
    } catch (error) {
      console.error("Permission error:", error);
      Alert.alert(
        "Permission Error",
        "KeySpot could not request microphone permission."
      );
      return { status: "cancelled" };
    }
  };

  return {
    isListening,
    requestPermissionAndListen,
  };
};
