import { Fragment, useState } from "react";
import { Column, Center, Heading, Row, FlatList, Text, useToast } from "native-base";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/Global";
import { ModalConfirm } from "@/components/ModalConfirm";
import { ContactError, useContacts } from "@/hooks/useContacts";
import { Alert } from "@/components/Alert";

type ModalConfirmProps = {
  visible: boolean;
  textHeader: string;
  textBody: string;
  loading: boolean;
  titleButton: string;
  handleSave: () => Promise<void> | void;
};

export default function Index() {
  const { contacts, typeContacts, setContacts } = useContext(GlobalContext);
  const { removeContact } = useContacts();
  const [modalConfirm, setModalConfirm] = useState<ModalConfirmProps>({} as ModalConfirmProps);
  const toast = useToast();

  function handleDelete(id: number) {
    const modalConfirmObj = { ...modalConfirm, loading: true };
    setModalConfirm(modalConfirmObj);
    removeContact(id)
      .then(({ contact }) => {
        toast.closeAll();
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert
              status="success"
              title="Sucesso"
              description="Contato excluido com sucesso"
              colorScheme="success"
            />
          ),
        });
        const newContacts = contacts.filter(c => c.id !== contact.id);
        setContacts(newContacts);
      })
      .catch(err => {
        console.log(err);
        const msgError = err instanceof ContactError ? err.message : "Erro ao excluir contato";
        toast.closeAll();
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert status="error" title="Erro" description={msgError} colorScheme="danger" />
          ),
        });
      })
      .finally(() => {
        const modalConfirmObj = { ...modalConfirm, loading: false };
        setModalConfirm(modalConfirmObj);
      });
  }

  function confirmDelete(id: number, name: string) {
    const modalConfirmObj = {
      visible: true,
      textHeader: "Contato",
      textBody: `Confirma a exclusão do contato ${name}?`,
      titleButton: "Excluir",
      loading: false,
      handleSave: () => handleDelete(id),
    };
    setModalConfirm(modalConfirmObj);
  }

  return (
    <Fragment>
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
                        {item.name} ({typeContacts.find(tp => tp.tp_id === item.tp_id)?.tp_name})
                      </Text>
                    </Column>
                    <Column>
                      <Feather
                        name="x-circle"
                        color="red"
                        size={18}
                        onPress={() => confirmDelete(Number(item.id), String(item.name))}
                      />
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
      <ModalConfirm
        {...modalConfirm}
        onClose={() => setModalConfirm(m => ({ ...m, visible: false }))}
        isOpen={modalConfirm.visible}
      />
    </Fragment>
  );
}
