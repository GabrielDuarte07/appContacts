import { Center, Heading, Column, Text, Row, useToast, Spinner, FlatList } from "native-base";
import { Feather } from "@expo/vector-icons";
import Header from "@/components/Header";
import { Modal } from "@/components/Modal";
import { ModalConfirm } from "@/components/ModalConfirm";
import { Button } from "@/components/Button";
import { InputText } from "@/components/InputText";
import { Alert } from "@/components/Alert";
import { useContacts, TypeContact, ContactError } from "@/hooks/useContacts";
import { useEffect, useState, Fragment } from "react";
import { useForm, Controller } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

type TypeContactFormProps = {
  type_contact: string;
};

type ModalConfirmProps = {
  visible: boolean;
  textHeader: string;
  textBody: string;
  loading: boolean;
  titleButton: string;
  handleSave: () => Promise<void> | void;
};

export default function Index() {
  const [contactTypes, setContactTypes] = useState<TypeContact[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirm, setModalConfirm] = useState<ModalConfirmProps>({} as ModalConfirmProps);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { listContactTypes, createContactType } = useContacts();

  const typeContactResolver = yup.object({
    type_contact: yup
      .string()
      .required("Digite o tipo de contato")
      .min(4, "Mínimo de 4 caracteres"),
  });

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ resolver: yupResolver(typeContactResolver) });

  function handleOpenModal() {
    setModalVisible(true);
  }

  function handleSubmitNewType({ type_contact }: TypeContactFormProps) {
    setLoading(true);
    createContactType({ tp_name: type_contact })
      .then(() => {
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert
              title="Success"
              status="success"
              colorScheme="success"
              description="Tipo inserido com sucesso"
            />
          ),
        });
        setModalVisible(false);
      })
      .catch(err => {
        console.log(err);
        const errMsg = err instanceof ContactError ? err.message : "Erro ao inserir tipo";
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert title="Error" status="error" colorScheme="danger" description={errMsg} />
          ),
        });
      })
      .finally(() => setLoading(false));
  }

  function handleRemoveContactType(id: number) {
    const dataModal: ModalConfirmProps = {
      visible: true,
      textBody: String(id),
      textHeader: "header",
      titleButton: "title",
      handleSave: () => console.log("save"),
      loading: false,
    };
    setModalConfirm(dataModal);
  }

  useEffect(() => {
    listContactTypes().then(resolve => {
      const { types } = resolve;
      setContactTypes(types);
    });
  }, [contactTypes]);

  const title = contactTypes.length > 0 ? "Lista Tipo Contatos" : "Nenhum contato cadastrado";

  return (
    <Fragment>
      <Column>
        <Header />
        <Column w="full" my={5} px={3}>
          <Center>
            <Heading fontSize={"xl"} my={3}>
              {title}
            </Heading>
            {contactTypes.length > 0 && (
              <FlatList
                data={contactTypes}
                keyExtractor={item => item.tp_id}
                mb={5}
                renderItem={({ item }) => (
                  <Row
                    w="full"
                    justifyContent="space-between"
                    alignItems="center"
                    borderBottomWidth={1}
                    mb={4}
                  >
                    <Row>
                      <Text fontWeight={700} fontSize={18}>
                        {item.tp_name}
                      </Text>
                    </Row>
                    <Row>
                      <Feather
                        name="x-circle"
                        color="red"
                        size={18}
                        onPress={() => handleRemoveContactType(Number(item.tp_id))}
                      />
                    </Row>
                  </Row>
                )}
              />
            )}

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
          </Center>
        </Column>
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
          <Controller
            name="type_contact"
            control={control}
            render={({ field: { onChange, value } }) => (
              <InputText
                placeholder="Nome do tipo"
                errorMessage={errors.type_contact?.message}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        }
        footerChildren={
          <Row space={2}>
            <Button
              title="Limpar"
              titleProps={{ color: "gray.100", fontSize: 12 }}
              buttonNativeBase={{ _pressed: { opacity: 0.7 } }}
            />
            <Button
              title={!loading ? "Salvar" : <Spinner />}
              titleProps={{ color: "gray.100", fontSize: 12 }}
              buttonNativeBase={{
                _pressed: { opacity: 0.7 },
                onPress: handleSubmit(handleSubmitNewType),
                disabled: loading,
              }}
            />
          </Row>
        }
      />
      <ModalConfirm
        {...modalConfirm}
        onClose={() => setModalConfirm(m => ({ ...m, visible: false }))}
        isOpen={modalConfirm.visible}
      />
    </Fragment>
  );
}
