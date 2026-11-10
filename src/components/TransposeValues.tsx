import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

type TransposeValuesProps = {
    originalKey?: string;
    targetKey?: string;
    sign?: string;
    semitones: number | null;
}

export const TransposeValues = ({ originalKey, targetKey, sign, semitones }: TransposeValuesProps) => {
    return (
        <>
            <View className='flex-row items-center justify-center'>
                <Text className='text-white font-bold text-xl tracking-wide'>
                    {originalKey}
                </Text>

                <Ionicons
                    name='arrow-forward'
                    size={20}
                    color='#8B9BB4'
                    className='mx-4'
                />

                <Text className='text-white font-bold text-xl tracking-wide'>
                    {targetKey}
                </Text>
            </View>

            <View className='flex-row items-center justify-center mt-3'>
                <Text className={`font-bold text-3xl mr-2 ${sign === '+' ? 'text-[#34D399]' : 'text-[#F59E0B]'
                    }`}>
                    {sign}
                </Text>

                <Text className='text-white font-bold text-4xl tracking-tight'>
                    {semitones ?? 'N/A'}
                </Text>
            </View>

            <Text className='text-[#8290A5] mt-2 text-xs font-semibold tracking-[1.5px] uppercase'>
                Semitones
            </Text>
        </>
    );
};
