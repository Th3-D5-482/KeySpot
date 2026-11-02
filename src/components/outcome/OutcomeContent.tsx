import { View } from 'react-native';
import { Header } from '../Header';

type OutcomeContentProps = {
  onBackFunction?: () => void;
}

export const OutcomeContent = ({ onBackFunction }: OutcomeContentProps) => {
  return (
    <View className='flex-1 px-5 bg-black py-5'>
      <Header showBackButton={true} title='TRANSPOSE RESULT' onBackFunction={onBackFunction} />
    </View>
  )
}