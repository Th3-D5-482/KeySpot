import { Text, View } from 'react-native';
import { Header } from '../Header';
import { RelativeChords } from '../RelativeChords';
import { TransposeValues } from '../TransposeValues';

type OutcomeContentProps = {
  onBackFunction?: () => void;
  originalKey?: string;
  targetKey?: string;
  getSemitones?: (fromKey?: string, toKey?: string) => number | null;
}

export const OutcomeContent = ({ onBackFunction, originalKey, targetKey, getSemitones }: OutcomeContentProps) => {
  const forwardSemitones = getSemitones?.(originalKey, targetKey) ?? null;
  const reverseSemitones = getSemitones?.(targetKey, originalKey) ?? null;

  return (
    <View className='flex-1 px-5 py-6'>
      <Header
        showBackButton={true}
        title='TRANSPOSE RESULT'
        onBackFunction={onBackFunction}
      />

      <View className='mt-8 rounded-[24px] border border-[#273244] px-5 py-5 items-center bg-[#17191F]'>
        <TransposeValues
          originalKey={originalKey}
          targetKey={targetKey}
          sign='+'
          semitones={forwardSemitones}
        />

        <View className='my-5 w-full h-[1px] bg-[#273244]' />

        <TransposeValues
          originalKey={originalKey}
          targetKey={targetKey}
          sign='-'
          semitones={reverseSemitones}
        />
      </View>

      <View className="mt-7">
        <Text className="text-[22px] font-extrabold tracking-tight text-white">
          Relative Chords
        </Text>

        <Text className="text-sm text-gray-500 mt-1">
          Compare chord progressions across keys
        </Text>

        <View className="flex-row gap-3 mt-5">
          <RelativeChords
            title={`Key of ${originalKey ?? 'N/A'}`}
            subtitle="Original"
            rootKey={originalKey ?? ''}
          />

          <RelativeChords
            title={`Key of ${targetKey ?? 'N/A'}`}
            subtitle="Target"
            rootKey={targetKey ?? ''}
            forwardSemitones={forwardSemitones}
            reverseSemitones={reverseSemitones}
          />
        </View>
      </View>

    </View>
  )
}
