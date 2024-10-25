import { Button as ButtonNativeBase, IButtonProps, Text, ITextProps } from "native-base";
import { ReactNode } from "react";

type ButtonProps = {
  title: string | ReactNode;
  buttonNativeBase?: IButtonProps;
  titleProps?: ITextProps;
};

export function Button({ title, buttonNativeBase, titleProps }: ButtonProps) {
  const buttonBgColor = titleProps?.bgColor ? titleProps.bgColor : "orange.500";
  const typeTitle = typeof title;
  return (
    <ButtonNativeBase {...buttonNativeBase} bgColor={buttonBgColor}>
      {typeTitle === "string" ? <Text {...titleProps}>{title}</Text> : title}
    </ButtonNativeBase>
  );
}
