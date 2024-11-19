import { Center, Column, Heading } from "native-base";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";

export default function NewContact() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  console.log(id);
  const title = id ? "Edição de Contato" : "Novo Contato";
  return (
    <Column>
      <Header />
      <Column w="full" my={5} px={3}>
        <Center>
          <Heading>{title}</Heading>
        </Center>
      </Column>
    </Column>
  );
}
