import { Modal as ModalNativeBase, IModalProps } from "native-base";
import { ReactNode } from "react";

type ModalProps = IModalProps & {
  headerChildren: ReactNode;
  bodyChildren: ReactNode;
  footerChildren: ReactNode;
};

export function Modal({ headerChildren, bodyChildren, footerChildren, ...rest }: ModalProps) {
  return (
    <ModalNativeBase {...rest}>
      <ModalNativeBase.Content>
        <ModalNativeBase.CloseButton _icon={{ color: "red.700" }} />
        <ModalNativeBase.Header>{headerChildren}</ModalNativeBase.Header>
        <ModalNativeBase.Body>{bodyChildren}</ModalNativeBase.Body>
        <ModalNativeBase.Footer>{footerChildren}</ModalNativeBase.Footer>
      </ModalNativeBase.Content>
    </ModalNativeBase>
  );
}
