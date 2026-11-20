import { Text, View } from 'react-native';
import { NOTE_NAMES } from './features/detection/constants';
import { getDiatonicChords } from './features/detection/keys';

type RelativeChordsProps = {
    title: string;
    subtitle: string;
    rootKey: string;
    forwardSemitones?: number | null;
    reverseSemitones?: number | null;
};

export const RelativeChords = ({
    title,
    subtitle,
    rootKey,
    forwardSemitones,
    reverseSemitones,
}: RelativeChordsProps) => {
    const keyIndex = NOTE_NAMES.indexOf(rootKey);
    const chords =
        keyIndex === -1 ? [] : getDiatonicChords(keyIndex, 'Major').slice(0, 6);

    return (
        <View className="flex-1 rounded-2xl border border-white/[0.08] bg-[#17191F] px-4 py-4">
            <View className="mb-4 flex-row items-center gap-2">
                <Text className="text-[15px] font-bold text-white tracking-tight">
                    {title}
                </Text>

                {subtitle && (
                    <Text className="text-[11px] font-bold uppercase tracking-[1.5px] text-white mt-1">
                        ({subtitle})
                    </Text>
                )}
            </View>

            <View className="h-px bg-white/[0.07] mb-3" />

            <View className="gap-1">
                {chords.map((item, index) => (
                    <View
                        key={item.degree}
                        className={'flex-row items-center justify-between rounded-xl px-2 py-2 '}
                    >
                        <Text className="text-[13px] font-semibold text-gray-500 w-10">
                            {item.degree}
                        </Text>

                        <Text className="text-[16px] font-bold text-white flex-1">
                            {item.label}
                        </Text>
                    </View>
                ))}
            </View>

        </View>
    );
};