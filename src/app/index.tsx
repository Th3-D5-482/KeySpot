import { useRouter } from "expo-router";
import { useEffect } from "react";

import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/(tabs)/home");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen />;
}
