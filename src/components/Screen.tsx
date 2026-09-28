import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export const Screen = ({
  children,
  className = "flex-1 bg-black",
}: ScreenProps) => {
  return <SafeAreaView className={className}>{children}</SafeAreaView>;
};
