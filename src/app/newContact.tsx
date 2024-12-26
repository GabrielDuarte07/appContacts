import { Center, Column, Heading, useToast, Spinner } from "native-base";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import { InputText } from "@/components/InputText";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/Button";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/contexts/Global";
import { router } from "expo-router";
import { Dropdown } from "@/components/Dropdown";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { Feather } from "@expo/vector-icons";
import { Contact, ContactError, useContacts } from "@/hooks/useContacts";
import { Alert } from "@/components/Alert";

type FormContactProps = {
  name: string;
  email: string;
  nascimento: string;
  type_contact: string;
  celular: string;
};

const newContactResolver = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().required("O email é obrigatório").email("E-mail invalido"),
  celular: yup.string().required("O celular é obrigatório").min(14, "Digite o numero completo"),
  type_contact: yup.string().required("Selecione um tipo"),
  nascimento: yup.string().required("Selecione uma data de nascimento"),
});

export default function NewContact() {
  const { typeContacts, setContacts } = useContext(GlobalContext);
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickedDate, setPickedDate] = useState(new Date().getTime());
  const { createContact } = useContacts();
  const toast = useToast();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({ resolver: yupResolver(newContactResolver) });

  const title = id ? "Edição de Contato" : "Novo Contato";

  useEffect(() => {
    if (typeContacts && typeContacts.length > 0) return;

    router.navigate({ pathname: "/typesContact", params: { newType: "1" } });
  }, [typeContacts]);

  function handleContactSubmit({
    name,
    email,
    celular,
    nascimento,
    type_contact,
  }: FormContactProps) {
    setLoading(true);
    const nascimentoFixed = nascimento.split("/").reverse().join("-");
    createContact({ name, celular, email, nascimento: nascimentoFixed, tp_id: type_contact })
      .then(({ contact }) => {
        setContacts(c => [...c, contact as Contact]);
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert
              title="Sucesso"
              status="success"
              colorScheme="success"
              description="Contato inserido com sucesso"
            />
          ),
        });
        router.navigate({ pathname: "/" });
      })
      .catch(err => {
        console.log(err);
        const msgError = err instanceof ContactError ? err.message : "Erro ao inserir contato";
        toast.show({
          placement: "top",
          duration: 4000,
          render: () => (
            <Alert title="Error" status="error" colorScheme="danger" description={msgError} />
          ),
        });
      })
      .finally(() => setLoading(false));
  }

  return (
    <Column>
      <Header />
      <Column w="full" my={5} px={3}>
        <Center>
          <Heading>{title}</Heading>

          <Controller
            name="type_contact"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Dropdown
                placeholder="Selecione um tipo de contato"
                options={typeContacts}
                selectedValue={value}
                onValueChange={onChange}
                errorMessage={errors.type_contact?.message}
              />
            )}
          />
          <Controller
            name="name"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputText
                py={"4"}
                mt={"4"}
                placeholder="Nome do Contato"
                fontSize={"md"}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.name?.message}
              />
            )}
          />
          <Controller
            name="email"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputText
                py={"4"}
                mt={"4"}
                placeholder="Email do Contato"
                fontSize={"md"}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name="celular"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputText
                py={"4"}
                mt={"4"}
                placeholder="Celular do Contato"
                fontSize={"md"}
                onChangeText={text => {
                  let v = text;
                  v = v.replace(/\D/g, "");
                  if (v.length < 4) {
                    onChange(v);
                    return;
                  }
                  v = v.replace(/(\d{2})/, "($1)");
                  v = v.replace(/(\d{5})(\d{4})/g, "$1-$2");
                  if (v.length > 14) {
                    v = v.slice(0, 14);
                  }
                  onChange(v);
                }}
                value={value}
                errorMessage={errors.celular?.message}
              />
            )}
          />
          <Controller
            name="nascimento"
            control={control}
            render={({ field: { value, onChange } }) => (
              <InputText
                py={"4"}
                mt={"4"}
                readOnly
                onPress={() => setCalendarVisible(!calendarVisible)}
                placeholder="Data de nascimento"
                fontSize={"md"}
                onChangeText={onChange}
                value={value}
                errorMessage={errors.nascimento?.message}
              />
            )}
          />
          {calendarVisible && (
            <Column mt={4}>
              <Feather
                name="x"
                size={20}
                color={"red"}
                style={{ textAlign: "right", fontWeight: "bold" }}
                onPress={() => setCalendarVisible(false)}
              />
              <RNDateTimePicker
                mode="date"
                value={new Date(pickedDate)}
                onChange={event => {
                  setPickedDate(event.nativeEvent.timestamp);
                  setValue(
                    "nascimento",
                    new Date(event.nativeEvent.timestamp).toLocaleDateString("pt-br"),
                  );
                }}
                display="spinner"
              />
            </Column>
          )}
          <Button
            title={loading === false ? "Salvar" : <Spinner />}
            buttonNativeBase={{
              mt: "4",
              w: "full",
              _pressed: { opacity: 0.7 },
              onPress: handleSubmit(handleContactSubmit),
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
