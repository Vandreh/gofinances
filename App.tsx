import 'react-native-gesture-handler';

import React from 'react';
import { StatusBar } from 'react-native';
import AppLoading from 'expo-app-loading';
import { ThemeProvider } from 'styled-components';

//import { NavigationContainer } from '@react-navigation/native';
import { Routes } from './src/routes';

import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';

import theme from './src/global/styles/theme';

import { AppRoutes } from './src/routes/app.routes';

import 'intl';
import 'intl/locale-data/jsonp/pt-BR';

//import { Register } from './src/screens/Register';
//import { CategorySelect } from './src/screens/CategorySelect';
import { SignIn } from './src/screens/SignIn';

//import { AuthContext } from './src/AuthContext';
import { AuthProvider, useAuth } from './src/hooks/auth';

export default function App() {
  const [fonstLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  const { userStorageLoading } = useAuth();

  if(!fonstLoaded || userStorageLoading) {
    return <AppLoading />
  }

  return (
    <ThemeProvider theme={theme}>
        <StatusBar barStyle="light-content" />
        <AuthProvider>
          <Routes/>
        </AuthProvider>
    </ThemeProvider>)
}