import { Header } from '@/components/Header'
import { useBackFunction } from '@/hooks/useBackFunction'
import { View } from 'react-native'

export const BestRoutey = () => {
  const backFunction = useBackFunction()

  return (
    <View className="flex-1">
      <Header
        title="Play Your Way"
        showBackButton={true}
        onBackFunction={backFunction}
      />
    </View>
  )
}