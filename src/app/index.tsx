
import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";

import { SplashScreen } from "@/components/splash/SplashScreen";

export default function Index() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname !== "/") return;

    const timer = setTimeout(() => {
      router.replace("/routey");
    }, 3000);

    return () => {
      clearTimeout(timer);
    };
  }, [pathname, router]);

  return <SplashScreen />;
}
