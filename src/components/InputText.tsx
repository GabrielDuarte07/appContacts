import { Input as NativeBaseInput, FormControl, IInputProps, Text } from "native-base";

type InputTextProps = IInputProps & {
  errorMessage?: string;
};

export function InputText({ errorMessage, isInvalid, ...rest }: InputTextProps) {
  const valid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={valid}>
      <NativeBaseInput {...rest} _invalid={{ borderWidth: 1 }} />
      <FormControl.ErrorMessage>
        <Text fontWeight={500}>{errorMessage}</Text>
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
