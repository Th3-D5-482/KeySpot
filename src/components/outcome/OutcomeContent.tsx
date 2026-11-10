import { View } from 'react-native';
import { Header } from '../Header';
import { TransposeValues } from '../TransposeValues';

type OutcomeContentProps = {
  onBackFunction?: () => void;
  originalKey?: string;
  targetKey?: string;
}

export const OutcomeContent = ({ onBackFunction, originalKey, targetKey }: OutcomeContentProps) => {
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
        />

        <View className='my-5 w-full h-[1px] bg-[#273244]' />

        <TransposeValues
          originalKey={originalKey}
          targetKey={targetKey}
          sign='-'
        />

      </View>

    </View>
  )
}
