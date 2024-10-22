import { Center, Row, Image } from "native-base";
import { Ionicons } from "@expo/vector-icons";
import LogoBlackWhite from "../../assets/images/logo_black_white.png";

export default function Header() {
  return (
    <Row bg={"orange.500"} py={1} w={"full"}>
      <Center pl={3}>
        <Ionicons size={26} name="arrow-back-sharp" color={"#FFF"} />
      </Center>

      <Center w={"full"}>
        <Image source={LogoBlackWhite} width={20} height={20} />
      </Center>
    </Row>
  );
}
