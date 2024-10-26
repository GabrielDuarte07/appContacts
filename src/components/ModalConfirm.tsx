import { Modal as NativeBaseModal, IModalProps, Row, Spinner, Text } from "native-base";
import { Button } from "./Button";

type ModalConfirmProps = IModalProps & {
  loading?: boolean;
  handleSave?: () => Promise<void> | void;
  titleButton?: string;
  textBody?: string;
  textHeader?: string;
};

export function ModalConfirm({
  handleSave,
  loading,
  titleButton,
  textBody,
  textHeader,
  ...rest
}: ModalConfirmProps) {
  return (
    <NativeBaseModal {...rest}>
      <NativeBaseModal.Content>
        <NativeBaseModal.CloseButton _icon={{ color: "red.700" }} />
        <NativeBaseModal.Header>
          <Text fontSize={20} fontWeight={700} fontFamily={"body"}>
            {textHeader}
          </Text>
        </NativeBaseModal.Header>
        <NativeBaseModal.Body>
          <Text fontSize={16} fontWeight={500} fontFamily={"body"}>
            {textBody}
          </Text>
        </NativeBaseModal.Body>
        <NativeBaseModal.Footer>
          <Row space={2}>
            <Button
              title={!loading ? titleButton : <Spinner />}
              titleProps={{ color: "gray.100", fontSize: 12 }}
              buttonNativeBase={{
                _pressed: { opacity: 0.7 },
                onPress: handleSave,
                disabled: loading,
              }}
            />
          </Row>
        </NativeBaseModal.Footer>
      </NativeBaseModal.Content>
    </NativeBaseModal>
  );
}
