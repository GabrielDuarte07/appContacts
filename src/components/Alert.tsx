import { Alert as NativeBaseAlert, IAlertProps, Row, Column, Text } from "native-base";

type AlertProps = IAlertProps & {
  title: string;
  description?: string;
};

export function Alert({ title, description, ...rest }: AlertProps) {
  return (
    <NativeBaseAlert {...rest} maxW={400}>
      <Column space={2} w="100%">
        <Row space={2} alignItems="center">
          <NativeBaseAlert.Icon />
          <Text fontSize="md" fontWeight="medium" color="coolGray.800">
            {title}
          </Text>
        </Row>
        <Text pl={6} color={"coolGray.600"}>
          {description}
        </Text>
      </Column>
    </NativeBaseAlert>
  );
}
