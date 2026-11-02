import { useRouter } from "expo-router";
import { useCallback } from "react";

export function useBackFunction(onBack?: () => void) {
  const router = useRouter();

  return useCallback(() => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  }, [onBack, router]);
}
