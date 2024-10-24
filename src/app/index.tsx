import { Center, Heading, Column, Modal, Button, Text, Row } from "native-base";
import Header from "@/components/Header";
import { useContacts, TypeContact } from "@/hooks/useContacts";
import { useEffect, useState, Fragment } from "react";

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
        <Center my={6} mx={3}>
          <Column>
            <Heading fontSize={"3xl"}>{title}</Heading>
            <Row space={2}>
              <Button bgColor={"orange.500"} flex={1} onPress={() => handleOpenModal()}>
                <Text color={"gray.100"} fontWeight={700}>
                  Novo tipo de contato
                </Text>
              </Button>
              <Button bgColor={"orange.500"} flex={1}>
                <Text color={"gray.100"} fontWeight={700}>
                  Salvar Contato
                </Text>
              </Button>
            </Row>
          </Column>
        </Center>
      </Column>
      <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)} size={"xl"}>
        <Modal.Content>
          <Modal.CloseButton _icon={{ color: "red.700" }} />
          <Modal.Header>
            <Text fontWeight={700} fontSize={"xl"}>
              Novo Tipo
            </Text>
          </Modal.Header>
          <Modal.Body>
            <Text>oi</Text>
          </Modal.Body>
        </Modal.Content>
      </Modal>
    </Fragment>
  );
}
