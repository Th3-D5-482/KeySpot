
import type { ReactNode } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type ScreenProps = {
  children: ReactNode;
  className?: string;
};

export const Screen = ({
  children,
  className = "flex-1 bg-[#0F1117] px-5",
}: ScreenProps) => {
  return (
    <SafeAreaView
      edges={["top", "bottom"]}
      className={className}
    >
      {children}
    </SafeAreaView>
  );
};
