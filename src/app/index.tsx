import { Fragment, useState } from "react";
import { Column, Center, Heading, Row, FlatList, Text, useToast } from "native-base";
import { Feather } from "@expo/vector-icons";
import { Button } from "@/components/Button";
import Header from "@/components/Header";
import { router } from "expo-router";
import { useContext } from "react";
import { GlobalContext } from "@/contexts/Global";
import { ModalConfirm } from "@/components/ModalConfirm";
import { Contact, ContactError, TypeContact, useContacts } from "@/hooks/useContacts";
import { Alert } from "@/components/Alert";
import { Modal } from "@/components/Modal";

type ModalConfirmProps = {
  visible: boolean;
  textHeader: string;
  textBody: string;
  loading: boolean;
  titleButton: string;
  handleSave: () => Promise<void> | void;
};

type ModalDetailsProps = Contact &
  TypeContact & {
    visible: boolean;
  };

export default function Index() {
  const { contacts, typeContacts, setContacts } = useContext(GlobalContext);
  const { removeContact } = useContacts();
  const [modalConfirm, setModalConfirm] = useState<ModalConfirmProps>({} as ModalConfirmProps);
  const [modalDetails, setModalDetails] = useState({} as ModalDetailsProps);
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

  function showDetails(id: string) {
    const contact = contacts.find(c => String(c.id) === id);
    const typeContact = typeContacts.find(tp => tp.tp_id === contact?.tp_id);
    const details: ModalDetailsProps = {
      visible: true,
      celular: contact?.celular,
      name: contact?.name,
      tp_name: typeContact?.tp_name,
      nascimento: new Date(String(contact?.nascimento)).toLocaleDateString("pt-br"),
      email: contact?.email,
      created_at: new Date(String(contact?.created_at)).toLocaleDateString("pt-br"),
      updated_at: new Date(String(contact?.updated_at)).toLocaleDateString("pt-br"),
    };
    setModalDetails(details);
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
                      <Text
                        fontWeight={700}
                        fontSize={18}
                        onPress={() => showDetails(String(item.id))}
                      >
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
      <Modal
        isOpen={modalDetails.visible}
        onClose={() => setModalDetails(m => ({ ...m, visible: false }))}
        size={"xl"}
        headerChildren={
          <Text fontWeight={700} fontSize={"xl"}>
            Informações do Contato
          </Text>
        }
        bodyChildren={
          <Column space={2}>
            <Text fontSize={"lg"}>{modalDetails.tp_name}</Text>
            <Text fontSize={"lg"}>{modalDetails?.name}</Text>
            <Text fontSize={"lg"}>{modalDetails?.email}</Text>
            <Text fontSize={"lg"}>{modalDetails?.celular}</Text>
            <Text fontSize={"lg"}>
              {new Date(
                String(modalDetails?.nascimento).split("/").reverse().join("-"),
              ).toLocaleDateString()}
            </Text>
            <Text fontSize={"lg"}>
              Cadastrado em:{" "}
              {new Date(
                String(modalDetails?.created_at).split("/").reverse().join("-"),
              ).toLocaleDateString()}
            </Text>
            <Text fontSize={"lg"}>
              atualizado em:{" "}
              {new Date(
                String(modalDetails?.updated_at).split("/").reverse().join("-"),
              ).toLocaleDateString()}
            </Text>
          </Column>
        }
      />
    </Fragment>
  );
}
