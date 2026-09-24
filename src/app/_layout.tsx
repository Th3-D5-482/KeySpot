import { Stack } from "expo-router";
require('../../global.css');

export default function RootLayout() {
  return <Stack screenOptions={{headerShown: false}}/>;
}
