import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, Text, View } from 'react-native';
import { Header } from '../Header';
import { RelativeChords } from '../RelativeChords';
import { TransposeValues } from '../TransposeValues';

type OutcomeContentProps = {
  onBackFunction?: () => void;
  originalKey?: string;
  targetKey?: string;
  getSemitones?: (fromKey?: string, toKey?: string) => number | null;
}

const getOrdinalSuffix = (value: number | null) => {
  if (value === null) return '';

  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) return 'th';

  switch (absoluteValue % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
}

export const OutcomeContent = ({ onBackFunction, originalKey, targetKey, getSemitones }: OutcomeContentProps) => {
  const forwardSemitones = getSemitones?.(originalKey, targetKey) ?? null;
  const reverseSemitones = getSemitones?.(targetKey, originalKey) ?? null;
  const capoSemitones = forwardSemitones === null
    ? reverseSemitones
    : reverseSemitones === null
      ? forwardSemitones
      : Math.min(forwardSemitones, reverseSemitones);

  return (
    <ScrollView>
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

        <View className="mt-7 mb-5 border border-[#273244] rounded-2xl bg-[#17191F] px-5 py-5">
          <View className='flex-row items-center gap-2'>
            <MaterialCommunityIcons
              name="piano"
              size={23}
              color="#34D399"
            />
            <Text className='text-white font-bold text-lg'>Keyboard</Text>
            <Text className='text-gray-500 font-semibold text-xl'>Transpose: +{forwardSemitones} / -{reverseSemitones}</Text>
          </View>
          <View className='flex-row items-center gap-2 pt-3'>
            <MaterialCommunityIcons
              name="guitar-acoustic"
              size={23}
              color="#F59E0B"
            />
            <Text className='text-white font-bold text-lg'>Guitar</Text>
            <Text className='text-gray-500 font-semibold text-xl'>Use Capo on {capoSemitones}{getOrdinalSuffix(capoSemitones)} fret</Text>
          </View>
        </View>

      </View>
    </ScrollView>
  )
}
