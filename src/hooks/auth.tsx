import React, {
    createContext,
    ReactNode,
    useContext,
    useState,
    useEffect
} from "react";
import { Alert } from "react-native";

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;

import * as AppleAuthentication from 'expo-apple-authentication';
import * as AuthSession from 'expo-auth-session';

import AsyncStorage from '@react-native-async-storage/async-storage';
//import { signOutAsync } from "expo-apple-authentication";


interface AuthProviderProps {
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
    signInWithApple(): Promise<void>;
    signOut(): Promise<void>;
    userStorageLoading: boolean;

}

interface AuthorizationResponse {
    params: {
        access_token: string;
    };
    type: string;
}

const AuthContext = createContext({} as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps) {
    const [ user, setUser ] = useState<User>({} as User);

    const [ userStorageLoading, setUserStorageLoading ] = useState(true);

    const userStorageKey = '@gofinances:user';

    async function signInWithGoogle() {
        try {
            const RESPONSE_TYPE = 'token';
            const SCOPE = encodeURI('profile email');

            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;

            const { type, params } = await AuthSession
            .startAsync({ authUrl }) as AuthorizationResponse;
            
            if(type === 'success') {
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                
                const userLoggedIn = {
                    id: userInfo.id,
                    email: userInfo.email,
                    name: userInfo.given_name,
                    photo: userInfo.picture
                }
                              
                setUser(userLoggedIn);
                AsyncStorage.setItem(userStorageKey, JSON.stringify(userLoggedIn));
                console.log(userInfo);
            }

        } catch (error) {
            //throw new Error(error);
            Alert.alert('Erro SignIn', 'Erro ao conectar com a conta Google');
        }
    }

    async function signInWithApple() {
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            console.log(credential);

            if(credential) {
                const name = credential.fullName!.givenName!;
                const photo = `https://ui-avatars.com/api/?name=${name}&length=1`;

                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name,
                    photo,
                }
                setUser(userLogged)
                await AsyncStorage.setItem('@gofinances:user', JSON.stringify(userLogged));
            }
            
            // if(credential) {
            //     setUser({
            //         id: String(credential.user),
            //         email: credential.email!,
            //         name: credential.fullName!.givenName!,
            //         photo: undefined
            //     });
            // }
            //await AsyncStorage.setItem(userStorageKey, JSON.stringify(setUser));

        } catch (error) {
            //throw new Error(error);
            console.log(error);
            Alert.alert('Erro SignIn', 'Erro ao conectar com a conta Apple');
        }
    }

    async function signOut() {
        setUser({} as User);
        await AsyncStorage.removeItem(userStorageKey);
    }

    useEffect(() => {
        async function loadUserStorageData() {
            const userStoraged = await AsyncStorage.getItem(userStorageKey);

            if(userStoraged) {
                const userLogged = JSON.parse(userStoraged) as User;
                setUser(userLogged);
            }
            setUserStorageLoading(false);
        }

        loadUserStorageData();
    }, []);

    return(
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
            signInWithApple,
            signOut,
            userStorageLoading
        }}>
          { children }
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
    }

    return context;
}

export { AuthProvider, useAuth }