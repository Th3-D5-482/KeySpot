import { Header } from '@/components/Header'
import { useBackFunction } from '@/hooks/useBackFunction'
import { Ionicons } from '@expo/vector-icons'
import { ScrollView, Text, View } from 'react-native'
import { Footer } from '../Footer'

export const BestRoutey = () => {
  const backFunction = useBackFunction()

  return (
    <View className="flex-1">
      <ScrollView>
        <Header
          title="Play Your Way"
          showBackButton={true}
          onBackFunction={backFunction}
        />
        <View className='mt-6'>
          <Text className='text-gray-400 text-xl font-bold'>ROUTE FINDER</Text>
          <Text className='text-white text-4xl pt-5 font-extrabold'>Reach your detected key</Text>
          <Text className='text-gray-400 pt-5'>Choose your instrument. We'll find an easy way to play along.</Text>
        </View>
        <View className='mt-6 h-40 border border-[rgb(40,91,75)] rounded-[28px] px-5 py-8 bg-[#151922] flex-row justify-between items-center gap-4'>
          <View className='border border-[#1a3b30] w-16 h-16 rounded-2xl bg-[#1a3b30] items-center justify-center'>
            <Ionicons name='musical-note' size={30} color="white" />
          </View>
          <View className='flex-1 absolute left-24 top-6 ml-4 '>
            <Text className='text-gray-400 text-lg font-bold'>DETECTED KEY • MAJOR</Text>
            <Text className='text-white text-6xl pt-2 font-extrabold'>C</Text>
          </View>
          <View className='flex-row border border-[#1a3b30] rounded-full bg-[#1a3b30] px-2 py-2 items-center justify-center'>
            <View className='w-2 h-2 bg-[#31d1a1] rounded-full mr-2' />
            <Text className='text-[#31d1a1] text-sm font-bold'>KEY FOUND</Text>
          </View>
        </View>
        <View className='mt-6 border border-[#293240] rounded-2xl h-20 bg-[#151922] flex-row px-2 py-2'>
          <View className='flex-row w-52 bg-[#202735] rounded-2xl justify-center items-center gap-2'>
            <Ionicons name='musical-note' size={20} color='white' />
            <Text className='text-white text-2xl font-bold'>Keyboard</Text>
          </View>
          <View className='flex-row items-center pl-10'>
            <Ionicons name='musical-note-sharp' size={20} color='white' />
            <Text className='text-white text-2xl font-bold'>Guitar</Text>
          </View>
        </View>
        <View className='mt-6 gap-2'>
          <Text className='text-white text-3xl'>Keyboard routes</Text>
          <Text className='text-gray-400'>Play a familar key shape, then set keyboard tranpose.</Text>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#31d1a1] bg-[#12271f] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#31d1a1] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl bg-[#31d1a1]' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>Play D Major</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Easy white-key shape</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>TRANPOSE</Text>
              <Text className='text-[#31d1a1] text-3xl font-extrabold'>+6</Text>
            </View>
          </View>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#293240] bg-[#151922] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#667387] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>Play A Major</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Small adjustment</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>TRANPOSE</Text>
              <Text className='text-[#ffc02e] text-3xl font-extrabold'>-1</Text>
            </View>
          </View>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#293240] bg-[#151922] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#667387] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>Play A Major</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Small adjustment</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>TRANPOSE</Text>
              <Text className='text-[#31d1a1] text-3xl font-extrabold'>+4</Text>
            </View>
          </View>
        </View>
        <View className='mt-8 gap-2'>
          <Text className='text-white text-3xl'>Guitar capo routes</Text>
          <Text className='text-gray-400'>Keep your open chord shapes. A capo raises the sounding key.</Text>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#98732a] bg-[#282318] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#ffc02e] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl bg-[#ffc02e]' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>G Shape</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Easy open chord family</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>CAPO FRET</Text>
              <Text className='text-[##ffc02e] text-3xl font-extrabold'>6</Text>
            </View>
          </View>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#293240] bg-[#151922] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#667387] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>E Shape</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Low capo position</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>CAPO FRET</Text>
              <Text className='text-[#ffc02e] text-3xl font-extrabold'>4</Text>
            </View>
          </View>
        </View>
        <View className='mt-6 flex-1'>
          <View className='flex-row border border-[#293240] bg-[#151922] h-20 rounded-2xl items-center justify-between px-6 py-6'>
            <View className='w-6 h-6 border border-[#667387] rounded-full items-center justify-center'>
              <View className='w-4 h-4 rounded-2xl' />
            </View>
            <View className='flex'>
              <Text className='text-white pl-4 text-2xl font-bold'>D Shape</Text>
              <Text className='text-gray-400 pl-4 text-xl'>Compact voicing</Text>
            </View>
            <View className='items-center'>
              <Text className='text-gray-400 font-bold text-xl'>CAPO FRET</Text>
              <Text className='text-[#ffc02e] text-3xl font-extrabold'>6</Text>
            </View>
          </View>
        </View>
        <Footer />
      </ScrollView>
    </View>
  )
}