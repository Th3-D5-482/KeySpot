import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

type TransposeButtonProps = {
    onTranspose: () => void;
}

export const TransposeButton = ({
onTranspose,
}: TransposeButtonProps) => {
    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={onTranspose}
            className="border rounded-[30px] border-gray-800 bg-[#080808] py-4"
        >
            <View className="flex-row items-center px-5">

                <Ionicons
                    name="swap-horizontal"
                    size={26}
                    color="#777777"
                />

                <View className="flex-1 items-center ml-3">
                    <Text className="text-white text-lg font-semibold text-center">
                        Transpose
                    </Text>

                    <Text
                        className="text-gray-600 text-xs mt-1 text-center"
                        numberOfLines={1}
                        adjustsFontSizeToFit
                    >
                        Change key · Find increments
                    </Text>
                </View>

                <Ionicons
                    name="chevron-forward"
                    size={24}
                    color="#555555"
                />

            </View>
        </TouchableOpacity>
    )
}