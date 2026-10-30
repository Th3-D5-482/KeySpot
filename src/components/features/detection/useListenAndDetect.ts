import {
  requestRecordingPermissionsAsync,
  useAudioStream,
} from "expo-audio";
import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Linking, Platform } from "react-native";

import { analyzeRecording } from "./analyzeRecording";
import { LISTENING_TIME, REQUESTED_SAMPLE_RATE } from "./constants";
import type { AnalysisResult } from "./types";

type WebAudioCapture = {
  mediaStream: MediaStream;
  audioContext: AudioContext;
  source: MediaStreamAudioSourceNode;
  processor: ScriptProcessorNode;
  silentGain: GainNode;
};

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
  const webAudioCapture = useRef<WebAudioCapture | null>(null);

  const stopWebAudioCapture = useCallback(async () => {
    const capture = webAudioCapture.current;
    webAudioCapture.current = null;

    if (!capture) {
      return;
    }

    capture.processor.disconnect();
    capture.source.disconnect();
    capture.silentGain.disconnect();
    capture.mediaStream.getTracks().forEach((track) => track.stop());

    if (capture.audioContext.state !== "closed") {
      await capture.audioContext.close();
    }
  }, []);

  const startWebAudioCapture = async () => {
    if (!navigator.mediaDevices?.getUserMedia || !window.AudioContext) {
      throw new Error("Live microphone capture is not available in this browser.");
    }

    const mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: { channelCount: 1 },
      video: false,
    });
    const audioContext = new window.AudioContext();
    const source = audioContext.createMediaStreamSource(mediaStream);
    const processor = audioContext.createScriptProcessor(4096, 1, 1);
    const silentGain = audioContext.createGain();

    actualSampleRate.current = audioContext.sampleRate;
    processor.onaudioprocess = (event) => {
      if (!isListeningRef.current) {
        return;
      }

      audioBuffers.current.push(
        new Float32Array(event.inputBuffer.getChannelData(0))
      );
    };
    silentGain.gain.value = 0;
    source.connect(processor);
    processor.connect(silentGain);
    silentGain.connect(audioContext.destination);
    webAudioCapture.current = {
      mediaStream,
      audioContext,
      source,
      processor,
      silentGain,
    };
    await audioContext.resume();
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      void stopWebAudioCapture().catch((error: unknown) => {
        console.error("Could not stop microphone capture:", error);
      });
    };
  }, [stopWebAudioCapture]);

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
      if (Platform.OS === "web") {
        await startWebAudioCapture();
      } else {
        if (!audioStream.stream) {
          throw new Error("KeySpot could not create an audio stream.");
        }
        await audioStream.stream.start();
      }
      console.log("Listening for", LISTENING_TIME / 1000, "seconds...");

      return await new Promise((resolve, reject) => {
        timeoutRef.current = setTimeout(async () => {
          try {
            if (Platform.OS === "web") {
              await stopWebAudioCapture();
            } else {
              await audioStream.stream.stop();
            }
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
        error instanceof Error
          ? error.message
          : "KeySpot could not start the microphone."
      );
      return { status: "cancelled" };
    }
  };

  const requestPermissionAndListen = async (): Promise<ListenOutcome> => {
    if (Platform.OS === "web") {
      return await startListening();
    }

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
