import { Center, Image, ZStack, Box } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import LogoBlackWhite from "../../assets/images/logo_black_white.png";

export default function Header() {
  const { canGoBack, back } = router;
  return (
    <ZStack bg={"orange.500"} h={20} w={"full"} flexDirection={"row"} alignItems={"center"}>
      <Center w={"full"}>
        <Image source={LogoBlackWhite} width={20} height={20} alt="logo" />
      </Center>
      {canGoBack() && (
        <Box pl={3}>
          <Ionicons onPress={() => back()} size={26} name="arrow-back-sharp" color={"#FFF"} />
        </Box>
      )}
    </ZStack>
  );
}
