import { Button as ButtonNativeBase, IButtonProps, Text, ITextProps } from "native-base";

type ButtonProps = {
  title: string;
  buttonNativeBase?: IButtonProps;
  titleProps?: ITextProps;
};

export function Button({ title, buttonNativeBase, titleProps }: ButtonProps) {
  const buttonBgColor = titleProps?.bgColor ? titleProps.bgColor : "orange.500";
  return (
    <ButtonNativeBase {...buttonNativeBase} bgColor={buttonBgColor}>
      <Text {...titleProps}>{title}</Text>
    </ButtonNativeBase>
  );
}
