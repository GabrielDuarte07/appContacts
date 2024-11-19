import { Column, Center, Heading } from "native-base";
import { Button } from "@/components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";

export default function Index() {
  return (
    <Column>
      <Header />
      <Column w="full" my={5} px={3}>
        <Center>
          <Heading fontSize={"xl"} my={3}>
            Lista de Contatos
          </Heading>
          <Button
            title="Novo Contato"
            buttonNativeBase={{
              bgColor: "orange.500",
              w: "full",
              _pressed: { opacity: 0.7 },
              onPress: () => router.navigate({ pathname: "/newContact", params: { id: "" } }),
            }}
            titleProps={{
              color: "gray.100",
              fontSize: "lg",
              fontFamily: "body",
              fontWeight: 700,
            }}
          />
        </Center>
      </Column>
    </Column>
  );
}
