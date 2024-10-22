import { useEffect } from "react";
import { Slot, SplashScreen } from "expo-router";
import { NativeBaseProvider, extendTheme } from "native-base";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "react-native";
import {
  useFonts,
  Roboto_300Light,
  Roboto_500Medium,
  Roboto_500Medium_Italic,
  Roboto_700Bold,
} from "@expo-google-fonts/roboto";
import { SQLiteProvider } from "expo-sqlite";
import { initDatabase } from "../../database/initContactsDB";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [fontsLoaded] = useFonts({
    Roboto_300Light,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_500Medium_Italic,
  });

  useEffect(() => {
    if (!fontsLoaded) return;
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 1000);
  }, [fontsLoaded]);

  if (!fontsLoaded) return;

  const theme = extendTheme({
    fontConfig: {
      Roboto: {
        500: {
          normal: "Roboto_500Medium",
          italic: "Roboto_500Medium_Italic",
        },
        300: {
          normal: "Roboto_300Light",
        },
        700: {
          normal: "Roboto_700Bold",
        },
      },
    },
    fonts: { body: "Roboto", heading: "Roboto", mono: "Roboto" },
  });

  return (
    <NativeBaseProvider theme={theme}>
      <SQLiteProvider databaseName="contacts.db" onInit={initDatabase}>
        <StatusBar barStyle={"dark-content"} translucent />
        <SafeAreaView>
          <Slot />
        </SafeAreaView>
      </SQLiteProvider>
    </NativeBaseProvider>
  );
}
