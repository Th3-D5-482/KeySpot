import { Text, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

export default function transpose() {
  return (
    <SafeAreaProvider>
      <View className='flex-1 py-5 bg-black items-center justify-center'>
        <Text className='text-white text-3xl font-bold'>
          Work in Progress!
        </Text>
      </View>
    </SafeAreaProvider>
  )
}