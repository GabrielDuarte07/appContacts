import { Center, Column, Heading } from "native-base";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import { InputText } from "@/components/InputText";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/Button";
import { useContext, useEffect } from "react";
import { GlobalContext } from "@/contexts/Global";
import { router } from "expo-router";

type FormContactProps = {
  name: string;
  email: string;
};

const newContactResolver = yup.object({
  name: yup.string().required("O nome é obrigatório"),
  email: yup.string().required("O email é obrigatório").email("E-mail invalido"),
  celular: yup.string().required("O celular é obrigatório").min(14, "Digite o numero completo"),
});

export default function NewContact() {
  const { typeContacts } = useContext(GlobalContext);
  const { id } = useLocalSearchParams<{ id?: string }>();
  //const toast = useToast();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(newContactResolver) });

  const title = id ? "Edição de Contato" : "Novo Contato";

  useEffect(() => {
    if (typeContacts && typeContacts.length > 0) return;

    router.navigate({ pathname: "/typesContact", params: { newType: "1" } });
  }, [typeContacts]);

  function handleContactSubmit({ name }: FormContactProps) {
    console.log(name);
  }

  return (
    <Column>
      <Header />
      <Column w="full" my={5} px={3}>
        <Center>
          <Heading>{title}</Heading>
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
          <Button
            title="Salvar"
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
