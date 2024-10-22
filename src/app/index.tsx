import { Center, Heading, Column } from "native-base";
import Header from "@/components/Header";

export default function Index() {
  return (
    <Column>
      <Header />
      <Center my={6} mx={6}>
        <Column>
          <Heading fontSize={"3xl"}>Lista de Contatos</Heading>
        </Column>
      </Center>
    </Column>
  );
}
