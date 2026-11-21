import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useBackFunction(
  onBack?: () => void,
  onNoHistory?: () => void
) {
  const router = useRouter();

  return useCallback(() => {
    if (onBack) {
      onBack();
    } else if (router.canGoBack()) {
      router.back();
    } else if (onNoHistory) {
      onNoHistory();
    } else {
      router.replace("/home");
    }
  }, [onBack, onNoHistory, router]);
}
