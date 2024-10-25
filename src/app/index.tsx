import { Center, Heading, Column, Text, Row } from "native-base";
import Header from "@/components/Header";
import { Modal } from "@/components/Modal";
import { Button } from "@/components/Button";
import { useContacts, TypeContact } from "@/hooks/useContacts";
import { useEffect, useState, Fragment } from "react";
import { InputText } from "@/components/InputText";

export default function Index() {
  const [typeCategories, setTypeCategories] = useState<TypeContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const { listCategoryTypes } = useContacts();

  function handleOpenModal() {
    setModalVisible(true);
  }

  useEffect(() => {
    listCategoryTypes().then(resolve => {
      const { types } = resolve;
      setTypeCategories(types);
    });
  }, []);

  const title = typeCategories.length > 0 ? "Lista de Contatos" : "Nenhum contato cadastrado";

  return (
    <Fragment>
      <Column>
        <Header />
        <Center>
          <Column my={6} mx={3}>
            <Heading fontSize={"xl"}>{title}</Heading>
            <Row space={2}>
              <Button
                title="Novo tipo de contato"
                buttonNativeBase={{
                  bgColor: "orange.500",
                  flex: 1,
                  onPress: () => handleOpenModal(),
                  _pressed: { opacity: 0.7 },
                }}
                titleProps={{ color: "gray.100", fontSize: 10 }}
              />
              <Button
                title="Salvar Contato"
                buttonNativeBase={{
                  bgColor: "orange.500",
                  flex: 1,
                  onPress: () => handleOpenModal(),
                  _pressed: { opacity: 0.7 },
                }}
                titleProps={{ color: "gray.100", fontSize: 10 }}
              />
            </Row>
          </Column>
        </Center>
      </Column>
      <Modal
        isOpen={modalVisible}
        onClose={() => setModalVisible(false)}
        size={"xl"}
        headerChildren={
          <Text fontWeight={700} fontSize={"xl"}>
            Novo Tipo de Contato
          </Text>
        }
        bodyChildren={
          <Fragment>
            <InputText placeholder="Nome do tipo" errorMessage="erro" />
          </Fragment>
        }
        footerChildren={
          <Row space={2}>
            <Button
              title="Limpar"
              titleProps={{ color: "gray.100", fontSize: 12 }}
              buttonNativeBase={{ _pressed: { opacity: 0.7 } }}
            />
            <Button
              title="Salvar"
              titleProps={{ color: "gray.100", fontSize: 12 }}
              buttonNativeBase={{ _pressed: { opacity: 0.7 } }}
            />
          </Row>
        }
      />
    </Fragment>
  );
}
