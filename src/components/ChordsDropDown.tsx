import { Modal, Pressable, Text, View } from 'react-native';

type ChordsDropDownProps = {
    originalKey: String;
    setOriginalKey: (key: String) => void;
    pickerVisible: boolean;
    setPickerVisible: (visible: boolean) => void;
    musicalKeys: string[];
}

export const ChordsDropDown = ({ originalKey, setOriginalKey, pickerVisible, setPickerVisible, musicalKeys
}: ChordsDropDownProps) => {

    return (
        <View className='flex-1 mt-5'>
            <Pressable onPress={() => setPickerVisible(true)} className='w-full px-4 h-14 border border-gray-800 rounded-2xl bg-[#111111] flex-row items-center justify-between'>
                <Text className='text-white text-base'>{originalKey}</Text>
                <Text className='text-lg text-gray-400'> ▼</Text>
                <Modal visible={pickerVisible} transparent animationType='fade' onRequestClose={() => setPickerVisible(false)} statusBarTranslucent>
                    <Pressable onPress={() => setPickerVisible(false)} className='flex-1 bg-black/70 justify-center px-8'>
                        <Pressable onPress={(event) => event.stopPropagation()} className='bg-[#111111] border border-gray-800 rounded-2xl overflow-hidden'>
                            <Text className='text-white text-lg font-bold px-5 py-4'>Select Original Key</Text>
                            {musicalKeys.map((key) => (
                                <Pressable key={key} onPress={() => { setOriginalKey(key); setPickerVisible(false) }} className={`px-5 py-4 ${originalKey === key ? "bg-gray-800" : ""}`}>
                                    <Text className ={`text-base ${originalKey === key ? "text-white font-bold" : "text-gray-400"}`}>{key}</Text>
                                </Pressable>
                            ))}
                        </Pressable>
                    </Pressable>
                </Modal>
            </Pressable>
        </View>
    )
}
