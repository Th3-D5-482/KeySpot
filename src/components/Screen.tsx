
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export const Screen = ({
  children,
  className = "flex-1 bg-[#0B0D12] px-5",
}: ScreenProps) => {
  return (
    <SafeAreaView className={className}>
      {children}
    </SafeAreaView>
  );
};
