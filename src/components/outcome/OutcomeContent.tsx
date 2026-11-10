import { NOTE_NAMES } from '@/components/features/detection/constants';
import { View } from 'react-native';
import { Header } from '../Header';
import { TransposeValues } from '../TransposeValues';

type OutcomeContentProps = {
  onBackFunction?: () => void;
  originalKey?: string;
  targetKey?: string;
}

const getSemitones = (fromKey?: string, toKey?: string) => {
  const fromIndex = NOTE_NAMES.indexOf(fromKey ?? '');
  const toIndex = NOTE_NAMES.indexOf(toKey ?? '');

  if (fromIndex === -1 || toIndex === -1) {
    return null;
  }

  return (toIndex - fromIndex + NOTE_NAMES.length) % NOTE_NAMES.length;
};

export const OutcomeContent = ({ onBackFunction, originalKey, targetKey }: OutcomeContentProps) => {
  const forwardSemitones = getSemitones(originalKey, targetKey);
  const reverseSemitones = getSemitones(targetKey, originalKey);

  return (
    <View className='flex-1 px-5 py-6'>
      <Header
        showBackButton={true}
        title='TRANSPOSE RESULT'
        onBackFunction={onBackFunction}
      />

      <View className='mt-8 rounded-[24px] border border-[#273244] px-5 py-5 items-center'>
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
    </View>
  )
}
