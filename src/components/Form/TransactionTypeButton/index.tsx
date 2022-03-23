import React from "react";
import { TouchableOpacityProps } from "react-native";
// import { ReactButtonProps } from 'react-native-gesture-handler'; nao funciona estou usando TouchableOpacity porque funciona
import {
    Container,
    Title,
    Icon,
    // Button
} from "./styles";

const icons = {
    up: 'arrow-up-circle',
    down: 'arrow-down-circle'
}

// interface Props extends ReactButtonProps{ 
interface Props extends TouchableOpacityProps{
    type: 'up' | 'down';
    title: string;
    isActive: boolean;
}

export function TransactionTypeButton({
    type,
    title,
    isActive,
    ...rest
}: Props) {
    return (
        <Container
            isActive={isActive}
            type={type}
            {...rest}
        >
            <Icon
                name={icons[type]}
                type={type} 
            />
            <Title>
                {title}
            </Title>
        </Container>
        /*

        <Container
            isActive={isActive}
            type={type}
        >
            <Button
                {...rest}
            >
                <Icon
                    name={icons[type]}
                    type={type} 
                />
                <Title>
                    {title}
                </Title>
            <Button/>
        </Container>

        */
    );
}