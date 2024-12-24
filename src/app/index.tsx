import { Column, Center, Heading, Row, FlatList, Text } from "native-base";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/Global";

export default function Index() {
  const { contacts } = useContext(GlobalContext);

  return (
    <Column>
      <Header />
      <Column w="full" my={5} px={3}>
        <Center>
          <Heading fontSize={"xl"} my={3}>
            Lista de Contatos
          </Heading>
          {contacts.length > 0 && (
            <FlatList
              data={contacts}
              keyExtractor={contact => String(contact.id)}
              renderItem={({ item }) => (
                <Row
                  mb={5}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  w={"full"}
                  borderBottomWidth={1}
                  marginBottom={4}
                >
                  <Column>
                    <Text fontWeight={700} fontSize={18}>
                      {item.name}
                    </Text>
                  </Column>
                  <Column>
                    <Feather name="x-circle" color="red" size={18} onPress={() => {}} />
                  </Column>
                </Row>
              )}
            />
          )}
          <Row>
            <Button
              title="Tipos contato"
              buttonNativeBase={{
                bgColor: "orange.500",
                w: "1/2",
                marginRight: "1",
                _pressed: { opacity: 0.7 },
                onPress: () => router.navigate({ pathname: "/typesContact" }),
              }}
              titleProps={{
                color: "gray.100",
                fontSize: "md",
                fontFamily: "body",
                fontWeight: 700,
              }}
            />
            <Button
              title="Novo Contato"
              buttonNativeBase={{
                bgColor: "orange.500",
                w: "1/2",
                _pressed: { opacity: 0.7 },
                onPress: () => router.navigate({ pathname: "/newContact", params: { id: "" } }),
              }}
              titleProps={{
                color: "gray.100",
                fontSize: "md",
                fontFamily: "body",
                fontWeight: 700,
              }}
            />
          </Row>
        </Center>
      </Column>
    </Column>
  );
}
