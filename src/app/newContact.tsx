import { Center, Column, Heading } from "native-base";
import Header from "@/components/Header";
import { useLocalSearchParams } from "expo-router";
import { InputText } from "@/components/InputText";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Button } from "@/components/Button";

type FormContactProps = {
  name: string;
};

const newContactResolver = yup.object({
  name: yup.string().required("O nome é obrigatório"),
});

export default function NewContact() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(newContactResolver) });

  const title = id ? "Edição de Contato" : "Novo Contato";

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
