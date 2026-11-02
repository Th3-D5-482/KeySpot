import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

type HeaderProps = {
    title: string;
    showBackButton: boolean;
    onBackFunction?: () => void;
};

export const Header = ({ title, showBackButton, onBackFunction }: HeaderProps) => {
    return (
        <>
            {showBackButton ? (
                <View className="flex-row items-center px-1 pt-7">
                    <TouchableOpacity
                        activeOpacity={0.7}
                        className="w-10 h-10 items-center justify-center rounded-full bg-[#111111]"
                        onPress={onBackFunction}
                    >
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color="#FFFFFF"
                        />
                    </TouchableOpacity>
                    <View className="ml-4">
                        <Text className="text-white text-3xl font-bold tracking-tight">
                            KeySpot
                        </Text>

                        <Text className="text-gray-500 text-xs font-medium mt-1 tracking-widest">
                            TRANSPOSE
                        </Text>
                    </View>
                </View>
            ) : (
                <View className="pt-7">
                    <Text className="text-white text-3xl font-bold tracking-tight">
                        KeySpot
                    </Text>

                    <Text className="text-gray-500 text-xs font-medium mt-1 tracking-widest">
                        {title}
                    </Text>
                </View>
            )}
        </>
    );
};
