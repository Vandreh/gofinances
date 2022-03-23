import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useFocusEffect } from "@react-navigation/native";
import { useTheme } from "styled-components";
import { useAuth } from "../../hooks/auth";

import { HighlightCard } from "../../components/HighlightCard";
import { TransactionCard, TransactionCardProps } from "../../components/TransactionCard";

import {
    Container,
    Header,
    UserWrapper,
    UserInfo,
    Photo,
    User,
    UserGreeting,
    UserName,
    Icon,
    HighlightCards,
    Transactions,
    Title,
    TransactionList,
    LogoutButton,
    LoadContainer
} from "./styles";

export interface DataListProps extends TransactionCardProps {
    id: string;
}

interface HighlightProps {
    amount: string;
    lastTransaction: string;
}

interface HighlightData {
    entries: HighlightProps;
    expensives: HighlightProps;
    total: HighlightProps;
}

export function Dashboard(){
    const [isLoading, setIsloading] = useState(true);
    const [transactions, setTransactions] = useState<DataListProps[]>([]);
    const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

    const theme = useTheme();
    const { signOut, user } = useAuth();

    function getLastTransactionDate(
        collection: DataListProps[],
        type: 'positive' | 'negative'
    ){

        const collectionFiltered = collection
        .filter(transaction => transaction.type === type);

        if(collectionFiltered.length === 0)
            return 0;

        //console.log(type, collectionFiltered)

        const lastTransaction = new Date(
            Math.max.apply(Math, collectionFiltered
            .map(transaction => new Date(transaction.date).getTime())))
            
            return `${lastTransaction.getDate()} de ${lastTransaction.toLocaleString('pt-BR', { month: 'long'})}`

            //console.log(lastTransaction)

            //const lastTransactionFormatted = Intl
            // const lastTransaction =
            // Math.max.apply(Math, collection
            // .filter(transaction => transaction.type === type)
            // .map(transaction => new Date(transaction.date).getTime()))
            
            // console.log(lastTransaction)

            // return Intl
            // .DateTimeFormat('pt-BR', {
            //     day: '2-digit',
            //     month: '2-digit',
            //     year: '2-digit'
            // }).format(new Date(lastTransaction));


    }

    async function loadTransactions(){
        //const dataKey = '@gofinances:transactions';
        const dataKey = `@gofinances:transactions_user:${user.id}`
        const response = await AsyncStorage.getItem(dataKey);
        const transactions = response ? JSON.parse(response) : [];

        let entriesTotal = 0;
        let expensiveTotal = 0;

        const transactionsFormatted: DataListProps[] = transactions
        .map((item: DataListProps) => {

            if(item.type === 'positive'){
                entriesTotal += Number(item.amount);
            }else{
                expensiveTotal += Number(item.amount)
            }

            const amount = Number(item.amount)
            .toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const date =  Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: '2-digit'
            }).format(new Date(item.date));

            return{
                id: item.id,
                name: item.name,
                amount,
                type: item.type,
                category: item.category,
                date,
            }
        });

        setTransactions(transactionsFormatted);

        const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
        const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');


        const totalInterval = lastTransactionExpensives === 0
        ? 'Não há transações'
        :`01 a ${lastTransactionExpensives}`;

        // const lastTransactionEntries = Math.max.apply(Math, transactions
        //     .filter((transaction: DataListProps) => transaction.type === 'positive')
        //     .map((transaction: DataListProps) => new Date(transaction.date).getTime()));
        //     console.log(new Date(lastTransactionEntries))
        //     console.log(lastTransactionEntries)
            

        // const lastTransactionEntries =
        //     Math.max.apply(Math, transactions
        //     .filter((transaction: DataListProps) => transaction.type === 'positive')
        //     .map((transaction: DataListProps) => new Date(transaction.date).getTime()))
            
        //     console.log(lastTransactionEntries)

        //     const lastTransactionEntriesFormatted = Intl
        //     .DateTimeFormat('pt-BR', {
        //         day: '2-digit',
        //         month: '2-digit',
        //         year: '2-digit'
        //     }).format(new Date(lastTransactionEntries));
                

        const total = entriesTotal - expensiveTotal;

        setHighlightData({
            entries: {
                amount: entriesTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionEntries === 0
                ? 'Não há transações'
                : `Última entrada dia ${lastTransactionEntries}`,
            },
            expensives: {
                amount: expensiveTotal.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: lastTransactionExpensives === 0 ?
                'Não há transações'
                : `Última saída ${lastTransactionExpensives}`,
            },
            total: {
                amount: total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                }),
                lastTransaction: totalInterval
            }
        });

        //console.log(transactionsFormatted)
        setIsloading(false);
    }

    useEffect(() => {
        loadTransactions();

        // remover itens da lista:
        // const dataKey = '@gofinances:transactions';
        // AsyncStorage.removeItem(dataKey);

    }, []);
    /*const data: DataListProps[] = [
        {
            id: '1',
            type: 'positive',
            title:"Desenvolvimento de site",
            amount:"R$ 12.000,00",
            category:{
                name: 'Vendas',
                icon: 'dollar-sign'
            },
            date:"13/03/2022"
        },
        {
            id: '2',
            type: 'negative',
            title:"Hamburgueria Pizzy",
            amount:"R$ 59,00",
            category:{
                name: 'Alimentação',
                icon: 'coffee'
            },
            date:"10/03/2022"
        },
        {
            id: '3',
            type: 'negative',
            title:"Aluguel de apartamento",
            amount:"R$ 1.200,00",
            category:{
                name: 'Casa',
                icon: 'shopping-bag'
            },
            date:"10/03/2022"
        }
    ];*/

    useFocusEffect(useCallback(() => {
        loadTransactions();
    },[]));

    return (
        <Container>
            {
                isLoading ?
                <LoadContainer>
                    <ActivityIndicator
                        color={theme.colors.primary}
                        size="large"
                    />
                </LoadContainer> :
                <>
                    <Header>
                        <UserWrapper>
                            <UserInfo>
                                <Photo
                                    source={{ uri: user.photo }}
                                />
                                <User>
                                    <UserGreeting>Olá,</UserGreeting>
                                    <UserName>{user.name}</UserName>
                                </User>
                            </UserInfo>

                            <LogoutButton onPress={signOut}>
                                <Icon name="power"/>
                            </LogoutButton>
                        </UserWrapper>
                    </Header>

                    <HighlightCards
                        //horizontal
                        //showsHorizontalScrollIndicator={false}
                        //contentContainerStyle={{paddingHorizontal: 24 }}
                    >
                        <HighlightCard
                            type="up"
                            title="Entradas"
                            amount={highlightData?.entries?.amount}
                            lastTransaction={highlightData.entries.lastTransaction}
                        />
                        <HighlightCard
                            type="down"
                            title="Saidas"
                            amount={highlightData?.expensives?.amount}
                            lastTransaction={highlightData.expensives.lastTransaction}
                        />
                        <HighlightCard
                            type="total"
                            title="Total"
                            amount={highlightData?.total?.amount}
                            lastTransaction={highlightData.total.lastTransaction}
                        />
                    </HighlightCards>

                    <Transactions>
                        <Title>Listagem</Title>

                        <TransactionList
                            data={transactions}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => <TransactionCard data={item} /> }
                        />

                    </Transactions>
                </>
            }        
        </Container>
    );
}