import { TypeContact } from "@/hooks/useContacts";
import { Select, FormControl, ISelectProps, Text } from "native-base";

type DropDownProps = ISelectProps & {
  options: TypeContact[];
  isInvalid?: boolean;
  errorMessage?: string;
  selectedItem?: string;
};

export function Dropdown({ options, isInvalid, errorMessage, ...rest }: DropDownProps) {
  const valid = !!errorMessage || isInvalid;
  return (
    <FormControl isInvalid={valid}>
      <Select py={4} mt={4} {...rest} fontSize={"md"} w={"100%"}>
        {options.map(type => (
          <Select.Item key={type.tp_id} value={type.tp_id} label={type.tp_name} />
        ))}
      </Select>
      <FormControl.ErrorMessage>
        <Text fontWeight={500}>{errorMessage}</Text>
      </FormControl.ErrorMessage>
    </FormControl>
  );
}
