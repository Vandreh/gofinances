import React from "react";
//nao funciona import { RectButtonProps } from 'react-native-gesture-handler'; estou usando TouchableOpacityProps porque funciona
import { TouchableOpacityProps } from "react-native";

import { Container, Title } from "./styles";

// interface Props extends RectButtonProps{
interface Props extends TouchableOpacityProps{
    title: string;
    //onPress: () => void;
}

export function Button({
    title,
    //onPress,
    ...rest
}: Props) {
    return (
        <Container
            //onPress={onPress}
            {...rest}
        >
            <Title>
                {title}
            </Title>
        </Container>
    );
}