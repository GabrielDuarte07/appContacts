import { Input as NativeBaseInput, FormControl, IInputProps } from "native-base";

type InputTextProps = IInputProps & {
  errorMessage: string;
};

export function InputText({ errorMessage, isInvalid, ...rest }: InputTextProps) {
  const valid = !!errorMessage || isInvalid;

  return (
    <FormControl isInvalid={valid}>
      <NativeBaseInput {...rest} />
    </FormControl>
  );
}
