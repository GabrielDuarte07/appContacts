//import { hideAsync, preventAutoHideAsync } from "expo-splash-screen";
import { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
  Inter_200ExtraLight,
} from "@expo-google-fonts/inter";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({ Inter_200ExtraLight, Inter_400Regular, Inter_700Bold });

  useEffect(() => {
    if (!fontsLoaded) return;
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, [fontsLoaded]);

  const theme = extendTheme({ fonts: { Inter_200ExtraLight, Inter_400Regular, Inter_700Bold } });

  return (
    <NativeBaseProvider theme={theme}>
      <SafeAreaView>
        <Slot />
      </SafeAreaView>
    </NativeBaseProvider>
  );
}
